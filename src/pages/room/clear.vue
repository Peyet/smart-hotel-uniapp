<template>
	<view class="page-container flex flex-direction">
		<u-skeleton :loading="loading">
			<view class="ax-card-32 flex flex-direction" v-for="(item,index) in cleanList" :key="index" v-if="cleanList">
				<view class="flex align-center justify-between ax-card-32__item">
					<view class="flex align-center">
						<uni-icons type="ax-icon-hotel" custom-prefix="ax-icon" size="18" color="#000"></uni-icons>
						<text class="font32 margin-left-xxs">{{item.hotelName}}</text>
					</view>
					<text class="font32" :class="item.status ? 'text-color-normal' : 'text-color-active'">{{item.status?"已完成":"待打扫"}}</text>
				</view>
				<view class="flex">
					<image class="room__image" :src="item.roomCover"></image>
					<view class="flex flex-direction margin-top-xs">
						<text class="font32">{{item.roomName}}</text>
						<text class="font24 info-color margin-top-xs">
							房间号：
							<text class="font-bold black-color">{{item.no}}</text>
						</text>
					</view>
				</view>
				<view class="ax-card-32__item flex justify-end font24" v-if="item.status">完成时间：{{item.cleanTime}}</view>
			</view>
		</u-skeleton>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cleanList: [],
			loading: true
		};
	},
	methods: {
		async onGetData() {
			let res = await this.$api.getCleanRoom();
			if (res.code == 0) {
				this.cleanList = res.data;
				this.loading = false;
			}
		}
	},
	onShow() {
		this.onGetData()
	}
};
</script>

<style lang="scss">
.page-container {
	z-index: 2;
	padding: 32rpx 32rpx;
}

.room {
	&__server-btn {
		display: flex;
		flex-direction: column;
		align-items: center;

		& image {
			width: 48rpx;
			height: 48rpx;
			// background-color: #f8f8f8;
			border-radius: 0rpx 0rpx 0rpx 0rpx;
			margin-bottom: 16rpx;
		}

		&__text {
			font-size: 24rpx;
			color: #242424;
		}
	}

	&__image {
		width: 120rpx;
		height: 120rpx;
		background-color: #f8f8f8;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		margin-right: 16rpx;
	}

	&__info {
		&__key {
			font-size: 26rpx;
			font-weight: normal;
			color: #999999;
		}

		&__value {
			font-size: 40rpx;
			font-weight: 500;
			color: #d59e32;
		}

		&__bg {
			height: 86rpx;
			background: #f8f8f8;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;

			&:not(:last-child) {
				margin-bottom: 16rpx;
			}
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
