<template>
	<view>
		<view class="container flex flex-direction">
			<view class="contact-form flex flex-direction">
				<view class="contact-form__item flex align-center justify-between">
					<view class="contact-form__item__title">姓名</view>
					<u--input border="none" placeholder="请输入姓名" v-model="name"></u--input>
				</view>
				<view class="contact-form__item flex align-center justify-between">
					<view class="contact-form__item__title">手机号</view>
					<u--input border="none" type="digit" placeholder="请输入手机号" v-model="phone"></u--input>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="bottom-btn__item">
				<u-button
					:customStyle="{ color: '#fff', borderRadius: '0rpx' }"
					:loading="loading"
					color="#242424"
					loading-mode="semicircle"
					@click="onSubmintData"
					text="保存"
				></u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			phone: '',
			loading: false,
			isAdd: true,
			id: ''
		};
	},
	methods: {
		async onSubmintData() {
			this.loading = true;
			let res = {};
			if (this.isAdd) {
				res = await this.$api.saveUserPermanentResident({ name: this.name, phone: this.phone });
			} else {
				res = await this.$api.updateUserPermanentResident(this.id, { name: this.name, phone: this.phone });
			}
			if (res.code === 0) {
				uni.showToast({
					title: '处理成功',
					icon: 'success'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 500);
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		}
	},
	onLoad(opt) {
		if (opt.id) {
			this.isAdd = false;
			this.id = opt.id;
			this.phone = opt.phone;
			this.name = opt.name;
		}
	}
};
</script>

<style lang="scss">
.container {
	padding: 24rpx 32rpx;
}
.contact-form {
	padding: 2rpx 32rpx;
	background-color: #fff;
	border-radius: 20rpx;
	&__item {
		padding: 30rpx 0;
		&__title {
			width: 140rpx;
			height: 42rpx;
			font-size: 30rpx;
			color: #0a1629;
			line-height: 42rpx;
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
	// background: #fff;
	display: flex;
	flex-direction: column;

	&__item {
		// width: 200rpx;
	}
}
</style>
