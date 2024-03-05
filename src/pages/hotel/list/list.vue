<template>
	<view class="flex flex-direction">
		<view class="search-flexd-op">
			<u-search bg-color="#EEEEEE" v-model="searchValue" placeholder="请输入酒店名称关键字" :show-action="false"></u-search>
			<view class="flex align-center search-flexd-op__params">
				<!-- 菜单地址 -->
				<view class="flex align-center" @click="chooseLocation">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-dizhi" size="20" color="#D59E32"></uni-icons>
					<text class="font28 margin-left-xs name-max">{{ localtion.name }}</text>
				</view>
				<view class="flex flex-direction font24 margin-left" @click="calendarShow = !calendarShow">
					<view class="flex align-center">
						<text class="info-color">住</text>
						<text class="margin-left-xxs">{{ startDate.format('MM-DD') }}</text>
					</view>
					<view class="flex align-center margin-top-xs">
						<text class="info-color">离</text>
						<text class="margin-left-xxs">{{ endDate.format('MM-DD') }}</text>
					</view>
				</view>
				<ax-time-capsule class="margin24" :line="false" :text="`${days}晚`"></ax-time-capsule>
				<u-line direction="col" length="35rpx"></u-line>

				<!-- 菜单排序 -->
				<view @click="_showDropdown(1)" class="flex font24 align-center margin-lr">
					<text class="margin-right-xs search-flexd-op__params__text"
						:class="[menuActive === 1 ? 'search-flexd-op__params__text--active' : '']">
						{{ getSortName(menuActiveData.sort) }}
					</text>
					<view :class="[menuActive === 1 ? 'search-flexd-op__params__icon--active' : '']"
						class="search-flexd-op__params__icon flex align-center">
						<u-icon name="arrow-down-fill" size="12" color="#D2D2D2"></u-icon>
					</view>
				</view>
				<!-- 菜单筛选 -->
				<view @click="_showDropdown(2)" class="flex font24 align-center">
					<text class="margin-right-xs search-flexd-op__params__text"
						:class="[menuActive === 2 ? 'search-flexd-op__params__text--active' : '']">筛选</text>
					<view :class="[menuActive === 2 ? 'search-flexd-op__params__icon--active' : '']"
						class="search-flexd-op__params__icon flex align-center">
						<u-icon name="arrow-down-fill" size="12" color="#D2D2D2"></u-icon>
					</view>
				</view>
			</view>
			<!-- 筛选区域 -->

			<view class="search-flexd-op__filter"
				:class="[dropdown ? 'search-flexd-op__filter--active' : 'search-flexd-op__filter--hide']"
				v-show="dropdown">
				<view class="flex flex-direction" v-if="menuActive === 0"></view>
				<!-- 排序1 -->
				<view class="flex flex-direction" v-if="menuActive === 1">
					<view class="dorp-down__cell" @click="activeSort('RECOMMEND')"
						:class="[menuActiveData.sort == 'RECOMMEND' ? 'dorp-down__cell--hover' : '']"
						hover-class="dorp-down__cell--hover">
						推荐排序
					</view>
					<view class="dorp-down__cell" @click="activeSort('RATE')"
						:class="[menuActiveData.sort == 'RATE' ? 'dorp-down__cell--hover' : '']"
						hover-class="dorp-down__cell--hover">
						好评优先
					</view>
					<view class="dorp-down__cell" @click="activeSort('DISTANCE')"
						:class="[menuActiveData.sort == 'DISTANCE' ? 'dorp-down__cell--hover' : '']"
						hover-class="dorp-down__cell--hover">
						距离最近
					</view>
					<view class="dorp-down__cell" @click="activeSort('PRICE_HIGH')"
						:class="[menuActiveData.sort == 'PRICE_HIGH' ? 'dorp-down__cell--hover' : '']"
						hover-class="dorp-down__cell--hover">
						高价优先
					</view>
					<view class="dorp-down__cell" @click="activeSort('PRICE_LOW')"
						:class="[menuActiveData.sort == 'PRICE_LOW' ? 'dorp-down__cell--hover' : '']"
						hover-class="dorp-down__cell--hover">
						低价优先
					</view>
				</view>
				<!-- 筛选 -->
				<view class="flex flex-direction" v-if="menuActive === 2">
					<view class="dorp-down__filter">
						<view class="dorp-down__filter__title">酒店类型</view>
						<view class="dorp-down__filter__content">
							<view class="dorp-down__filter__content__item"
								:class="filterOpt.active === item ? 'dorp-down__filter__content__item--hover' : ''"
								@click="activeFilter(item)" v-for="(item, index) in filterOpt.data" :key="index">
								{{ item }}
							</view>
						</view>
					</view>
					<view class="flex justify-between">
						<u-button class="margin-top-lg" :plain="true"
							:customStyle="{ marginTop: '32rpx', borderRadius: '0rpx' }" color="#242424"
							@click="clearFilter()" text="清空"></u-button>
						<view class="margin-right-xs"></view>
						<u-button class="margin-top-lg"
							:customStyle="{ color: '#fff', marginTop: '32rpx', borderRadius: '0rpx' }" color="#242424"
							@click="searchFilter()" text="开始搜索"></u-button>
					</view>
				</view>
			</view>
		</view>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<view style="height: 202rpx" slot="top"></view>
			<view class="page-container">
				<ax-hotel-card v-for="(item, index) in dataList" :key="item.id" :hotel="item"></ax-hotel-card>
			</view>
		</z-paging>
		<u-overlay :z-index="1" :show="dropdown" @click="_hideDropdown()"></u-overlay>
		<u-calendar :show="calendarShow" color="#D59E32" mode="range"
			:defaultDate="[startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]" startText="住店" endText="离店"
			confirmDisabledText="请选择离店日期" round="20rpx" @close="calendarClose" @confirm="calendarConfirm"></u-calendar>
	</view>
</template>

<script>
	const dayjs = require('@/utils/dayjs.min.js');
	export default {
		onLoad() {
			let opstion = this.$st.getIndexPageData();
			console.log(opstion);
			if (opstion != null) {
				this.localtion = JSON.parse(opstion.localtion);
				this.startDate = dayjs(opstion.startDate);
				this.endDate = dayjs(opstion.endDate);
				this.days = opstion.days;
				this.searchValue = opstion.searchValue;
				this.pageData = opstion;
			}
			this.getOptions();
		},
		data() {
			return {
				dropdown: false,
				menuActive: 0,
				menuActiveData: {
					sort: 'RECOMMEND',
					filter: ''
				},
				dataList: [],
				localtion: {
					name: '武汉',
					address: '武汉',
					longitude: 114.41276550292967, //经度
					latitude: 30.493989944458015 //纬度
				},
				startDate: dayjs(),
				endDate: dayjs(),
				days: 1,
				searchValue: '',
				calendarShow: false,
				pageData: {},
				filterOpt: {
					active: '',
					data: []
				}
			};
		},
		methods: {
			_showDropdown(index) {
				this.menuActive = index;
				this.dropdown = true;
			},
			_hideDropdown() {
				this.menuActive = 0;
				this.dropdown = false;
			},
			upCallback() {
				console.log('upCallback');
				// this.mescroll.endErr()
				this.mescroll.endSuccess(10);
			},
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			queryList(pageNo, pageSize) {
				let params = {
					longitude: this.localtion.longitude,
					latitude: this.localtion.latitude,
					page: pageNo,
					pageSize: pageSize
				};
				if (this.filterOpt.active) {
					params.type = this.filterOpt.active
				}
				if (this.menuActiveData.sort) {
					params.sortType = this.menuActiveData.sort
				}
				this.$api
					.getHotel(params)
					.then((res) => {
						this.$refs.paging.complete(res.data.records);
					})
					.catch((res) => {
						//如果请求失败写this.$refs.paging.complete(false)，会自动展示错误页面
						//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
						//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
						this.$refs.paging.complete(false);
					});
			},
			// 日历确认
			calendarConfirm(data) {
				console.log(data);
				// 修改值 和默认值
				this.startDate = dayjs(data[0]);
				this.endDate = dayjs(data[data.length - 1]);
				this.days = data.length - 1;
				this.calendarShow = false;
				this._setIndexPageData();
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
			// 关闭日历
			calendarClose() {
				this.calendarShow = false;
			},
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						this.localtion.longitude = res.longitude;
						this.localtion.latitude = res.latitude;
						this.localtion.address = res.address;
						this.localtion.name = res.name
						this.getHomeHotel();
						this._setIndexPageData();
						this.$refs.paging.reload();
					}
				});
			},
			activeSort(type) {
				this.menuActiveData.sort = type;
				this._hideDropdown();
				this.$refs.paging.reload()
			},
			getSortName(type) {
				if (type === 'RECOMMEND') {
					return '推荐排序';
				} else if (type === 'RATE') {
					return '好评优先';
				} else if (type === 'DISTANCE') {
					return '距离最近';
				} else if (type === 'PRICE_HIGH') {
					return '高价优先';
				} else if (type === 'PRICE_LOW') {
					return '低价优先';
				}
			},
			async getOptions() {
				let res = await this.$api.getSystemOptions('hotelType');
				this.filterOpt.data = res.data;
			},
			// 选择筛选
			activeFilter(key) {
				this.filterOpt.active = key;
			},
			// 清除
			clearFilter() {
				this.filterOpt.active = '';
			},
			// 搜索
			searchFilter() {
				this._hideDropdown();
				this.$refs.paging.reload()
			}
		}
	};
</script>

<style lang="scss">
	.page-container {
		padding: 40rpx 32rpx;
	}

	.dorp-down {
		&__cell {
			font-size: 28rpx;
			padding: 24rpx 0;
			color: #242424;

			&:not(:last-child) {
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.3);
			}

			&--hover {
				color: #d59e32;
			}
		}

		&__filter {
			&__title {
				font-size: 30rpx;
				font-weight: 400;
				margin-top: 60rpx;
				margin-bottom: 16rpx;
			}

			&__content {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				grid-row-gap: 16rpx;

				&__item {
					width: 160rpx;
					height: 60rpx;
					background: #ffffff;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					color: $ax-text-color-black;

					&--hover {
						color: #ffffff;
						background: #242424;
					}
				}
			}
		}
	}

	.search-flexd-op {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 24rpx 32rpx;
		background-color: $ax-bg-color;
		z-index: 12;

		&__params {
			margin-top: 24rpx;

			&__text {
				font-size: 26rpx;
				color: $ax-text-color-black;

				&--active {
					color: $ax-text-color-main;
				}
			}

			&__icon {
				// transform: rotate(0deg);
				transition-property: transform;
				transition-duration: 0.3s;
				transition-delay: 0s;
				transition-timing-function: linear;

				&--active {
					transform: rotate(180deg);
				}
			}
		}

		&__filter {
			transition-property: transform;
			transition-duration: 0.5s;
			transition-delay: 0s;
			transition-timing-function: linear;

			&--active {
				transform: translateY(0);
				transition-duration: 0.5s;
			}

			&--hide {
				transform: translateY(-100%);
				transition-duration: 0.5s;
				// height: 0;
			}
		}
	}

	.name-max {
		max-width: 84rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>