export default {

	pageScrollTo(dom, duration) {
		const query = uni.createSelectorQuery();
		query.select(dom).boundingClientRect((data) => {
			let pageScrollTop = Math.round(data.top)
			uni.pageScrollTo({
				scrollTop: pageScrollTop, //滚动的距离
				duration: duration, //过渡时间
			})
		}).exec()
	}
}