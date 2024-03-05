<template>
	<view class="container flex flex-direction">
		<view class="contact-form flex flex-direction">
			<view class="contact-form__item flex align-center justify-between">
				<view class="contact-form__item__title">姓名</view>
				<view class="flex w-221">
					<input placeholder="请输入姓名" v-model="info.name" type="text" />
				</view>
			</view>
			<view class="contact-form__item flex align-center justify-between">
				<view class="contact-form__item__title">身份证号码</view>
				<view class="flex w-221">
					<input placeholder="请身份证号码" v-model="info.idNo" type="idcard" />
				</view>
			</view>
			<view class="contact-form__item flex align-center justify-between">
				<view class="contact-form__item__title">详细地址</view>
				<view class="flex w-221">
					<textarea v-model="info.address" placeholder="请输入您的地址信息" auto-height></textarea>
				</view>
				<!-- <u--input border="none" type="address" placeholder="请输入您的地址信息" v-model="info.address"></u--input> -->
			</view>
			<view class="contact-form__item flex align-center ">
				<view class="contact-form__item__title">名族信息</view>
				<view class="flex align-center w-221 justify-between" v-if="false">
					<view @click="show=true">{{ info.nation == null ? '选择名族信息' : info.nation }}</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view class="flex">
					<picker mode="selector" :range="columns" @change="onConfirmPicker">
						<view class="flex">
							<view>{{ info.nation == null ? '选择名族信息' : info.nation }}</view>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</picker>
				</view>
			</view>

		</view>
		<!-- <u-picker :show="show" :columns="columns" title="选择名族" @confirm="onConfirmPicker" @cancel="hidePicker"></u-picker> -->
		<view class="bottom-btn">
			<view class="bottom-btn__item">
				<u-button :customStyle="{ color: '#fff', borderRadius: '0rpx' }" :loading="loading" color="#242424"
					loading-mode="semicircle" @click="onSubmitData" text="开始认证"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {},
				id: null,
				loading: false,
				show: false,
				columns: ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族",
					"哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族",
					"土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族",
					"乌孜别克",
					"俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族",
					"其它"
				],
				index: 0,


			};
		},
		onLoad(opt) {
			this.id = opt.id
		},
		methods: {
			async onSubmitData() {
				if (this.info.name === "" || this.info.name == null) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return
				}
				if (this.info.idNo === "" || this.info.idNo == null) {
					uni.showToast({
						title: '请输入身份证号码',
						icon: 'none'
					})
					return
				}
				if (this.info.address === "" || this.info.address == null) {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					})
					return
				}
				if (this.info.nation === "" || this.info.nation == null) {
					uni.showToast({
						title: '请选择名族信息',
						icon: 'none'
					})
					return
				}
				this.loading = true
				let res = await this.$api.generateFacePluginToken(this.id, this.info)
				this.loading = false
				if(res.code == 0){
					uni.redirectTo({
						url:"/pages/face/web?id="+this.id
					})
				}

			},
			hidePicker() {
				this.show = false
			},
			onConfirmPicker(val) {
				console.log(val.detail.value);
				this.index = val.detail.value
				this.info.nation = this.columns[this.index]
			}
		},
	}
</script>

<style lang="scss">
	.container {
		padding: 40rpx 32rpx;
	}

	.contact-form {
		padding: 2rpx 32rpx;
		background-color: #fff;
		border-radius: 20rpx;

		&__item {
			padding: 30rpx 0;

			&__title {
				width: 180rpx;
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

	.w-221 {
		width: 442rpx;
	}
</style>