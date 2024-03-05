export default {
	setIndexPageData(data) {
		uni.setStorageSync("setIndexPageData", JSON.stringify(data))
	},
	getIndexPageData() {
		let data = uni.getStorageSync("setIndexPageData")
		if (data === "") {
			return null
		}
		return JSON.parse(data)
	},
	/**
	 * @param {Object} data {localtion:{},days:num,searchValue,startDate,endDate}
	 */
	setCreateParams(data) {
		uni.setStorageSync("setCreateParams", JSON.stringify(data))
	},
	getCreateParams(){
		let data = uni.getStorageSync("setCreateParams")
		if (data === "") {
			return {}
		}
		return JSON.parse(data)
	},
	login(tekenVo){
		uni.setStorageSync("TOKENVO", JSON.stringify(tekenVo))
	},
	getTokenVO(){
		let data = uni.getStorageSync("TOKENVO")
		if (data === "") {
			return null
		}
		return JSON.parse(data)
	},
	setUserInfo(userInfo){
		uni.setStorageSync("USERINFO", JSON.stringify(userInfo))
	},
	getUserInfo(){
		let data = uni.getStorageSync("USERINFO")
		if (data === "") {
			return null
		}
		return JSON.parse(data)
	},
	loginOut(){
		uni.removeStorageSync("USERINFO")
		uni.removeStorageSync("TOKENVO")
	}
}