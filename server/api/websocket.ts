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
        if (!users.get(user.id)) {
          const peers = new Map([[peer.id, peer]])
          users.set(user.id, { ...user, peers })

          if (!rooms.get(user.id)) {
            rooms.set(user.id, {
              id: user.id,
              host: user.id,
              guests: new Map()
            })
          }

          // for when the same user it's connected in a different tab
        } else {
          users.get(user.id)?.peers.set(peer.id, peer)
        }

        this.send.toAllUsers()
        return
      case "JOIN-ROOM":
        if (!users.get(user.id))
          return

        const { roomId } = message
        const room = rooms.get(roomId)

        if (!room)
          return

        room.guests.set(user.id, user.id)

        this.send.toAllUsers()
        return
      case "LEAVE-ROOM":
        rooms.get(user.roomId || "")?.guests.delete(user.id)

        this.send.toAllUsers()
        return
      default:
        const assertUnreachable: never = type
        throw new Error("Unknown new message type: " + assertUnreachable)

    }
  }

  private _onClose: wsServer["onClose"] = peer => {
    peers.delete(peer.id)

    const usersArr = Array.from(users.values())
    const user = usersArr.find(user => user.peers.has(peer.id))

    if (!user)
      return

    if (users.get(user.id)?.peers.size === 1) {
      users.delete(user.id)
      rooms.delete(user.id)
    } else {
      users.get(user.id)?.peers.delete(peer.id)
    }

    this.send.toAllUsers()
  }

  private _send: wsServer["send"] = (() => {
    return ({
      toRoom: () => { },
      toUser: (peer) => {
        const parsedUsers: wsUsers = {}

        users.forEach(user => {
          parsedUsers[user.id] = {
            name: user.name,
            id: user.id,
            roomId: user.roomId
          }
        })

        const parsedRooms: wsRooms = {}

        rooms.forEach(room => {
          const usersArr = Array.from(users.values())
          const user = usersArr.find(user => user.peers.has(peer.id))

          if (!user)
            return

          parsedRooms[room.id] = {
            id: room.id,
            host: user.id,
            guests: Array.from(room.guests.values())
          }
        })

        const message: wsServerMessage = {
          users: parsedUsers,
          rooms: parsedRooms,
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

