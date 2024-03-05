<template>
	<view class="index-page">
		<image src="../../static/bg/bg-img.png" mode="widthFix" class="bg-image"></image>
		<ax-navbar image-url="../../static/bg/bg-img.png">
			<view slot="content" class="navbar-title">订酒店</view>
		</ax-navbar>
		<view class="index-container flex flex-direction margin-top-xs">
			<view class="time-card">
				<view class="time-card__row justify-between">
					<view class="flex align-center" hover-class="active--hover" @click="chooseLocation">
						<uni-icons custom-prefix="ax-icon" type="ax-icon-dizhi" size="20" color="#666666"></uni-icons>
						<text class="margin-left-sm time-card__row__title">{{ localtion.name }}</text>
					</view>
					<view class="flex align-center" hover-class="active--hover">
						<view class="vertical-line__34 margin-right"></view>
						<uni-icons custom-prefix="ax-icon" type="ax-icon-getlocaltion" size="20"
							color="#D59E32"></uni-icons>
						<text class="margin-left-xs font28 main-color" @click="getRegeo">当前位置</text>
					</view>
				</view>
				<view class="time-card__row align-center justify-between" @click="calendarShow = true">
					<view class="flex flex-direction">
						<text class="font24 info-color margin-bottom-xs">入住</text>
						<view class="flex align-center">
							<text class="font32">{{ startDate.format('MM月DD号') }}</text>
							<text class="font24 margin-left-xs">{{ formatWeek(startDate) }}</text>
						</view>
					</view>
					<ax-time-capsule :text="`${days}晚`"></ax-time-capsule>
					<view class="flex flex-direction">
						<text class="font24 info-color margin-bottom-xs">离店</text>
						<view class="flex align-center">
							<text class="font32">{{ endDate.format('MM月DD号') }}</text>
							<text class="font24 margin-left-xs">{{ formatWeek(endDate) }}</text>
						</view>
					</view>
				</view>
				<view class="time-card__row">
					<u--input placeholder="酒店名称" v-model="searchValue" border="none"></u--input>
				</view>
				<u-button class="margin-top-lg" :customStyle="{ color: '#FADEAB', marginTop: '32rpx' }" color="#242424"
					@click="_goHotelListPage" text="开始搜索"></u-button>
			</view>
			<!-- 轮播 -->
			<view class="flex flex-direction index-swiper">
				<u-swiper :list="bannerList" keyName="image" indicator :loading="!bannerList" indicatorMode="line"
					height="240rpx" easingFunction="linear" circular @click="bannerClick"></u-swiper>
			</view>
			<!-- 推荐 -->
			<view class="op-ad flex flex-direction">
				<view class="op-ad__title">热门推荐</view>
				<ax-hotel-card v-for="hotel in hotelList" :hotel="hotel" :key="hotel.id"></ax-hotel-card>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-modal :show="localtionModalShow" title="定位获取" content="由于您拒绝授权定位系统将无法为您推荐附近酒店，请同意授权位置信息。">
			<view class="" slot="confirmButton">
				<u-button class="margin-top-lg" openType="openSetting"
					:customStyle="{ color: '#FADEAB', marginTop: '32rpx' }" color="#242424" text="打开设置"></u-button>
			</view>
		</u-modal>
		<u-calendar :show="calendarShow" color="#D59E32" mode="range"
			:defaultDate="[startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]" startText="住店" endText="离店"
			confirmDisabledText="请选择离店日期" round="20rpx" @close="calendarClose" @confirm="calendarConfirm"></u-calendar>
	</view>
</template>

<script>
	import {
		minus
	} from '../../uni_modules/uview-ui/libs/function/digit';
	import timejs from '@/utils/time.js';
	const dayjs = require('@/utils/dayjs.min.js');
	import amap from '@/utils/amap-wx.130.js';
	export default {
		data() {
			return {
				amapPlugin: null,
				amapPluginKey: 'amapPluginKey',//高德地图key
				btnStyle: {
					color: '#FADEAB',
					marginTop: '32rpx'
				},
				title: 'Hello',
				bgColor: '#555567',
				bannerList: [],
				localtion: {
					name: '武汉',
					address: '武汉',
					longitude: 114.41276550292967, //经度
					latitude: 30.493989944458015 //纬度
				},
				localtionModalShow: false,
				indexPageData: {},
				hotelList: [],
				// 日历
				calendarShow: false,
				defaultDateMultiple: [dayjs().format('YYYY-MM-DD'), dayjs().add(1, 'day').format('YYYY-MM-DD')],
				startDate: dayjs(),
				endDate: dayjs().add(1, 'day'),
				days: 1, //几天
				searchValue: ''
			};
		},
		onShow() {
			if (this.hotelList.length === 0) {
				this.getLocaltion();
			}
			let opstion = this.$st.getIndexPageData();
			if (opstion != null) {
				if (dayjs().diff(dayjs(opstion.startDate).format('YYYY-MM-DD')) > 0) {
					this.startDate = dayjs();
				} else {
					this.startDate = dayjs(opstion.startDate);
				}
				if (dayjs().add(1, 'day').diff(dayjs(opstion.endDate).format('YYYY-MM-DD')) > 0) {
					this.endDate = dayjs().add(1, 'day');
				} else {
					this.endDate = dayjs(opstion.endDate);
				}
				this.localtion = JSON.parse(opstion.localtion);
				this.days = opstion.days;
				this.searchValue = opstion.searchValue;
				this._setIndexPageData();
			}
		},
		onHide() {
			this._setIndexPageData();
		},
		onLoad() {
			this.amapPlugin = new amap.AMapWX({
				key: this.amapPluginKey
			});
			this.getBanner();
			// console.log(uni.$u.addUnit(uni.$u.getPx(44) + uni.$u.sys().statusBarHeight, 'px'));
		},
		methods: {
			formatWeek(date) {
				return timejs.getWeekDay(date.format('d'));
			},
			async getHomeHotel() {
				let data = await this.$api.getHotel({
					longitude: this.localtion.longitude,
					latitude: this.localtion.latitude,
					recommendSize: 10
				});
				this.hotelList = data.data.records;
			},
			getBanner() {
				this.$api.getBanner().then((res) => {
					this.bannerList = res.data.banners;
				});
			},
			confirm(e) {
				this.show = false;
				console.log(e);
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
			_goHotelListPage() {
				this._setIndexPageData();
				uni.$u.route({
					url: '/pages/hotel/list/list'
				});
			},
			getLocaltion() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						this.getRegeo();
					},
					fail: () => {
						this.localtionModel();
					},
					complete: () => {}
				});
			},
			localtionModel() {
				uni.showModal({
					title: '定位获取',
					content: '由于您拒绝授权定位系统将无法为您推荐附近酒店，请在设置中同意定位授权。',
					showCancel: true,
					cancelText: '放弃推荐',
					confirmText: '打开设置',
					success: (data) => {
						if (data.confirm) {
							uni.openSetting({
								success(res) {
									console.log(res.authSetting);
								}
							});
						}
						if (data.cancel) {
							this.getHomeHotel();
						}
					}
				});
			},
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						if (res.name) {
							this.localtion.longitude = res.longitude;
							this.localtion.latitude = res.latitude;
							this.localtion.address = res.address;
							this.localtion.name = res.name
							console.log(res);
						}
						this._setIndexPageData()
						this.getHomeHotel();
					}
				});
			},
			// banner点击 后期统一
			bannerClick(index) {
				console.log(this.bannerList[index]);
				let banner = this.bannerList[index]
				if (banner.actionType == 'path') {
					uni.navigateTo({
						url: banner.actionValue
					});
				}
			},
			// 日历确认
			calendarConfirm(data) {
				console.log(data);
				// 修改值 和默认值
				this.startDate = dayjs(data[0]);
				this.endDate = dayjs(data[data.length - 1]);
				this.days = data.length - 1;
				this.calendarShow = false;
			},
			// 关闭日历
			calendarClose() {
				this.calendarShow = false;
			},
			getRegeo() {
				uni.showLoading({
					title: '获取信息中'
				});
				this.amapPlugin.getRegeo({
					success: (data) => {
						if (data.length > 0) {
							this.localtion.name = data[0].desc;
							this.localtion.address = data[0].name;
							this.localtion.longitude = data[0].longitude;
							this.localtion.latitude = data[0].latitude;
							this._setIndexPageData()
							this.getHomeHotel()
						}
						uni.hideLoading();
						
					},
					fail: (info) => {
						//失败回调
						uni.hideLoading();
						this.chooseLocation()
					}
				});
			}
		},
		onShareAppMessage(){
			
		}
	};
</script>
<style lang="scss">
	page {
		background-color: $ax-bg-color;
	}
</style>
<style lang="scss" scoped>
	.vertical-line__34 {
		width: 1rpx;
		height: 34rpx;
		background: #d2d2d2;
	}

	.navbar-title {
		padding: 0 32rpx;
		width: 100%;
		font-size: 40rpx;
		font-weight: bold;
		color: $ax-text-color-black;
	}

	.index-container {
		z-index: 2;
		padding: 0 32rpx;

		& .time-card {
			padding: 16rpx 40rpx 40rpx 40rpx;
			background: #ffffff;
			border-radius: 20rpx;

			&__row {
				display: flex;
				padding: 24rpx 0;
				width: 100%;
				border-bottom: 1rpx solid #e5e5e5;

				&__title {
					color: $ax-text-color-black;
					font-size: 36rpx;
					font-weight: bold;
					max-width: 326rpx;
					height: 50rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}

		& .index-swiper {
			border-radius: 20rpx;
			overflow: hidden;
			margin: 24rpx 0;
		}
	}

	.bg-image {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 750rpx;
		z-index: -1;
	}

	.index-page {
		display: flex;
		flex-direction: column;
	}

	.op-ad {
		&__title {
			font-size: 36rpx;
			color: $ax-text-color-black;
			font-weight: normal;
			margin: 24rpx 0;
		}

		&__card {
			&:not(:first-child) {
				margin-top: 24rpx;
			}
		}
	}
</style>