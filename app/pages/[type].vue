<script setup lang="ts">
import type { CollectionType } from '~/composables/useBangumi'
import Pagination from '~/components/partial/Pagination.vue'

import useBangumi from '~/composables/useBangumi'

const route = useRoute()
const contentType = route.path.includes('anime') ? 'anime' : 'game'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-log'])

const page = ref(1)
const collectionType = ref<CollectionType>('wish')
const { data, error, status, totalPages } = useBangumi(contentType, collectionType, page)

const games = computed(() => data.value?.data || [])

const orderMap = computed(() => {
    return contentType === 'anime'
        ? {
                wish: '想看',
                do: '在看',
                collect: '看过',
            }
        : {
                wish: '想玩',
                do: '正在玩',
                collect: '玩过',
            }
})

watch(collectionType, () => {
    page.value = 1
})
</script>

<template>
    <div class="game-page">
        <div class="toolbar">
            <ZButton
                v-for="(label, key) in orderMap"
                :key="key"
                :text="label"
                :primary="collectionType === key"
                @click="collectionType = key as CollectionType"
            />
            <span class="count-text">{{ orderMap[collectionType] }}{{ data?.total ?? 0 }}部{{ contentType === 'anime' ? '动漫' : '游戏' }}</span>
        </div>
        <div v-if="error" class="error">
            {{ error.message }}
        </div>
        <TransitionGroup name="fade" tag="div" class="game-list">
            <BgmCard
                v-for="game in games"
                :key="game.subject_id"
                :bangumi-collection-item="game"
            />
        </TransitionGroup>

        <Pagination
            v-if="totalPages > 1"
            v-model="page"
            :total-pages="totalPages"
        />

      <PostComment :key="route.path" />
    </div>
</template>

<style scoped lang="scss">
.game-page {
  padding: 1rem;
}

.toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

.count-text {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--c-text-light);
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>