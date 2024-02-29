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
        expirationDate: Date | null;
        set: (value: string, expiresIn: number) => void;
        refresh: (refreshToken: string) => void;
    },
    refreshToken: {
        value: string
        set: (value: string) => void
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
        expirationDate: new Date(localStorage.getItem("access_token_expiration_date")) || null,
        set: function(value: string, expiresIn: number){ 
            localStorage.setItem("access_token", value)
            this.value = value

            // make this a worker that automatically get the refreshed token

            const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
            localStorage.setItem("access_token_expiration_date", expirationDate)
            this.expirationDate = expirationDate
        },
        refresh: function(refreshToken: string){
            //...
        }
    },
    refreshToken: {
        value: localStorage.getItem("refresh_token") || "",
        set: function(value: string){
            localStorage.setItem("refresh_token", value)
            this.value = value
        }
    },
})