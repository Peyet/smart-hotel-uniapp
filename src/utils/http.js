import baseUrl from "@/common/url.config.js"
import st from "@/common/storage.js"
import Request from 'luch-request' // 使用npm

const http = new Request();
/**
 * @description 修改全局默认配置
 * @param {Function}
 */
http.setConfig((config) => {
    /* config 为默认全局配置*/
    config.baseURL = baseUrl; /* 根域名 */
    config.header = {
        'x-api-version': '1'
    }
    config.custom.loading = true
    return config
})

http.interceptors.request.use((config) => { // 可使用async await 做异步操作
    config.header = {
        ...config.header,
        a: 1 // 演示拦截器header加参
    }
    let tokenVO = st.getTokenVO()
    if (tokenVO) {
        config.header.Authorization = tokenVO.tokenValue
    }
    // 演示custom 用处
    // if (config.custom.auth) {
    //   config.header.token = 'token'
    // }
    if (config.custom.loading) {
        uni.showLoading({
            title: "努力加载中"
        })
    }
    /**
     /* 演示
     if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
     return Promise.reject(config)
     }
     **/
    return config
}, config => { // 可使用async await 做异步操作
    return Promise.reject(config)
})
http.interceptors.response.use((response) => {
    /* 对响应成功做点什么 可使用async await 做异步操作*/
    if (response.statusCode === 401) {
        toLogin()
    }
    let data = response.data
    //  if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
    //    return Promise.reject(response) // return Promise.reject 可使promise状态进入catch
    // if (response.config.custom.verification) { // 演示自定义参数的作用
    //   return response.data
    // }
    // console.log(data)
    uni.hideLoading()
    if (data.code != 0) {
        // uni.showToast({
        // 	title: data.msg,
        // 	icon: 'none'
        // });
        uni.showModal({
            title: '提示',
            content: data.msg,
            showCancel: false,
            cancelText: '',
            confirmText: '确认',
            success: res => {},
            fail: () => {},
            complete: () => {}
        });
    }
    return data
}, (response) => {
    /*  对响应错误做点什么 （statusCode !== 200）*/
    console.log(response)
    uni.hideLoading()
    if (response.statusCode === 401) {
        toLogin()
    }else{
        uni.showModal({
            title: '提示',
            content: response.data.msg,
            showCancel: false,
            cancelText: '',
            confirmText: '确认',
            success: res => {},
            fail: () => {},
            complete: () => {}
        });
    }
    // uni.showToast({
    // 	title: response.data.msg,
    // 	icon: 'none'
    // });


    return response.data
})

function toLogin() {
    uni.navigateTo({
        url: '/pages/login/login',
    });
}
export default http;