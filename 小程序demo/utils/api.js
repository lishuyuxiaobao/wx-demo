const sayHi = () => {
    console.log("早上好")

}
const baseUrl = "https://elm.cangdu.org/";
const get = function (url, data) {
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    return new Promise(function (resolve, reject) {
        // resolve();
        wx.request({
            url: baseUrl + url,
            data,
            dataType: "json",
            header: {
                'content-type': 'application/json'  //只针对豆瓣  去掉json
            },
            success: res => {
                resolve(res);
                // wx.showToast({
                //     title: '成功',
                //     icon: 'success',
                //     duration: 2000
                // })
            },
            fail: err => {
                reject(err);
            },
            complete: () => {
                // 请求成功或失败都会走
                wx.hideLoading()
            }
        })
    })
}
// get("url").then(res => {
//     console.log("then   进来了")
// }).catch(err => {
//     console.log("catch 进来了")
// })
// 导出对象
module.exports = {
    sayHi,
    get
}
// export {
//     sayHi,
//     get
// }