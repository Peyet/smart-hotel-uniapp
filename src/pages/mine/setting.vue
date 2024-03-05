<template>
	<view class="flex flex-direction container">
		<view class="ax-card margin-top">
			<view class="ax-card__cell flex align-center justify-between" @click="goWeb('UserPrivacyTerms')">
				<view class="flex align-center">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-yinsitiaokuan" size="20"></uni-icons>
					<text class="font28 margin-left-sm">用户隐私条款</text>
				</view>
				<u-icon name="arrow-right" color="#242424"></u-icon>
			</view>
			<view class="ax-card__cell flex align-center justify-between" @click="goWeb('UserPrivacyPolicy')">
				<view class="flex align-center">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-anquan" size="20"></uni-icons>
					<text class="font28 margin-left-sm">隐私政策</text>
				</view>
				<u-icon name="arrow-right" color="#242424"></u-icon>
			</view>
			<view class="ax-card__cell flex align-center justify-between" @click="showToast">
				<view class="flex align-center">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-gengxin" size="20"></uni-icons>
					<text class="font28 margin-left-sm">版本更新</text>
				</view>
				<u-icon name="arrow-right" color="#242424"></u-icon>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="bottom-btn__item">
				<u-button class="margin-top-lg" :customStyle="{ color: '#fff', borderRadius: '0rpx' }" :loading="loading" color="#F30000" loading-mode="semicircle" @click="loginOut"  text="退出登录"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading:false
		};
	},
	methods:{
		goWeb(key){
			uni.navigateTo({
				url:"/pages/web/web?key="+key
			})
		},
		showToast(){
			uni.showToast({
				title: '当前已是最新版本',
				icon: 'none'
			});
		},
		loginOut(){
			uni.showModal({
				title: '提示',
				content: '是否退出登录？',
				showCancel: true,
				cancelText: '点错了',
				confirmText: '我意已决',
				success: res => {
					if(res.confirm){
						this.loading = true
						this.$st.loginOut()
						this.loading = false
						uni.switchTab({
							url:"/pages/index/index"
						})
					}
				},
				fail: () => {},
				complete: () => {}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding: 0 32rpx;
}
.bottom-btn {
	padding: 12rpx 32rpx;
	padding-bottom: calc(12rpx + var(--safe-area-inset-bottom));
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	// background: #fff;
	display: flex;
	flex-direction: column;

	&__item {
		// width: 200rpx;
	}
}
.cell--hover {
	background-color: #f8f8f8;
}
</style>
