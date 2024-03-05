<template>
	<view class="ax-tag" :class="[isFlex?'ax-tag--flex':'ax-tag--inline']"
		:style="{background:bgColor,color:textColor}">
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "ax-tag",
		data() {
			return {

			};
		},
		props: {
			isFlex: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: "#F8F8F8"
			},
			textColor: {
				type: String,
				default: "#666666"
			}
		}
	}
</script>

<style lang="scss">
	.ax-tag {
		border-radius: 6rpx;
		padding: 0rpx 12rpx;
		font-size: 20rpx;
		// height: inherit
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
		margin: 0;
		&--flex {
			display: flex; 
		}

		&--inline {
			display: inline-block;
		}
	}
</style>