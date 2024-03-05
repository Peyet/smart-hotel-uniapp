<template>
	<u-popup :show="show" @close="close" round="30rpx" closeable="true" :customStyle="{ overflow: 'hidden' }" @open="getData()">
		<view slot="close">
			<u-icon name="close-circle-fill" color="#fff" size="28"></u-icon>
		</view>
		<scroll-view scroll-y="true" class="scroll-height" v-if="roomData">
			<view class="flex flex-direction">
				<view class="room-banner">
					<u-swiper
						:list="roomData.images"
						@change="(e) => (currentNum = e.current)"
						:autoplay="false"
						:indicatorStyle="{ right: '20px', bottom: '50px' }"
						height="580rpx"
						radius="0"
						:loading="loading"
					>
						<view slot="indicator" class="indicator-num" v-if="roomData.images">
							<text class="indicator-num__text">{{ currentNum + 1 }}/{{ roomData.images.length  }}</text>
						</view>
					</u-swiper>
				</view>
				<view class="room-info-card flex flex-direction">
					<u-skeleton rows="5" title :loading="loading">
						<view class="room-info-card__title">
							<text class="font-bold">{{ roomData.name }}</text>
						</view>
						<scroll-view scroll-x="true" class="room-info-card__lable">
							<view class="room-info-card__lable__item" v-bind:key="index" v-for="(item, index) in roomData.tags">
								<ax-lable :title="item"></ax-lable>
							</view>
						</scroll-view>
						<u-line></u-line>
						<view class="room-info-card__tags">
							<ax-service-lable></ax-service-lable>
							<ax-service-lable></ax-service-lable>
							<ax-service-lable></ax-service-lable>
							<ax-service-lable
								v-for="(item, index) in roomData.serviceTags"
								:title="item.name"
								:icon="item.icon"
								:lableList="item.items"
								v-if="roomData.serviceTags"
								:key="index"
							></ax-service-lable>
						</view>
					</u-skeleton>
				</view>
			</view>
		</scroll-view>
	</u-popup>
</template>

<script>
export default {
	name: 'ax-popup-room',
	data() {
		return {
			currentNum: 0,
			list6: ['https://cdn.uviewui.com/uview/swiper/swiper2.png', 'https://cdn.uviewui.com/uview/swiper/swiper3.png', 'https://cdn.uviewui.com/uview/swiper/swiper1.png'],
			navbarColor: {
				bg: 'transparent',
				icon: '#FFFFFF',
				title: ''
			},
			loading: false,
			roomData: null
		};
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
		roomId: {
			type: String,
			default: null
		}
	},
	methods: {
		close() {
			this.$emit('click');
		},
		getData() {
			this.loading = true;
			console.log('getData'+this.roomId);
			if (this.roomId) {
				if(!this.roomData){
					this.$api.getRoomTypeDetail(this.roomId).then((res) => {
						if (res.code === 0) {
							this.roomData = res.data;
							this.loading = false;
						}
					});
				}else{
					this.loading = false;
				}
			}
		}
	}
};
</script>

<style lang="scss">
.ax-popup-close {
	position: absolute;
	top: 30px;
	right: 30px;
}
.scroll-height {
	height: calc(100vh - 100px);
}
.room-banner {
	height: 580rpx;
}

.indicator-num {
	padding: 2px 0;
	background-color: rgba(0, 0, 0, 0.35);
	border-radius: 100px;
	width: 35px;
	@include flex;
	justify-content: center;

	&__text {
		color: #ffffff;
		font-size: 12px;
	}
}

.room-info-card {
	position: relative;
	top: -60rpx;
	padding: 32rpx;
	// height: 488rpx;
	background: #ffffff;
	border-radius: 50rpx 50rpx 20rpx 20rpx;
	margin-bottom: -60rpx;

	&__title {
		font-size: 36rpx;
		font-weight: 400;
		line-height: 50rpx;
		color: #242424;
	}

	&__lable {
		// width: 686rpx;
		white-space: nowrap;
		margin: 32rpx 0;

		&__item {
			display: inline-block;

			&:not(:last-child) {
				margin-right: 48rpx;
			}
		}
	}

	&__tags {
		margin-top: 32rpx;
	}
}

.room-info {
	&__price {
		margin-top: 24rpx;
		background-color: #ffffff;
		padding: 32rpx;
		&__money {
			height: 88rpx;
			background: rgba(250, 222, 171, 0.5);
			border-radius: 4rpx 4rpx 4rpx 4rpx;
			padding: 0 32rpx;
		}

		&__amount {
			padding: 16rpx 32rpx;
		}
	}
}
</style>
