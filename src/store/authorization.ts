import { reactive } from "vue"

type Authorization = {
    code: {
        value: string;
        set: (value: string) => void;
    };
    codeVerifier: {
        value: string;
        set: (value: string) => void;
    };
    accessToken: {
        value: string;
        set: (value: string) => void;
    },
    refreshToken: {
        value: string
        set: (value: string) => void
    },
    expirationDate: {
        value: Date
        set: (expiresIn: number) => void
    }
}

export const authorization = reactive<Authorization>({
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
        },
    },
    refreshToken: {
        value: localStorage.getItem("refresh_token") || "",
        set: function(value: string){
            localStorage.setItem("refresh_token", value)
            this.value = value
        }
    },
    expirationDate: {
        value: new Date(localStorage.getItem("expiration_date") || Date.now()),
        set: function(expiresIn) {
            const date = new Date( Date.now() + (expiresIn * 1000))
            this.value = date
            localStorage.setItem("expiration_date", new Date( Date.now() + (expiresIn * 1000)).toString())
        }
    }
})