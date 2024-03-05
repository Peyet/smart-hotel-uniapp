<template>
	<view>
		<view class="flex flex-direction container">
			<u-notice-bar
				text="该订单可享受原房续住,无需换房;本平台续房订单可享受免认证特权,可免去身份证认证."
				mode="closable"
				speed="50"
				v-if="orderId && original"
			></u-notice-bar>
			<u-notice-bar text="本平台续房订单可享受免认证特权,可免去身份证认证～" mode="closable" speed="50" v-if="orderId && !original"></u-notice-bar>
			<view class="ax-card margin-b24 flex flex-direction">
				<u-skeleton :loading="!pageParams" :title="false" rowsHeight="28" :rows="2">
					<view class="flex justify-between align-center ax-card__cell" v-if="timeParams">
						<view class="flex align-center">
							<text class="font32 font-normal">{{ formatMMDD(timeParams.startDate) }}</text>
							<text class="font24 margin-left-xs">入住</text>
						</view>
						<ax-time-capsule class="margin-lr" :text="`${timeParams.days}晚`" :line="true" color="#242424" textColor="#242424"></ax-time-capsule>
						<view class="flex align-center">
							<text class="font32 font-normal">{{ formatMMDD(timeParams.endDate) }}</text>
							<text class="font24 margin-left-xs">离店</text>
						</view>
					</view>
					<view class="ax-card__cell flex flex-direction">
						<view class="flex align-center justify-between">
							<view class="font28">{{ pageParams.roomName }}</view>
							<view class="flex align-center black-color" hover-class="active--hover" @click="goRoom">
								<text class="font24 main-color margin-right-xs">房型详情</text>
								<u-icon name="arrow-right" color="#D59E32" size="12"></u-icon>
							</view>
						</view>
						<ax-lables :list="pageParams.tags"></ax-lables>
					</view>
				</u-skeleton>
			</view>
			<u-skeleton :loading="loading" :rows="8">
				<view class="ax-card margin-b24 flex flex-direction">
					<view class="ax-card__cell flex justify-between align-center">
						<view class="font32">订房信息</view>
						<view class="room-number-box">
							<u-number-box v-model="roomNum" @change="changeRoomNum" :disableMinus="roomNum <= 1">
								<view slot="minus" class="minus" :style="{ borderColor: roomNum > 1 ? '#D59E32' : '#D2D2D2' }">
									<u-icon name="minus" :color="roomNum > 1 ? '#D59E32' : '#D2D2D2'" size="12"></u-icon>
								</view>
								<text slot="input" class="input">{{ roomNum }}间</text>
								<view slot="plus" class="plus">
									<u-icon name="plus" color="#D59E32" size="12"></u-icon>
								</view>
							</u-number-box>
						</view>
					</view>
					<!-- 房客 -->
					<view class="ax-card__cell" v-for="(item, index) in roomUserList" v-bind:key="index">
						<view class="flex align-center">
							<view class="room__title">{{ item.roomName }}</view>
							<view class="flex align-center justify-between" style="width: 100%">
								<u--input placeholder="每间填1位住客姓名" border="none" v-model="item.username"></u--input>
								<uni-icons custom-prefix="ax-icon" type="ax-icon-lianxiren" size="20" color="#D59E32" @click="onShowContact(index)"></uni-icons>
							</view>
						</view>
						<view class="room-user-info">姓名必须真实，用户办理入住身份证识别订单</view>
					</view>
					<view class="ax-card__cell">
						<view class="flex align-center">
							<view class="room__title">联系手机</view>
							<view class="flex align-center justify-between" style="width: 100%">
								<u--input v-model="userPhone" placeholder="手机号码" type="number" border="none"></u--input>
								<uni-icons custom-prefix="ax-icon" type="ax-icon-tongxunlu" size="20" color="#D59E32"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<!-- 价格 -->
				<view class="ax-card flex flex-direction safe-bottom" v-if="priceData">
					<view class="room-price__title">订房信息</view>
					<view class="flex justify-between">
						<view class="flex align-center info-color">
							<text class="font28" style="color: #666666">房费</text>
							<text class="font24">{{ `（共${priceData.days}晚）` }}</text>
						</view>
						<text class="text-price font28">{{ fen2yun(priceData.totalPrice) }}</text>
					</view>
					<view class="room-price__content flex flex-direction" v-if="priceData.priceList">
						<view class="flex justify-between align-center room-price__content__item" v-for="(item, index) in priceData.priceList" :key="index">
							<view class="flex align-center info-color">
								<text class="font24" style="color: #666666">{{ item.time }}</text>
								<text class="font24 margin-left-xxs">{{ `（${item.roomNum}间)` }}</text>
							</view>
							<text class="text-price font24">{{ fen2yun(item.price) }}</text>
						</view>
					</view>
					<!-- 押金 -->
					<view class="flex flex-direction">
						<view class="flex justify-between" v-if="priceData">
							<view class="flex align-center info-color">
								<text class="font28" style="color: #666666">押金</text>
							</view>
							<text class="text-price font28">{{ fen2yun(priceData.deposit) }}</text>
						</view>
						<view class="room-price__deposit">{{original?'原房续住免押金':'离店后押金将原路返回到您的账户'}}</view>
					</view>
				</view>
			</u-skeleton>
		</view>
		<view class="bottom-btn">
			<text class="text-price font-bold font40" v-if="priceData">{{ fen2yun(priceData.totalPrice + priceData.deposit) }}</text>
			<view class="bottom-btn__item">
				<u-button
					class="margin-top-lg"
					:loading="btnLoading"
					:customStyle="{ color: '#fff', borderRadius: '0rpx' }"
					color="#242424"
					@click="createOrder"
					text="立即支付"
				></u-button>
			</view>
		</view>
		<ax-popup-contact :show="popupContact" @data="onChooseContact" @hide="popupContact=false"></ax-popup-contact>
		<ax-popup-qrcode :show="qrcodeShow" @hide="qrcodeShow= false"></ax-popup-qrcode>
	</view>
</template>

<script>
const dayjs = require('@/utils/dayjs.min.js');
export default {
	data() {
		return {
			roomNum: 1,
			roomUserList: [
				{
					roomName: '房间1',
					username: ''
				}
			],
			inputUserIndex:0,
			userPhone: '',
			user:null,
			pageParams: null,
			timeParams: null,
			submitData: {},
			priceData: null,
			orderId: null,
			order: null,
			original: false,
			roomItemId: null,
			loading: false,
			btnLoading: false,
			subTag: false,
			popupContact:false,
			contactData:null,
			qrcodeShow:false,
			isShowQrcodeShow:false
		};
	},
	methods: {
		// 调整房型页面
		goRoom() {
			uni.navigateTo({
				url: '/pages/hotel/room/room?id=' + this.pageParams.roomId + '&btn=1'
			});
		},
		fen2yun(fen) {
			return parseFloat(fen / 100).toFixed(2);
		},
		// 选择房间
		changeRoomNum(e) {
			if (e.value > this.roomNum) {
				this.roomUserList.push({
					roomName: '房间' + e.value,
					username: ''
				});
			} else {
				this.roomUserList.splice(e.value, 1);
			}
			this.roomNum = e.value;
			this.getPrice();
		},
		// 时间转换
		formatMMDD(date) {
			return dayjs(date).format('MM月DD日');
		},
		// 获取订单信息
		async getOrderData(id) {
			this.loading = true;
			let res = await this.$api.getOrderDetails(id);
			this.order = res.data;
			this.userPhone = res.data.phone;
			this.roomUserList[0].username = res.data.username;
			this.loading = false;
		},
		// 获取单价
		async getPrice() {
			this.loading = true;
			this.submitData.roomId = this.pageParams.roomId;
			this.submitData.roomCount = this.roomNum;
			this.submitData.days = this.timeParams.days;
			this.submitData.startDate = dayjs(this.timeParams.startDate).format('YYYY-MM-DD') + ` ${this.pageParams.inTime || 13}:00:00`;
			this.submitData.endDate = dayjs(this.timeParams.endDate).format('YYYY-MM-DD') + ` ${this.pageParams.endTime || 12}:00:00`;
			this.submitData.originalRenew = this.original
			let data = await this.$api.getCreateOrderPrice(this.submitData);
			this.priceData = data.data;
			this.loading = false;
		},
		// 判断是否关注
		async subscribe() {
			let data = await this.$api.getUser();
			if (data.code === 0) {
				this.user = data.data;
				this.$st.setUserInfo(this.user);
			}
			if(this.user.wxMpOpenid=='' && !this.isShowQrcodeShow){
				this.qrcodeShow = true
				this.isShowQrcodeShow = true
				return
			}
			await this.submitOrder()
		},
		// 创建订单
		async createOrder() {
			let flog = true;
			this.roomUserList.forEach((e) => {
				if (e.username == '') {
					flog = false;
				}
			});
			if (!flog) {
				uni.showToast({
					icon: 'none',
					title: '请输入房间住客名称'
				});
				return;
			}
			if (!this.userPhone) {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号码'
				});
				return;
			}
			await this.subscribe();
		},
		// 提交订单
		async submitOrder() {
			this.btnLoading = true;
			this.submitData.sourceTag = 'MINI_PROGRAM';
			this.submitData.username = this.roomUserList[0].username;
			this.submitData.phone = this.userPhone;
			if (this.original) {
				this.submitData.roomItemId = this.roomItemId;
			}

			let data = {};
			if (this.orderId != null) {
				this.submitData.orderId = this.orderId;
				data = await this.$api.renewOrder(this.submitData);
			} else {
				data = await this.$api.createOrder(this.submitData);
			}
			this.btnLoading = false;
			if (data.code === 0) {
				uni.redirectTo({
					url: '/pages/order/pay?order=' + JSON.stringify(data.data)
				});
			}
		},
		// 选择联系人
		onChooseContact(data){
			this.contactData = data
			this.roomUserList[this.inputUserIndex].username = data.name
			this.userPhone = data.phone
		},
		// 显示联系人
		onShowContact(index){
			this.inputUserIndex = index
			this.popupContact = true
		}
	},
	onLoad(opt) {
		let params = this.$st.getCreateParams();
		uni.setNavigationBarTitle({
			title: params.hotelName
		});
		this.pageParams = params;
		let time = this.$st.getIndexPageData();
		this.timeParams = time;
		if (opt.id) {
			this.orderId = opt.id;
			if (opt.original) {
				this.original = true;
				this.roomItemId = opt.original;
			}
			this.getOrderData(opt.id);
		}
	},
	onShow() {
		if (!this.priceData) {
			this.getPrice();
		}
	},
	onHide() {
		if(this.qrcodeShow){
			this.qrcodeShow = false
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding: 40rpx 32rpx;
}

.margin-b24 {
	margin-bottom: 24rpx;
}

.room-user-info {
	font-size: 24rpx;
	font-weight: normal;
	color: #999999;
	line-height: 34rpx;
	margin-top: 32rpx;
}

.room-number-box {
	height: 48rpx;
	background: #f8f8f8;
	border-radius: 40rpx 40rpx 40rpx 40rpx;
	padding: 8rpx;
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

.room {
	&__title {
		width: 172rpx;
		font-size: 28rpx;
		color: #666666;
	}
}

.room-price {
	&__title {
		height: 45rpx;
		font-size: 32rpx;
		padding: 24rpx 0;
		font-weight: normal;
		color: #242424;
		line-height: 45rpx;
	}

	&__content {
		padding: 24rpx 32rpx;
		background: #f8f8f8;
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		margin-top: 24rpx;
		margin-bottom: 32rpx;

		&__item {
			&:not(:last-child) {
				margin-bottom: 24rpx;
			}
		}
	}

	&__deposit {
		font-size: 24rpx;
		font-weight: normal;
		color: #999999;
		line-height: 34rpx;
		margin-bottom: 32rpx;
	}
}
.safe-bottom {
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
	justify-content: space-between;
	align-items: center;
	&__item {
		width: 240rpx;
	}
}
</style>
