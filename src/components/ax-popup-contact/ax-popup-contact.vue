<template>
	<u-popup :show="show" @close="close" @open="open" round="30rpx" closeable>
		<view class="flex flex-direction popup-contact">
			<u-skeleton :loading="loading" :rows="5">
				<view class="">选择入住人</view>
				
				<u-radio-group v-model="radioValue" :borderBottom="true" placement="column" iconPlacement="right">
					<u-radio label-color="#242424" label-size="16" :customStyle="{ padding: '16px 0' }" v-for="(item, index) in constactList" :key="index" :label="item.name" :name="item.name" @change="groupChange($event,index)"></u-radio>
				</u-radio-group>
				<view class="bottom-btn">
					<view class="bottom-btn__item">
						<u-button
							:customStyle="{ color: '#fff', borderRadius: '0rpx' }"
							color="#242424"
							loading-mode="semicircle"
							@click="onContactPage"
							text="新增入住人"
						></u-button>
					</view>
				</view>
			</u-skeleton>
		</view>
	</u-popup>
</template>

<script>
export default {
	name: 'ax-popup-contact',
	data() {
		return {
			radioValue: null,
			loading: true,
			constactList: null
		};
	},
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		close() {
			this.$emit("hide")
		},
		open() {
			this.getData();
		},
		async getData() {
			this.loading = true;
			let res = await this.$api.getUserPermanentResidentList();
			this.constactList = res.data;
			this.loading = false;
		},
		// 单选选择
		groupChange(value,index) {
			this.$emit("data",this.constactList[index])
			this.$emit("hide")
		},
		// 点击手动添加
		onContactPage(item) {
			this.$emit("hide")
			let url = '/pages/mine/add-contact';
			if (item != null) {
				url = url + `?id=${item.id}&name=${item.name}&phone=${item.phone}`;
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.popup-contact {
	height: calc(100vh - 360px);
	padding: 32rpx 32rpx;
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
