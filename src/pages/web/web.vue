<template>
	<view class="content">
		<u-skeleton :loading="loading" :rows="10">
			<!-- <rich-text v-html="content"></rich-text> -->
			<view class="ax-safe-bottom">
				<u-parse :content="content" :selectable="true"></u-parse>
			</view>
		</u-skeleton>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: true,
			content: ''
		};
	},
	methods: {
		async getData(key) {
			let res = await this.$api.getSystemPage(key);
			if (res.code === 0) {
				uni.setNavigationBarTitle({
					title: res.data.name
				});
				this.content = res.data.content;
				this.loading = false;
			}
		}
	},
	onLoad(opt) {
		if (opt.key) {
			this.getData(opt.key);
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	padding: 32rpx 32rpx;
}
</style>
