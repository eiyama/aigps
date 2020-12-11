<template>
  <div :class="isShow ? 'videos-transition-start' : 'videos-transition-end'" class="right-videos videos">
    <div class="active-bar">
      <el-tooltip class="item" effect="dark" :content="i18nVideo.preview" placement="top-start">
        <span @click="handleShowCenVideo" class="play iconfont icon-preview"></span>
      </el-tooltip>
      <span class="play iconfont icon-shishipiliangdaifa"></span>
      <el-dropdown trigger="click" @command="handleCommand" class="floatLeft">
        <span class="el-dropdown-link iconfont icon-play"></span>
        <el-dropdown-menu slot="dropdown" class="video-dropdown">
          <el-dropdown-item v-for="(v, i) of i18nVideo.dropdown1 || []" :key="i" :class="bitstream == v.label ? 'active' : ''" :command="v.label">{{ v.val }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip class="item" effect="dark" :content="i18nVideo.play" placement="top-start">
        <span @click="playAll(true)" class="play iconfont icon-bofang2"></span>
      </el-tooltip>
      <el-dropdown trigger="click" @command="handleCommand" class="floatLeft">
        <span class="el-dropdown-link iconfont icon-play"></span>
        <el-dropdown-menu slot="dropdown" class="video-dropdown">
          <el-dropdown-item v-for="(v, i) of i18nVideo.dropdown2 || []" :key="i" :command="v.label">{{ v.val }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip class="item" effect="dark" :content="i18nVideo.stop" placement="top-start">
      <span @click="stopAll(true, true)" class="stop iconfont icon-zanting"></span>
      </el-tooltip>
      <el-dropdown trigger="click" @command="handleCommand" class="floatLeft">
        <span class="el-dropdown-link iconfont icon-play"></span>
        <el-dropdown-menu slot="dropdown" class="video-dropdown">
          <el-dropdown-item v-for="(v, i) of i18nVideo.dropdown3 || []" :key="i" :command="v.label">{{ v.val }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span @click="handleVideosHide" class="el-icon-close hide"></span>
    </div>
    <div class="video-box" ref="flash">
      <div class="flash-box" v-for="(v, i) in count" :key="i" @dblclick="dblRightVideo">
        <div :id="`flash${i}`" class="flash">
          <a href="http://www.adobe.com/go/getflashplayer">
            <img src="@/assets/image/allMonitor/flash_zh.png" alt="Get Adobe Flash player" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.videos-transition-start {
  transform: translateX(0);
  transition: all 0.3s;
}

.videos-transition-end {
  transform: translateX(110%);
  transition: all 0.3s;
}
.videos {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  height: 100%;
  position: absolute;
  top: 0;
}
.right-videos {
  width: 355px;
  right: 0;
  padding: 5px 5px 40px 0;
  /* border-left: 1px solid #dcdfe6; */
}
.video-dropdown {
  z-index: 1000000 !important;
}
.video-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
.video-box .flash-box {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.video-box .flash {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.video-box .flash a {
  background: rgb(56,56,61);
  flex: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.video-box .flash img {
  max-height: 100%;
}
</style>

<script>
import swfobject from '@/conmon/js/swfobject'
import playerSwf from '@/assets/flash/player.swf'
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
  beforeDestroy() {
    // const data = this.getData()
    // for (const [k, v] of Object.entries(data)) {
    //   this[k] = v
    // }
    // 清除所有数据
    this.clearData(false, true, true)
  },
  methods: {
    getData() {
      const i18nVideo = getCopyObj(this.$t('allMonitor.videoInfo'))
      return {
        i18nVideo,
        isShow: false,
        previewTips: [],
        aFlash: [],
        count: 4,
        isInitFinished: false,
        taskArr: []
      }
    },
    /**
     * 初始化视频数据
     */
    async init() {
      this.isShow = true
      if (this.aFlash.length) return
      this.aFlash = this.getVideos()
      await this.$nextTick()
      this.initPlayerExample()
    },
    /**
     * 初始化flash视频插件
     */
	  initPlayerExample() {
      const { count, aFlash, $refs } = this
      const params = {
        allowFullscreen: 'true',
        allowScriptAccess: 'always',
        bgcolor: '#FFFFFF',
        wmode: 'transparent'
      }
      const w = $refs.flash.clientWidth
      const h = $refs.flash.clientHeight / count - 4
      let i = 0
      while (i < count) {
        const id = `flash${i}`
        aFlash[i].domId = id
        swfobject.embedSWF(playerSwf, id, w, h, '11.0.0', null, null, params, null)
        this.initFlash(id, i)
        i++
      }
    },
    /**
     * 视频插件加载完成设置窗口参数与服务器参数
     * @param {String} id dom节点的id
     * @param {Number} i 下标
     */
    async initFlash(id, i, num) {
      if (num === 500) return
      if (!num) num = 1
      num++
      if (
        swfobject.getObjectById(id) == null ||
        typeof swfobject.getObjectById(id).setWindowNum == 'undefined'
      ) {
        setTimeout(() => {
          this.initFlash(id, i)
        }, 50)
      } else {
        const host = process.env.VUE_APP_BASEURL_FLASH
        const ip = host.substring(7, 20)
        const prot = host.substring(21, host.length - 1)
        //设置视频插件的语言
        // swfobject.getObjectById('myContent').setLanguage('http://39.108.194.249/808gps/open/player/cn.xml')
        // 再配置当前的窗口数目
        swfobject.getObjectById(id).setWindowNum(1)
        //设置视频插件的服务器
        swfobject.getObjectById(id).setServerInfo(ip, prot)
        if (i + 1 === this.count) {
          await this.$nextTick()
          this.isInitFinished = true
          setTimeout(() => {
            for (const v of this.taskArr.values()) {
              this.handlePlay(v)
            }
            this.taskArr = []
          }, 100)
        }
      }
    },
    /**
     * 点击中间视频关闭
     */
    async handleCenHide(videos) {
      this.isShow = true
      this.aFlash = this.getVideos()
      this.isInitFinished = false
      await this.$nextTick()
      this.initPlayerExample()
      for (const [i, v] of videos.entries()) {
        if (!v.url) {
          continue
        }
        if (this.aFlash.length <= i) {
          this.aFlash.push(v)
        } else {
          this.aFlash.splice(i, 1, v)
        }
        if (i < this.count && v.switch) {
            this.handlePlay(i)
        }
      }
    },
    /**
     * 判断是否有空盒子
     * @param {Number} index 当前通道的下标
     */
    isEmpty(index) {
      const { aFlash, count, isInitFinished } = this
      if (!isInitFinished) {
        return true
      }
      if (index >= count) {
        return false
      }
      return true
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
          aFlash[res].switch = false
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
          // 如果为反改变树节点的视频设备图标为不启用状态
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
        // 改变树节点的视频设备图标为不启用状态
        this.$emit('setEnable', aFlash[i].id, false)
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
     * 点击事实预览显示中间的视频弹窗
     */
    handleShowCenVideo() {
      const { aFlash } = this
      this.isShow = false
      this.$emit('handleShowCenVideo', getCopyObj(aFlash))
      // this.isShow = false
      // 关闭之前清除所有的视频
      this.clearData(false, false, true)
      // this.handleVideosHide()
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
          // console.log('清除数据');
          this.clearData(true, true)
          break;
        // case 'clearAll':
        default:
          // console.log('清除所有数据');
          this.clearData(false, true)
          this.$emit('clearAll')
      }
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
          this.handlePlay(i)
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
     * 点击关闭图标
     */
    handleVideosHide() {
      this.isShow = false
      // 关闭之前暂停所有的视频
      this.stopAll(true)
      this.clearData(false, true)
    },
    /**
     * 清除数据
     * @param {Boolean} isOne 是否只清除一个，true只清除一个，反之全部
     * @param {Boolean} isClear 是否是清除
     * @param {Boolean} isInit 是否是初始化
     */
    clearData(isOne, isClear, isInit) {
      const { aFlash, count } = this
      for (const [i, v] of aFlash.entries()) {
        if (v.url) {
          // 重置视频窗口
          if (count > i) {
            this.handleStop(i, true)
            const swf = swfobject.getObjectById(v.domId)
            if (!this.isFlash(v.domId)) {
              return
            }
            swf.reSetVideo(0)
          }
          v.url = ''
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
      if (isInit) {
        console.log('初始化')
        this.aFlash = []
      }
    },
    /**
     * 校验flash
     */
    isFlash(id) {
      const swf = swfobject.getObjectById(id)
      return swf && swf.setWindowNum
    },
    /**
     * 双击切换到中间视频且放大视频
     * @param {Number} i 下标
     */
    dblRightVideo(i) {
      console.log(i)
      // this.isShow = false
      // const videos = getCopyObj(this.aFlash)
      // this.$emit('handleShowCenVideo', videos, i)
      // this.handleVideosHide()
    },
    /**
     * 点击播放视频
     * @param {Number} k 第一层得下标
     */
    handlePlay(i) {
      if (!this.isInitFinished) {
        this.taskArr.push(i)
        return
      }
      const { aFlash, jsession } = this
      const obj = aFlash[i]
      obj.switch = true
      const { bitstream, channelId, vehTerminalNo, name, vehPlate, domId } = obj
      // 先停止视频窗口
      swfobject.getObjectById(domId).stopVideo(0)
      // 设置窗口标题
      const title  = `${vehPlate}-${name}`
      swfobject.getObjectById(domId).setBufferTime(0, 2)
      swfobject.getObjectById(domId).setBufferTimeMax(0, 6)
      swfobject.getObjectById(domId).setVideoInfo(0, title)
      // 播放视频
      swfobject.getObjectById(domId).startVideo(0, jsession, vehTerminalNo, channelId, bitstream, true)
    },
    /**
     * 点击暂停视频
     * @param {Number} i 下标
     * @param {Boolean} isState 是否修改状态
     */
    handleStop(i, isState) {
      const { aFlash } = this
      const v = aFlash[i]
      if (!this.isFlash(v.domId)) {
        return
      }
      if (isState) {
        v.switch = false
      }
      // 暂停播放
      const swf = swfobject.getObjectById(v.domId)
      const stop = swf.stopVideo(0)
    },
    /**
     * 遍历一组视频盒子出来
     * @return videos 返回一个数组
     */
    getVideos() {
      const { count } = this
      const arr = []
      // 视频总共多少页
      
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
      while (i < count) {
        arr.push(getCopyObj(obj))
        i ++
      }
      return arr
    }
  }
}
</script>