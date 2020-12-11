<template>
  <el-dialog title="主动安全报警处理" width="800px" :visible.sync="isShow" @close="handleClose">
    <el-tabs v-model="tabName" class="tab-border-top" tab-position="bottom">
      <!-- 视频 -->
      <el-tab-pane label="报警视频" name="video">
        <div v-show="!videos.length" class="no-video">
          <img height="440" width="100%" src="@/assets/image/allMonitor/noVideo.jpg"/>
          <!-- <h3>暂无视频</h3> -->
        </div>
        <ul v-show="!!videos.length" class="ul">
          <li v-for="(v, i) of videos" :key="i">
            <!-- 代替视频的poster图片 -->
            <img v-show="!v.switch" src="@/assets/image/allMonitor/mn.jpg"/>
            <!-- 视频节点 -->
            <div v-if="!v.isDestroy" class="model">
              <video id="my_video" class="video-js vjs-default-skin" autoplay controls preload="none">
                {{ videoMsg }}
                <source :src="v.url" type="application/x-mpegURL"/>
              </video>
            </div>
          </li>
        </ul>
      </el-tab-pane>
      <!-- 图片 -->
      <el-tab-pane label="报警图片" name="img">
        <div style="height: 440px; display: flex; justify-content: center; align-items: center;" v-if="imgs.length < 2" class="one-img">
          <h3 v-show="!imgs.length" class="no-img">暂无图片</h3>
          <img style="max-width: 100%; max-height: 100%;" v-for="(v, i) of imgs" :key="i" :src="v.fsl" />
        </div>
        <el-carousel v-else trigger="click" indicator-position="none" height="440px">
          <el-carousel-item v-for="(v, i) of imgs" :key="i" style="display: flex; justify-content: center; align-items: center;">
            <img style="max-width: 100%; max-height: 100%;" :src="v.fsl"/>
          </el-carousel-item>
        </el-carousel>
      </el-tab-pane>
      <div class="tab-btn">
        <el-button v-if="!rowInfo.alaStatus" @click="handleAlarm" size="small">报警处理</el-button>
        <el-button @click="downFile" size="small">证据导出</el-button>
        <el-button v-if="downloadUrl" @click="downFileVedio" size="small">视频导出</el-button>
        <!-- 用来下载文件 -->
        <iframe style="display: none;" :src="downUrl"></iframe>
      </div>
    </el-tabs>
    <ul class="ala-info">
      <li class="iconfont icon-bianma"><span>{{ rowInfo.vehPlateNo || '' }}</span></li>
      <li class="iconfont icon-baojing2"><span>{{ rowInfo.alarmDisplay || '' }}</span></li>
      <li class="iconfont icon-sudu"><span>{{ (rowInfo.accSpeed || 0) + 'Km/h' }}</span></li>
      <li class="iconfont icon-shijian"><span>{{ rowInfo.stm || '' }}</span></li>
      <li class="iconfont icon-bumen2"><span>{{ rowInfo.dptName || '' }}</span></li>
      <li class="iconfont icon-iconfontyonghuming"><span>{{ rowInfo.dn || '' }}</span></li>
      <li style="width: 100%;" class="iconfont icon-dingwei1"><span>{{ rowInfo.address || '' }}</span></li>
    </ul>
  </el-dialog>
</template>

<style scoped>
.ul, .ala-info {
  overflow: hidden;
  width: 760px;
}
.ul li {
  position: relative;
  /* float: left; */
  width: 100%;
  height: 440px;
}
.ul li img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}
.ul li .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  display: none;
  z-index: 999;
  color: #fff;
  cursor: pointer;
}
.ul li:hover .iconfont {
  display: block;
}
.ul .video-js, .ul video, .ul li .model {
  width: 100%;
  height: 100%;
  display: block;
}
.tab-btn {
  position: absolute;
  bottom: 3px;
  right: 0;
  display: flex;
  z-index: 999;
}
.ala-info {
  padding: 10px 0 0;
}
.ala-info li {
  float: left;
  width: 50%;
  color: #666;
  height: 24px;
  line-height: 24px;
  display: flex;
}
.ala-info li span {
  display: block;
  color: #666;
  font-size: 12px;
  padding: 0 0 0 5px;
}
</style>

<script>
import { customZeroize, getCopyObj, getDateStr, getParse, getDecimalN } from '@/utils/util'
import { alarmDetailApp } from '@/api/video'
import { mapGetters } from 'vuex'
import videojs from 'video.js'
import 'videojs-contrib-hls'

import {  Dialog, Tabs, TabPane, Carousel, CarouselItem } from 'element-ui'

export default {
  components: {
    ElDialog: Dialog,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    ElCarousel: Carousel,
    ElCarouselItem: CarouselItem
  },
  data() {
    return {
      isShow: false,
      tabName: 'video',
      videos: [],
      imgs: [],
      videoMsg: this.$t('allMonitor.videoInfo.videoMsg'),
      rowInfo: {},
      downUrl: '',
      downloadUrl:''
    }
  },
  computed: {
    ...mapGetters(
      ['jsession']
    )
  },
  created() {
    // 安全证据报表页面点击操作查看附件
    eventBus.$on('handleAct', this.handleAct)
  },
  beforeDestroy() {
    eventBus.$off('handleAct', this.handleAct)
    this.handleClose()
  },
  methods: {
    /**
     * 点击操作
     * @param {Object} res 数据
     */
    handleAct(res) {     
      this.rowInfo = getCopyObj(res);
      // 根据状态切换选项卡
      this.isShow = true;
      if (res.mediaType === 0) {
        this.tabName = 'img'
      } else if (res.mediaType === 1) {
        this.tabName = 'video'
      }
      this.rowInfo.extensionData = res.extensionData
      this.rowInfo.alaType = res.atp || res.alarmType
      this.rowInfo.alaStatus = res.alarmStatus      
      this.rowInfo.id = res.id
      this.rowInfo.guid = res.guid || res.label
      this.rowInfo.vehPlateNo = res.vehPlateNo || res.vehiIdno
      this.rowInfo.alarmDisplay = res.alarmDisplay || res.alarmText
      this.rowInfo.dptName = res.dptName
      const obj = res.extensionData ? JSON.parse(res.extensionData) : {}
      this.rowInfo.accSpeed = obj.Speed;
      this.rowInfo.address  = res.endAddress || res.address ;
      const num = obj.TTXTerminalNoLength || 12
      const devIdno = res.did ? customZeroize(res.did, num) : customZeroize(res.vehTerminalNo, num)
      this.getVideos(devIdno, res.guid || res.label, res.atp || res.alarmType, res.stm)
    },
    /**
     * 点击报警处理
     */
    handleAlarm() {
      eventBus.$emit('handleAlarm', this.rowInfo)
    },
    /**
     * 证据导出
     */
    downFile() {
      const { jsession, rowInfo } = this
      const obj = getParse(rowInfo.extensionData)
      const num = obj.TTXTerminalNoLength
      const vehTerminalNo = num ? customZeroize(this.rowInfo.vehTerminalNo, num) : this.rowInfo.vehTerminalNo
      let guid = rowInfo.guid
      if (!guid) {
        guid = obj.guid || ''
      }
      const begintime = getDateStr(rowInfo.stm)
      const alaType = rowInfo.alaType || rowInfo.alarmValue
      
      this.downUrl = `${process.env.VUE_APP_BASEURL_KY}StandardApiAction_zipAlarmEvidence.action?jsession=${jsession}&devIdno=${vehTerminalNo}&guid=${guid}&alarmType=${alaType}&begintime=${begintime}&toMap=2`
      setTimeout(() => {
        this.downUrl = ''
      }, 800)
    },
    /**
     * 视频导出
     */
    downFileVedio(){
      const { jsession, rowInfo } = this
      const obj = getParse(rowInfo.extensionData)
      const num = obj.TTXTerminalNoLength
      const vehTerminalNo = num ? customZeroize(this.rowInfo.vehTerminalNo, num) : this.rowInfo.vehTerminalNo
      let guid = rowInfo.guid
      if (!guid) {
        guid = obj.guid || ''
      }
      const begintime = getDateStr(rowInfo.stm)
      const alaType = rowInfo.alaType || rowInfo.alarmValue
      this.downUrl = this.downloadUrl;
      // this.downUrl = "http://120.79.48.180:6611/3/5?DownType=3&DevIDNO=%E7%B2%A4BJH578&FLENGTH=734682&FOFFSET=0&MTYPE=1&FPATH=D%3A%2FgStorage%2FRECORD_FILE%2F040281815785%2F2020-10-14%2F02_64_6401_0_00040281815785201014000608000300.mp4&SAVENAME=02_64_6401_0_00040281815785201014000608000300.mp4&jsession="
      // setTimeout(() => {
      //   this.downUrl = ''
      // }, 800)
    },
    /**
     * 获取视频数据
     * @param devIdno 设备号
     * @param guid guid
     * @param alaType 报警类型
     * @param begintime 报警时间
     */
    getVideos(devIdno, guid, alaType, begintime) {
      const { jsession } = this
      this.imgs = []
      this.videos = []
      // 弹出视频弹窗
      this.isShow = true
      alarmDetailApp({ guid, alaType, begintime, jsession }).then(res => {
        if (res.result == 0) {
          // console.log(res)
          this.imgs = res.images || [];
          const videos = res.videos;

          if (Array.isArray(videos) && videos.length) {
            this.videos.push({ url: videos[0].fsl, oV: null, switch: false });
            this.downloadUrl = videos[0].downloadUrl;
            this.handlePlay(0);
          }
          const infos = res.infos;
          const accSpeed = getDecimalN(infos.endSpeed / 10);
          this.$set(this.rowInfo, 'accSpeed', accSpeed);
          this.$set(this.rowInfo, 'vehPlateNo', infos.vehiIdno);
          this.$set(this.rowInfo, 'dn', infos.dn);
          this.$set(this.rowInfo, 'vehTerminalNo', infos.devIdno);
          this.$set(this.rowInfo, 'address', infos.endPosition || infos.startPosition);
          if (!this.rowInfo.alarmDisplay)
            this.$set(this.rowInfo, 'alarmDisplay', infos.armTypeStr);

          if (!this.rowInfo.dptName)
            this.$set(this.rowInfo, 'dptName', infos.companyName);
        }
      })
      .catch(err => {

      })
    },
     /**
     * 点击播放视频
     * @param i 点击的下标
     * @param url 播放的url地址
     */
    handlePlay(i) {
      this.$set(this.videos[i], 'isDestroy', false);
      this.$nextTick(() => {
        this.initPlayerExample(i);
      });
      this.$set(this.videos[i], 'switch', true);      
    },
    /**
     * 初始化视频
     */
    initPlayerExample(i) {
      // 该视频等于null没有初始化过
      if (this.videos[i].oV == null) {
        this.videos[i].oV = videojs('my_video', {
          bigPlayButton: false,
          textTrackDisplay: false,
          posterImage: true,
          errorDisplay: false,
          controlBar: true,
          autoplay: true,
          controls: true
        },
        () => {
          this.videos[i].oV.play()
        });
      } else {
        this.videos[i].oV.play()
      }
    },
     /**
     * 点击暂停视频
     * @param i 点击的下标
     */
    handleStop(i) {
      // 修改成停止状态
      this.$set(this.videos[i], 'switch', false)
      // 暂停播放
      this.videos[i].oV.pause()
    },
    /**
     * 主动安全弹窗关闭
     */
    handleClose() {
      // 有视频实例的就销毁掉
      for (const v of this.videos.values()) {
        if (v.oV) {
          v.oV.dispose()
        }
      }
      this.videos = []
      // 关闭弹窗
      this.isShow = false
    }
  }
}
</script>