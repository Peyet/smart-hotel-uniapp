<template>
	<view class="ax-hotel-card" @click="_goToHotelDetails(hotel.id)">
		<view class="ax-hotel-card__image">
			<image :src="hotel.cover" mode="aspectFill"></image>
		</view>
		<view class="ax-hotel-card__content">
			<view class="ax-hotel-card__content__title">
				<text class="font-bold">{{ hotel.name }}</text>
				<ax-tag bgColor="#242424" is-flex text-color="#FADEAB" class="margin-left-xs p7">{{ hotel.hotelType }}</ax-tag>
			</view>
			<view class="flex align-center margin-tb-xs">
				<ax-rate-capsule text="真棒👍🏻" rate="4.9" />
				<text class="margin-left-xs font24 info-color">{{ hotel.rateCount }}点评</text>
			</view>

			<scroll-view scroll-x="true" class="ax-hotel-card__content__tag">
				<ax-tag class="ax-hotel-tag-ml" bgColor="#F9F6EE" text-color="#D59E32" v-bind:key="index" v-for="(item, index) in hotel.tags">{{ item }}</ax-tag>
			</scroll-view>
			<text>
				<text class="font24 info-color two-lines-ellipsis">{{ hotel.address }}</text>
				<text class="font24 info-color">距你{{ hotel.distance.toFixed(2) }}公里</text>
			</text>
			<view class="flex justify-end align-center margin-top">
				<text class="text-price font40 font-bold">{{ fen2Yuan(hotel.lowPrice || 0) }}</text>
				<text class="margin-left-xxs font24">起</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ax-hotel-card',
	data() {
		return {};
	},
	props: {
		hotel: {}
	},
	methods: {
		_goToHotelDetails(id) {
			uni.navigateTo({
				url: '/pages/hotel/details/details?id=' + id
			});
		},
		fen2Yuan(fen) {
			if (fen === 0) {
				return '0';
			}
			return parseFloat(fen / 100).toFixed(2);
		}
	}
};
</script>

<style lang="scss" scoped>
.two-lines-ellipsis {
	display: -webkit-box;
	-webkit-line-clamp: 2; /* 显示两行文本 */
	-webkit-box-orient: vertical; /* 垂直排列 */
	overflow: hidden;
	text-overflow: ellipsis; /* 超出两行显示省略号 */
	white-space: normal; /* 允许换行 */
}
.ax-hotel-tag-ml {
	display: inline-block;
	&:not(:first-child) {
		margin-left: 12rpx;
	}
}

.ax-hotel-card {
	display: flex;
	width: 100%;
	margin-bottom: 24rpx;

	&__image {
		width: 440rpx;
		overflow: hidden;
		display: flex;
		border-radius: 20rpx;
		background-color: #fff;
		margin-right: 24rpx;

		& image {
			width: 100%;
			height: 100%;
		}
	}

	&__content {
		display: flex;
		flex-direction: column;

		&__title {
			display: flex;
			flex-wrap: wrap;
			font-size: 32rpx;
			font-weight: 400;
			align-items: center;
			color: #242424;
			line-height: 44rpx;
		}

		&__tag {
			white-space: nowrap;
			width: 440rpx;
			overflow: hidden;
		}
	}
}
</style>
