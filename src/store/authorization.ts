import { reactive } from "vue"

export const store = reactive({
    code: {
        value: localStorage.getItem("code") || "",
        set: function(value: string){
            localStorage.setItem("code", value)
            this.value = value
        }
    },
    codeVerifier: {
        value: localStorage.getItem("code_verifier") || "",
        set: function(value: string){
            localStorage.setItem("code_verifier", value)
            this.value = value
        }
    },
    accessToken: {
        value: localStorage.getItem("access_token") || "",
        set: function(value: string){ 
            localStorage.setItem("access_token", value)
            this.value = value
        }
    },
})