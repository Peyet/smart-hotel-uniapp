<template>
	<view class="">
		<view class="flex flex-direction">
			<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="true" :safe-area-inset-bottom="true">
				<template #top>
					<view class="flex flex-direction bg-white">
						<u-tabs
							lineColor="#D59E32"
							:active-style="{ color: '#D59E32', fontSize: '34rpx' }"
							:inactive-style="{ fontSize: '32rpx' }"
							:list="tabList"
							:scrollable="true"
							:current="current"
							@change="tabsChange"
						/>
					</view>
				</template>
				<view class="flex flex-direction container">
					<view class="order-card-item" v-for="(item, index) in dataList" :key="index">
						<ax-order-card :order="item" @refresh="$refs.paging.reload()"></ax-order-card>
					</view>
				</view>
			</z-paging>
		</view>
	</view>
</template>

<script>
import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';

export default {
	mixins: [ZPMixin],
	data() {
		return {
			tabList: [{ name: '全部' }, { name: '待支付' }, { name: '待入住' }, { name: '待评价' }, { name: '退款' },{ name: '待退押金' }],
			current: 0, // tabs组件的current值，表示当前活动的tab选项
			dataList: [],
			tabIndex: 0,
			status: [null, 'wait_pay', 'wait_live', 'complete', 'apply_refund','wait_refund']
		};
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		//tabs通知swiper切换
		tabsChange(index) {
			this.current = index.index;
			this.$refs.paging.reload();
		},
		queryList(pageNo, pageSize) {
			let status = this.$api.pageOrder({ page: pageNo, size: pageSize, status: this.status[this.current] }).then((res) => {
				if (res.code === 0) {
					this.$refs.paging.complete(res.data.records);
				}
			});
		}
	},
	onLoad(opt) {
		uni.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: '#ffffff',
			animation: {
				duration: 0,
				timingFunc: 'linear'
			}
		});
		this.current = opt.type ?? 0;
	},
	onShow() {
		this.$refs.paging.reload();
	}
};
</script>

<style lang="scss" scoped>
.swiper {
	height: 100%;
}

.container {
	padding: 0 32rpx;
}

.search-left-box {
	&__content {
		width: 432rpx;
		padding-left: 32rpx;
		height: 72rpx;
		background: #eeeeee;
		border-radius: 36rpx 36rpx 36rpx 36rpx;
	}
}

.order-card-item {
	margin-top: 24rpx;
	//&:not(:last-child) {
	//  margin-bottom: 24rpx;
	//}
}
.bg-white {
	background: white;
}
</style>
