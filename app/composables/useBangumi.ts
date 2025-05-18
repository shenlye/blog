import type { BangumiCollection } from '~/types/bangumi'
import BlogConfig from '~~/blog.config'

export type ContentType = 'anime' | 'game'

export const ITEMS_PER_PAGE = 12

const TYPE_ID_MAP = {
    wish: 1,
    collect: 2,
    do: 3,
}

export function useBangumiCollection(
    contentType: ContentType,
    collectionType: keyof typeof TYPE_ID_MAP,
    page: MaybeRef<number> = 1,
) {
    const username = BlogConfig.bgmUsername

    const subjectType = computed(() => contentType === 'anime' ? 2 : 4)

    const typeId = computed(() => TYPE_ID_MAP[collectionType])

    const offset = computed(() => (toValue(page) - 1) * ITEMS_PER_PAGE)

    const { data, error, status } = useFetch<{
        data: BangumiCollection[]
        total: number
    }>(() => {
        return `https://api.bgm.tv/v0/users/${username}/collections?subject_type=${subjectType.value}&type=${typeId.value}&limit=${ITEMS_PER_PAGE}&offset=${offset.value}`
    }, {
        key: `bangumi-${contentType}-${collectionType}-page-${toValue(page)}`,
        transform: res => ({
            data: res.data || [],
            total: res.total || 0,
        }),
    })

    return {
        collections: data.value?.data || [],
        total: data.value?.total || 0,
        isLoading: status.value === 'pending',
        error,
        page: toRef(page),
    }
}