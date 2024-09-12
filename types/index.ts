export { }

declare global {
    type Camelize<T extends string> = T extends `${infer A}_${infer B}` ? `${A}${Camelize<Capitalize<B>>}` : T

    type CamelizeKeys<T extends object> = {
        [key in keyof T as key extends string ? Camelize<key> : key]: T[key] extends object ? CamelizeKeys<T[key]> : T[key]
    }

    // WEB API

    type Authorization_code_PKCE = {
        request_user_authorization: {
            URLParams: {
                client_id: string
                response_type: string
                redirect_uri: string
                state?: string
                scope?: string
                code_challenge_method: string
                code_challenge: string
            },
            response: {
                code: string
                state?: string
            }
            error_response: {
                error?: string
                state?: string
            }
        },
        request_access_token: {
            payload: {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
                body: {
                    grant_type: "authorization_code"
                    code: string
                    redirect_uri: string
                    client_id: string
                    code_verifier: string
                }
            },
            response: {
                access_token: string
                token_type: string
                scope: string
                expires_in: number
                refresh_token: string
            }
            error_response: {
                error: string
                error_description: string
            }
        }
    }

    type AuthorizationCodePKCE = CamelizeKeys<Authorization_code_PKCE>

    type Web_API = {
        Player: {
            get_playback_state: {
                payload: {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: string
                    },
                }
                response: {
                    device: Device
                    repeat_state: "off" | "track" | "context",
                    shuffle_state: boolean,
                    context: Context | null
                    timestamp: number
                    progress_ms: number
                    is_playing: boolean,
                    actions: ActionsObject,
                } & (
                    {
                        currently_playing_type: "track"
                        item: TrackObject
                    } |
                    {
                        currently_playing_type: "episode"
                        item: EpisodeObject
                    } |
                    {
                        currently_playing_type: "unkown"
                        item: null
                    }
                )
                error_response: {
                    status: 400 | 403 | 429
                    message: string
                }
            }
        }
        Users: {
            get_current_user_profile: {
                payload: {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: string
                    },
                }
                response: {
                    country: string | null // null if user-read-private not granted
                    display_name: string
                    email: string | null // null if user-read-email not granted
                    explicit_content: {
                        filter_enabled: boolean
                        filter_locked: boolean
                    } | null // null if user-read-private not granted
                    external_urls: {
                        spotify: string
                    } | null // null if user-read-private not granted
                    followers: FollowersObject
                    href: string
                    id: string
                    images: ImageObject[]
                    product: string | null // null if user-read-private not granted
                    type: "user"
                    uri: string
                }
                error_response: {
                    status: number
                    message: string
                }
            }
        }
    }

    type WebAPI = CamelizeKeys<Web_API>
}

interface Device {
    id: string | null
    is_active: boolean
    is_private_session: boolean
    is_restricted: boolean
    name: string
    type: string
    volume_percent: number | null
    supports_volume: boolean
}

interface Context {
    type: "artist" | "playlist" | "album" | "show"
    href: string
    external_urls: string
    uri: string
}

interface TrackObject {
    album: {
        type: "album" | "single" | "compilation"
        total_tracks: number
        available_markets: string
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        images: ImageObject[]
        name: string
        release_date: string
        release_date_precision: string
        restrictions: RestrictionsObject
        uri: string
        artists: SimplifiedArtistObject[]
    },
    artists: ArtistObject[],
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: {
        isrc: string
        ean: string
        upc: string
    }
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    is_playable: boolean
    linked_from: {}
    restrictions: RestrictionsObject
    name: string
    popularity: number
    preview_url: string
    track_number: string
    type: "track"
    uri: string
    is_local: boolean
}

interface EpisodeObject {
    audio_preview_url: string | null
    description: string
    html_description: string
    duration_ms: number
    explicit: boolean
    external_urls: {
        spotifiy: string
    }
    href: string
    id: string
    images: ImageObject[]
    is_externally_hosted: boolean
    is_playable: boolean
    languages: string[]
    name: string
    release_date: string
    release_date_precision: string
    resume_point: {
        fully_played: boolean
        resume_position_ms: number
    }
    type: string
    uri: string
    restrictions: RestrictionsObject
    show: {
        available_markets: string[]
        copyrights: CopyrightObject
        description: string
        html_description: string
        explicit: boolean
        external_urls: {
            spotify: string
        }
        href: string
        id: string
        images: ImageObject[]
        is_externally_hosted: boolean
        languages: string[]
        media_type: string
        name: string
        publisher: string
        type: "show"
        uri: string
        total_episodes: number
    }
}

interface ArtistObject {
    external_urls: {
        spotify: string
    }
    followers: {
        href: string | null
        total: number
    }
    genres: string[],
    href: string
    id: string
    images: ImageObject[]
    name: string
    popularity: number
    type: "artist"
    uri: string
}

interface ImageObject {
    url: string
    height: number | null
    width: number | null
}

interface SimplifiedArtistObject {
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    name: string
    type: "artist"
    uri: string
}

interface RestrictionsObject {
    reason: "market" | "product" | "explicit"
}

interface CopyrightObject {
    text: string
    type: "C" | "P"
}

interface ActionsObject {
    interrupting_playback: boolean
    pausing: boolean
    seeking: boolean
    skipping_next: boolean
    skipping_prev: boolean
    toggling_repeat_context: boolean
    toggling_shuffle: boolean
    toggling_repeat_track: boolean
    trasferring_playback: boolean
}

interface FollowersObject {
    href: null // Currently not supported by the Web API
    total: number
}