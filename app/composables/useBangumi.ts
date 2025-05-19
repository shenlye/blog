import type { BangumiApiResponse } from '~/types/bangumi'

import BlogConfig from '~~/blog.config'

export type ContentType = 'anime' | 'game'
export type CollectionType = keyof typeof TYPE_ID_MAP

export const ITEMS_PER_PAGE = 12

const TYPE_ID_MAP = {
    wish: 1,
    collect: 2,
    do: 3,
} as const

export default function useBangumiCollection(
    contentType: ContentType = 'anime',
    collectionType: Ref<CollectionType> = ref('wish'),
    page: Ref<number> = ref(1),
) {
    const username = BlogConfig.bgmUsername

    const subjectType = computed(() => contentType === 'anime' ? 2 : 4)
    const typeId = computed(() => TYPE_ID_MAP[toValue(collectionType)])
    const offset = computed(() => (page.value - 1) * ITEMS_PER_PAGE)

    const { data, status, error } = useFetch<BangumiApiResponse>(() => {
        return `https://api.bgm.tv/v0/users/${username}/collections?subject_type=${subjectType.value}&type=${typeId.value}&limit=${ITEMS_PER_PAGE}&offset=${offset.value}`
    }, {
        key: `bangumi-${contentType}-${toValue(collectionType)}-page-${toValue(page)}`,
    })

    const totalPages = computed(() => data.value ? Math.ceil(data.value.total / ITEMS_PER_PAGE) : 0)

    return {
        data,
        status,
        error,
        totalPages,
    }
}
