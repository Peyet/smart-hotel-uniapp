<template>
	<view>
		<u-skeleton :loading="!loading" :rows="10"></u-skeleton>
		<web-view :src="webUrl" v-if="loading"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				id: "",
				token: "",
				record: null,
				webUrl: "",
        faceUrl: "",// 人脸识别地址
			};
		},
		async onLoad(opt) {
			this.id = opt.id
			await this.onGetRecord()
		},
		methods: {
			// 查询记录
			async onGetRecord() {
				let res = await this.$api.getFacePlugin(this.id)
				if (res.code == 0) {
					this.record = res.data
					this.token = res.data.orderToken
					await this.$api.handleFacePlugin(this.record.id, "WAIT_VERIFY")
					await this.createUrl()
				}
			},
			async createUrl() {
				const successUrl = encodeURIComponent(`${this.faceUrl}?id=` + this.record.id +
					'&type=success');
				const failedUrl = encodeURIComponent(`${this.faceUrl}?id=` + this.record.id +
					'&type=failed');
				const url =
					`faceUrl?token=${this.token}&successUrl=${successUrl}&failedUrl=${failedUrl}`;
				this.webUrl = url
				this.loading = true
			}
		}
	}
</script>

<style lang="scss">

</style>