<template>
	<view>
		<view class="flex flex-direction container">
			<u-skeleton :loading="loading" :rows="6" title>
				<view class="flex align-center justify-center margin-top-xl">
					<text class="font28 info-color margin-right-xs">支付剩余时间</text>
					<u-count-down :time="payTime" v-if="payTime > 0" format="HH:mm:ss"></u-count-down>
				</view>
				<view class="flex align-center justify-center margin-top-sm">
					<text class="text-price font72 font-bold">{{ fen2yun(order.totalPrice + order.deposit) }}</text>
				</view>
				<view class="ax-card flex flex-direction">
					<view class="flex ax-card__cell align-center justify-between">
						<view class="flex align-center">
							<image src="../../static/wechat-pay.png" class="pay-icon"></image>
							<text class="margin-left-xs font32">微信</text>
						</view>
						<view class="flex align-center">
							<u-radio-group v-model="radioValue">
								<u-radio label=" " :name="1" activeColor="#D59E32" size="48rpx"
									iconSize="18px"></u-radio>
							</u-radio-group>
						</view>
					</view>
				</view>
			</u-skeleton>
		</view>
		<view class="bottom-btn">
			<view class="bottom-btn__item">
				<sqb-pay :return_url="payData.return_url" :total_amount="payData.total_amount"
					:terminal_sn="payData.terminal_sn" :subject="payData.subject" :client_sn="payData.client_sn"
					:notify_url="payData.notify_url" @navigateTo="navigateTo" :sign="payData.sign">
					<u-button class="margin-top-lg" :customStyle="{ color: '#fff', borderRadius: '0rpx' }"
						color="#242424" text="立即支付"></u-button>
				</sqb-pay>
			</view>
		</view>
	</view>
</template>

<script>
	const dayjs = require('@/utils/dayjs.min.js');
	export default {
		data() {
			return {
				radioValue: 1,
				order: {},
				payTime: 0,
				loading: false,
				payData: {
					client_sn: null,
					return_url: null,
					sign: null,
					subject: null,
					terminal_sn: null,
					total_amount: null,
					notify_url: null
				}
			};
		},
		methods: {
			fen2yun(fen) {
				return parseFloat(fen / 100).toFixed(2);
			},
			async getData(id) {
				let data = await this.$api.getOrderBase(id);
				if (data.code == 0 && data.data != null) {
					this.order = data.data;
					if (data.data.status === 'wait_pay') {
						let time = dayjs().diff(dayjs(data.data.createdAt));
						if (time > 0) {
							this.payTime = 600000 - time;
						} else {
							this.payTime = 0;
						}
					}
				}
				this.loading = false;
			},
			async createPay() {
				this.loading = true;
				let orderId = this.order.rootOrderId == null ? this.order.id : this.order.rootOrderId
				console.log(this.order);
				let res = await this.$api.getPayParams({
					orderId: this.order.id,
					payWay: 'WEI_XIN_APP',
					returnUrl: '/pages/order/details?id=' + orderId
				});
				if (res.code === 0) {
					this.payData = res.data;
					// this.payData.sign = JSON.stringify(res.data.sign)
				}
				this.loading = false;
			},
			navigateTo(e) {
				console.log(e);
				uni.redirectTo({
					url: e.detail.url,
					fail(e) {
						uni.showToast({
							title: '支付失败'
						});
					}
				});
			}
		},
		onLoad(params) {
			if (params != null || params != undefined) {
				this.order = JSON.parse(params.order);

			} else {
				this.loading = true;
			}
		},
		async onShow() {
			await this.getData(this.order.id);
			await this.createPay()
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 0rpx 32rpx;
	}

	.font72 {
		font-size: 72rpx;
	}

	.pay-icon {
		height: 60rpx;
		width: 60rpx;
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
		flex-direction: column;

		&__item {}
	}
</style>