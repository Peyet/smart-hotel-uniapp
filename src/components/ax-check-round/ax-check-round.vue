<template>
	<view>
		<uni-icons custom-prefix="ax-icon" type="ax-icon-round_check" color="#D59E32" :size="size" v-if="active"></uni-icons>
		<uni-icons custom-prefix="ax-icon" type="ax-icon-round" color="#B5B5B5" :size="size" v-if="!active"></uni-icons>
	</view>
</template>

<script>
export default {
	name: 'ax-check-round',
	data() {
		return {};
	},
	props: {
		active: {
			type: Boolean,
			default: false
		},
		size:{
			type:Number,
			default:20
		}
	}
};
</script>

<style lang="scss">
.round--check {
	width: 42rpx;
	height: 42rpx;
}
</style>
