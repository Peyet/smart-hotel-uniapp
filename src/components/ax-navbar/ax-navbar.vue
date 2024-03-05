<template>
	<view class="ax-navbar">
		<view class="ax-navbar__placeholder" :style="{ height: navHeight() }"></view>
		<view class="ax-navbar--flexd">
			<image :src="imageUrl" :style="{clip: imageStyle()}"  mode="widthFix" class="nav-bg-image" v-if="imageUrl != ''" ></image>
			<view style="width: 100%" :style="{ height: infoHeight() }"></view>
			<view class="ax-navbar__content" :style="{ height: $u.addUnit(height) }">
				<view class="ax-navbar__content__left" hover-class="ax-navbar__content__left--hover"></view>
				<slot name="content">
					<text class="ax-navbar__content__title">456465465</text>
				</slot>
				<view class="ax-navbar__content__right">
					<text class="ax-navbar__content__right__text"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'ax-navbar',
	props: {
		// 导航栏高度
		height: {
			type: [String, Number],
			default: 44
		},
		imageUrl: {
			type: String,
			default: ''
		},
		// 导航栏背景色
		bgColor: {
			type: String,
			default: '#ffffff'
		}
	},
	methods: {
		navHeight() {
			return uni.$u.addUnit(uni.$u.getPx(this.height) + uni.$u.sys().statusBarHeight, 'px');
		},
		infoHeight() {
			return uni.$u.addUnit(uni.$u.sys().statusBarHeight, 'px');
		},
		imageStyle() {
			let style = `rect(0px, 100% ,${this.navHeight()},0px);`;
			return style;
		}
		
	},
	computed:{
		
	},
	onLoad() {
		console.log(this.imageStyle());
	}
};
</script>

<style lang="scss" scoped>
.ax-navbar__placeholder {
	width: 100%;
	// background-color: $uni-border-color;
}

.ax-navbar {
	&--flexd {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 12;
		overflow: hidden;
	}

	&__content {
		display: flex;
		align-items: center;
		// background-color: #9acafc;
		position: relative;
		justify-content: center;

		&__left,
		&__right {
			padding: 0 13px;
			position: absolute;
			top: 0;
			bottom: 0;
			display: flex;
			align-items: center;
		}

		&__left {
			left: 0;

			&--hover {
				opacity: 0.7;
			}

			&__text {
				font-size: 15px;
				margin-left: 3px;
			}
		}

		&__title {
			text-align: center;
			font-size: 16px;
			color: $u-main-color;
		}

		&__right {
			right: 0;

			&__text {
				font-size: 15px;
				margin-left: 3px;
			}
		}
	}
}

.nav-bg-image {
	position: absolute;
	width: 100%;
	top: 0;
	right: 0;
	left: 0;
}
</style>
