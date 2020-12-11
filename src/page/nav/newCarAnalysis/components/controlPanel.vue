<template>
  <div class="controller" @mousedown.stop>
    <div class="controller-btn">
      <div class="input" @click.stop @contextmenu.stop>
        <el-input @click.native="handleInput" v-model="search.val" :readonly="true" class="input" :placeholder="$t('placeholder.carSearch')">
          <i slot="suffix" class="el-input__icon down-icon el-icon-caret-bottom"></i>
        </el-input>
      </div>
      <el-date-picker :readonly="playState === 1" value-format="yyyy-MM-dd HH:mm:ss" v-model="search.dates" style="width: 360px;float:left;margin-right:5px;"
        type="datetimerange" :picker-options="pickerOptions" :range-separator="$t('placeholder.to')" :start-placeholder="$t('placeholder.startTime')"
        :end-placeholder="$t('placeholder.endTime')" :default-time="['00:00:00', '23:59:59']" align="right" @change="changeDate"></el-date-picker>          
      <el-tooltip class="item" effect="dark" :content="rate" placement="top">
        <em @click="changeTaktTime(false)" class="icon iconfont">&#xe726;</em>
      </el-tooltip>
      <el-tooltip v-show="playState !== 1" class="item" effect="dark" :content="$t('carAnalysis.controller.startPlay')" placement="top">
        <em @click="handlePlay" class="icon iconfont">&#xe61c;</em>
      </el-tooltip>
      <el-tooltip v-if="playState === 1" class="item" effect="dark" :content="$t('carAnalysis.controller.stopPlay')" placement="top">
        <em @click="handleSuspend" class="icon iconfont">&#xe600;</em>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="rate" placement="top">
        <em @click="changeTaktTime(true)" class="icon iconfont">&#xe614;</em>
      </el-tooltip>
      <div class="zero floatRight">
        <span class="name">{{ $t('carAnalysis.controller.zeroName') }}</span>
        <el-checkbox v-model="search.zero"></el-checkbox>
      </div>
    </div>
    <div class="block slider">
      <el-slider :max="slider.max" @change="changeSlider" :show-tooltip="false" style="width:100%;" v-model="slider.progress" ></el-slider>
    </div>
    <!-- 选择车辆的树 -->
    <div class="car-tree" @click.stop @contextmenu.stop v-show="isShow">
      <div class="search-bar">
        <el-input size="small" :placeholder="$t('placeholder.carSearch')" @input.native="changeVal" v-model="searchValue">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-scrollbar class="border-blue scroll-y" width="100%" style="margin: 10px 0 0;flex:1;">
        <el-tree empty-text :default-expanded-keys="opendList" :expand-on-click-node="false"
          :data="tree" node-key="id" @node-click="handleNodeSideClick" highlight-current
          ref="tree" :props="defaultProps" :filter-node-method="filterNode">
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { Checkbox, Slider, Tooltip, Tree, Scrollbar, DatePicker, Message } from 'element-ui'
import { getPickerOptions, getTodays } from '@/utils/data'
import { getFormatTime, getCopyObj } from '@/utils/util'

export default {
  components: {
    ElCheckbox: Checkbox,
    ElSlider: Slider,
    ElTooltip: Tooltip,
    ElTree: Tree,
    ElScrollbar: Scrollbar,
    ElDatePicker: DatePicker
  },
  data() {
    const data = this.getData()
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      oSliderBtn: null,
      ...data
    }
  },
  computed: {
    
  },
  props: {
    isPlay: {
      type: Boolean,
      default: false
    }
  },
  async created() {
    try {
      const tree = await this.$store.dispatch('data/setCarTree'); //sessionStorage取值
      this.tree = tree
      this.opendList.push(tree[0].id)
    } catch(err) {

    }
    eventBus.$on('changeState', this.changeState)
    eventBus.$on('setSlider', this.setSlider)
    await this.$nextTick()
    this.oSliderBtn = document.querySelector('.el-slider__button-wrapper')
    this.oSliderBtn.onmousedown = this.sliderDown
    document.documentElement.addEventListener('click', this.handleBox)
  },
  beforeDestroy() {
    document.documentElement.removeEventListener('click', this.handleBox)
    if (this.oSliderBtn)
      this.oSliderBtn.onmousedown = null
    eventBus.$off('changeState', this.changeState)
    eventBus.$off('setSlider', this.setSlider)
  },
  methods: {
    /**
     * 初始化数据
     */
    getData() {
      const pickerOptions = getPickerOptions(this.$t('otherText'));
      const search = {
        val: '',
        dates: getTodays(),
        zero: false
      }
      return {
        pickerOptions,
        search,
        slider: {},
        rate: '2x',
        taktTime: 500,
        playState: 0, // 播放状态 0是结束且清除了地图覆盖物（当更新了时间和车辆的时候才清除覆盖物），1是开始，2是暂停，3是结束但没有清除覆盖物
        searchValue: '',
        opendList: [],
        tree: [],
        isShow: false,
        curNode: {}
      }
    },
    /**
     * 监控页面点击轨迹按钮
     * @param {Object} opt 搜索参数
     */
    handleTrail(opt) {
      this.$set(this.search, 'veh', opt.id)
      this.$set(this.search, 'val', opt.carName)
      this.$set(this.search, 'dates', opt.dates || getTodays())
      this.handlePlay()
    },
    /**
     * 初始化数据
     */
    initData() {
      const data = this.getData()
      for (const [k, v] of Object.entries(data)) {
        this[k] = v
      }
    },
    /**
     * 改变播放按钮的状态
     * @param {Number} state 0是结束，1是开始，2是暂停
     */
    changeState(state) {
      this.playState = state
    },
    /**
     * silder的按钮down事件
     */
    sliderDown() {
      const oldVal = this.slider.progress
      // 如果正在播放就暂停播放
      if (this.playState === 1)
        eventBus.$emit('suspend', false)
      window.onmouseup = ev => {
        const newVal = this.slider.progress
        // 滑块的值没有改变如果之前是播放状态现在继续开始播放
        if (oldVal === newVal && this.playState === 1) {
          const dates = this.search.dates
          eventBus.$emit('suspend', true)
          eventBus.$emit('handlePlay', null, dates[1])
        }
        window.onmouseup = null
      }
    },
    /**
     * 点击body隐藏部门树选择
     */
    handleBox() {
      this.isShow = false
    },
    /**
     * 设置slider的最大值
     * @param {Number} max 最大值
     */
    setSliderMax(max) {
      this.$set(this.slider, 'max', max)
    },
    /**
     * 设置滑块的值
     * @param {Number} progress 滑块的值
     */
    setSlider(progress) {
      this.$set(this.slider, 'progress', progress)
    },
    /**
     * 点击输入框显示车辆树
     */
    handleInput() {
      // 轨迹开始时不能选择车牌
      if (this.playState === 1) return
      this.isShow = true
    },
    /**
     * 选择起始与结束时间
     */
    changeDate() {
      this.playState = 0
      const dates = this.search.dates
      if (!dates || !dates.length) return;
      eventBus.$emit('initData')
      this.setSlider(0)
    },
    /**
     * 点击增加轨迹播放的间隔时间
     * @param {Boolean} state true是加，false是减
     */
    changeTaktTime(state) {
      if (state) {
        if (this.taktTime === 200) {
          Message.error(this.$t('error.msgMax'))
          return
        }
        this.taktTime -= 300
      } else {
        if (this.taktTime === 800) {
          Message.error(this.$t('error.msgMin'))
          return
        }
        this.taktTime += 300
      }
      this.rate = this.getRate(this.taktTime)
      eventBus.$emit('changeTaktTime', this.taktTime)
    },
    /**
     * 获取轨迹播放速度级别
     */
    getRate(val) {
      switch (val) {
        case 200:
          return '3X';
          break;
        case 500:
          return '2X';
          break;
        case 800:
          return '1X';
          break;
      }
    },
    /**
     * 获取搜索的数据
     */
    getSearch() {
      return this.search
    },
    /**
     * 轨迹开始播放
     */
    handlePlay() {
      const val = this.search.val
      const dates = this.search.dates
      if (!val) {
        Message.error(this.$t('error.selectCar'))
        return
      } else if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTime'))
        return
      }
      // 请求数据播放
      if (this.playState === 0) {
        eventBus.$emit('initData')
        this.$emit('handlePlay')
      } else {
        // 没有改变时间与车辆，不请求，从新开始播放
        if (this.playState === 3) eventBus.$emit('setIndex', 0)
        eventBus.$emit('suspend', true)
        eventBus.$emit('handlePlay', null, dates[1])
      }
      this.playState = 1
    },
    /**
     * 轨迹暂停播放
     */
    handleSuspend() {
      this.playState = 2;
      eventBus.$emit('suspend', false)
    },
    /**
     * 拖动滑块
     * @param {Number} val 滑块的当前值
     */
    changeSlider(val) {
      const veh = this.search.veh
      const dates = this.search.dates
      if (!veh || !dates || !dates.length) return
      if (this.playState === 0) {
        this.$emit('handlePlay')
        this.$set(this.slider, 'sliderL', 0)
        this.$set(this.slider, 'sliderR', 0)
      } else {
        eventBus.$emit('suspend', true)
        eventBus.$emit('setIndex', val)
        eventBus.$emit('handlePlay', null)
      }
      this.playState = 1
    },
    /**
     * 树过滤
     */
    filterNode(val, data) {
      if (!val) return true;
      var boole = false;
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
     * 点击树节点
     */
    handleNodeSideClick(data) {
      // 是否是车辆节点
      if (data.type == '2') {
        const veh = this.search.veh
        if (veh === data.vehTerminalNo) return
        this.curNode = data
        this.$set(this.search, 'val', data.name)
        this.search.veh = data.vehTerminalNo
        this.isShow = false
        this.playState = 0
        eventBus.$emit('initData')
        this.setSlider(0)
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
    }
  }
}
</script>

<style scoped>
.controller {
  position: absolute;
  left: 50%;
  bottom: 10px;
  padding: 10px 0 0;
  background: #fff;
  z-index: 20;
  width: 844px;
  box-shadow: 1px 5px 5px 0 rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  margin-left: -422px;
}
.controller .input {
  width: 220px !important;
  float: left;
  margin-right: 10px;
}
.controller .down-icon {
  font-size: 20px;
  cursor: pointer;
}
.controller .block {
  width: 100%;
}
.controller-btn {
  overflow: hidden;
  padding: 0 10px;
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
.controller .block {
  margin-top: 11px;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
}
.slider-l, .slider-r {
  position: absolute;
  background: red;
  height: 3px;
  top: 7px;
}
.slider-l {
  left: 10px;
  border-radius: 2px 0 0 2px;
}
.slider-r {
  right: 10px;
  border-radius: 0 2px 2px 0;
}
.controller .zero {
  margin: 10px 10px 0 0;
}
.controller .floatRight {
  margin-top: 10px;
}
.controller .floatRight .name {
  color: #666;
  margin-right: 3px;
}
.car-tree {
  position: absolute;
  bottom: 85px;
  left: 10px;
  width: 280px;
  height: 300px;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.car-tree .search-bar {
  padding: 6px 6px 0;
}
</style>