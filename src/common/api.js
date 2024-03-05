import http from "@/utils/http.js"
import baseUrl from "@/common/url.config.js"
import st from "@/common/storage.js"

export default {

	getBanner() {
		return http.get("/ma/home")
	},
	getHotel(params) {
		return http.get("/ma/hotel", {
			params: params
		})
	},
	// 获取酒店详情
	getHotelDetails(params) {
		return http.get("/ma/hotel/detail", {
			params: params
		})
	},
	getHotelConfig(id) {
		return http.get("/ma/hotel/config?hotelId=" + id)
	},
	// 获取当前酒店全日房空闲房型
	getAvailableRoomType(id, startTime, endTime) {
		return http.get("/ma/hotel/room/day/available", {
			params: {
				hotelId: id,
				startTime: startTime,
				endTime: endTime
			}
		})
	},
	// 获取全日房价格
	getCreateOrderPrice(data) {
		return http.post("/ma/order/create/day/price", data)
	},
	getCreateOriginalOrderPrice(data) {
		return http.post("/ma/order/renew/original/price", data)
	},
	// 支付订单
	getPayParams(data) {
		return http.post("/ma/pay/applet", data)
	},
	// 登录
	login(code) {
		return http.post(`/ma/login/mp/auth/${code}`)
	},
	getOpenId(code) {
		return http.get(`/ma/login/oauth/code?code=${code}`)
	},
	// 获取登录信息
	getUser(id) {
		return http.get("/ma/user/auth/info", {
			custom: {
				loading: false
			}
		})
	},
	// 创建订单 /create/day
	createOrder(data) {
		return http.post("/ma/order/create/day", data)
	},
	renewOrder(data) {
		return http.post("/ma/order/renew/day", data)
	},
	// 查询订单列表
	pageOrder(params) {
		return http.get("/ma/order/page", {
			params: params
		})
	},
	// 查看订单详情
	getOrderDetails(orderId) {
		return http.get("/ma/order/detail", {
			params: {
				orderId: orderId
			}
		})
	},
	// 查看房型详情
	getRoomTypeDetail(id) {
		return http.get("/ma/hotel/room/type/detail", {
			params: {
				id: id
			}
		})
	},
	//  获取开门使用记录
	getBindRoomList() {
		return http.get("/ma/room/bind", {
			custom: {
				loading: false
			}
		})
	},
	// 绑定记录
	bindRoom(id) {
		return http.post(`/ma/room/bind?useId=${id}`)
	},
	// 分享记录
	shareUseRecord() {

	},
	// 查看记录
	getUseRecord(id) {
		return http.get("/ma/room/record", {
			params: {
				orderId: id
			}
		})
	},
	// 是否绑定
	isBindRoom(id) {
		return http.get("/ma/room/bind/status", {
			params: {
				useId: id
			}
		})
	},
	//  获取订单基本信息
	getOrderBase(id) {
		return http.get("/ma/order/base", {
			params: {
				orderId: id
			}
		})
	},
	// 取消订单
	cancelNoPayOrder(id) {
		return http.post("/ma/order/cancel?orderId=" + id)
	},
	// 退房
	checkOutRoom(id) {
		return http.post("/ma/order/out?orderId=" + id)
	},
	// 更新用户信息
	updateUserInfo(data) {
		return http.put("/ma/user", data)
	},
	// 获取订阅
	getSubscribe() {
		return http.get("/ma/order/notice/subscribe")
	},
	// 获取系统参数
	getSystemOptions(key) {
		return http.get(`/ma/system/options/${key}/auto`)
	},
	//用户常住人列表
	getUserPermanentResidentList() {
		return http.get('/ma/user/permanent/resident')
	},
	// 添加用户常住人、
	saveUserPermanentResident(data) {
		return http.post("/ma/user/permanent/resident", data)
	},
	//删除指定ID的用户常住人
	delteUserPermanentResident(id) {
		return http.delete(`/ma/user/permanent/resident/${id}`)
	},
	//更新指定ID的用户常住人
	updateUserPermanentResident(id, data) {
		return http.put(`/ma/user/permanent/resident/${id}`, data)
	},
	// 系统界面 UserPrivacyTerms UserPrivacyPolicy
	getSystemPage(key) {
		return http.get(`/ma/system/page/${key}`)
	},
	uploadAvatar(file) {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: baseUrl + "/ma/upload/avatar",
				filePath: file,
				name: 'file',
				header: {
					"Authorization": st.getTokenVO().tokenValue
				},
				success: (uploadFileRes) => {
					resolve(JSON.parse(uploadFileRes.data));
				},
				fail: (err) => {
					reject(err);
				}
			});
		})
	},
	//获取关注二维码
	getSubscribeQrCode() {
		return http.get('/ma/wx/mp/qrcode/subscribe')
	},
	// 用户绑定公众号
	userBindMp(id) {
		return http.post("/ma/user/bind/map?mpOpenId=" + id)
	},
	// 提交打扫房间
	postCleanRoom(data) {
		return http.post("/ma/room/clean", data)
	},
	getCleanRoom() {
		return http.get("/ma/room/clean")
	},
	// 查询人脸识别插件记录
	getFacePlugin(id) {
		return http.get("/ma/face/plugin?recordId=" + id)
	},
	// 处理人脸识别插件记录
	handleFacePlugin(id, process) {
		return http.post("/ma/face/plugin/handle", {
			process: process,
			id: id
		})
	},
	// 人脸识别支付
	createFacePluginPay(recordId, openId) {
		return http.get("/ma/face/plugin/pay", {
			params: {
				recordId: recordId,
				openId: openId
			}
		})
	},
	// /generate/token
	generateFacePluginToken(recordId, info) {
		return http.post(`/ma/face/plugin/generate/token/${recordId}`, info)
	},
	// 绑定公众号
	bindUserMp(mpOpenId) {
		return http.get("/ma/user/bind/mp", {
			params: {
				openId: mpOpenId
			}
		})
	}
}