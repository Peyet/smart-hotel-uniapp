<template>
	<view class="ax-room-type-card" :class="[disable ? 'ax-room-type-card--disable' : '']">
		<view class="ax-room-type-card__original" v-if="original"><text>原房入住</text></view>
		<view class="ax-room-type-card__image" :class="[original ? 'ax-room-type-card__image--mt16' : '']" @click="_goDetail">
			<image :src="data.cover" mode="aspectFill"></image>
		</view>
		<view class="flex flex-direction w386" :class="[original ? 'ax-room-type-card__image--mt16' : '']">
			<view class="ax-room-type-card__title" @click="_goDetail">{{ data.name }}</view>
			<view class="ax-room-type-card__tag" @click="_goDetail">
				<view class="ax-room-type-card__tag__item" v-for="(item, index) in data.tags" v-if="data.tags" :key="index">{{ item }}</view>
			</view>
			<view class="flex align-end justify-end margin-top">
				<view class="flex align-center">
					<text class="font24">共计：</text><text class="text-price font-bold font40 margin-right-xs">{{ fen2Yuan(data.price * days) }}</text>
				</view>
				<view class="flex flex-direction align-center pay-btn" :hover-class="[disable ? '' : 'pay-btn--hover']" @click="_createOrder()">
					<view class="">{{ disable ? '满房' : '订' }}</view>
					<view class="pay-btn__bottom">{{ disable ? '无法下单' : '在线付' }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ax-room-type-card',
	data() {
		return {};
	},
	props: {
		disable: {
			type: Boolean,
			default: false
		},
		original: {
			type: Boolean,
			default: false
		},
		data: {
			type: Object,
			default: {}
		},
		days: {
			type: Number,
			default: 1
		},
		orderId:{
			type: String,
			default: ""
		},
		roomItemId:{
			type: String,
			default: ""
		}
	},
	methods: {
		_goDetail() {
			uni.navigateTo({
				url: '/pages/hotel/room/room?id=' + this.data.id
			});
		},
		_createOrder() {
			if (this.disable) {
				uni.showToast({
					title: '已满房无法下单',
					icon: 'none'
				});
				return;
			}
			let params = this.$st.getCreateParams();
			params.roomId = this.data.id;
			params.tags = this.data.tags;
			params.roomName = this.data.name;
			this.$st.setCreateParams(params);
			let url = '/pages/order/create'
			if(this.orderId){
				url = url+`?id=${this.orderId}`
				if(this.original){
					url = url+`&original=${this.roomItemId}`
				}
			}
			
			uni.navigateTo({
				url: url
			});
		},
		fen2Yuan(fen) {
			return parseFloat(fen / 100).toFixed(2);
		}
	}
};
</script>

<style lang="scss" scoped>
.ax-room-type-card {
	background: #ffffff;
	border-radius: 20rpx 20rpx 20rpx 20rpx;
	margin-bottom: 24rpx;
	padding: 32rpx;
	display: flex;
	position: relative;
	&--disable {
		opacity: 0.7;
	}
	&__original {
		position: absolute;
		width: 124rpx;
		height: 40rpx;
		top: 0;
		left: 0;
		border-radius: 20rpx 20rpx 20rpx 0px;
		background: linear-gradient(90deg, #ff3700 0%, #ff7300 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		& text {
			font-size: 22rpx;
			color: #ffffff;
		}
	}
	&__image {
		width: 220rpx;
		overflow: hidden;
		display: flex;
		border-radius: 10rpx;
		background-color: #f8f8f8;
		margin-right: 24rpx;

		& image {
			width: 100%;
			height: 100%;
		}
		&--mt16 {
			margin-top: 16rpx;
		}
	}

	&__title {
		font-size: 32rpx;
		font-weight: 500;
		color: $ax-text-color-black;
		line-height: 45rpx;
	}
	&__tag {
		display: flex;
		flex-wrap: wrap;
		&__item {
			font-size: 24rpx;
			line-height: 34rpx;
			color: #242424;
			&:not(:last-child) {
				margin-right: 8rpx;
			}
		}
	}
}
.pay-btn {
	background: #242424;
	padding: 4rpx;
	color: #ffffff;
	font-size: 28rpx;
	min-width: 120rpx;
	&__bottom {
		background-color: #ffffff;
		width: 100%;
		color: #242424;
		font-size: 22rpx;
		text-align: center;
	}
	&--hover {
		opacity: 0.8;
	}
}
.w386 {
	width: 386rpx;
}
</style>
