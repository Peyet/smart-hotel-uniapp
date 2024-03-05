<template>
	<view class="">
		<u-navbar bg-color="transparent" left-icon-color="#ffffff" @leftClick="_goBack"></u-navbar>
		<view class="hotel-banner">
			<u-swiper
				:list="hotel.images"
				:loading="!hotel.images.length"
				@change="(e) => (currentNum = e.current)"
				:autoplay="false"
				:indicatorStyle="{ right: '20px', bottom: '50px' }"
				height="580rpx"
				radius="0"
				v-if="hotel"
			>
				<view slot="indicator" class="indicator-num">
					<text class="indicator-num__text">{{ currentNum + 1 }}/{{ hotel.images.length }}</text>
				</view>
			</u-swiper>
		</view>
		<view class="hotel-info-card" v-if="hotel != null">
			<!-- 名称 -->
			<view class="hotel-info-card__title">
				<text class="font-bold">{{ hotel.name }}</text>
				<ax-tag bgColor="#242424" is-flex text-color="#FADEAB" class="margin-left-xs">{{ hotel.hotelType }}</ax-tag>
				<!-- <u-tag text="高级大酒店" size="mini" bgColor="#242424" color="#FADEAB" borderColor="#242424"> </u-tag> -->
			</view>
			<!-- 标签 -->
			<view class="flex justify-between margin-bottom margin-top-xs">
				<scroll-view scroll-x="true" class="hotel-info-card__tags">
					<ax-tag class="ax-hotel-tag-ml" bgColor="#F9F6EE" text-color="#D59E32" v-for="(item, index) in hotel.tags" :key="index">{{ item }}</ax-tag>
				</scroll-view>
				<view class="flex align-center" hover-class="active--hover" @click="_goInfo">
					<text class="font24 info-color margin-right-xs">详情/设施</text>
					<u-icon name="arrow-right" color="#999999" size="12"></u-icon>
				</view>
			</view>
			<!-- 评分 -->
			<view class="flex justify-between margin-bottom margin-top-xs">
				<ax-rate-capsule text="真棒👍🏻" rate="4.9" />
				<view class="flex align-center" hover-class="active--hover">
					<text class="font24 info-color margin-right-xs">{{ hotel.rateCount }}评价</text>
					<u-icon name="arrow-right" color="#999999" size="12" v-if="false"></u-icon>
				</view>
			</view>
			<!-- 地理位置 -->
			<view class="hotel-info-card__map flex align-center justify-between">
				<view class="flex flex-direction">
					<view class="hotel-info-card__map__title">{{ hotel.address }}</view>
					<view class="flex align-center margin-top-xs">
						<!-- <uni-icons type="location-filled" size="14" color="#999999"></uni-icons> -->
						<uni-icons custom-prefix="ax-icon" type="ax-icon-getlocaltion" size="14" color="#999999"></uni-icons>
						<text class="font24 margin-left-xxs info-color">距您当前位置有{{ hotel.distance.toFixed(2) }}km</text>
					</view>
				</view>
				<view class="flex flex-direction align-center" @click="_goMap">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-dizhi" size="20" color="#D59E32"></uni-icons>
					<text class="font-normal font24">导航酒店</text>
				</view>
			</view>
		</view>
		<!-- 时间 -->
		<view class="user-choose-time flex align-center justify-center" @click="calendarShow = true">
			<view class="flex align-center">
				<text class="font32 font-normal">{{ startDate.format('MM月DD号') }}</text>
				<text class="font24 margin-left-xs">入住</text>
			</view>
			<ax-time-capsule class="margin-lr" :text="`${days}晚`" :line="false" color="#ffffff" textColor="#ffffff"></ax-time-capsule>
			<view class="flex align-center">
				<text class="font32 font-normal">{{ endDate.format('MM月DD号') }}</text>
				<text class="font24 margin-left-xs">离店</text>
			</view>
		</view>
		<view class="hotel-room-type">
			<ax-room-type-card :days="days" v-for="(item, index) in roomTypeList" :data="item" v-if="roomTypeList" :key="index" :disable="item.isFull"></ax-room-type-card>
		</view>
		<ax-amap ref="amap"></ax-amap>
		<u-calendar
			:show="calendarShow"
			color="#D59E32"
			mode="range"
			:defaultDate="[startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]"
			startText="住店"
			endText="离店"
			confirmDisabledText="请选择离店日期"
			round="20rpx"
			@close="calendarClose"
			@confirm="calendarConfirm"
		></u-calendar>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
const dayjs = require('@/utils/dayjs.min.js');
import { getHotelTime } from '@/utils/time.js';
export default {
	data() {
		return {
			currentNum: 0,
			list6: ['https://cdn.uviewui.com/uview/swiper/swiper2.png', 'https://cdn.uviewui.com/uview/swiper/swiper3.png', 'https://cdn.uviewui.com/uview/swiper/swiper1.png'],
			id: '',
			hotel: null,
			localtion: null,
			startDate: dayjs(),
			endDate: dayjs(),
			days: 1,
			// 日历
			calendarShow: false,
			defaultDateMultiple: [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'day').format('YYYY-MM-DD')],
			roomTypeList: null
		};
	},
	methods: {
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
		_goInfo() {
			uni.navigateTo({
				url: '/pages/hotel/info/info?id=' + this.id
			});
		},
		async getDetails(id) {
			let hotelData = await this.$api.getHotelDetails({ hotelId: this.id, longitude: this.localtion.longitude, latitude: this.localtion.latitude });
			if (hotelData.code === 0) {
				this.hotel = hotelData.data;
				await this.getRoomType(this.hotel.id, this.startDate, this.endDate);
			}
			let params = this.$st.getCreateParams();
			params.hotelId = hotelData.data.id;
			params.hotelName = hotelData.data.name;
			params.inTime = hotelData.data.inTime;
			params.outTime = hotelData.data.outTime;
			this.$st.setCreateParams(params);
		},
		// 日历确认
		async calendarConfirm(data) {
			// 修改值 和默认值
			this.startDate = dayjs(data[0]);
			this.endDate = dayjs(data[data.length - 1]);
			this.defaultDateMultiple = [dayjs(data[0]), dayjs(data[data.length - 1])];
			this.days = data.length - 1;
			this.calendarShow = false;
			//修改值
			this._setIndexPageData();
			await this.getRoomType(this.hotel.id, this.startDate, this.endDate);
		},
		// 关闭日历
		calendarClose() {
			this.calendarShow = false;
		},
		_setIndexPageData() {
			this.$st.setIndexPageData({
				localtion: JSON.stringify(this.localtion),
				startDate: this.startDate,
				endDate: this.endDate,
				days: this.days,
				searchValue: this.searchValue
			});
		},
		// 位置导航
		_goMap() {
			uni.openLocation({
				latitude: this.hotel.latitude,
				longitude: this.hotel.longitude,
				name: this.hotel.name,
				address: this.hotel.address,
				success: () => {}
			});
		},
		// 获取可用房型
		async getRoomType(id, start, end) {
			const inTime = getHotelTime(start, this.hotel.inTime || 13);
			const outTime = getHotelTime(end, this.hotel.outTime || 12);
			let data = await this.$api.getAvailableRoomType(id, inTime, outTime);
			if (data.code === 0) {
				this.roomTypeList = data.data;
			}
		}
	},
	onLoad(params) {
		this.$refs.amap.init();
		this.id = params.id;
		let opstion = this.$st.getIndexPageData();
		if (opstion != null) {
			this.localtion = JSON.parse(opstion.localtion);
			this.startDate = dayjs(opstion.startDate);
			this.endDate = dayjs(opstion.endDate);
			this.days = opstion.days;
			this.searchValue = opstion.searchValue;
		}
		if (this.id != null || this.id != '') {
			this.getDetails(this.id);
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $ax-bg-color;
}
</style>
<style lang="scss" scoped>
.ax-hotel-tag-ml {
	display: inline-block;

	&:not(:first-child) {
		margin-left: 12rpx;
	}
}

.hotel-banner {
	height: 580rpx;
}

.hotel-info-card {
	position: relative;
	top: -60rpx;
	padding: 32rpx;
	// height: 488rpx;
	background: #ffffff;
	border-radius: 50rpx 50rpx 20rpx 20rpx;
	margin-bottom: -60rpx;

	&__tags {
		white-space: nowrap;
		width: 500rpx;
		overflow: hidden;
	}

	&__title {
		font-size: 36rpx;
		font-weight: 400;
		line-height: 50rpx;
		color: #242424;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	&__map {
		padding: 24rpx;
		background: #f8f8f8;
		border-radius: 20rpx 20rpx 20rpx 20rpx;

		&__title {
			width: 466rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #242424;
			line-height: 39rpx;
		}
	}
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

.user-choose-time {
	margin: 24rpx 0;
	padding: 24rpx 32rpx;
	background: #242424;
	color: #ffffff;
}

.hotel-room-type {
	padding: 0 32rpx;
	display: flex;
	flex-direction: column;
}
</style>
