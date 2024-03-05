<template>
	<view>
		<view class="page-container flex flex-direction">
			<u-skeleton :loading="loading" :rows="6" title>
				<view class="flex ax-card-32__item" v-if="useRoom">
					<image :src="useRoom.roomCover" class="room__image" mode="aspectFill"></image>
					<view class="flex flex-direction margin-top-xs" style="width: 480rpx">
						<text class="font32">{{ useRoom.hotelName }}</text>
						<text class="font24 info-color margin-top-xs">{{ useRoom.hotelAddress }}</text>
					</view>
				</view>
				<view class="flex ax-card-32__item align-center justify-around" v-if="useRoom">
					<view class="flex flex-direction">
						<text class="font32">
							{{ getMMDD(useRoom.startDate) }}
							<text class="font24">{{ getWeek(useRoom.startDate) }}</text>
						</text>
						<text class="font24">{{ getTime(useRoom.startDate) }}后</text>
					</view>
					<ax-time-capsule :text="`${useRoom.days}晚`"></ax-time-capsule>
					<view class="flex flex-direction">
						<text class="font32">
							{{ getMMDD(useRoom.endDate) }}
							<text class="font24">{{ getWeek(useRoom.endDate) }}</text>
						</text>
						<text class="font24">{{ getTime(useRoom.endDate) }}前</text>
					</view>
				</view>
				<view class="flex ax-card-32__item justify-between align-center" v-if="useRoom">
					<view class="font28">{{ useRoom.roomName }}</view>
				</view>
				<view class="flex ax-card-32__item flex-direction" v-if="useRoom">
					<view class="room__info room__info__bg">
						<text class="room__info__key">房间楼层</text>
						<text class="room__info__value">{{ useRoom.roomFloor }}楼</text>
					</view>
					<view class="room__info room__info__bg">
						<text class="room__info__key">房间号</text>
						<text class="room__info__value">{{ useRoom.roomNo }}</text>
					</view>
				</view>
			</u-skeleton>
		</view>
		<view class="bottom-btn">
			<view class="bottom-btn__item">
				<u-button class="margin-top-lg" :loading="btnLoading"
					:customStyle="{ color: '#fff', borderRadius: '0rpx' }" color="#242424" text="立即绑定"
					@click="bindOrder"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	const dayjs = require('@/utils/dayjs.min.js');
	export default {
		data() {
			return {
				useRoom: null,
				loading: true,
				btnLoading:false,
				orderId: null,
				openId: null
			};
		},
		methods: {
			getMMDD(time) {
				return dayjs(time).format('MM月DD日');
			},
			getWeek(time) {
				let week = dayjs(time).format('d');
				switch (week) {
					case '0':
						return '周日';
					case '1':
						return '周一';
					case '2':
						return '周二';
					case '3':
						return '周三';
					case '4':
						return '周四';
					case '5':
						return '周五';
					case '6':
						return '周六';
				}
			},
			getTime(time) {
				return dayjs(time).format('HH:mm');
			},
			async bindOrder() {
				this.btnLoading = true;
				let res = await this.$api.bindRoom(this.orderId);
				if (res.code === 0) {
					uni.showModal({
						title: '提示',
						content: '房间绑定成功',
						showCancel: false,
						cancelText: '',
						confirmText: '查看信息',
						success: res => {
							uni.switchTab({
								url: '/pages/room/room'
							});
						}
					});
				}
				this.btnLoading = false;
			},
			async checkBind(id) {
				this.btnLoading = true;
				let data = await this.$api.isBindRoom(id);
				if (data.code == 0) {
					if (data.data) {
						uni.showModal({
							title: '提示',
							content: '该记录已绑定',
							showCancel: false,
							cancelText: '',
							confirmText: '查看信息',
							success: res => {
								uni.switchTab({
									url: '/pages/room/room'
								});
							}
						});
					} else {
						let res = await this.$api.getUseRecord(id);
						if (res.code === 0) {
							this.useRoom = res.data;
							if (!this.useRoom) {
								uni.showToast({
									title: '查无记录',
									icon: 'error'
								});
							} else {
								this.loading = false;
								this.btnLoading = false;
							}
						}
					}
				}
			}
		},
		onLoad(opt) {
			let id = decodeURIComponent(opt.scene);
			let openId = decodeURIComponent(opt.openId);
			this.orderId = id;
			if (id) {} else {
				uni.showToast({
					title: '参数错误',
					icon: 'error'
				});
			}
			this.openId = openId
		},
		onShow() {
			if (this.openId) {
				this.$api.bindUserMp(this.openId)
			}
			this.checkBind(this.orderId);
		}
	};
</script>
<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss">
	.navbar-title {
		padding: 0 32rpx;
		width: 100%;
		font-size: 40rpx;
		font-weight: bold;
		color: $ax-text-color-black;
	}

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
				background-color: #f8f8f8;
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

		&__item {
			// width: 200rpx;
		}
	}
</style>