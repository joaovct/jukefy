export const client = (() => {
    if(import.meta.client){
        return {
            localStorage: localStorage
        }
    }

})()