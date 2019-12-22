//logs.js
var app = getApp()
const AV = require('../../av-weapp-min.js')
const devices_id = "574525817" // 填写在OneNet上获得的devicesId 形式就是一串数字 例子:9939133
const api_key = "orglLbZcSbqwzgcOnCJlNAVXkC4=" // 填写在OneNet上的 api-key 例子: VeFI0HZ44Qn5dZO14AuLbWSlSlI=
const util = require('../../utils/util.js')
Page({
  data: {
    animationData: {},
    z:'播放',
    temperature: 0,
     light: 0,
    sound: 0,
    value1: '',
    value2: '',
    value3: '',
    value: '',
    shifouplay: false,
    playurl: '',
    playpic: '',
    songname1: '',
    songurl1: '',
    picurl1: '',
    songname2: '',
    songurl2: '',
    picurl2: '',
    name:'',
    angle: 0,        //用来不断保存旋转次数，用于解决界面多次跳转后旋转失速问题
  },
  method: 'GET',
  getData: function () {
    var that = this
    wx.request({

      url: 'http://api.heclouds.com/devices/574525817/datapoints?datastream_ids=Temperature,Light,Humidity,sound', //        这里填写你的接口路径
      header: {
        'Content-Type': 'application/json',
        'api-key': api_key
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          temperature: res.data.data.datastreams[0].datapoints[0].value,//获取温度数值
          light: res.data.data.datastreams[1].datapoints[0].value,//获取光照数值
          sound: res.data.data.datastreams[4].datapoints[0].value,//获取声音数值
        })
        that.environment(),
          that.musicdown()

      },

    })

  },
  environment: function () {//获取环境数值并赋值
    var that = this
    var tem = this.data.temperature
    var lig = this.data.light
    var sou = this.data.sound
    if (tem > 20) { that.setData({ value1: "热", }) }//判断温度光照声音情况
    else { that.setData({ value1: "冷" }) }
    if (lig > 300) { that.setData({ value2: "亮", }) }
    else { that.setData({ value2: "暗" }) }
    if (sou > 8) { that.setData({ value3: "吵", }) }
    else { that.setData({ value3: "静" }) }
    this.setData({ value: that.data.value1 + that.data.value3 + that.data.value2 }) //将三个值整合在一起
  },

  turn: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay:0,
      transformOrigin: '50% 50% 0',
    })
    this.animation = animation

    // animation.scale(2, 2).rotate(45).step()

    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1
    setInterval(function () {
      n = this.data.angle;
      if (this.data.shifouplay){
      n = n + 1;}
      else{
        n=n;
        }
      this.setData({
        angle: n,
      })  
      this.animation.rotate(8* (n)).step()//每次转12 度
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this),100)//100ms转一个角度  
  },

  
  musicdown: function () {
    var that = this;
    var query = new AV.Query('music');
    query.contains('musicname', this.data.value);
    //获取所有符合条件的歌曲存入数组
    query.find().then(function (music1) {
      var url1 = music1[0].get('musicurl')
      var name1 = music1[0].get('name')
      var pic1 = music1[0].get('picurl')
      var url2 = music1[1].get('musicurl')
      var name2 = music1[1].get('name')
      var pic2 = music1[1].get('picurl')
      
      that.setData({
        songname1: name1,
        songurl1: url1,
        picurl1: pic1,
        songname2: name2,
        songurl2: url2,
        picurl2: pic2,

        name: name2,
        playurl: url2,
        playpic: pic2,
      })
    })
    },
 onLoad: function () {
  
      },


  //播放音乐
  playMusic: function (ev) {

    var shifouplay = this.data.shifouplay;

    if (shifouplay) {

      wx.pauseBackgroundAudio();

      this.setData({
        shifouplay: false,
        z:'播放',

      })

    } else {

      wx.playBackgroundAudio({

        dataUrl: this.data.playurl,

        title: this.data.name,

      })

      this.setData({

        shifouplay: true,
        z:'暂停',
      })
      
    }
    this.turn()
  },
    
  //上一首
  thepre: function () {
   var that = this
    wx.pauseBackgroundAudio();
    this.setData({
      name: that.data.songname1,
      playurl: that.data.songurl1,
      shifouplay: false,
      playpic: that.data.picurl1,
    })
    wx.playBackgroundAudio({
      dataUrl: this.data.playurl,
      title: this.data.playsong,

    })
    this.setData({
      shifouplay: true
    })
   
  },
  //下一首
  thenext: function () {
    var that = this;
    wx.pauseBackgroundAudio();
    this.setData({


      name: that.data.songname2,
      playurl: that.data.songurl2,
      shifouplay: false,
      playpic: that.data.picurl2,
    })
    wx.playBackgroundAudio({
      dataUrl: this.data.playurl,
      title: this.data.playsong,

    })
    this.setData({
      shifouplay: true
    })
   
  },
  
   onReady: function () {
  },
  onHide: function () {
  },

  onUnload: function () {
  },

  onPullDownRefresh: function () {
  },


  onReachBottom: function () {
  },
  onShareAppMessage: function () {
  }
})