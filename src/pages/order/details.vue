<template>
	<view class="flex flex-direction">
		<view class="flex flex-direction detail-top container text-white" v-if="orderStatus">
			<u-skeleton rows="3" title :loading="loading">
				<view class="flex align-center margin-top-sm margin-bottom-xs">
					<uni-icons custom-prefix="ax-icon" :type="orderStatus.type" v-if="orderStatus.type" size="24" color="#FFFFFF"></uni-icons>
					<text class="font36" :class="orderStatus.type === '' ? '' : 'margin-left-xs'">{{ orderStatus.title }}</text>
				</view>
				<view class="flex align-center">
					<text class="font24">{{ orderStatus.info }}</text>
					<u-count-down :time="payTime" v-if="payTime > 0" format="HH:mm:ss" @change="onChange">
						<text class="font24">&nbsp;{{ timeData.minutes }}&nbsp;分{{ timeData.seconds }}&nbsp;秒</text>
					</u-count-down>
				</view>
			</u-skeleton>
		</view>
		<view class="container flex flex-direction">
			<!-- 退款流程 -->
			<view class="ax-card" v-if="order.status === 'apply_refund'">
				<view class="font32 ax-card__column">申请详情</view>
				<view class="margin-bottom-sm">
					<u-steps current="1" direction="column" dot activeColor="#D59E32">
						<u-steps-item icon-size="16rpx" v-for="(item, index) in [1, 2, 3, 4]" :key="index">
							<view slot="desc" class="flex flex-direction">
								<view class="flex justify-between margin-bottom-xs">
									<text class="font28">发起申请</text>
									<text class="font24 info-color">2023年4月5日12:37</text>
								</view>
								<text class="font28 info-color margin-bottom-xs">您已申请退款，请等待商家处理。</text>
							</view>
						</u-steps-item>
					</u-steps>
				</view>
			</view>
			<!--时间-->
			<view class="ax-card flex flex-direction" v-if="order">
				<view class="ax-card__cell flex justify-between align-center">
					<view class="flex flex-direction">
						<text class="font32">
							{{ getMMDD(order.startDate) }}
							<text class="font24">{{ getWeek(order.startDate) }}</text>
						</text>
						<text class="font24">{{ getTime(order.startDate) }}后</text>
					</view>
					<ax-time-capsule :text="`${order.days}晚`"></ax-time-capsule>
					<view class="flex flex-direction">
						<text class="font32">
							{{ getMMDD(order.endDate) }}
							<text class="font24">{{ getWeek(order.endDate) }}</text>
						</text>
						<text class="font24">{{ getTime(order.endDate) }}前</text>
					</view>
				</view>
				<view class="ax-card__cell flex flex-direction">
					<view class="flex justify-between align-center margin-bottom-xs">
						<view class="font28">{{ order.roomName }}</view>
						<view class="flex align-center" hover-class="active--hover" @click="roomShow = true">
							<text class="font24 main-color margin-right-xs">详情/设施</text>
							<u-icon name="arrow-right" color="#D59E32" size="12"></u-icon>
						</view>
					</view>
					<view class="flex flex-direction margin-bottom-sm">
						<ax-lables :list="order.tags"></ax-lables>
					</view>
					<view class="flex align-center justify-between" v-if="order">
						<!-- <ax-button width="191rpx"></ax-button> -->
						<!-- <ax-button width="406rpx"></ax-button> -->
						<block v-if="order.status === 'wait_pay'">
							<ax-button width="191rpx" content="取消订单" @click="cancelOrder()"></ax-button>
							<ax-button width="406rpx" type="ok" content="立即支付" @click="payOrder()"></ax-button>
						</block>
						<block v-if="order.status === 'wait_live'">
							<ax-button width="191rpx" content="取消订单" @click="cancelOrder()"></ax-button>
							<ax-button width="191rpx" content="再次预定" @click="goHotelDetail()"></ax-button>
							<ax-button width="191rpx" content="原房续住" @click="continuationOrder()"></ax-button>
						</block>
						<block v-if="order.status === 'living'">
							<ax-button width="622rpx" content="查看开门信息" @click="goRoomPage()"></ax-button>
						</block>
						<block v-if="order.status === 'wait_rate'">
							<ax-button width="622rpx" content="立即评价" @click="commentOrder()"></ax-button>
						</block>
					</view>
				</view>
			</view>
			<!--酒店-->
			<view class="flex flex-direction ax-card margin-top-sm" v-if="order">
				<view class="flex ax-card__column align-center">
					<image class="hotel-cover" :src="order.cover" mode="aspectFill"></image>
					<view class="flex flex-direction margin-left-sm" style="width: 480rpx">
						<text class="font32 margin-bottom-xs">{{ order.hotelName }}</text>
						<text class="font24">{{ order.address }}</text>
					</view>
				</view>
				<view class="ax-card__column flex align-center justify-around">
					<ax-lable title="酒店详情" icon="ax-icon-hotel" @click="onGoHotelInfo"></ax-lable>
					<ax-lable title="联系店家" @click="onCallHotel"></ax-lable>
					<ax-lable title="地图导航" icon="ax-icon-dizhi" @click="onGoHotelAddress"></ax-lable>
				</view>
			</view>
			<!--联系人-->
			<view class="ax-card flex flex-direction" v-if="false">
				<view class="font32 ax-card__title">入住登记信息</view>
				<view class="ax-card__cell flex flex-direction">
					<text class="font28 margin-bottom-xs">房间1</text>
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">入住人</view>
						<view class="font28">马云</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">手机号码</view>
						<view class="font28">150****2587</view>
					</view>
				</view>
				<view class="ax-card__cell flex flex-direction">
					<text class="font28 margin-bottom-xs">房间1</text>
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">入住人</view>
						<view class="font28">马云</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">手机号码</view>
						<view class="font28">150****2587</view>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="ax-card flex flex-direction">
				<view class="ax-card__title flex align-center justify-between">
					<view class="font32">订单信息</view>
				</view>
				<view class="ax-card__cell flex flex-direction">
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">订单来源:</view>
						<view class="font28 main-color">{{ order.isChannel ? '渠道订单' : '平台订单' }}</view>
					</view>
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">订单模式:</view>
						<view class="font28 main-color">{{ order.mode === 'day' ? '全日房' : '其他' }}</view>
					</view>
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">订单编号:</view>
						<view class="font28 main-color">{{ order.id }}</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">下单时间:</view>
						<view class="font28 main-color">{{ order.createdAt }}</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">入住人:</view>
						<view class="font28 main-color">{{ order.username }}</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">手机号吗:</view>
						<view class="font28 main-color">{{ order.phone }}</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">是否续房:</view>
						<view class="font28 main-color">{{ order.isRenew?'已续房':'未续房' }}</view>
					</view>
				</view>
			</view>
			<view class="ax-card flex flex-direction">
				<view class="ax-card__title flex align-center justify-between">
					<view class="font32">支付信息</view>
					<view class="flex align-center" hover-class="active--hover" @click="showMoneyPopup">
						<text class="font24 main-color margin-right-xs">费用明细</text>
						<u-icon name="arrow-right" color="#D59E32" size="12"></u-icon>
					</view>
				</view>
				<view class="ax-card__cell flex flex-direction">
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">订单金额:</view>
						<view class="font28 main-color text-price">{{ fen2yun(order.deposit + order.totalPrice) }}</view>
						<!-- <u--text mode="price" text="728732.32" color="#D59E32" size="28rpx"></u--text> -->
					</view>
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">订单状态:</view>
						<view class="font28 main-color">{{ order.payStatus === 'unpaid' ? '未支付' : '已支付' }}</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">支付时间:</view>
						<view class="font28 main-color">{{ order.payTime || '未支付' }}</view>
					</view>
				</view>
			</view>
			<!-- 退款信息 -->
			<view class="ax-card flex flex-direction" v-if="!order.orderRefundList">
				<view class="ax-card__title flex align-center justify-between">
					<view class="font32">退款信息</view>
				</view>
				<view class="ax-card__cell flex flex-direction" v-for="refund in order.orderRefundList" :key="refund.id">
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">订单编号:</view>
						<view class="font28 main-color text-price">{{ refund.orderId }}</view>
						<!-- <u--text mode="price" text="728732.32" color="#D59E32" size="28rpx"></u--text> -->
					</view>
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">退款金额:</view>
						<view class="font28 main-color text-price">{{ fen2yun(refund.refundAmount) }}</view>
						<!-- <u--text mode="price" text="728732.32" color="#D59E32" size="28rpx"></u--text> -->
					</view>
					<view class="flex align-center margin-bottom-xs">
						<view class="color666 font28 width140">退款备注:</view>
						<view class="font28 main-color">{{ refund.operator }}</view>
					</view>
					<view class="flex align-center">
						<view class="color666 font28 width140">退款时间:</view>
						<view class="font28 main-color">{{ refund.refundTime }}</view>
					</view>
				</view>
			</view>
			<view class="is-btn-height"></view>
		</view>
		<!-- 金额明细 -->

		<ax-popup-money :price="order.priceDetail" :show="moneyPopup" @click="close()" :is-btn="order.status === 'wait_pay'" @goPay="payOrder()"></ax-popup-money>
		<ax-popup-room :show="roomShow" :roomId="order.roomId" @click="closeRoomShow()"></ax-popup-room>
		<block v-if="order.status === 'cancel' || order.status === 'complete' || order.status === 'wait_rate'">
			<view class="bottom-btn">
				<view class="bottom-btn__item">
					<u-button class="margin-top-lg" :customStyle="{ color: '#fff', borderRadius: '0rpx' }" color="#242424" text="再次预定" @click="goHotelDetail()"></u-button>
				</view>
			</view>
		</block>
		<block v-if="order.status === 'wait_pay'">
			<view class="bottom-btn">
				<view class="bottom-btn__item">
					<u-button class="margin-top-lg" :customStyle="{ color: '#fff', borderRadius: '0rpx' }" color="#242424" @click="" text="立即支付" @click="payOrder()"></u-button>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
const dayjs = require('@/utils/dayjs.min.js');
export default {
	data() {
		return {
			moneyPopup: false,
			order: {},
			payTime: 0,
			timeData: {},
			orderStatus: {},
			btnList: [],
			roomShow: false,
			loading: false,
			orderId:null
		};
	},
	methods: {
		onChange(e) {
			this.timeData = e;
		},
		close() {
			this.moneyPopup = false;
		},
		showMoneyPopup() {
			this.moneyPopup = true;
		},
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
		fen2yun(fen) {
			return parseFloat(parseInt(fen) / 100).toFixed(2);
		},
		getOrderStatus(order) {
			if (order.status === 'wait_pay') {
				return {
					type: 'ax-icon-time',
					info: '订单未支付超时自动取消',
					title: '未支付'
				};
			}
			if (order.status === 'wait_live') {
				return {
					type: 'ax-icon-success_solid',
					info: `请于${order.startDate}后办理入住`,
					title: '预定成功'
				};
			}
			if (order.status === 'living') {
				return {
					type: 'ax-icon-success_solid',
					info: `将于${order.endDate}后离店`,
					title: '入住中'
				};
			}
			if (order.status === 'wait_refund') {
				return {
					type: '',
					info: `商家待退押金`,
					title: '已离店'
				};
			}
			if (order.status === 'wait_rate') {
				return {
					type: '',
					info: `订单已经完成，快评价吧~`,
					title: '已完成'
				};
			}
			if (order.status === 'complete') {
				return {
					type: '',
					info: `订单已经完成，感谢您的使用~`,
					title: '已完成'
				};
			}
			if (order.status === 'cancel') {
				return {
					type: '',
					info: `订单已经取消`,
					title: '已取消'
				};
			}
			if (order.status === 'apply_refund') {
				return {
					type: '',
					info: `申请退款等待商家处理`,
					title: '申请退款'
				};
			}
		},
		getBtnList(order) {
			let list = [];
			list.push({
				title: '取消订单',
				width: '191rpx',
				type: 'defualt',
				fun: () => {
					console.log('quxiaod');
				}
			});
			return list;
		},
		// 取消订单
		cancelOrder() {
			uni.showModal({
				title: '提示',
				content: '是否取消订单',
				success: (res) => {
					if (res.confirm) {
						this.$api.cancelNoPayOrder(this.order.id).then((res) => {
							if (res.code === 0) {
								uni.showToast({
									icon: 'success',
									title: '取消成功'
								});
								setTimeout(() => {
									uni.navigateBack();
								}, 1000);
							}
						});
					}
				}
			});
		},
		// 支付订单
		payOrder() {
			uni.navigateTo({
				url: '/pages/order/pay?order=' + JSON.stringify(this.order)
			});
		},
		//  续住 开门信息 评价 预定
		continuationOrder() {
			uni.navigateTo({
				url: '/pages/order/continuation?id=' + this.order.id,
				success: (res) => {},
				fail: () => {},
				complete: () => {}
			});
		},
		goRoomPage() {
			uni.switchTab({
				url: '/pages/room/room'
			});
		},
		commentOrder() {},
		goHotelDetail() {
			uni.navigateTo({
				url: '/pages/hotel/details/details?id=' + this.order.hotelId
			});
		},
		goRoomInfo() {},
		closeRoomShow() {
			this.roomShow = false;
		},
		onGoHotelInfo() {
			uni.navigateTo({
				url: '/pages/hotel/info/info?btn=false&id=' + this.order.hotelId
			});
		},
		onCallHotel(){
			if(this.order.hotelPhone ){
				uni.makePhoneCall({
					phoneNumber: this.order.hotelPhone 
				});
			}else{
				uni.showModal({
					title: '提示',
					content: '未能获取到该商家的联系方式',
					showCancel: false,
					cancelText: '',
					confirmText: '确定',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		onGoHotelAddress(){
			uni.openLocation({
				latitude: this.order.latitude,
				longitude: this.order.longitude,
				name: this.order.hotelName,
				address: this.order.address,
				success: () => {}
			});
		}
	},
	onLoad(opt) {
		if (opt.id) {
			this.orderId = opt.id
			
		}
	},
	onShow() {
		if(this.orderId){
			this.loading = true;
			this.$api.getOrderDetails(this.orderId).then((res) => {
				if (res.code === 0) {
					this.order = res.data;
					if (res.data.status === 'wait_pay') {
						let time = dayjs().diff(dayjs(res.data.createdAt));
						if (time > 0) {
							this.payTime = 600000 - time;
						} else {
							this.payTime = 0;
						}
					}else{
						this.payTime = 0;
					}
					this.orderStatus = this.getOrderStatus(res.data);
					this.btnList = this.getBtnList(res.data);
				}
				this.loading = false;
			});
		}
		
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding: 0 32rpx;
}

.page-top-bg-color {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 400rpx;
	background: #555567;
	z-index: 1;
}

.text-white {
	color: #fff;
}

.detail-top {
	height: 400rpx;
	background: #555567;
	margin-bottom: -262rpx;
}

.details-card {
	height: 387rpx;
	padding: 32rpx;
	background: #ffffff;
	border-radius: 20rpx 20rpx 20rpx 20rpx;
}

.hotel-cover {
	width: 120rpx;
	height: 120rpx;
	border-radius: 10rpx 10rpx 10rpx 10rpx;
}

.width140 {
	width: 150rpx;
}

.is-btn-height {
	margin-bottom: calc(128rpx + var(--safe-area-inset-bottom));
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
