<template></template>

<script>
import amap from '@/utils/amap-wx.130.js';
export default {
	name: 'ax-amap',
	data() {
		return {
			amapPlugin: null,
			amapPluginKey: 'amapPluginKey'
		};
	},
	methods: {
		init() {
			this.amapPlugin = new amap.AMapWX({
				key: this.amapPluginKey
			});
		},
		getRegeo(localtion) {
			uni.showLoading({
				title: '获取信息中'
			});
			uni.hideLoading();
			return new Promise((resolve, reject) => {
				this.amapPlugin.getRegeo({
					localtion: localtion,
					success: (data) => {
						uni.hideLoading();
						resolve(data);
					},
					fail: (e) => {
						uni.hideLoading();
						reject(e);
					}
				});
			});
		}
	}
};
</script>

<style lang="scss"></style>
