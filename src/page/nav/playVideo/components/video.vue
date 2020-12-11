<template>
  <div class="video-box">
    <div class="video1">
      <div class="cur-title">
        <!-- <span class="num">{{ i + 1 }}</span> -->
        {{ videos.title }}
      </div>
      <div class="iframe">
        <img v-show="!videos.switch" src="@/assets/image/allMonitor/mn.jpg" class="poster-img">
        <div @click.prevent class="video-group">
          <div :id="`my_video_1`" class="video-js vjs-default-skin" preload="auto">
          </div>
        </div>
      </div>
    </div>
    <div class="controller">
      <div class="controller-btn">
        <div class="input" @click.stop @contextmenu.stop>
          <el-input @click.native="handleInput" v-model="search.val" readonly class="input" :placeholder="$t('placeholder.carSearch')">
            <i slot="suffix" class="el-input__icon down-icon el-icon-caret-bottom"></i>
          </el-input>
        </div>
        <!-- 时间 -->
        <el-date-picker class="input-date" value-format="yyyy-MM-dd" v-model="search.dates" :picker-options="pickerOptions"
          type="date" :placeholder="$t('placeholder.times')"></el-date-picker>
        <div class="radio">
            <span class="label">文件位置：</span>
            <el-radio-group v-model="search.radio">
              <el-radio :label="1">终端设备</el-radio>
              <el-radio :label="2">存储服务器</el-radio>
              <!-- <el-radio :label="4">下载服务器</el-radio> -->
            </el-radio-group>
          </div>
        <el-button @click="handleBtn" style="margin: 0 12px 0 2px;" type="primary">开始巡检</el-button>
      </div>
      <!-- 选择车辆的树 -->
      <div class="car-tree" @click.stop @contextmenu.stop v-show="isShow">
        <div class="search-bar">
          <el-input size="small" @input.native="changeVal" :placeholder="$t('placeholder.carSearch')" v-model="search.searchVal">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <el-scrollbar class="border-blue scroll-y" width="100%" style="margin: 10px 0 0;flex:1;">
          <el-tree empty-text :default-expanded-keys="opendList" :expand-on-click-node="false"
            :data="tree" node-key="id" @node-click="handleNode" highlight-current ref="tree"
            :props="defaultProps" :filter-node-method="filterNode"></el-tree>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { getPickerOptions3 } from '@/utils/data'
import { getFormatTime, zerosN, getCopyObj } from '@/utils/util'
import { lastRecodes } from '@/api/vehicle'
import { getVideoFileInfo } from '@/api/video'
import { mapGetters } from 'vuex'
import { RadioGroup, Radio, DatePicker, Tree, Scrollbar, Message } from 'element-ui'


export default {
  components: {
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElDatePicker: DatePicker,
    ElTree: Tree,
    ElScrollbar: Scrollbar
  },
  data() {
    const data = this.getData()
    return {
      ...data,
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters([
      'jsession'
    ])
  },
  props: {

  },
  async created() {
    try {
      const tree = await this.$store.dispatch('data/setCarTree')
      this.tree = getCopyObj(tree)
      this.opendList.push(this.tree[0].id)
      tree = null
    } catch(err) {

    }
    document.documentElement.addEventListener('click', this.handleBox)
    eventBus.$on('handleDblPlay', this.handleDblPlay)
  },
  beforeDestroy() {
    document.documentElement.removeEventListener('click', this.handleBox)
    eventBus.$off('handleDblPlay', this.handleDblPlay)
    this.videos.oV = null
  },
  methods: {
    getData() {
      const search = {
        dates: getFormatTime('Y-M-D'),
        radio: 1
      }
      return {
        search,
        isShow: false,
        tree: null,
        videos: {},
        opendList: [],
        pickerOptions: getPickerOptions3(this.$t('otherText'))
      }
    },
    /**
     * 点击输入框显示车辆树
     */
    handleInput() {
      this.isShow = true
    },
    /**
     * 点击body隐藏部门树选择
     */
    handleBox() {
      this.isShow = false
    },
    /**
     * 树过滤
     */
    filterNode(val, data) {
      if (!val) return true;
      let boole = false;
      // 根据车牌号、终端号、SIM号、VIN号筛选
      const valCase = val.toUpperCase();
      const name = data.name ? data.name.toUpperCase() : '';
      const veh = data.vehTerminalNo ? data.vehTerminalNo.toUpperCase() : '';
      const vehVin = data.vehVin ? data.vehVin.toUpperCase() : '';
      const sim = data.sim ? data.sim.toUpperCase() : '';
      if (name.indexOf(valCase) !== -1 || veh.indexOf(valCase) !== -1 || vehVin.indexOf(valCase) !== -1 || sim.indexOf(valCase) !== -1) {
        boole = true;
      }
      return boole;
    },
    /**
     * 点击按钮开始巡检
     */
    async handleBtn() {
      const name = this.search.val;
      const dates = this.search.dates;
      if (!name) {
        Message.error(this.$t('error.selectCar'));
        return;
      } else if (!dates) {
        Message.error(this.$t('error.selectTime'));
        return;
      }
      const veh = this.curNode.vehTerminalNo
      const loc = this.search.radio
      if (loc === 1) {
        const res = await lastRecodes({ vehTerminalNo: veh })
        try {
          const obj = res.result[0]
          // if(!obj.location.acc) {
          //   Message.error('该车辆ACC已关闭！')
          //   return
          // }
        } catch(err) {
          return
        }
      }
      const ttxVehicleCfg = this.curNode.ttxVehicleCfg || {};
      const newVeh = zerosN(veh, ttxVehicleCfg.ttxTerminalNoLength || 12);
      // 切割日期
      const aDate = dates.split('-');
      const month = aDate[1].replace(/^0/, '');
      const day = aDate[2].replace(/^0/, '');
      const data = {         
        YEAR: aDate[0],
        MON:month,
        DAY:day,
        LOC:loc,
        jsession: this.jsession,
        DevIDNO:newVeh
      }
      const res2 = await getVideoFileInfo(data); 
      // ${host}StandardApiAction_getVideoFileInfo.action?DownType=2&DevIDNO=${data.veh}&LOC=${data.loc}
      // &CHN=-1&YEAR=${data.year}&MON=${data.month}&DAY=${data.day}&RECTYPE=-1&FILEATTR=2&BEG=0&END=86399&ARM1=0&ARM2=0&RES=3&STREAM=-1&STORE=0&jsession=${data.jsession}
      try {
        eventBus.$emit('setInfo', res2, { dates, veh: newVeh })
      } catch(err) {

      }
    },
    /**
     * 树的搜索框改变的时候
     * @param {Event} e Event对象
     */
    changeVal(e) {
      const val = e.target.value;
      if (!val) {
        const oldTree = getCopyObj(this.tree);
        this.tree = []
        this.$nextTick(() => {
          this.tree = oldTree;
        })
      } else {
        this.$refs.tree.filter(val);
      }
    },
    /**
     * 点击树节点
     */
     handleNode(data) {
      // 是否是车辆节点且有视频节点
      const count = data.child instanceof Array && data.child.length
      if (data.type == '2' && count) {
        const veh = this.search.veh
        if (veh === data.vehTerminalNo) return
        this.curNode = data
        this.$set(this.search, 'val', data.name)
        this.search.veh = data.vehTerminalNo
        this.isShow = false
        eventBus.$emit('handleNode', count)
      }
    },
    /**
     * 双击播放视频
     */
    handleDblPlay(data) {
      // 修改成播放状态
      const player = new Aliplayer({
        id: 'my_video_1',
        source: data.url,
        width: '100%',
        height: '100%',
        autoplay: true,
        isLive: false,
        rePlay: false,
        playsinline: true,
        preload: true,
        controlBarVisibility: 'hover',
        useFlashPrism: true
      },
      player => {
        console.log('播放器创建了。');
      });
      // 将播放器实例保存起来
      this.$set(this.videos, 'oV', player);
      this.$set(this.videos, 'switch', true);
      this.$set(this.videos, 'title', `${data.devIdno}-CH${data.chn}`);
      player.on('play', () => {
        // 将播放器实例保存起来
        console.log('视频加载完成');
      })
    }
  }
}
</script>

<style scoped>
.video-box {
  flex: 5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 999;
  height: 100%;
}
.active-bar {
  overflow: hidden;
  background: #fff;
  padding: 2px 5px;
}
.active-bar span {
  cursor: pointer;
  float: left;
  font-size: 20px;
  display: block;
  margin: 0 0 0 5px;
  color: #aaa;
}
.active-bar span:hover, .active-bar .active {
  color: #00a8d4;
}
.active-bar .el-dropdown-link {
  margin: 0;
}
.video-box .page {
  flex: 1;
  background: #f0f0f0;
  padding: 3px 0 2px 10px;
  display: flex;
  flex-direction: column;
}
.video-box .video {
  background: #fff;
  padding: 0 5px 5px;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #f2f6fc;
  border-radius: 3px;
}

.video-box .video-js, .video-box video {
  width: 100%;
  height: 100%;
}

.video-box .cur-title {
  height: 26px;
  line-height: 26px;
  position: relative;
  text-align: center;
  overflow: hidden;
  flex-shrink: 0;
}
.video-box .cur-title .num {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  line-height: 26px;
}
.video-box .video1 {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 0 15px 3px;
  flex: 1;
  box-sizing: border-box;
}
.video-box .iframe {
  flex: 1;
  position: relative;
}
.video-box .iframe{
  display: flex;
  overflow: hidden;
  flex-direction: column;
  align-items:center;
  justify-content:center;
}
.video-box .video1 .video-group {
  width: 100%;
}

.video-box .video-group {
  width: 100%;
  height: 100%;
}

.video-box  .poster-img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.controller {
  padding: 10px 10px;
  position: relative;
  background: #fff;
  box-shadow: 0 5px -5px 0 rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  border-bottom: 1px solid #c0bfbe;
}
.controller .input {
  width: 220px !important;
  margin-right: 10px;
}
.controller .input-date {
  width: 180px !important;
}
.controller .down-icon {
  font-size: 20px;
  cursor: pointer;
}
.controller-btn {
  overflow: hidden;
  padding: 0 10px;
  display: flex;
}
.controller-btn .radio {
  padding: 10px 10px 0;
  height: 30px;
}
.controller-btn .radio >>> .el-radio {
  margin-right: 10px;
}
.controller em {
  display: block;
  float: left;
  margin: 2px 4px 0;
  cursor: pointer;
  font-size: 20px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  background: #00a8d4;
  border-radius: 50%;
}
.car-tree {
  position: absolute;
  bottom: 68px;
  left: 20px;
  width: 280px;
  height: 300px;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}
.car-tree .search-bar {
  padding: 6px 6px 0;
}
</style>