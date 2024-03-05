<template>
	<view class="flex-direction flex">
		<image src="../../static/bg/bg-img.png" mode="widthFix" class="bg-image"></image>
		<ax-navbar image-url="../../static/bg/bg-img.png">
			<view slot="content" class="navbar-title">我的</view>
		</ax-navbar>
		<view class="page-container flex flex-direction">
			<view class="flex align-center user__info justify-between" @click="_goPage('/pages/mine/info', '')">
				<view class="flex align-center">
					<image class="user__info__image" :src="user.avatar"></image>
					<text class="user__info__name">{{ user.nickname }}</text>
				</view>
				<u-icon name="arrow-right" color="#242424"></u-icon>
			</view>
			<view class="ax-card-32 flex justify-between">
				<view class="flex flex-direction align-center" hover-class="active--hover" @click="_goPage('/pages/order/list', '?type=0')">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-c_neirong" size="36" color="#D59E32"></uni-icons>
					<text class="font24 margin-top-xs">全部订单</text>
				</view>
				<view class="flex flex-direction align-center" hover-class="active--hover" @click="_goPage('/pages/order/list', '?type=1')">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-c-qianbao" size="36" color="#D59E32"></uni-icons>
					<text class="font24 margin-top-xs">待支付</text>
				</view>
				<view class="flex flex-direction align-center" hover-class="active--hover" @click="_goPage('/pages/order/list', '?type=2')">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-c_rili" size="36" color="#D59E32"></uni-icons>
					<text class="font24 margin-top-xs">待入住</text>
				</view>
				<view class="flex flex-direction align-center" hover-class="active--hover" @click="_goPage('/pages/order/list', '?type=3')">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-c_message" size="36" color="#D59E32"></uni-icons>
					<text class="font24 margin-top-xs">待评价</text>
				</view>
				<view class="flex flex-direction align-center" hover-class="active--hover" @click="_goPage('/pages/order/list', '?type=4')">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-c_wenjian" size="36" color="#D59E32"></uni-icons>
					<text class="font24 margin-top-xs">退款/售后</text>
				</view>
			</view>
			<view class="ax-card-32 flex justify-between">
				<view class="flex align-center">
					<u-icon name="weixin-fill" size="22"></u-icon>
					<text class="font28 margin-left-sm">关注公众号，享受服务通知</text>
				</view>
				<ax-button :type="!user.wxMpOpenid?'primary':'default'" round :size="24" :height="48" width="120"  @click="showQrcode">{{!user.wxMpOpenid?'关注':'已关注'}}</ax-button>
			</view>
			<view class="user__card flex flex-direction">
				<view class="user__card__item flex align-center justify-between" hover-class="cell--hover" @click="_goPage('/pages/mine/contact', '')">
					<view class="flex align-center">
						<uni-icons custom-prefix="ax-icon" type="ax-icon-personal" size="22"></uni-icons>
						<text class="font28 margin-left-sm">常用入住人</text>
					</view>
					<u-icon name="arrow-right" color="#242424"></u-icon>
				</view>
				<view class="user__card__item flex flex-direction" hover-class="cell--hover">
					<button class="u-reset-button flex align-center justify-between w-full" open-type="feedback">
						<view class="flex align-center">
							<uni-icons custom-prefix="ax-icon" type="ax-icon-c_tianxie" size="22"></uni-icons>
							<text class="font28 margin-left-sm">我要反馈</text>
						</view>
						<u-icon name="arrow-right" color="#242424"></u-icon>
					</button>
				</view>
				<view class="user__card__item flex align-center justify-between" hover-class="cell--hover" @click="goWeb('HotelJoin')">
					<view class="flex align-center">
						<uni-icons custom-prefix="ax-icon" type="ax-icon-c-city" size="22"></uni-icons>
						<text class="font28 margin-left-sm">我要加盟</text>
					</view>
					<u-icon name="arrow-right" color="#242424"></u-icon>
				</view>
				<view class="user__card__item flex align-center justify-between" hover-class="cell--hover" @click="subscribe" v-if="false">
					<view class="flex align-center">
						<u-icon name="weixin-fill" size="22"></u-icon>
						<text class="font28 margin-left-sm">微信通知</text>
					</view>
					<u-icon name="arrow-right" color="#242424"></u-icon>
				</view>
				<view class="user__card__item flex align-center justify-between" hover-class="cell--hover" @click="_goPage('/pages/mine/setting', '')">
					<view class="flex align-center">
						<uni-icons custom-prefix="ax-icon" type="ax-icon-c-setting" size="22"></uni-icons>
						<text class="font28 margin-left-sm">设置</text>
					</view>
					<u-icon name="arrow-right" color="#242424"></u-icon>
				</view>
			</view>
		</view>
		<ax-popup-qrcode :show="qrcodeShow" @hide="qrcodeShow= false"></ax-popup-qrcode>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {},
			qrcodeShow:false,
			isUpdate:false
		};
	},
	methods: {
		goWeb(key){
			uni.navigateTo({
				url:"/pages/web/web?key="+key
			})
		},
		_goPage(page, prams) {
			uni.navigateTo({
				url: page + prams
			});
		},
		async getData() {
			// let us = this.$st.getUserInfo();
			// if (us == null || this.isUpdate) {
			// 	let data = await this.$api.getUser();
			// 	this.isUpdate = false
			// 	if (data.code === 0) {
			// 		this.user = data.data;
			// 		this.$st.setUserInfo(this.user);
			// 	}
			// } else {
			// 	this.user = us;
			// }
			let data = await this.$api.getUser();
			this.isUpdate = false
			if (data.code === 0) {
				this.user = data.data;
				this.$st.setUserInfo(this.user);
			}
		},
		subscribe() {
			this.$api.getSubscribe().then((res) => {
				if (res.code === 0) {
					let data = res.data;
					let idList = [];
					if (data != null) {
						data.forEach((e) => {
							idList.push(e.templateId);
						});
					}
					uni.requestSubscribeMessage({
						tmplIds: idList,
						success: (res) => {
							console.log(res);
						},
						fail: (res) => {
							console.log(res);
						},
						complete: (res) => {
							console.log(res);
						}
					});
				}
			});
		},
		showQrcode(){
			if(!this.user.wxMpOpenid){
				this.qrcodeShow = true
				this.isUpdate = true
			}
		}
		
	},
	onShow() {
	 this.getData();
	},
	onHide() {
		this.qrcodeShow = false
	}
};
</script>
<style lang="scss">
page {
	background-color: $ax-bg-color;
}
</style>
<style lang="scss" scoped>
.bg-image {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	width: 750rpx;
	z-index: 1;
}

.navbar-title {
	padding: 0 32rpx;
	width: 100%;
	font-size: 40rpx;
	font-weight: bold;
	color: $ax-text-color-black;
}

.page-container {
	z-index: 2;
	padding: 0 32rpx;
}
.user {
	&__info {
		margin: 48rpx 0;
		&__image {
			width: 120rpx;
			border-radius: 50%;
			height: 120rpx;
			border: 4rpx solid #ffffff;
		}
		&__name {
			font-size: 42rpx;
			font-weight: bold;
			margin-left: 24rpx;
		}
	}
	&__card {
		padding: 24rpx 32rpx;
		border-radius: 20rpx;
		background-color: #fff;
		&__item {
			padding: 24rpx 0;
		}
	}
}
.cell--hover {
	background-color: #f8f8f8;
}
</style>
