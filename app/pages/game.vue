<script setup lang="ts">
import Pagination from '~/components/partial/Pagination.vue'
import useBangumi from '~/composables/useBangumi'

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-log'])

const page = ref(1)
const { data, error, status, totalPages } = useBangumi('game', 'wish', page)

const games = computed(() => data.value?.data || [])
</script>

<template>
    <div class="game-page">
        <div v-if="status === 'pending'" class="loading">
            加载中...
        </div>
        <div v-else-if="error" class="error">
            {{ error.message }}
        </div>

        <div v-else class="game-list">
            <BgmCard
                v-for="game in games"
                :key="game.subject_id"
                :bangumi-collection-item="game"
            />
        </div>

        <Pagination
            v-if="totalPages > 1"
            v-model="page"
            :total-pages="totalPages"
        />
    </div>
</template>

<style scoped lang="scss">
.game-page {
  padding: 1rem;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}
</style>
