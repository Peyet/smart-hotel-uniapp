<template>
	<u-popup :show="show" @close="close" @open="open" round="30rpx" closeable :close-on-click-overlay="false" mode="center" :safe-area-inset-bottom="false">
		<view class="flex flex-direction popup-qrcode ">
			<u-skeleton :loading="loading" :rows="5">
				<view class="flex flex-direction align-center">
					<view class="flex flex-direction align-center">
						<text>公众服务号</text>
					</view>
					<image :src="imageData" show-menu-by-longpress class="popup-qrcode-image" mode="widthFix" ></image>
					<view class="flex flex-direction align-center" show-menu-by-longpress>
						<view class="subscribe-btn">
							<image src="../../static/business/zhiwen.png" show-menu-by-longpress mode="widthFix"></image>
							<text class="margin-left-xs">长按图片识别关注</text>
						</view>
					</view>
					<view class="flex flex-direction align-center" show-menu-by-longpress>
						<view class="subscribe-text">
							<view class="flex justify-center">
								<text class="font24">关注将获得以下权益</text>
							</view>
							<view class="flex justify-center">
								<text class="font24 font-bold">下单/入住/续房/离店/退款通知</text>
							</view>
						</view>
					</view>
				</view>
			</u-skeleton>
		</view>
	</u-popup>
</template>

<script>
export default {
	name: 'ax-popup-qrcode',
	data() {
		return {
			loading: true,
			imageData: ''
		};
	},
	props: {
		show: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		close() {
			this.$emit('hide');
		},
		open() {
			this.getData();
		},
		async getData() {
			this.loading = true;
			let res = await this.$api.getSubscribeQrCode();
			this.imageData = res.data;
			this.loading = false;
		},
		// 单选选择
		groupChange(value, index) {
			this.$emit('hide');
		},
	}
};
</script>

<style lang="scss">
.popup-qrcode {
	width: 560rpx;
	// height: calc(100vh - 360px);
	padding: 32rpx 32rpx;
}
.popup-qrcode-image{
	margin-top: 32rpx;
	width: 300rpx;
	border: 1rpx solid #242424;
	border-radius: 12rpx;
}
.subscribe-btn{
	margin-top: 32rpx;
	width: 300rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16rpx;
	border-radius: 50rpx;
	background-color: #242424;
	& image{
		width: 48rpx;
	}
	& text{
		color: #fff;
		font-size: 28rpx;
	}
}
.subscribe-text{
	width: 400rpx;
	display: flex;
	flex-direction: column;
	padding: 16rpx;
}
</style>
