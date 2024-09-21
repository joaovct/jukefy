// let users: wsUsers = {}
// let rooms: wsRooms = {}

const users: wsServerUsers = new Map()
const rooms: wsServerRooms = new Map()
const peers: Map<wsPeer["id"], wsPeer> = new Map()

class Server implements wsServer {
  send
  onOpen
  onMessage
  onClose

  constructor() {
    this.onOpen = this._onOpen
    this.onMessage = this._onMessage
    this.onClose = this._onClose

    this.send = this._send

    const exhaustiveCheck: EnforceExact<Server, wsServer> = this
  }

  private _onOpen: wsServer["onOpen"] = peer => {
    peers.set(peer.id, peer)
  }

  private _onMessage: wsServer["onMessage"] = (peer, message) => {
    const type = message.type
    const { user } = message

    switch (type) {
      case "CREATE-USER":
        users.set(user.id, { ...user, peerId: peer.id })

        this.send.toAllUsers()
        return
      case "JOIN-ROOM":
        if (!users.get(user.id))
          return

        const { roomId } = message

        if (!rooms.get(roomId))
          rooms.set(roomId, { id: roomId, usersId: new Map() })

        rooms.get(roomId)?.usersId.set(user.id, user.id)

        this.send.toAllUsers()
        return
      case "LEAVE-ROOM":
        rooms.get(user.roomId || "")?.usersId.delete(user.id)
        this.send.toAllUsers()
        return
      default:
        const assertUnreachable: never = type
        throw new Error("Unknown new message type: " + assertUnreachable)

    }
  }

  private _onClose: wsServer["onClose"] = peer => {
    const usersArr = Array.from(users.values())
    const user = usersArr.find(user => user.peerId === peer.id)

    if(!user)
        return

    users.delete(user.id)
    peers.delete(peer.id)
  
    this.send.toAllUsers()
  }

  private _send: wsServer["send"] = (() => {
    return ({
      toRoom: () => {},
      toUser: (peer) => {
        const parsedRooms: wsRooms = {}

        rooms.forEach(room => {
          parsedRooms[room.id] = {
            id: room.id,
            usersId: Array.from(room.usersId.values())
          }
        })

        const message: wsServerMessage = {
          users: Object.fromEntries(users),
          rooms: parsedRooms
        }
        
        const stringified = JSON.stringify(message)
        peer.send(stringified)
      },
      // only send the updated state of rooms and users
      toAllUsers: () => {
        peers.forEach(peer => this.send.toUser(peer))
      }
    })
  })()
}


const server = new Server()

export default defineWebSocketHandler({
  open: server.onOpen,
  close: server.onClose,
  message(peer, stringified) {
    const message: wsClientMessage = JSON.parse(stringified.text())
    server.onMessage(peer, message)
  },
});

