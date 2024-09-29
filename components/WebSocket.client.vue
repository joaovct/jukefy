<script setup lang="ts">
import { store } from '~/store'

//TODO: in prod if secure, use wss
const { status, data, send } = useWebSocket(`ws://${location.host}/api/websocket`)

const rooms = ref<wsRooms>({})
const users = ref<wsUsers>({})

watch(status, status => {
    if (status === 'OPEN' && store.user.value) {
        const message: wsClientMessage = {
            type: "CREATE-USER",
            user: {
                name: store.user.value.displayName,
                id: store.user.value.id,
                roomId: undefined,
            }
        }

        send(JSON.stringify(message))
    }

})

watch(data, stringified => {
    const value: wsServerMessage = JSON.parse(stringified)
    rooms.value = value.rooms
    users.value = value.users
})

function joinRoom(roomId: wsRoom["id"]){
    if(!store.user.value)
        return

    const message: wsClientMessage = {
        type: "JOIN-ROOM",
        roomId,
        user: {
            id: store.user.value.id,
            name: store.user.value.displayName,
            roomId: roomId
        }
    }

    send(JSON.stringify(message))
}

</script>

<template>
    <h3>Users</h3>
    <ul>
        <li v-for="user in users"> {{ user.name }} </li>
    </ul>
    <hr>
    <h3>Rooms</h3>
    <ul>
        <li v-for="room in rooms">
            <h3>Sala: {{ room.id }}</h3>
            <br/>
            users:
            <ul>
                <li v-for="userId in room.guests">{{ userId }}</li>
            </ul>
            <button :onclick="() => joinRoom(room.id)">join room</button>
        </li>
    </ul>
</template>