<template>
	<view>
		<view class="login">
			<view class="login__content">
				<image class="login__content__image" src="/static/logo.png"></image>
				<text class="login__content__title">欢迎登录SmartHotel</text>
				<ax-button class="mt96" type="primary" width="622rpx" height="96rpx" @click="login">
					<u-icon name="weixin-fill" color="#ffffff" size="24"></u-icon>
					<text class="ml32 size32">微信登录</text>
				</ax-button>
				<ax-button class="mt32" color="#D2D2D2" width="622rpx" height="96rpx" @click="backHome">
					<text class="size32" style="color: #999999">取消</text>
				</ax-button>
			</view>
			<view class="login__protocol">
				<u-checkbox-group v-model="checkboxValue">
					<u-checkbox activeColor="#242424" name="ok"></u-checkbox>
				</u-checkbox-group>
				<text class="login__protocol__text">
					注册登录即表示同意
					<text style="color: #d59e32" @click="goWeb('UserPrivacyTerms')">用户协议</text>
					和
					<text style="color: #d59e32" @click="goWeb('UserPrivacyPolicy')">隐私政策</text>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			checkboxValue: ['ok']
		};
	},
	methods: {
		goWeb(key){
			uni.navigateTo({
				url:"/pages/web/web?key="+key
			})
		},
		onClick_1() {
			alert(1);
		},
		backHome() {
			uni.switchTab({
				url:"/pages/index/index"
			})
		},
		async login() {
			await uni.login({
				provider: 'weixin', //使用微信登录
				success: async (loginRes) => {
					if (loginRes.code) {
						let data = await this.$api.login(loginRes.code);
						this.$st.login(data.data);
						if (data.code === 0) {
							this.back();
						}
					}
				}
			});
		},
		back() {
			let pages = getCurrentPages();
			console.log();
			if (pages.length > 1) {
				if(pages[0].route.startsWith("pages/web")){
					uni.switchTab({
						url: '/pages/index/index'
					});
				}else{
					uni.navigateBack({
						delta: 1
					});
				}
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	},
	onLoad() {
		uni.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: '#ffffff',
			animation: {
				duration: 0,
				timingFunc: 'linear'
			}
		});
	}
};
</script>

<style>
page {
	background-color: #fff;
}
</style>

<style lang="scss" scoped>
.login {
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	&__content {
		margin-top: 168rpx;
		margin-bottom: 96rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		&__image {
			width: 160rpx;
			height: 160rpx;
			background: #d8d8d8;
			border-radius: 30rpx 30rpx 30rpx 30rpx;
		}
		&__title {
			margin-top: 32rpx;
			font-size: 40rpx;
			font-weight: 400;
			color: #242424;
			line-height: 56rpx;
		}
	}
	&__protocol {
		padding-bottom: calc(12rpx + var(--safe-area-inset-bottom));
		display: flex;
		align-items: center;
		&__text {
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
			line-height: 36rpx;
		}
	}
}
.mt96 {
	margin-top: 96rpx;
}
.mt32 {
	margin-top: 32rpx;
}
.ml32 {
	margin-right: 32rpx;
}
.size32 {
	font-size: 32rpx;
}
</style>
