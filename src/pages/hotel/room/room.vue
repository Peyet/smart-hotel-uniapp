<template>
	<view>
		<u-navbar :bg-color="navbarColor.bg" :left-icon-color="navbarColor.icon" :title="navbarColor.title" @leftClick="_goBack"></u-navbar>
		<view class="flex flex-direction">
			<view class="room-banner">
				<u-skeleton :titleHeight="290" title-width="100%" :loading="loading">
					<u-swiper
						:list="roomType.images"
						@change="(e) => (currentNum = e.current)"
						:autoplay="false"
						:indicatorStyle="{ right: '20px', bottom: '50px' }"
						height="580rpx"
						radius="0"
						v-if="roomType"
					>
						<view slot="indicator" class="indicator-num">
							<text class="indicator-num__text" v-if="roomType.images">{{ currentNum + 1 }}/{{ roomType.images.length }}</text>
						</view>
					</u-swiper>
				</u-skeleton>
			</view>

			<view class="room-info-card flex flex-direction">
				<u-skeleton :rows="7" title :loading="loading">
					<view class="room-info-card__title">
						<text class="font-bold">{{ roomType.name }}</text>
					</view>
					<scroll-view scroll-x="true" class="room-info-card__lable">
						<view class="room-info-card__lable__item" v-bind:key="index" v-for="(i,index) in roomType.policyTags">
							<ax-lable :icon="i.icon" :title="i.items[0]" ></ax-lable>
						</view>
					</scroll-view>
					<u-line></u-line>
					<view class="room-info-card__tags">
						<ax-service-lable :key="index" :icon="item.icon" :title="item.name" :lableList="item.items" v-for="(item,index) in roomType.serviceTags" />
					</view>
				</u-skeleton>
			</view>
			<view class="room-info__price">
				<u-skeleton :rows="3" title :loading="loading">
					<view class="room-info__price__money flex justify-between align-center">
						<text>房费</text>
						<text class="text-price">{{ fen2Yuan(roomType.price) }}/晚</text>
					</view>
					<view class="flex flex-direction align-end room-info__price__amount">
						<text class="text-price font-bold font40">{{ fen2Yuan(roomType.price) }}</text>
					</view>
				</u-skeleton>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="bottom-btn__item">
				<u-button class="margin-top-lg" :customStyle="{ color: '#fff', borderRadius: '0rpx' }" color="#242424" @click="_createOrder" text="立即预订"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentNum: 0,
			list6: [],
			navbarColor: {
				bg: 'transparent',
				icon: '#FFFFFF',
				title: ''
			},
			roomType: null,
			loading: true
		};
	},
	methods: {
		_navbarChange(scrollTop) {
			if (scrollTop > 84) {
				this.navbarColor.bg = '#F8f8f8';
				this.navbarColor.icon = '#242424';
				this.navbarColor.title = '房型';
			} else {
				this.navbarColor.bg = 'transparent';
				this.navbarColor.icon = '#FFFFFF';
				this.navbarColor.title = '';
			}
		},
		_goBack() {
			let pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1
				});
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		_createOrder() {
			let params = this.$st.getCreateParams();
			params.roomId = this.roomType.id;
			params.tags = this.roomType.tags;
			params.roomName = this.roomType.name;
			this.$st.setCreateParams(params);
			uni.navigateTo({
				url: '/pages/order/create'
			});
		},
		fen2Yuan(fen) {
			return parseFloat(fen / 100).toFixed(2);
		}
	},
	onLoad(opt) {
		if (opt.type) {
			this.roomType = JSON.parse(opt.type);
			this.loading = false;
		}
		if (opt.id) {
			this.$api.getRoomTypeDetail(opt.id).then((res) => {
				if (res.code === 0) {
					this.roomType = res.data;
					this.loading = false;
				}
			});
		}
	},
	onPageScroll(e) {
		this._navbarChange(e.scrollTop);
	}
};
</script>
<style lang="scss" scoped>
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
		margin-bottom: calc(128rpx + var(--safe-area-inset-bottom));

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

.bottom-btn {
	padding: 12rpx 32rpx;
	padding-bottom: calc(12rpx + var(--safe-area-inset-bottom));
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	display: flex;
	justify-content: flex-end;

	&__item {
		width: 200rpx;
	}
}
</style>
