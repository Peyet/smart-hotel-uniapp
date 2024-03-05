<template>
	<view class="ax-order-card flex flex-direction" @click="_handleClick" v-if="order">
		<!--  标题  -->
		<view class="flex align-center justify-between margin-bottom-sm">
			<view class="flex align-center">
				<uni-icons type="ax-icon-hotel" custom-prefix="ax-icon" size="18" color="#000"></uni-icons>
				<text class="font32 margin-left-xxs">{{ order.hotelName }}</text>
			</view>
			<text class="font28" :class="order.status === 'cancel' ? 'text-color-normal' : 'text-color-active'">{{ getOrderStatusName(order.status).name }}</text>
		</view>
		<view class="flex ax-order-card__content align-center">
			<image :src="order.cover" mode="aspectFill"></image>
			<view class="flex flex-direction margin-left-sm">
				<view class="font32">{{ order.roomName }}</view>
				<view class="margin-top-xs font24 info-color">
					<text class="">{{ formartYMD(order.startDate) }}至{{ formartYMD(order.endDate) }}</text>
					<text class="margin-left-xxs">{{ `${order.days}晚${order.roomCount}间` }}</text>
				</view>
			</view>
		</view>
		<view class="flex justify-end margin-bottom-xs">
			<text class="font40 font-bold text-price">{{ fen2yun(order.totalPrice + order.deposit) }}</text>
		</view>
		<view class="flex justify-end">
			<ax-button class="ax-order-card__btn" @click="cancelOrder" content="取消订单" v-if="order.status === 'wait_pay'" />
			<ax-button class="ax-order-card__btn" content="查看详情" @click="goDetails()" />
			<ax-button class="ax-order-card__btn" type="primary" content="立即支付" v-if="order.status === 'wait_pay'" @click="payOrder" />
		</view>
	</view>
</template>

<script>
const dayjs = require('@/utils/dayjs.min.js');
export default {
	data() {
		return {};
	},
	props: {
		order: {
			type: Object,
			default: {}
		}
	},
	methods: {
		//点击事件
		_handleClick() {
			this.$emit('click');
		},
		payOrder() {
			uni.navigateTo({
				url: '/pages/order/pay?order=' + JSON.stringify(this.order)
			});
		},
		// 查看详情
		goDetails() {
			uni.navigateTo({
				url: '/pages/order/details?id=' + this.order.id
			});
		},
		formartYMD(date) {
			return dayjs(date).format('YYYY-MM-DD');
		},
		// 取消订单
		cancelOrder() {
			uni.showModal({
				title: '提示',
				content: '是否取消订单',
				success: (res) => {
					if (res.confirm) {
						this.$api.cancelNoPayOrder(this.order.id).then((res) => {
							if (res.code === 0) {
								uni.showToast({
									icon: 'success',
									title: '取消成功'
								});
								this.$emit('refresh');
							}
						});
					}
				}
			});
		},
		fen2yun(fen) {
			return parseFloat(fen / 100).toFixed(2);
		},
		getOrderStatusName(status) {
			if (status === 'wait_pay') {
				return {
					name: '待支付'
				};
			} else if (status === 'wait_live') {
				return {
					name: '待入住'
				};
			} else if (status === 'living') {
				return {
					name: '入住中'
				};
			} else if (status === 'wait_refund') {
				return {
					name: '待退押金'
				};
			} else if (status === 'wait_rate') {
				return {
					name: '待评价'
				};
			} else if (status === 'complete') {
				return {
					name: '已完成'
				};
			} else if (status === 'cancel') {
				return {
					name: '已取消'
				};
			} else {
				return {
					name: '其他'
				};
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.ax-order-card {
	padding: 32rpx;
	background: #ffffff;
	border-radius: 20rpx 20rpx 20rpx 20rpx;
	&:not(:last-child) {
		margin-bottom: 24rpx;
	}

	&__content {
		& image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx 10rpx 10rpx 10rpx;
		}
	}
	&__btn {
		&:not(:last-child) {
			margin-right: 24rpx;
		}
	}
}

.text-color-active {
	color: #ff4e07;
}

.text-color-normal {
	color: #666666;
}
</style>
