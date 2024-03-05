<template>
	<view class="flex flex-direction">
		<view class="flex margin-top-xl flex-direction container">
			<!-- 头像选择 -->
			<u-skeleton :loading="loading" title :rows="5">
				<view class="wam__avatar">
					<view class="button-shadow">
						<button class="button" open-type="chooseAvatar" @chooseavatar="chooseAvatarEvent">
							<view v-if="userInfo.avatar" class="avatar__image">
								<image class="image" :src="userInfo.avatar" mode="aspectFill"></image>
							</view>
							<view v-else class="avatar__empty">
								<image
									class="image"
									src="/static/avatar.webp"
									mode="aspectFill"
								></image>
							</view>
							<view class="avatar--icon">
								<uni-icons custom-prefix="ax-icon" type="ax-icon-xiangji" size="20" color="#fff"></uni-icons>
							</view>
						</button>
					</view>
				</view>
				<!-- 昵称输入 -->
				<view class="flex flex-direction">
					<text class="font24 info-color margin-left-xs">昵称</text>
					<view class="wam__nickname">
						<view class="nickname__data">
							<input class="input" type="nickname" v-model="userInfo.nickname"  placeholder="请输入昵称" placeholder-style="color: #AAAAAA;" />
						</view>
					</view>
				</view>
			</u-skeleton>
			<!-- 保存按钮 -->
			<view
				class="wam__submit-btn"
				:class="[
					{
						disabled: !userInfo.avatar || !userInfo.nickname
					}
				]"
				hover-class="tn-btn-hover-class"
				:hover-stay-time="150"
				@tap.stop="submitUserInfo"
			>
				保 存
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showAuthorizationModal: false,
			userInfo: {
				avatar: '',
				nickname: ''
			},
			user: null,
			loading: false
		};
	},
	onLoad() {
		this.getData();
	},
	methods: {
		// 头像选择
		async chooseAvatarEvent(e) {
			await uni.showLoading({
			    title: '上传中',
			    mask: true
			  })
			  const res =  await this.$api.uploadAvatar(e.detail.avatarUrl)
			  console.log(res)
			  if (res.code == 0){
			    this.userInfo.avatar = res.data?.fileUrl
				this.$api.updateUserInfo(this.userInfo).then((res) => {
					if (res.code === 0) {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						});
						this.user.avatar = this.userInfo.avatar;
						this.user.nickname = this.userInfo.nickname;
						this.$st.setUserInfo(this.user);
					}
				});
			  }else {
			    await uni.showToast({
			      icon: 'error',
			      title: res.msg
			    });
			  }
			  uni.hideLoading()
		},

		// 更新用户信息
		submitUserInfo() {
			// 判断是否已经选择了用户头像和输入了用户昵称
			if (!this.userInfo.avatar) {
				return uni.showToast({
					icon: 'none',
					title: '请选择头像'
				});
			}
			if (!this.userInfo.nickname) {
				return uni.showToast({
					icon: 'none',
					title: '请输入用户信息'
				});
			}
			this.$api.updateUserInfo(this.userInfo).then((res) => {
				if (res.code === 0) {
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					this.user.avatar = this.userInfo.avatar;
					this.user.nickname = this.userInfo.nickname;
					this.$st.setUserInfo(this.user);
				}
			});
			// 更新完成事件
		},
		getData() {
			this.loading = true;
			let us = this.$st.getUserInfo();
			this.user = us;
			this.userInfo.avatar = us.avatar;
			this.userInfo.nickname = us.nickname;
			this.loading = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding: 32rpx;
}
.image {
	width: 100%;
	height: 100%;
	border-radius: inherit;
}

.wam {
	/* 头像选择 */
	&__avatar {
		width: 100%;
		margin-top: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.button-shadow {
			border: 8rpx solid rgba(255, 255, 255, 0.05);
			box-shadow: 0rpx 0rpx 80rpx 0rpx rgba(0, 0, 0, 0.15);
			border-radius: 50%;
		}

		.button {
			position: relative;
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			overflow: visible;
			background-image: repeating-linear-gradient(45deg, #e4e9ec, #f8f7f8);
			color: #ffffff;
			background-color: transparent;
			padding: 0;
			margin: 0;
			font-size: inherit;
			line-height: inherit;
			border: none;

			&::after {
				border: none;
			}
		}

		.avatar {
			&__empty,
			&__image {
				width: 100%;
				height: 100%;
				border-radius: inherit;
			}

			&--icon {
				position: absolute;
				right: -10rpx;
				bottom: -6rpx;
				width: 60rpx;
				height: 60rpx;
				// transform: translate(50%, 50%);
				background-color: #1d2541;
				color: #ffffff;
				border-radius: 50%;
				border: 6rpx solid #ffffff;
				line-height: 1;
				font-size: 36rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	/* 昵称 */
	&__nickname {
		.nickname {
			&__data {
				margin-top: 16rpx;
				padding: 26rpx 20rpx;
				border-radius: 10rpx;
				background-color: #ffffff;

				.input {
					color: #080808;
				}
			}
		}
	}

	/* 保存按钮 */
	&__submit-btn {
		background-color: #242424;
		color: #ffffff;
		margin-top: 60rpx;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		&.disabled {
			background-color: #e6e6e6;
		}
	}
}
</style>
