<template>
	<view class="container flex flex-direction">
		<u-skeleton :loading="loading" :rows="10">
			<view class="face-card face-card__400 flex justify-between">
				<view class="flex flex-direction ">
					<image class="face-title--image" src="/static/face/face-title.png" mode="heightFix"></image>
					<view class="flex flex-direction  face-title ">
						<view>根据</view>
						<view class="font-bold font32">国家旅馆业治安管理规定</view>
						<view>入住酒店必须提供身份证登记</view>
						<view>且要实名认证并上报相关信息</view>
					</view>
				</view>
				<view>
					<image class="face-image" src="/static/face/face-image.png" mode="heightFix"></image>
				</view>
			</view>
			<view class="face-card mt32 flex flex-direction">
				<div class="flex justify-between align-center ">
					<text class="font32">在线实名认证</text>
					<text>
						<text class="font-bold font32" v-if="record">{{fen2yun(record.pluginPrice)}}</text>
						<text class="font24 .margin-left-xxs">元/次</text>
					</text>
				</div>
				<div class="flex margin-top-xs">
					<text
						class="font24 info-color">如果您没有携带身份证，我们提供了在线输入身份证信息的选项供您完成认证。请注意，由于额外的验证步骤和系统支持，此项服务将产生额外费用。请您在线输入与入住人一致且未过期的有效身份证件信息。</text>
				</div>
			</view>
			<view class="face-card mt32 flex flex-direction">
				<div class="flex justify-between align-center">
					<text class="font32">支付方式</text>
					<text class="font-bold font32">微信支付</text>
				</div>
				<view class="flex margin-top-xs">
					<text class="font24 info-color">支付成功后认证失败可重新认证，如还无法认证成功则系统会在12小时内【全额退款】，请放心使用。</text>
				</view>
			</view>
			<view class="mt32 font24 info-color">
				<text>提供身份证信息是酒店规定的必要程序，如果您选择在线输入身份证进行认证，无法提供正确的身份信息将可能影响您的入住。请您理解我们的合规要求，并积极配合完成相关手续。</text>
			</view>
			<view class="bottom-btn" v-if="record">
				<text class="text-price font-bold font40">{{fen2yun(record.pluginPrice)}}<text class="font24">/次</text>
				</text>
				<view class="bottom-btn__item">
					<u-button class="margin-top-lg" :loading="btnLoading"
						:customStyle="{ color: '#fff', borderRadius: '0rpx' }" color="#242424" @click="onCreatePay"
						text="立即认证"></u-button>
				</view>
			</view>
		</u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				btnLoading: false,
				scene: null,
				record: null,
				loading: true,
				openId: null,
				paySuccess:false

			};
		},
		onLoad(opt) {
			if (opt.scene) {
				this.scene = decodeURIComponent(opt.scene)
			}
		},
		onShow() {
			if (this.scene) {
				this.onGetData(this.scene)
			}
			if (!this.openId) {
				this.onGetOpenId()
			}
		},
		methods: {
			createOrder() {

			},
			fen2yun(fen) {
				return parseFloat(fen / 100).toFixed(2);
			},
			async onGetData(id) {
				let res = await this.$api.getFacePlugin(id)
				if (res.code == 0) {
					this.record = res.data
					if (this.record.process == 'WAIT_SCAN') {
						await this.$api.handleFacePlugin(id, "SCANNED")
					}
					this.loading = false
				}
			},
			async onGetOpenId() {
				await uni.login({
					provider: 'weixin', //使用微信登录
					success: async (loginRes) => {
						if (loginRes.code) {
							let res = await this.$api.getOpenId(loginRes.code)
							this.openId = res.data.openid
						}
					}
				});
			},
			async onCreatePay() {
				this.btnLoading = true
				let res = await this.$api.createFacePluginPay(this.record.id, this.openId)
				this.btnLoading = false
				if (res.code == 0) {
					let pay = res.data
					uni.requestPayment({
						provider: "wxpay",
						timeStamp: pay.timeStamp,
						nonceStr: pay.nonceStr,
						package: pay.packageValue,
						paySign: pay.paySign,
						signType: pay.signType,
						success:(res) => {
							uni.redirectTo({
								url:"/pages/face/input?id="+this.record.id
							})
						},
						fail(e) {
							uni.showModal({
								title: '提示',
								content: '支付失败',
								showCancel: false,
								cancelText: '',
								confirmText: '了解',
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 40rpx 32rpx;
	}

	.face-card {
		padding: 32rpx 32rpx;
		box-sizing: border-box;
		background: rgba(63, 140, 255, 0.1);
		border-radius: 30rpx 30rpx 30rpx 30rpx;

		&__400 {
			height: 400rpx;
		}
	}

	.face-title {
		margin-top: 40rpx;
		font-size: 28rpx;
		line-height: 48rpx;

		&--image {
			height: 58rpx;
		}
	}

	.face-image {
		height: 336rpx;
	}

	.bottom-btn {
		padding: 12rpx 32rpx;
		padding-bottom: calc(12rpx + var(--safe-area-inset-bottom));
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&__item {
			width: 240rpx;
		}
	}
</style>