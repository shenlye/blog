<script setup lang="ts">
import type { BangumiCollectionItem } from '~/types/bangumi'

const props = defineProps<{
    bangumiCollectionItem: BangumiCollectionItem
}>()

function handleClick() {
    const url = `https://bgm.tv/subject/${props.bangumiCollectionItem.subject_id}`
    window.open(url, '_blank')
}
</script>

<template>
    <div class="bgm-card" @click="handleClick">
        <img
            v-if="bangumiCollectionItem.subject.images?.grid"
            :src="bangumiCollectionItem.subject.images.grid"
            :alt="bangumiCollectionItem.subject.name"
            class="bgm-card__image"
        >
        <div class="bgm-card__info">
            <h3 class="bgm-card__title">
                {{ bangumiCollectionItem.subject.name_cn || bangumiCollectionItem.subject.name }}
            </h3>
            <p class="bgm-card__meta">
                <span class="bgm-card__date">{{ bangumiCollectionItem.subject.date }}</span>
                <span class="bgm-card__score">评分: {{ bangumiCollectionItem.subject.score || '暂无' }}</span>
            </p>
            <p class="bgm-card__summary">
                {{ bangumiCollectionItem.subject.short_summary || '暂无简介' }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.bgm-card {
  display: flex;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 180px;
  cursor: pointer;
  background-color: var(--c-bg-3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--c-brand);
  }

  &__image {
    width: 120px;
    height: 100%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__info {
    padding: 12px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--c-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    gap: 12px;
    margin: 0 0 8px;
    font-size: 12px;
    color: var(--c-text-secondary);
  }

  &__summary {
    margin-top: auto;
    font-size: 13px;
    color: var(--c-text-tertiary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
  }
}
</style>
