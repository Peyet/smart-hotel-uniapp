<template>
	<view class="ax-rate-capsule">
		<view class="ax-rate-capsule__content" :class="text?'bg-color':''">
			<text class="ax-rate-capsule__content__text">{{getText(rate)}}</text>
			<view class="ax-rate-capsule__content__rate">
				<uni-icons customPrefix="ax-icon" type="ax-icon-wujiaoxing" size="15" color="#FADEAB"></uni-icons>
				<text class="ax-rate-capsule__content__rate__number">{{rate}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "ax-rate-capsule",
		data() {
			return {

			};
		},
		props: {
			text: {
				type: String,
				default: ""
			},
			rate: {
				type: String,
				default: "4.0"
			}
		},
		computed: {
			/**
			 * 获取文字
			 */

		},
		methods: {
			getText() {	
				return this.text !== '' ? this.text : t
			},
			getText(rate){
			  switch (rate) {
			    case '4.9':
			      return '超棒'
			    case '4.8':
			      return '棒'
			    case '4.7':
			      return '很好'
			    case '4.6':
			      return '好'
			    case '4.5':
			      return '不错'
			    default:
			      return '不错'
			  }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg-color {
		background-color: #FADEAB;
	}

	.ax-rate-capsule {
		display: flex;
		align-items: center;
		flex-direction: column;

		&__content {

			height: 46rpx;
			border-radius: 30rpx;
			display: flex;
			align-items: center;
			position: relative;

			&__text {
				margin-left: 112rpx;
				font-size: 24rpx;
				color: #3D3D3D;
				margin-right: 16rpx;
				font-weight: 500;
			}

			&__rate {
				position: absolute;
				top: 0;
				left: 0;
				width: 96rpx;
				height: 46rpx;
				background: #242424;
				border-radius: 30rpx 4rpx 20rpx 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				&__number {
					font-size: 24rpx;
					color: #FADEAB;
				}
			}
		}
	}
</style>