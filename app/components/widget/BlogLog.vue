<script setup lang="ts">
const appConfig = useAppConfig()

const blogLog = [
    { date: '2025-05-15', content: 'Astro博客的页面基本完成，但是不够满意，转用纸鹿的博客' },
    { date: '2025-03-12', content: '发布第一篇文章Hello Astro' },
    { date: '2025-02-18', content: '第一次提交代码到Github，准备用Astro开发博客' },
]
</script>

<template>
    <h3 class="widget-title">
        更新日志
    </h3>
    <!-- TODO: 优化时间线样式 -->
    <div class="widget-card">
        <ul>
            <li v-for="(item, index) in blogLog" :key="index">
                <small>{{ item.date }}</small><br>
                {{ item.content }}
            </li>
        </ul>
    </div>
</template>
