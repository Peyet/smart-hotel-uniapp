<template>
	<view class="ax-service-lable">
		<view class="ax-service-lable__title">
			<uni-icons custom-prefix="ax-icon" :type="icon" size="18" color="#242424"></uni-icons>
			<text>{{title}}</text>
		</view>
		<view class="ax-service-lable__content"
			:class="isOne()?'ax-service-lable__content--one':'ax-service-lable__content--two'">
			<block v-if="!lableList.length">
				<view class="ax-service-lable__content__item" >快递服务</view>
				<view class="ax-service-lable__content__item">年龄限制：不允许18岁以下的单独办理入住</view>
			</block>
			<block v-else>
				<view class="ax-service-lable__content__item" :key="index" v-for="(item,index) in lableList">{{item}}</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ax-service-lable",
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
			lableList: {
				type: Array,
				default: []
			}
		},
		methods: {
			isOne() {
				return this.lableList.length <= 1
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ax-service-lable {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-bottom: 32rpx;
		&__title {
			display: flex;
			align-items: center;
			width: 100%;

			& text {
				height: 40rpx;
				font-size: 28rpx;
				font-weight: normal;
				white-space: nowrap;
				color: #242424;
				line-height: 40rpx;
				margin-left: 16rpx;
			}

		}

		&__content {
			width: 582rpx;
			margin-top: 20rpx;
			display: grid;

			grid-row-gap: 16rpx;
			font-size: 26rpx;
			font-weight: normal;

			&--two {
				grid-template-columns: repeat(2, 1fr);
			}

			&--one {
				grid-template-columns: repeat(1, 1fr);
			}

			&__item {
				line-height: 30rpx;
				height: 30rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>