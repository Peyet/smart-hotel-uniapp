<template>
	<view>
		<u-skeleton :loading="loading" :rows="8">
			<view class="flex flex-direction container">
				<view class="flex flex-direction">
					<view class="con-card flex flex-direction">
						<view class="flex align-center justify-between">
							<view class="flex align-center">
								<view class="num-box">
									<text>1</text>
								</view>
								<view class="margin-left-xs font32">订房信息</view>
							</view>
							<view class="flex flex-direction">
								<view class="day-number-box">
									<u-number-box :value="dayNum" @blur="blurDay" @change="changeDayNum" :disableMinus="dayNum <= 1">
										<view slot="minus" class="minus" :style="{ borderColor: dayNum > 1 ? '#D59E32' : '#D2D2D2' }">
											<u-icon name="minus" :color="dayNum > 1 ? '#D59E32' : '#D2D2D2'" size="12"></u-icon>
										</view>
										<text slot="input" class="input">{{ dayNum }}晚</text>
										<view slot="plus" class="plus">
											<u-icon name="plus" color="#D59E32" size="12"></u-icon>
										</view>
									</u-number-box>
								</view>
								<text class="font28 info-color margin-top-xs" v-if="endDate">至{{ getTime(endDate) }}离店</text>
							</view>
						</view>
					</view>
					<view class="con-card flex flex-direction">
						<view class="flex align-center">
							<view class="num-box">
								<text>2</text>
							</view>
							<view class="margin-left-xs font32">房间选择</view>
						</view>
						<view class="con-card__room flex flex-direction">
							<view class="con-card__room__item flex justify-between align-center" v-for="(item, index) in orderRoomList" :key="index" @tap.stop="chooseRoom(index)">
								<view class="flex align-center">
									<text class="con-card__room__title font28 info-color">房间{{ index + 1 }}</text>
									<text class="font28">{{ item.roomNo }}</text>
								</view>
								<ax-check-round size="24" :active="index + 1 === activeRoom"></ax-check-round>
							</view>
						</view>
					</view>
					<view class="con-card flex align-center justify-between">
						<view class="flex align-center">
							<view class="num-box">
								<text>3</text>
							</view>
							<view class="margin-left-xs font32">选择续住价格</view>
						</view>
						<text class="font28 info-color">以当前价格为准</text>
					</view>
				</view>
				<ax-room-type-card :roomItemId="order.rooms[0].roomItemId" :orderId="order.id" :original="true" :data="originalPrice" v-if="originalPrice"></ax-room-type-card>
				<ax-room-type-card :orderId="order.id" :days="dayNum" v-for="(item, index) in roomTypeList" :data="item" v-if="roomTypeList" :key="index" :disable="item.isFull"></ax-room-type-card>
			</view>
		</u-skeleton>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
const dayjs = require('@/utils/dayjs.min.js');
export default {
	data() {
		return {
			id: '',
			order: {},
			loading: true,
			dayNum: 1,
			activeRoom: 1,
			orderRoomList: [],
			endDate: null,
			config: null,
			submitData: {},
			roomTypeList: null,
			originalPrice: null
		};
	},
	onLoad(opt) {
		if (opt.id) {
			this.id = opt.id;
		}
		let params = this.$st.getCreateParams();
		this.pageParams = params;
	},
	onShow() {
		this.getData(this.id);
	},
	methods: {
		getTime(time) {
			return dayjs(time).format('MM月DD日');
		},
		async blurDay(){
			
		},
		updateTime(){
			let time = this.$st.getIndexPageData();
			time.endDate = this.endDate
			time.startDate = this.order.endDate
			time.days = this.dayNum
			this.$st.setIndexPageData(time)
		},
		async  changeDayNum(e) {
			// 加
			if (e.value > this.dayNum) {
				this.endDate = dayjs(this.endDate).add(1, 'day');
				this.dayNum = this.dayNum +1
			} else {
				this.dayNum = this.dayNum -1
				this.endDate = dayjs(this.endDate).subtract(1, 'day');
			}
			await this.getOriginalPrice();
			await this.getPrice();
			this.updateTime()
			
		},
		chooseRoom(index) {
			this.activeRoom = index + 1;
		},
		async getData(id) {
			this.loading = true;
			let res = await this.$api.getOrderDetails(id);
			if (res.code == 0) {
				this.order = res.data;
				this.endDate = dayjs(res.data.endDate).add(1, 'day');
				this.orderRoomList = this.order.rooms;

				uni.setNavigationBarTitle({
					title: res.data.hotelName
				});
				let hotelRes = await this.$api.getHotelConfig(res.data.hotelId);
				if (hotelRes.code == 0) {
					this.config = hotelRes.data;
				}
				await this.getOriginalPrice();
				await this.getPrice();
				this.updateTime()
			}
			this.loading = false;
		},
		async getOriginalPrice() {
			this.submitData.roomId = this.order.roomId;
			this.submitData.roomItemId = this.order.rooms[0].roomItemId;
			this.submitData.roomCount = 1;
			this.submitData.days = this.dayNum;
			this.submitData.startDate = dayjs(this.order.endDate).format('YYYY-MM-DD') + ` ${this.config.inTime || 13}:00:00`;
			this.submitData.endDate = dayjs(this.endDate).format('YYYY-MM-DD') + ` ${this.config.endTime || 12}:00:00`;
			let data = await this.$api.getCreateOriginalOrderPrice(this.submitData);
			if (data.data) {
				this.originalPrice = {
					cover: this.order.roomCover,
					deposit: this.order.deposit,
					hotelId: this.order.hotelId,
					id: this.order.roomId,
					isFull: false,
					name: this.order.roomName,
					price: data.data.totalPrice,
					tags: this.order.tags
				};
			}
		},
		async getPrice() {
			const inTime = dayjs(this.order.endDate).format('YYYY-MM-DD') + ` ${this.config.inTime || 13}:00:00`;
			const outTime = dayjs(this.endDate).format('YYYY-MM-DD') + ` ${this.config.endTime || 12}:00:00`;
			let data = await this.$api.getAvailableRoomType(this.order.hotelId, inTime, outTime);
			if (data.code === 0) {
				this.roomTypeList = data.data;
			}
		}
	}
};
</script>

<style lang="scss">
.container {
	padding: 24rpx 32rpx;
}
.num-box {
	width: 48rpx;
	height: 48rpx;
	background: #666666;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	& text {
		font-size: 32rpx;
		font-weight: 500;
		color: #ffffff;
	}
}
.con-card {
	padding: 32rpx;
	background-color: #fff;
	border-radius: 20rpx;
	margin-bottom: 24rpx;
	&:not(:last-child) {
	}
	&__room {
		&__title {
			width: 170rpx;
		}
		&__item {
			padding: 24rpx 0;
			&:not(:last-child) {
				border-bottom: 1rpx #eee solid;
			}
		}
	}
}
.day-number-box {
	height: 48rpx;
	background: #f8f8f8;
	border-radius: 40rpx 40rpx 40rpx 40rpx;
	padding: 2rpx 8rpx;
	display: flex;
	align-items: center;
}

.minus {
	width: 32rpx;
	height: 32rpx;
	border-width: 1px;
	border-style: solid;
	border-top-left-radius: 100px;
	border-top-right-radius: 100px;
	border-bottom-left-radius: 100px;
	border-bottom-right-radius: 100px;
	@include flex;
	justify-content: center;
	align-items: center;
}

.input {
	// padding: 0 10px;
	width: 88rpx;
	font-size: 30rpx;
	text-align: center;
	font-weight: normal;
	color: #242424;
}

.plus {
	width: 32rpx;
	height: 32rpx;

	justify-content: center;
	align-items: center;
	border-width: 1px;
	border-color: #d59e32;
	border-style: solid;
	border-top-left-radius: 100px;
	border-top-right-radius: 100px;
	border-bottom-left-radius: 100px;
	border-bottom-right-radius: 100px;
	@include flex;
	justify-content: center;
	align-items: center;
}
</style>
