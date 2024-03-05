<template>
	<scroll-view scroll-x="true" class="ax-lables">
		<view class="ax-lables__item" v-for="(item,index) in list" :key="index" v-if="list">{{item}}</view>
		<view class="ax-lables__item" v-else>暂无标签</view>
	</scroll-view>
</template>

<script>
	export default {
		name: "ax-lables",
		data() {
			return {
			};
		},
		props:{
			list:[]
		}
	}
</script>

<style lang="scss">
	.ax-lables {
		white-space: nowrap;
		overflow: hidden;
		&__item {
			display: inline-block;
			font-size: 26rpx;
			height: 30rpx;
			line-height: 30rpx;
			color: #999999;
			text-align: center;
			padding: 0 10rpx;
			&:not(:last-child){
				border-right: 1rpx #999999 solid;
			}
				
			// &:not(:last-child):after {
			// 	content: '';
			// 	display: inline-block;
			// 	align-items: center;
			// 	margin-left: 10rpx;
			// 	width: 2rpx;
			// 	height: 24rpx;
			// 	text-align: center;
			// 	background-color: #999999;
			// }
		}
	}
</style>