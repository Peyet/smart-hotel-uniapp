<template>
	<view class="flex flex-direction container">
		<u-skeleton :loading="loading" :rows="5">
			<view class="flex flex-direction align-center margin-top-lg" v-if="!constactList.length">
				<image src="../../static/business/not-data.svg" width="200"></image>
				<text class="font28 info-color">暂无数据</text>
			</view>
			<view class="contact__item flex align-center justify-between" @tap.stop="showAction(item)" v-for="(item, index) in constactList" :key="index" v-else>
				<view class="flex align-center">
					<text class="font32">{{ item.name }}</text>
					<text class="font28 margin-left-xs">{{ item.phone }}</text>
				</view>
				<u-icon name="arrow-right" size="18" color="#242424"></u-icon>
			</view>
		</u-skeleton>
		<u-action-sheet
			:actions="btnlist"
			:closeOnClickOverlay="true"
			:closeOnClickAction="false"
			@select="selectClick"
			@close="show = false"
			:show="show"
			cancel-text="取消"
		></u-action-sheet>
		<view class="bottom-btn">
			<view class="bottom-btn__item">
				<u-button :customStyle="{ color: '#fff', borderRadius: '0rpx' }" color="#242424" loading-mode="semicircle" @click="onContactPage" text="新增入住人"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			btnlist: [
				{
					name: '删除',
					color: '#F30000'
				},
				{
					name: '修改',
					color: '#242424'
				}
			],
			show: false,
			constactList: [],
			loading: true,
			pageState: {
				id: '',
				item: {}
			}
		};
	},
	methods: {
		showAction(item) {
			this.show = true;
			this.pageState.id = item.id;
			this.pageState.item = item;
		},
		selectClick(e) {
			this.show = false;
			if (e.name == '修改') {
				this.onContactPage(this.pageState.item);
			}
			if (e.name == '删除') {
        uni.showModal({
          title: '提示',
          content: '确定删除吗？',
          success: (res) => {
            if (res.confirm) {
              this.deleteData(this.pageState.id)
            }
          }
        })
				// this.deleteData(this.pageState.id)
			}
		},
		async getData() {
			this.loading = true;
			let res = await this.$api.getUserPermanentResidentList();
			this.constactList = res.data;
			this.loading = false;
		},
		onContactPage(item) {
			
			let url = '/pages/mine/add-contact';
			if (item != null) {
				url = url + `?id=${item.id}&name=${item.name}&phone=${item.phone}`;
			}
			uni.navigateTo({
				url: url
			});
		},
		async deleteData(id) {
			let res = await this.$api.delteUserPermanentResident(id);
			if (res.code === 0) {
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				});
				setTimeout(() => {
					this.getData();
				}, 500);
			}
		}
	},
	onShow() {
		this.getData();
	}
};
</script>

<style lang="scss">
.container {
	padding: 24rpx 32rpx;
}
.contact {
	&__item {
		height: 104rpx;
		background: #ffffff;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
		padding: 0 32rpx;
		&:not(:last-child) {
			margin-bottom: 24rpx;
		}
	}
}
.bottom-btn {
	padding: 12rpx 32rpx;
	padding-bottom: calc(12rpx + var(--safe-area-inset-bottom));
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	// background: #fff;
	display: flex;
	flex-direction: column;

	&__item {
		// width: 200rpx;
	}
}
</style>
