export interface BangumiCollection {
    subject: {
        id: number
        name: string
        name_cn: string
        images: {
            common: string
        }
        score: number
    }
    rate: number
    comments: number
    updated_at: string
}
