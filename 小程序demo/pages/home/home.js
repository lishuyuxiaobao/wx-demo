// pages/home/home.js
// import { get } from '../../utils/api';
const api = require("../../utils/api");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjects: [],
    baseUrl: "https://elm.cangdu.org/img/",
    swiperData: []
  },

  collect(event) {
    console.log("收藏", event)
    let { index, shop } = event.currentTarget.dataset;
    // app.globalData.globalShops.push(shop)

    // 每次点击收藏 需要push到数组中  先获取收藏地址
    let shops = wx.getStorageSync("globalShops") || [];

    // 方法一
    // var newShops = [];
    // shops.forEach(element => {
    //   if (element.name != shop.name) {
    //     newShops.unshift(element)
    //   }
    // });
    // newShops.unshift(shop)


    // 方法二
    let isHasShop = shops.some(oldShop => {
      return oldShop.id === shop.id
    })
    if (isHasShop) {
      shops = shops.filter(res => {
        return res.id != shop.id
      })

    } else {
      shops.push(shop)
    }



    // 取消收藏
    shop.isCollect = !shop.isCollect;
    this.setData({
      ["subjects[" + index + "]"]: shop
    })



    // 存到缓存中
    wx.setStorageSync("globalShops", shops)

  },
  requestShop(offset) {
    const shops = "shopping/restaurants";
    let data = {
      latitude: 31.22967,
      longitude: 121.4762,
      offset,
      limit: 10
    }
    let oldSubjects = this.data.subjects;
    api.get(shops, data)
      .then(res => {
        //判断是否已收藏
        let gshop = wx.getStorageSync("globalShops") || [];
        res.data.forEach(element => {
          let isHasShop = gshop.some(oldShop => {
            return oldShop.id === element.id
          })
          if (isHasShop) {
            element.isCollect = true;
          }
        });


        let subjects = null;
        if (offset === 0) {
          //下拉刷新  清空原数组
          subjects = res.data;

          wx.stopPullDownRefresh()
        } else {
          //上拉拼接

          subjects = [...oldSubjects, ...res.data];


        }
        this.setData({
          subjects
        })

      }).catch(err => {
        console.log("出错了")
      })

  },
  requestSwiper() {
    const url = "v2/index_entry";
    api.get(url)
      .then(res => {
        let arr1 = res.data.slice(0, 8);
        let arr2 = res.data.slice(8);
        this.setData({
          swiperData: [arr1, arr2]
        })
        console.log(this.data.swiperData)
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    // const Top250 = "https://douban.uieee.com/v2/movie/top250";
    this.requestShop(0);
    this.requestSwiper();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * "enablePullDownRefresh" :true
   * 请求最新的数据
   */
  onPullDownRefresh: function () {
    this.requestShop(0);

  },

  /**
   * 页面上拉触底事件的处理函数
   * 请求后10调数据  拼接数据
   */
  onReachBottom: function () {
    this.requestShop(this.data.subjects.length);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '奥迪',
      path: '/page/user?id=123',  //打开时的路径
      imageUrl: '../../images/my.png'
    }
  }
})