import { worker } from '../mocks/browser'

export default defineNuxtPlugin(() => {
    if (import.meta.dev) {
        worker.start()
    }
})