<!-- 欢乐颂中心  -->
<template>
	<s-layout navbar="inner" class="index-wrap" title="欢乐颂中心" :bgStyle="bgStyle" :onShareAppMessage="shareInfo">
		<!-- 欢乐颂商信息 -->
		<baijia-info />
		<!-- 账户信息 -->
		<account-info />
		<!-- 菜单栏 -->
		<baijia-menu />
		<!-- 欢乐颂记录 -->
		<baijia-log />

		<!-- 权限弹窗 -->
		<baijia-auth />
	</s-layout>
</template>

<script setup>
  import { computed } from 'vue';
	import baijiaInfo from './components/baijia-info.vue';
	import accountInfo from './components/account-info.vue';
	import baijiaLog from './components/baijia-log.vue';
	import baijiaMenu from './components/baijia-menu.vue';
	import baijiaAuth from './components/baijia-auth.vue';
  import sheep from '@/sheep';

  const shareInfo = computed(() => {
    return sheep.$platform.share.getShareInfo({
      params: {
        page: '6',
      },
    }, {
      type: 'user',
    });
  });

	const bgStyle = {
		color: '#F7D598',
	};
</script>

<style lang="scss" scoped>
	:deep(.page-main) {
		background-size: 100% 100% !important;
	}
</style>
