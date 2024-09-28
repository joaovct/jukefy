import { http, HttpResponse } from "msw"
import { services } from "~/services"
import { faker } from '@faker-js/faker'

type JsonBodyResponse = Web_API["Users"]["get_current_user_profile"]["response"]

export const getCurrentUserProfile = http.get(services.users.getCurrentUserProfile.url, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const display_name = firstName + " " + lastName
    const id = faker.string.numeric(12)
    const imageURL = faker.image.avatar()
    const followersTotal = faker.number.int({ max: 674 })
    const country = faker.location.countryCode("alpha-2")
    const email = faker.internet.exampleEmail({ firstName, lastName })

    return HttpResponse.json<JsonBodyResponse>({
        display_name,
        external_urls: {
            spotify: `https://open.spotify.com/user/${id}`
        },
        href: `https://api.spotify.com/v1/users/${id}`,
        id,
        "images": [{
            "url": imageURL,
            "height": 64,
            "width": 64
        }, {
            "url": imageURL,
            "height": 300,
            "width": 300
        }],
        type: "user",
        uri: `spotify:user:${id}`,
        "followers": {
            "href": null,
            "total": followersTotal
        },
        country,
        "product": "premium",
        "explicit_content": {
            "filter_enabled": false,
            "filter_locked": false
        },
        email
    })
})