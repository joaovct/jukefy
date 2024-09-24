type User = {
    value: WebAPI["Users"]["getCurrentUserProfile"]["response"] | undefined
    set: (value: WebAPI["Users"]["getCurrentUserProfile"]["response"] | undefined) => void
}

export const user = reactive<User>({
    value: undefined,
    set: function(value){
        this.value = value
    }
})