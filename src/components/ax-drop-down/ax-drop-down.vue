<template>
	<view class="">
		<!-- 菜单地址 -->
		<view class="ax-drop-down">
			<view class="flex align-center ax-drop-down__params">
				<view class="flex align-center" @click="_showDropdown(0)">
					<uni-icons custom-prefix="ax-icon" type="ax-icon-dizhi" size="20" color="#D59E32"></uni-icons>
					<text class="font28 margin-left-xs">上海</text>
				</view>
				<view class="flex flex-direction font24 margin-left" @click="_showDropdown(0)">
					<view class="flex align-center">
						<text class="info-color">住</text>
						<text class="margin-left-xxs">04-05</text>
					</view>
					<view class="flex align-center margin-top-xs">
						<text class="info-color">离</text>
						<text class="margin-left-xxs">04-05</text>
					</view>
				</view>
				<ax-time-capsule class="margin24" :line="false"></ax-time-capsule>
				<u-line direction="col" length="35rpx"></u-line>

				<!-- 菜单排序 -->
				<view @click="_showDropdown(1)" class="flex font24 align-center margin-lr"> <text
						class=" margin-right-xs ax-drop-down__params__text "
						:class="[menuActive===1?'ax-drop-down__params__text--active':'']">推荐排序</text>
					<view :class="[menuActive===1?'ax-drop-down__params__icon--active':'']"
						class="ax-drop-down__params__icon flex align-center"><u-icon name="arrow-down-fill" size="12"
							color="#D2D2D2"></u-icon></view>
				</view>
				<!-- 菜单筛选 -->
				<view @click="_showDropdown(2)" class="flex font24 align-center"> <text
						class=" margin-right-xs ax-drop-down__params__text"
						:class="[menuActive===2?'ax-drop-down__params__text--active':'']">筛选</text>
					<view :class="[menuActive===2?'ax-drop-down__params__icon--active':'']"
						class="ax-drop-down__params__icon flex align-center"><u-icon name="arrow-down-fill" size="12"
							color="#D2D2D2"></u-icon></view>
				</view>
			</view>
			<!-- 筛选区域 -->
<!-- <view class="ax-drop-down__mask" v-show="dropdown" @click="_hideDropdown()"></view> -->
			<view class="ax-drop-down__filter"
				:class="[dropdown?'ax-drop-down__filter--active':'ax-drop-down__filter--hide']" v-show="dropdown">
				<!-- 排序1 -->
				<view class="flex flex-direction" v-if="menuActive===0">
					<view class="">45646546</view>
					<view class="">45646546</view>
					<view class="">45646546</view>
				</view>
				<view class="flex flex-direction" v-if="menuActive===1">
					<view class="" style="height: 200px;"></view>
				</view>
			</view>
		</view>


	</view>

</template>

<script>
	export default {
		name: "ax-drop-down",
		data() {
			return {
				dropdown: false,
				menuActive: 0,
				menuActiveData: {}
			};
		},
		methods: {
			_showDropdown(index) {
				this.menuActive = index
				this.dropdown = true
			},
			_hideDropdown() {
				this.menuActive = 0
				this.dropdown = false
			}
		},
		props: {
			show: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ax-drop-down {
		display: flex;
		flex-direction: column;
		width: 100%;
		z-index: 12;

		&__mask {
			z-index: 1;
			position: fixed;
			width: 100%;
			top: 0;
			bottom: 0;
			left: 0;
			background: rgba(0, 0, 0, .3);
		}

		&__params {
			margin-top: 24rpx;

			&__text {
				font-size: 26rpx;
				color: $ax-text-color-black;

				&--active {
					color: $ax-text-color-main;
				}
			}

			&__icon {
				// transform: rotate(0deg);
				transition-property: transform;
				transition-duration: 0.3s;
				transition-delay: 0s;
				transition-timing-function: linear;

				&--active {
					transform: rotate(180deg);

				}
			}
		}

		&__filter {
			transition-property: transform;
			transition-duration: 0.5s;
			transition-delay: 0s;
			transition-timing-function: linear;

			&--active {
				transform: translateY(0);
				transition-duration: 0.5s;
			}

			&--hide {
				transform: translateY(-100%);
				transition-duration: 0.5s;
				// height: 0;
			}
		}
	}
</style>