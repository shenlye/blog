---
title: "使用Vue给网站添加追番和游戏进度"
description: "在Nuxt中使用useFetch来从Bangumi API获取追番和游戏数据，然后使用Vue来展示这些数据。"
date: 2025-05-19
updated: 2025-05-19
type: story
categories: [博客]
tags: ["Bangumi", "前端", "Nuxt", "API", "Vue"]
---
::alert
作为一个完全不懂 Vue、Nuxt 和 TypeScript 的新手，我花了两天时间成功接入了 Bangumi API，实现了动漫和游戏进度的展示功能，本文基于 Nuxt 3 + Vue 3 + TypeScript 编写。
::
## 1. 准备工作

首先需要了解Bangumi API的基本用法：
::link-card
---
icon: https://bgm.tv/img/favicon.ico
title: Bangumi API
link: "https://bangumi.github.io/api"

---
::

## 2. 定义返回数据类型
在types/bangumi.d.ts中根据 API 文档定义返回数据的类型，比如：
```typescript
export interface BangumiApiResponse {
    total: number // 总数
    limit: number // 每页数
    offset: number // 偏移量
    data: {
        updated_at: string // 更新时间
        comment: string | null // 自己的评论
        subject: {
            images: {
                common: string // 封面
        }
        name: string // 名称
        name_cn: string // 中文名称
        score: number // 均分
        id: number // 条目 ID
        }
        subject_id: number
        rate: number // 自己的评分
    }[]
}
```

## 3. 实现数据获取逻辑

要使用 API，还需要准备5个参数，分别是用户名、条目类型、收藏类型、每页条数和偏移量。

根据文档得知，参数SubjectType为2表示动画，4表示游戏。参数Type为1表示想看，2表示看过，3表示再看。

重点说说 limit 和 offset，这两个参数就可以用来分页。limit 可以理解为获取多少条数据，而 offset 可以理解为忽略多少条数据。

比如，我们每页显示10条数据，那么 limit 就是10，当第一页的时候 offset 就为0，当第二页的时候 offset 就为10，以此类推。

将这些参数拼接后，就可以使用 :tip[useFetch]{tip="Nuxt提供的封装函数来发起 API 请求，它支持服务端预取和缓存，非常适合用来获取接口数据。"}获取到自己想要的数据了

创建 :tip[composables]{tip="用于存放Composition API 的可复用逻辑的文件夹"}/useBangumi.ts文件：
```typescript
import type { BangumiApiResponse } from '~/types/bangumi' // 导入定义好的类型

import BlogConfig from '~~/blog.config' // 导入用户名

export type ContentType = 'anime' | 'game' // 定义条目类型
export type CollectionType = keyof typeof TYPE_ID_MAP // 定义收藏类型

export const ITEMS_PER_PAGE = 12 // 每页显示12条数据

// 收藏类型映射表
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
        // 这里的 key 是 Nuxt 用来缓存 fetch 请求的标识，避免重复请求，提高性能
        key: `bangumi-${contentType}-${toValue(collectionType)}-page-${toValue(page)}`,
    })

    const totalPages = computed(() => data.value ? Math.ceil(data.value.total / ITEMS_PER_PAGE) : 0) // 计算总页数

    return {
        data,
        status,
        error,
        totalPages,
    }
}
```

## 4. 页面展示逻辑
```vue
<script setup lang="ts">
  import useBangumi from '~/composables/useBangumi'

  const contentType = ref<'anime' | 'game'>('anime')
  const collectionType = ref<'wish' | 'collect' | 'do'>('wish')
  const page = ref(1)

  const { data, pending, error, totalPages } = useBangumi(
      contentType,
      collectionType,
      page
  )

  // 切换收藏类型时重置页码
  watch(collectionType, () => {
    page.value = 1
  })
</script>
```

当我们需要获取不同类型的数据时，只需要修改 contentType 和 collectionType 即可。

data 包含了 API 返回的数据，pending 表示请求是否正在进行，error 表示请求是否出错，totalPages 表示总页数。要实现骨架屏和错误提示，只需要在页面上添加相应的组件即可。下面只展示逻辑

```vue
<template>
  <div>
    <div v-if="pending">加载中...</div>
    <div v-else-if="error">加载失败：{{ error.message }}</div>
    <div v-else>
      <!-- 数据展示 -->
    </div>
  </div>
</template>
```

分页控制也比较简单，只需要在页面上添加上一页和下一页的按钮，然后在点击按钮时修改 page 的值即可。
```vue
<template>
  <div class="pagination">
    <button @click="page--" :disabled="page <= 1">上一页</button>
    <span>{{ page }} / {{ totalPages }}</span>
    <button @click="page++" :disabled="page >= totalPages">下一页</button>
  </div>
</template>
```

这是我第一次使用 Vue 和 Nuxt 接入第三方 API，过程虽然有些曲折，但也收获颇多。
学到了一点 TypeScript 的知识，也了解了一些 Vue 的基本用法。