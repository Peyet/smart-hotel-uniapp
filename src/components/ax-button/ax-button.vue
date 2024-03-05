<template>
	<view class="ax-button" :style="[_getStyle]" :hover-class="`ax-button__${type}--hover`" @click="click">
		<slot>
			{{ content }}
		</slot>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {
		_getStyle() {
			let style = {};
			if (!this.flex) {
				style.width = uni.$u.addUnit(this.width, 'rpx');
			}
			style.height = uni.$u.addUnit(this.height, 'rpx');
			if (this.type === 'default') {
				// style += `color:#242424;`;
				// style += `background:#fff;`;
				style.color = this.color;
				style.background = '#fff';
				style.borderColor = this.color;
			} else {
				// style += `color:#fff;`;
				// style += `background:#242424;`;
				style.color = '#fff';
				style.background = '#242424';
			}
			if(this.round){
				style.borderRadius = uni.$u.addUnit((this.height ), 'rpx');
			}
			style.fontSize = uni.$u.addUnit(this.size, 'rpx');
			return uni.$u.addStyle(style);
		}
	},
	methods: {
		click() {
			if (this.custom) {
				this.fun;
			}
			this.$emit('click');
		}
	},
	props: {
		// 按钮类型 primary / default
		type: {
			type: String,
			default: 'default'
		},
		// 按钮宽度
		width: {
			type: [String, Number],
			default: 160
		},
		// 按钮内容
		content: {
			type: String,
			default: '按钮'
		},
		// 按钮flex
		flex: {
			type: Boolean,
			default: false
		},
		height: {
			type: [String, Number],
			default: 60
		},
		color: {
			type: String,
			default: '#242424'
		},
		fun: {
			type: Function,
			default: null
		},
		custom: {
			type: Boolean,
			default: false
		},
		round:{
			type: Boolean,
			default: false
		},
		size:{
			type: [String, Number],
			default: 28
		}
	}
};
</script>

<style lang="scss" scoped>
.ax-button {
	height: 60rpx;
	border-radius: 0rpx 0rpx 0rpx 0rpx;
	opacity: 1;
	border: 1rpx solid #242424;
	display: flex;
	align-items: center;
	justify-content: center;
	&__default {
		&--hover {
			opacity: 0.7;
		}
	}
	&__primary {
		&--hover {
			opacity: 0.8;
		}
	}
}
</style>
