// Bangumi API 响应类型
export interface BangumiApiResponse {
    data: BangumiCollectionItem[]
    total: number
    limit: number
    offset: number
}

// 单个收藏项
export interface BangumiCollectionItem {
    updated_at: string // ISO 8601 格式时间
    comment: string | null
    tags: Tag[]
    subject: Subject
    subject_id: number
    vol_status: number
    ep_status: number
    subject_type: number // 2=动画，4=游戏
    type: number // 收藏类型
    rate: number // 用户评分
    private: boolean
}

// 作品主体信息
export interface Subject {
    date: string // YYYY-MM-DD
    images: {
        small: string
        grid: string
        large: string
        medium: string
        common: string
    }
    name: string// 日文原名
    name_cn: string// 中文译名
    short_summary: string
    tags: Tag[]
    score: number // 社区评分
    type: number // 作品类型
    id: number // 作品ID
    eps: number // 集数
    volumes: number // 卷数
    collection_total: number // 收藏人数
    rank: number // 排名
}

export interface Tag {
    name: string
    count: number
    total_cont: number
}
