import { faker } from "@faker-js/faker"
import { http, HttpResponse } from "msw"
import { authorization } from "~/services/authorization"

type Response = Authorization_code_PKCE["request_access_token"]["response"]

export const requestAccessToken = http.post(authorization.requestAccessToken.url, () => {
    return HttpResponse.json<Response>({
        access_token: faker.string.alphanumeric(256),
        token_type: "Bearer",
        expires_in: 3600,
        refresh_token: faker.string.alphanumeric(256),
        scope: "user-read-playback-state user-read-email user-read-private"
    })
})