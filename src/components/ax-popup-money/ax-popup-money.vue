<template>
	<u-popup :show="show" @close="close" round="30rpx" closeable="true">
		
			<view class="flex flex-direction money-popup" v-if="price">
				<view class="money-popup__title flex flex-direction align-center">
					<text>费用明细</text>
				</view>
				<view class="flex justify-between align-center" >
					<view class="font32">订单总金额</view>
					<view class="text-price font40 price-color">{{ fen2yun(price.totalPrice + price.deposit) }}</view>
				</view>
				<scroll-view :scroll-y="true" class="scroll-height">
				<view class="money-popup__cell flex flex-direction">
					<view class="flex justify-between money-popup__cell__item">
						<view class="flex align-center">
							<text class="font28">房费</text>
							<text class="font24 info-color">{{ `（共${price.days}晚）` }}</text>
						</view>
						<text class="text-price font28">{{fen2yun(price.totalPrice)}}</text>
					</view>
					<view class="flex flex-direction" v-if="price.priceList">
						<view class="flex justify-between align-center money-popup__cell__item" :key="index" v-for="(item,index) in price.priceList">
							<view class="flex align-center info-color">
								<text class="font24" style="color: #666666">{{item.time}}</text>
								<text class="font24 margin-left-xxs">{{`（${item.roomNum}间）`}}</text>
							</view>
							<text class="text-price font24">{{fen2yun(item.price)}}</text>
						</view>
					</view>
				</view>
				</scroll-view>
				<view class="money-popup__cell flex flex-direction">
					<view class="flex justify-between">
						<view class="flex align-center">
							<text class="font28">押金</text>
						</view>
						<text class="text-price font28">{{fen2yun(price.deposit)}}</text>
					</view>
					<text class="info-color font24">离店后押金将原路返回到您的账户</text>
				</view>
			</view>
		
		<view class="money-popup__btn-box flex align-center justify-between" v-if="isBtn">
			<utext class="text-price font40" v-if="price">{{ fen2yun(price.totalPrice + price.deposit) }}</utext>
			<view class="flex align-center">
				<view class="flex align-center" @click="close()">
					<text class="font24 margin-right-xs">费用明细</text>
					<u-icon name="arrow-down" color="#999999" size="12"></u-icon>
				</view>
				<ax-button class="margin-left-sm" type="primary" width="200rpx" @click="goPay" content="立即支付"></ax-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	name: 'ax-popup-money',
	data() {
		return {};
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		isBtn: {
			type: Boolean,
			default: false
		},
		price: {
			type: Object,
			default: {}
		}
	},
	methods: {
		close() {
			this.$emit('click');
		},
		fen2yun(fen) {
			return parseFloat(parseInt(fen) / 100).toFixed(2);
		},
		goPay(){
			this.$emit('goPay');
		}
	}
};
</script>

<style lang="scss" scoped>
	.scroll-height {
		height: calc(100vh - 360px);
	}
.money-popup {
	padding: 24rpx 32rpx;
	&__title {
		height: 50rpx;
		font-size: 36rpx;
		margin-bottom: 32rpx;
		font-weight: normal;
		color: #3d3d3d;
	}

	&__cell {
		padding: 32rpx 0;

		&__item {
			&:not(:last-child) {
				margin-bottom: 24rpx;
			}
		}
	}

	&__cell {
		&:not(:last-child) {
			border-bottom: 1rpx #eeeeee solid;
		}
	}

	&__btn-box {
		padding: 0 32rpx;
		height: 98rpx;
		background-color: #fff;
		border-top: 1rpx rgba(98, 106, 105, 0.08) solid;
		// box-shadow: 20rpx ​-10rpx 10rpx 0rpx  rgba(98, 106, 105, 0.08);
		box-shadow: 20rpx ​-10rpx 10rpx 0rpx rgba(98, 106, 105, 0.08);
	}
}
</style>
