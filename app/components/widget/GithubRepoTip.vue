<script setup lang="ts">
</script>

<template>
    <a href="https://github.com/L33Z22L11/blog-v3" target="_blank" rel="noopener noreferrer" class="github-card">
        <img
            src="/githubcard.webp" alt="背景" class="github-card__bg" width="300" height="126" loading="lazy"
            decoding="async"
        >
        <div class="github-card__content">
            <span class="github-card__title">
                想使用该
                <span class="github-card__theme-text">主题</span>
                <br>
                建立自己的站点吗？
            </span>
            <br>
            <span class="github-card__footer">
                <span>不妨看看站点的</span>
                <svg class="github-card__icon" viewBox="0 0 24 24" data-icon="tabler:brand-github">
                    <path
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
                    />
                </svg>
                <span>仓库吧</span>
                <svg class="github-card__icon" viewBox="0 0 24 24" data-icon="tabler:arrow-right">
                    <path
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" d="M5 12h14m-6 6l6-6m-6-6l6 6"
                    />
                </svg>
            </span>
        </div>
    </a>
</template>

<style scoped lang="scss">
.github-card {
    position: relative;
    display: block;
    border-radius: 0.4375rem;
    margin: 1px;
    padding: 1rem;
    background-color: var(--c-bg);
    text-decoration: none;
    transition: transform 0.2s cubic-bezier(.4, 0, .2, 1), box-shadow 0.2s cubic-bezier(.4, 0, .2, 1);
    will-change: transform;
    cursor: pointer;

    &:hover {
        transform: scale(1.045);
        box-shadow: 0 6px 32px 0 rgba(0, 0, 0, 0.10);
    }

    &__bg {
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        object-fit: cover;
        opacity: 0.3;
        user-select: none;
        border-radius: 0.4375rem;
    }

    &__content {
        position: relative;
        z-index: 10;
    }

    &__title {
        font-weight: 700;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    &__theme-text {
        background-clip: text;
        color: transparent;
        background-image: linear-gradient(to top right, #3b82f6, #ec4899);
        font-weight: 900;
    }

    &__footer {
        font-size: 0.875rem;

        &>* {
            vertical-align: middle;
        }
    }

    &__icon {
        width: 1em;
        height: 1em;
        display: inline;
    }
}
</style>
