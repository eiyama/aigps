<template>
  <div v-if="isShow" class="main-vedio">
    <div class="left-empty"></div>
    <!-- 中间视频 -->
    <div class="center-videos videos">
      <div class="active-bar">
        <el-tooltip class="item" effect="dark" :content="i18nVideo.page1" placement="top-start">
          <span @click="handleChangePageSize(1)" :class="count == 1 ? 'active' : ''" class="play iconfont icon-kuang"></span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="i18nVideo.page4" placement="top-start">
          <span @click="handleChangePageSize(4)" :class="count == 4 ? 'active' : ''" class="play iconfont icon-jiugongge"></span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="i18nVideo.page9" placement="top-start">
          <span @click="handleChangePageSize(9)" :class="count == 9 ? 'active' : ''" class="play iconfont icon-jiugongge1"></span>
        </el-tooltip>
        <span class="play iconfont icon-shishipiliangdaifa"></span>
        <el-dropdown trigger="click" @command="handleCommand" class="floatLeft">
          <span class="el-dropdown-link iconfont icon-play"></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(v, i) of i18nVideo.dropdown1 || []" :key="i" :class="bitstream == v.label ? 'active' : ''" :command="v.label">{{ v.val }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip class="item" effect="dark" :content="i18nVideo.play" placement="top-start">
          <span @click="playAll(true)" class="play iconfont icon-bofang2"></span>
        </el-tooltip>
        <el-dropdown trigger="click" @command="handleCommand" class="floatLeft">
          <span class="el-dropdown-link iconfont icon-play"></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(v, i) of i18nVideo.dropdown2 || []" :key="i" :command="v.label">{{ v.val }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip class="item" effect="dark" :content="i18nVideo.stop" placement="top-start">
        <span @click="stopAll(true, true)" class="stop iconfont icon-zanting"></span>
        </el-tooltip>
        <el-dropdown trigger="click" @command="handleCommand" class="floatLeft">
          <span class="el-dropdown-link iconfont icon-play"></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(v, i) of i18nVideo.dropdown3 || []" :key="i" :command="v.label">{{ v.val }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <i style="float: right;" class="el-icon-right"></i> -->
        <span style="float: right;" @click="handleVideosCenHide" class="el-icon-close"></span>
      </div>
      <!-- 视频 -->
      <div class="flash-box" ref="flash">
         <div class="flash-box" id="cmsv6flash1"></div>
        <!-- <div id="flash" class="flash">
          <a href="http://www.adobe.com/go/getflashplayer">
            <img src="@/assets/image/allMonitor/flash_zh.png" alt="Get Adobe Flash player" />
          </a>
        </div> -->
      </div>
    </div>
    <div class="right-empty"></div>
  </div>
</template>

<style>
.main-vedio {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 15;
  display: flex;
  width: 100%;
  height: 100%;
}
.main-vedio .left-empty {
  width: 330px;
  height: 100%;
}
.main-vedio .right-empty {
  width: 500px;
  height: 100%;
  z-index: 15;
}
.flash-box {
  flex: 1;
  /* display: flex;
  flex-direction: column; */
  overflow: hidden;
  background: rgb(56,56,61);
}
.flash-box .flash {
  /* flex: 1;
  display: flex;
  flex-direction: column; */
}
.flash-box .flash a {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flash-box .flash img {
  max-height: 100%;
}
.videos {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 999;
  height: 100%;
  position: absolute;
  top: 0;
}
.videos .el-carousel {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.videos .video {
  background: #fff;
  padding: 0 5px 5px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #f2f6fc;
  border-radius: 3px;
  min-height: 166px;
  /* box-shadow: 10px 10px 5px #888888; */
}
.videos .active-bar {
  overflow: hidden;
  background: #fff;
  padding: 2px 5px;
  /* border-bottom: 1px solid #909399; */
}
.videos .video-js {
  width: 100%;
  height: 100%;
}
.videos .active-bar span {
  cursor: pointer;
  float: left;
  font-size: 20px;
  display: block;
  margin: 0 0 0 5px;
  color: #aaa;
}
.videos .active-bar span:hover, .videos .active-bar .active {
  color: #00a8d4;
}
.videos .active-bar .el-dropdown-link {
  margin: 0;
}
.videos .active-bar .hide {
  float: right;
  margin: 0;
}
.videos .cur-title {
  height: 26px;
  line-height: 26px;
  position: relative;
  text-align: center;
  overflow: hidden;
  flex-shrink: 0;
}
.videos .cur-title .num {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  line-height: 26px;
}
.video1 .cur-title .num {
  left: 10px;
}
.videos .video1 {
  /* flex: 1; */
  min-height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
}
.videos .iframe {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.videos .video1 .iframe{
  flex: 1;
  min-height: 650px !important;
  position: relative;
  display: flex;
  overflow: hidden;
  align-items:center;
  justify-content:center;
}
.videos .iframe .iconfont, .videos .video1 .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  display: none;
  z-index: 999;
  color: #fff;
}
.videos .iframe .video-group {
  width: 100% !important;
  height: 100% !important;
}
.videos .iframe:hover .iconfont, .videos .video1 .iframe:hover .iconfont {
  display: block;
  cursor: pointer;
  /* background: green; */
}
.videos .video1 .video-group {
  width: 100%;
  min-height: 650px !important;
  height: 650px !important;
}
.videos .iframe .poster-img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.videos .video1 .poster-img, .videos .video4 .poster-img, .videos .video9 .poster-img {
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 650px;
  z-index: 100;
  margin-top: -325px;
}
.videos video {
  display: block;
  width: 100%;
  height: 100%;
}

.videos .video4, .videos .video9 {
  width: calc(50% - 15px);
  height: calc(50% - 15px);
  min-height: 340px;
  margin: 10px 0 0 10px;
  background: #fff;
  float: left;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 5px;
}
.videos .video4 .iframe, .videos .video9 .iframe {
  flex: 1;
  display: flex;
  align-items: center;
}
.videos .video4 .video-group {
  display: block;
  min-height: 300px;
  height: 300px !important;
}
.videos .video4 .poster-img {
  height: 300px;
  margin-top: -150px;
}
.videos .video9 {
  width: calc(33.3% - 10px);
  height: calc(33.3% - 10px);
  min-height: 240px;
  border-radius: 3px;
}
.videos .video9 .video-group {
  display: block;
  min-height: 200px;
  height: 200px !important;
}
.videos .video9 .video-group {
  display: block;
  min-height: 200px;
  height: 200px !important;
}
.videos .video9 .poster-img {
  height: 200px;
  margin-top: -100px;
}
.videos >>> .el-scrollbar .el-scrollbar__view {
  height: 100%;
}
.center-videos {
  flex: 1;
  box-sizing: border-box;
  padding: 5px 5px 40px;
  position: relative;
}
.carousel-indicators {
  overflow: hidden;
  padding: 0 20px;
}
.carousel-indicators li {
  float: left;
}

.block {
  background: #fff;
}
</style>

<script>
// import swfobject from '@/conmon/js/swfobject'
// import playerSwf from '@/assets/flash/player.swf'
import { mapGetters } from 'vuex'
import { getCopyObj } from '@/utils/util'
import { Message, Tooltip, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'

export default {
  components: {
    ElTooltip: Tooltip,
    ElDropdown: Dropdown,
    ElDropdownMenu: DropdownMenu,
    ElDropdownItem: DropdownItem
  },
  data() {
    const data = this.getData()
    return {
      ...data
    }
  },
  computed: {
    ...mapGetters([
      'isMsg',
      'jsession'
    ])
  },
  props: {
    bitstream: {
      type: String,
      default: '0'
    }
  },
  created() {
    // window.addEventListener('onTtxVideoMsg', this.onTtxVideoMsg)
    window.onTtxVideoMsg = this.onTtxVideoMsg
  },
  beforeDestroy() {
    // const data = this.getData()
    // for (const [k, v] of Object.entries(data)) {
    //   this[k] = v
    // }
    // 清除所有数据
    this.handleCommand('clearAll')
    window.onTtxVideoMsg = null
  },
  methods: {
    /**
     * 初始化数据
     */
    getData() {
      const i18nVideo = getCopyObj(this.$t('allMonitor.videoInfo'))
      return {
        isShow: false,
        i18nVideo,
        previewTips: [],
        aFlash: [],
        taskArr: [],
        count: 1,
        maxCount: 9,
        oldArr: [],
        isInitFinished: false
      }
    },
    /**
     * 监听视频事件
     */
    onTtxVideoMsg(index, type) {
      if (!this.isInitFinished) return
      const { aFlash } = this
      if (type == 'stop') {
        aFlash[index].switch = false
      } else if (type == 'start' || type == 'play') {
        aFlash[index].switch = true
      }
    },
    /**
     * 初始化并显示改页面
     * @param {Array} videos 右侧视频的视频数据
     * @param {Number} curPage 当前页码
     */
    async init(videos) {
      console.log(videos);
      const { count, aFlash, isShow } = this
      this.isShow = true
      if (!isShow) {
        this.isInitFinished = false
        await this.$nextTick()
        this.aFlash = this.getVideos()
        this.initPlayerExample()
      }
      if (!(videos instanceof Array)) return
      for (const [i, v] of videos.entries()) {
        if (!v.url) {
          continue
        } 
        if (this.aFlash.length <= i) {
          this.aFlash.push(v)
        } else {
          this.aFlash.splice(i, 1, v)
        }
        if (i < this.count) {
          this.isInitFinished = false
          this.playVideo("cmsv6flash1",i)
        }
      }
    },
    /**
     * 初始化flash视频插件
     */
	  initPlayerExample() {
      const { count, aFlash, $refs } = this
      const params = {        
        lang: "zh-cn" //"en", "zh-cn", "zh-tw"
      }
      const w = $refs.flash.clientWidth
      const h = $refs.flash.clientHeight

      ttxVideoAll.init('cmsv6flash1', w, h, params);        
      
      this.initFlash('cmsv6flash1');
      //   const id = 'flash'
      //   swfobject.embedSWF(playerSwf, id, w, h, '11.0.0', null, null, params, null)
      //   this.initFlash(id)
    },
    /**
     * 视频插件加载完成设置窗口参数与服务器参数
     * @param {String} id dom节点的id
     */
    async initFlash(id, num) {
      if (num === 500) return
      if (!num) num = 1
      num++
      if (
         typeof swfobject == "undefined" || 
        swfobject.getObjectById(id) == null ||
        typeof swfobject.getObjectById(id).setWindowNum == 'undefined'
      ) {
        setTimeout(() => {
          this.initFlash(id, num)
        }, 50)
      } else {
        const host = process.env.VUE_APP_BASEURL_FLASH
        const ip = host.substring(7, 20)
        const prot = host.substring(21, host.length - 1)
        // const ip = "202.96.170.107"
        // const prot = "6605"  
        // 设置视频插件的语言
        // swfobject.getObjectById('myContent').setLanguage('http://39.108.194.249/808gps/open/player/cn.xml')
        swfobject.getObjectById(id).setWindowNum(4)    
        // 再配置当前的窗口数目
        this.setWindowNum(id)
        // 设置视频插件的服务器
        swfobject.getObjectById(id).setServerInfo(ip, prot)        
        await this.$nextTick()
        this.isInitFinished = true;       
        for (const v of this.taskArr.values()) {         
          this.playVideo("cmsv6flash1",v)
        }
        this.taskArr = []
      } 
    },
    playVideo(id,i) {
      if (!this.isInitFinished) {
        this.taskArr.push(i)
        return
      }            
      const { aFlash, jsession } = this        
      const obj = aFlash[i];            
      const { bitstream, channelId, vehTerminalNo, name, vehPlate, domId } = obj ;
      // 先停止视频窗口
      // 设置窗口标题
      const title  = `${vehPlate}-${name}`;
     
      swfobject.getObjectById(id).setVideoInfo(i, title);
      // 播放视频      
      swfobject.getObjectById(id).startVideo(i, jsession, vehTerminalNo, channelId, bitstream , true)     
    },
    /**
     * 设置窗口
     */
    setWindowNum(id) {
    //   if (!this.isFlash('flash')) {
    //     return
    //   }
    const { count } = this;     
    swfobject.getObjectById(id).setWindowNum(count)    
    //   const swf = swfobject.getObjectById(id)
    //   swf.setWindowNum(count)
    },
    /**
     * 校验flash
     */
    isFlash(id) {
      const swf = swfobject.getObjectById(id)
      return swf && swf.setWindowNum
    },
    /**
     * 重置窗口
     */
    reSetVideo(id, index) {
    //   if (!this.isFlash('flash')) {
    //     return
    //   }       
      swfobject.getObjectById(id).reSetVideo(index)
    },
    /**
     * 点击播放视频
     * @param {Number} i 下标
     */
    handlePlay(i) {
      if (!this.isInitFinished) {
        this.taskArr.push(i)
        return
      }
      const { aFlash, jsession, count } = this
      const obj = aFlash[i]
      obj.switch = true
      const { bitstream, channelId, vehTerminalNo, name, vehPlate } = obj
      // 先停止视频窗口
      if (i >= count) {
        i = count - 1
      }
      swfobject.getObjectById('cmsv6flash1').stopVideo(i)
      // 设置窗口标题
      const title  = `${vehPlate}-${name}`
      swfobject.getObjectById('cmsv6flash1').setBufferTime(i, 2)
      swfobject.getObjectById('cmsv6flash1').setBufferTimeMax(i, 6)
      swfobject.getObjectById('cmsv6flash1').setVideoInfo(i, title)
      // 播放视频
      swfobject.getObjectById('cmsv6flash1').startVideo(i, jsession, vehTerminalNo, channelId, bitstream, true)
    },
    /**
     * 遍历一组视频盒子出来
     * @return videos 返回一个数组
     */
    getVideos() {
      const { maxCount } = this
      const arr = []
      const obj = {
        title: '',
        switch: false, // 控制播放与暂停
        url: '', // 视频路径
        oV: null, // 控制video的实例
        isMaxVideo: false, // 是否显示大屏
        isDestroy: true, // 是否破坏video标签
        isHide: false, // 是否隐藏
        id: '' // 树节点的唯一id
      }
      let i = 0
      while (i < maxCount) {
        arr.push(getCopyObj(obj))
        i ++
      }
      return arr
    },
    /**
     * 判断是否有空盒子
     * @param {Number} index 当前通道的下标
     */
    isEmpty(index) {
      const { aFlash, count } = this
      if (index >= count) {
        return false
      }
      return true
    },
    /**
     * 双击右侧视频
     */
    dblRightVideo(videos, i) {
      console.log(videos,i)
    //   this.init(videos)
    //   this.$nextTick(() => {
    //     this.maxVideo(k, i)
    //   })
    },
   /**
     * 设置视频数据
     */
    setVideo(opt) {
      const { aFlash, count } = this
      const res = aFlash.findIndex(e => e.url === opt.url)
     if (res > -1) {
        // 证明是当前窗口的重复
        if (res < count) {
          // 点击通道节点的时候才弹
          if (!opt.isHandleChn) {
            Message.error(`已经在视频窗口${res + 1}上播放此通道的视频！`)
          }
          return
        } else {
          console.log('清重复')
          aFlash[res].url = '' 
        }
      }
      let i = res > -1 ? -1 : aFlash.findIndex(elem => elem.url === '')
      // url为空证明当前页有空盒子，反之没有空盒子就替换最后一个
      if (i < 0 || i >= count) {
        // 为false弹出询问框
        if (!this.isMsg) {
          this.$emit('popupShow')
          this.previewTips.push(opt)
          return
        } else {
          i = this.getReplaceIndex()
          // 改变树节点的视频设备图标为不启用状态
          this.$emit('setEnable', aFlash[i].id, false)
        }
      }
      const elem = {
        ...aFlash[i],
        ...opt
      }
      aFlash[i] = elem
      this.handlePlay(i)
      this.$emit('setEnable', opt.id, true)
    },
     /**
     * 点击替换当前视频确认
     */
    handleReplaceConfirm() {
      const { aFlash, previewTips } = this
      for (const v of previewTips.values()) {
        const i = this.getReplaceIndex()
        // 如果为反改变树节点的视频设备图标为不启用状态
        if (!this.isVideoRepeta(v.url)) {
          this.$emit('setEnable', aFlash[i].id, false)
        }
        aFlash[i] = {
          ...aFlash[i],
          ...v
        }
        this.handlePlay(i)
      }
      this.previewTips = []
    },
    /**
     * 找出上一次被替换过的那一项
     * @return i 返回上一次被替换过的下一个下标，都没有被替换过就默认0
     */
    getReplaceIndex() {
      const { aFlash, count } = this
      let index = 0
      for (const [i, v] of aFlash.entries()) {
        if (v.isReplace && i < count && i < aFlash.length -1) {
          index = i + 1
        }
        v.isReplace = false
      }
      this.$set(aFlash[index], 'isReplace', true)
      return index
    },
     /**
     * 用来判断该url的视频是否已添加在视频盒子里面
     * @param url 需要判断的url
     * @return 如果已存在返回一该视频盒子的编号，反之false
     */
    isVideoRepeta(url) {
      const { aFlash } = this
      return aFlash.some(e => e.url === url)
    },
    /**
     * 点击切换视频画面的数量
     */
    async handleChangePageSize(num) {
      const { aFlash, count } = this
      // 证明没有切换
      if (count === num) return
      for (const [i, v] of aFlash.entries()) {
        v.isReplace = false
        if (v.switch && !v.url) {
          this.reSetVideo('cmsv6flash1', i)
          v.switch = false
        }
      }
      this.count = num
      this.setWindowNum('cmsv6flash1')
      await this.$nextTick()
      for (const [i, v] of aFlash.entries()) {
        if (v.switch && i >= count) {
          this.playVideo("cmsv6flash1",i) 
        }
      }
    },
   /**
     * 视频盒子的功能栏下拉选择的事件
     * @paran key 选择当前项的key
     */
    handleCommand(key) {
      switch(key)
      {
        case '0':
          this.$emit('setBitstream', key)
          break;
        case '1':
          this.$emit('setBitstream', key)
          break;
        case 'play':
          this.playAll(true)
          break;
        case 'playAll':
          this.playAll()
          break;
        case 'popupOpen':
          // console.log('开启轮询窗口');
          break;
        case 'stop':
          this.stopAll(true, true)
          break;
        case 'stopAll':
          this.stopAll(true)
          break;
        case 'clear':
          console.log('清除数据');
          this.clearData(true, true)
          break;
        // case 'clearAll':
        default:
          console.log('清除所有数据');
          this.clearData(false, true)
          this.$emit('clearAll')
      }
    },
    /**
     * 点击关闭
     */
    handleVideosCenHide() {
      this.isInitFinished = false
      this.isShow = false
      const { aFlash } = this
      this.$emit('handleHide', getCopyObj(aFlash))
      // this.stopAll()
      this.clearData(false, false)
    },
     /**
     * 启动所有视频
     * @param {Boolean} isOne 是否只播放一个视频，true只播放一个，false全部播放
     */
    playAll(isOne) {
      const { aFlash, count } = this
      for (const [i, v] of aFlash.entries()) {
        if (count <= i) {
          break
        }
        if (v.url && !v.switch) {
          this.playVideo("cmsv6flash1",i)
          if (isOne) {
            break
          }
        }
      }
    },
    /**
     * 关闭所有视频
     * @param {Boolean} isState 是否修改状态
     * @param {Boolean} isAll 是否只关闭一个，true只暂停一个，false全部暂停
     */
    stopAll(isState, isOne) {
      const { aFlash, count } = this
      for (const [i, v] of aFlash.entries()) {
        if (count <= i) {
          break
        }
        if (v.url && v.switch) {
          this.handleStop(i, isState)
          if (isOne) {
            break
          }
        }
      }
    },
    /**
     * 清除数据
     * @param {Boolean} isOne 是否只清除一个，true只清除一个，反之全部
     * @param {Boolean} isClear 是否是点击清除数据
     */
    clearData(isOne, isClear) {
      const { aFlash, count } = this
      for (const [i, v] of aFlash.entries()) {
        if (v.url) {
          // 重置视频窗口
          if (count > i) {
            this.handleStop(i, true)
            this.reSetVideo('cmsv6flash1', i)
          }
        //   v.url = ''
          v.switch = false
          if (isClear) {
            // 改变树节点的视频设备图标为不启用状态
            this.$emit('setEnable', v.id, false)
          }
          if (isOne) {
            break
          }
        }
      }
    },
    /**
     * 点击暂停视频
     * @param {Number} i 下标
     * @param {Boolean} isState 是否修改状态
     */
    handleStop(i, isState) {
    //   if (!this.isFlash('cmsv6flash1')) {
    //     return
    //   }
      const { aFlash } = this
      if (isState) {
        aFlash[i].switch = false
      }
      // 暂停播放
      swfobject.getObjectById('cmsv6flash1').stopVideo(i)
    }
  }
}
</script>