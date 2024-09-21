<script setup lang="ts">
//TODO: in prod if secure, use wss
const { ws, status, data, send } = useWebSocket(`ws://${location.host}/api/websocket`, {  })

const rooms = ref<wsRooms>({})
const users = ref<wsUsers>({})

watch(status, status => {
    if (status === 'OPEN') {
        const message: wsClientMessage = {
            type: "CREATE-USER",
            user: {
                id: Date.now().toString(),
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

watch([users, rooms], () => {
    console.log(users.value, rooms.value)
})

</script>

<template>
    <div></div>
</template>