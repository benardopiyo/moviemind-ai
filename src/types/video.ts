export interface Video {
    id: string
    key: string
    name: string
    site: string
    size?: number
    type: string
    official: boolean
    published_at?: string
    iso_639_1: string
    iso_3166_1: string
}

export interface VideoResponse {
    id: number
    results: Video[]
}
