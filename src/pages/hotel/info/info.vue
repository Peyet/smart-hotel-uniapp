<template>
	<view>
		<view class="flex flex-direction" v-if="hotel != null">
			<view class="padding-container flex flex-direction">
				<view class="">{{ hotel.name }}</view>
				<view class="info-card flex justify-between font28">
					<view class="">
						<text class="info-color margin-right-xs">开业时间</text>
						<text>{{ hotel.openingTime }}</text>
					</view>
					<view class="">
						<text class="info-color margin-right-xs">装修时间</text>
						<text>{{ hotel.decorationTime }}</text>
					</view>
					<view class="flex justify-between">
						<view class="">
							<text class="info-color margin-right-xs">房间数量</text>
							<text>{{ hotel.roomCount || 0 }}间</text>
						</view>
					</view>
				</view>
			</view>
			<u-sticky bgColor="#fff">
				<u-tabs :list="titleList" :scrollable="false" @change="_changeTabs" lineColor="#D59E32"></u-tabs>
			</u-sticky>

			<view class="flex flex-direction hotel-des">
				<u-read-more ref="uReadMore" :toggle="true" show-height="250" color="#D59E32" close-text="展开全部">
					<rich-text :nodes='replaceText(hotel.introduce)'></rich-text>
						<!-- <u-parse :content="hotel.introduce" :tag-style="tagStyle"></u-parse> -->
				</u-read-more>
					<!-- <u-parse :content="hotel.introduce" :tag-style="tagStyle"></u-parse> -->
			</view>
			<view class="flex flex-direction hotel-device-tag">
				<ax-service-lable
					v-for="(item, index) in hotel.serviceTags"
					:title="item.name"
					:icon="item.icon"
					:lableList="item.items"
					v-if="hotel.serviceTags"
					:key="index"
				></ax-service-lable>
			</view>
			<view class="flex flex-direction hotel-service-tag">
				<ax-service-lable
					v-for="(item, index) in hotel.policyTags"
					:title="item.name"
					:icon="item.icon"
					:lableList="item.items"
					v-if="hotel.serviceTags"
					:key="index"
				></ax-service-lable>
			</view>
		</view>
		<view class="bottom-btn" v-if="showBtn">
			<view class="bottom-btn__item">
				<u-button class="margin-top-lg" :customStyle="{ color: '#fff', borderRadius: '0rpx' }" color="#242424" @click="_goHotelDetails" text="查看房型"></u-button>
			</view>
		</view>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
import AxDom from '@/utils/dom.js';

const dayjs = require('@/utils/dayjs.min.js');
export default {
	data() {
		return {
			scrollTop: 0,
			titleList: [
				{
					name: '酒店亮点'
				},
				{
					name: '设施服务'
				},
				{
					name: '酒店政策'
				}
			],
			// 这是一段很长的文字，也可能包含有HTML标签等内容
			content: null,
			hotel: null,
			showBtn: true,
			tagStyle:{
				img: "width:80%"
			}
		};
	},
	onLoad(params) {
		this.id = params.id;
		let data = JSON.parse(this.$st.getIndexPageData().localtion);
		console.log(data);
		if (this.id != null || this.id != '') {
			this.getDetails({ hotelId: this.id, longitude: data.longitude, latitude: data.latitude });
		}
		if (params.btn) {
			this.showBtn = false;
		}
	},
	methods: {
		_changeTabs(data) {
			this.$refs.uReadMore.init();
			this._initDomHeight();
			if (data.index === 0) {
				this._scrollDom('.hotel-des');
			}
			if (data.index === 1) {
				this._scrollDom('.hotel-device-tag');
			}
			if (data.index === 2) {
				this._scrollDom('.hotel-service-tag');
			}
			
		},
		_scrollDom(dom) {
			AxDom.pageScrollTo(dom, 0);
		},
		_initDomHeight() {
			uni.$u.getRect('.hotel-device-tag').then((res) => {
				console.log(res);
			});
		},
		_goHotelDetails() {
			uni.navigateBack({
				delta: 1
			});
		},
		getDetails(data) {
			this.$api.getHotelDetails(data).then((res) => {
				this.hotel = res.data;
				this.hotel.openingTime = dayjs(res.data.openingTime).format('YYYY年MM月');
				this.hotel.decorationTime = dayjs(res.data.decorationTime).format('YYYY年MM月');
				this.$refs.uReadMore.init();
			});
		},
		replaceText(t){
			return t.replace(/\<img/gi, '<img class="content-img"')
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	}
};
</script>
<style lang="scss">
page {
	background-color: $ax-bg-color;
}
.content-img {
  width: 80%;
}

</style>
<style lang="scss" scoped>
.padding-container {
	padding: 0 32rpx;
}

.info-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-row-gap: 24rpx;
	margin: 16rpx 0;
}

.hotel-des {
	background: #ffffff;
	opacity: 1;
	margin-bottom: 24rpx;
	padding: 32rpx;
}

.hotel-device-tag {
	padding: 32rpx;
	background: #ffffff;
	border-radius: 0rpx 0rpx 0rpx 0rpx;

	margin-bottom: 24rpx;
	opacity: 1;
}

.hotel-service-tag {
	padding: 32rpx;
	background: #ffffff;
	border-radius: 0rpx 0rpx 0rpx 0rpx;
	margin-bottom: calc(128rpx + var(--safe-area-inset-bottom));
}

.bottom-btn {
	padding: 12rpx 32rpx;
	padding-bottom: calc(12rpx + var(--safe-area-inset-bottom));
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	display: flex;
	justify-content: flex-end;

	&__item {
		width: 200rpx;
	}
}
</style>
