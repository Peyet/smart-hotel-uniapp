<!-- 时间胶囊 -->
<template>
	<view class="ax-time-capsule">
		<view class="ax-time-capsule--line" :style="{background: color}"  v-if="line"></view>
		<view class="ax-time-capsule__content" :style="{border: `2rpx solid ${color}`,color:color}" >{{text}}</view>
		<view class="ax-time-capsule--line" :style="{background: color}"  v-if="line"></view>
	</view>
</template>

<script>
	export default {
		name: "ax-time-capsule",
		props: {
			text: {
				type: String,
				default: "3晚"
			},
			line: {
				type: Boolean,
				default: true
			},
			color:{
				type: String,
				default: "#999999"
			},
			textColor:{
				type: String,
				default: "#999999"
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.ax-time-capsule {
		display: flex;
		align-items: center;

		&--line {
			height: 1rpx;
			width: 20rpx;
		}

		&__content {
			padding: 4rpx 24rpx;
			font-size: 24rpx;
			border-radius: 28rpx;
		}
	}
</style>