<template>
	<view class="ax-lable" :class="[vertical?'ax-lable--vertical':'ax-lable--horizontal']" @click="onClick">
		<uni-icons custom-prefix="ax-icon" :type="icon" size="18" color="#242424"></uni-icons>
		<text class="ax-lable__title">{{title}}</text>
	</view>
</template>

<script>
	export default {
		name: "ax-lable",
		data() {
			return {

			};
		},
		props: {
			title: {
				type: String,
				default: "前台服务"
			},
			icon: {
				type: String,
				default: "ax-icon-hour24"
			},
			vertical: {
				type: Boolean,
				default: true
			}
		},
		methods:{
			onClick(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.ax-lable {
		display: flex;

		&--vertical {
			flex-direction: column;
			align-items: center;
		}

		&--horizontal {
			flex-direction: row;
		}
		&__title{
			height: 36rpx;
			font-size: 26rpx;
			font-weight: normal;
			color: #242424;
			line-height: 36rpx;
		}
	}
</style>