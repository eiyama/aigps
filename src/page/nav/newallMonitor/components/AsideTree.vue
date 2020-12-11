<template>
  <div :class="asideOpend ? 'aside-trans-top' : 'aside-trans-buttom'" class="side-p">
    <div @contextmenu.prevent class="side-box">
      <div class="side-num border-bottom">
        <!-- 全部 -->
        <div class="all-model">
          <div class="all" @click="changeTreeType('all')">
            <span class="icon iconfont icon-huoche select-color"></span>
            <span class="title-color">{{ $t('allMonitor.sideTabsTitle.all') }}:{{ carInfo.all || 0 }}</span>
          </div>
        </div>
        <!-- 分享 -->
        <div class="share">
          <el-tooltip class="item" @click.native="changeInfo" effect="dark"
            :content=" isShare ? $t('allMonitor.sideTabsTitle.msgShareHide') : $t('allMonitor.sideTabsTitle.msgShareShow') "
            placement="bottom">
            <span class="icon iconfont icon-yanjing" :style="{ color: isShare ? '#a9d11c' : '#bfbfbf' }"></span>
          </el-tooltip>
          <span>{{ $t('allMonitor.sideTabsTitle.share') }}:{{ carInfo.share || 0 }}</span>
        </div>
        <!-- 告警 -->
        <div class="alarm" style="color: #e33d08;" @click="changeTreeType('alarm')">
          <span class="icon iconfont icon-icon-life-alarm"></span>
          <span>{{ $t('allMonitor.sideTabsTitle.alarm') }}:{{ carInfo.alarm || 0 }}</span>
        </div>
      </div>
      <div class="side-num pading-left">
        <el-tooltip class="item" @click.native="changeTreeType('run')" effect="dark"
          :content=" $t('allMonitor.sideTabsTitle.run') " placement="bottom">
          <span style="color:rgb(169, 209, 28);">
            <span class="icon iconfont icon-yunhang rotate-icon" style="margin-right: 10px;display:inline-block;font-size: 17px;"></span>
            {{ carInfo.run || 0 }}
          </span>
        </el-tooltip>
        <el-tooltip class="item" @click.native="changeTreeType('stop')" effect="dark"
          :content=" $t('allMonitor.sideTabsTitle.stop')" placement="bottom">
          <span class="icon iconfont icon-tingche1" style="color:rgb(230, 162, 60);">
            <span style="margin-left: 10px;">{{ carInfo.stop || 0 }}</span>
          </span>
        </el-tooltip>
        <el-tooltip class="item" @click.native="changeTreeType('offline')"
          effect="dark" :content=" $t('allMonitor.sideTabsTitle.offline')" placement="bottom">
          <span class="icon iconfont icon-sta_2" style="color: #bfbfbf;">
            <span style="margin-left: 10px;">{{ carInfo.offline || 0 }}</span>
          </span>
        </el-tooltip>
      </div>
      <img src="@/assets/image/map/dropDownIcon.png" v-show="!asideOpend" @click="handleAnimtion" class="icon-down">
      <img src="@/assets/image/map/pullUpIcon.png" v-show="asideOpend" @click="handleAnimtion" class="icon-up">
      <el-input class="side-search" size="small" :placeholder="$t('placeholder.carSearch')"
        v-model="searchInput" @input.native="changeInput" @clear="clear" clearable></el-input>
      <!-- 树 -->
      <el-scrollbar class="scroll-y" style="margin: 10px 0 0;flex:1;">
        <div id="down-side" class="border-blue" style="position:relative;">
          <el-tree empty-text accordion :default-expanded-keys="openKeys" :expand-on-click-node="false" @check="changeChecked"
            :data="data" show-checkbox node-key="id" @node-click="handleNode" @node-expand="handleOpen"
            highlight-current ref="tree" :props="defaultProps" :filter-node-method="filterNode">
            <span @dblclick="dblNode(data, node)" class="custom-tree-node" slot-scope="{ node, data }">
              <!-- 在线静止 -->
              <span v-if="data.type=='2' && data.location.state == '0'" style="color:#E6A23C;font-size:14px;display:inline-block;"
                class="icon iconfont">&#xe7f9;</span>
              <!-- 在线运行 -->
              <span v-else-if="data.type=='2' && data.location.state == '1'" style="color:#a9d11c;font-size:14px;display:inline-block;"
                class="icon iconfont rotate-icon">&#xe699;</span>
              <!-- 离线 -->
              <span v-else-if="data.type=='2' && (data.location.state == '2' || data.location.state == '3')"
                style="color:#bfbfbf;font-size:14px;" class="icon iconfont">&#xe611;</span>
              <!-- 父级节点收缩的文件图标 -->
              <span v-else-if="data.type=='1' && !node.expanded" style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe642;</span>
              <!-- 父级节点展开的文件图标 -->
              <span v-else-if="data.type=='1' && node.expanded" style="color:#00a8d4;font-size:12px;" class="icon iconfont">&#xe602;</span>
              <!-- 摄像头关闭 -->
              <span v-else-if="data.type == '3' && !data.isPlay" style="color:#6666;font-size:14px;" class="camera iconfont icon-shexiangtou"></span>
              <!-- 摄像头开启 -->                
              <span v-else-if="data.type == '3' && data.isPlay" style="color:#6666;font-size:14px;" class="camera iconfont icon-shipin1"></span>
              <span style="padding: 0 5px;color: #000;">{{ node.label}}</span>
              <!-- 该车辆是否有视频 -->
              <span v-if="data.type == '2' && (Array.isArray(data.child) && data.child.length)" style="color:#6666;font-size:14px;margin: 0 5px 0 0;" class="iconfont icon-shipin"></span>
              <!-- 共享图标 -->
              <el-tooltip class="item" effect="dark" :content=" $t('allMonitor.sideTabsTitle.share') " placement="bottom">
                <span v-if="data.type == '2' && data.allot == '1'" style="color:#a9d11c;font-size:14px;margin: 0 5px 0 0;" class="icon iconfont">&#xe688;</span>
              </el-tooltip>
              <!-- 报警 -->
              <span @click.stop="handleAlarm(data)" v-if="data.type == '2' && data.location.alam == '1'" style="color:#e67060;font-size:14px;" class="icon iconfont">&#xe616;</span>
              <!-- 离线时长，离线的情况下才显示-->
              <span v-if="data.type == '2' && (data.location.state == '2' || data.location.state == '3')"
                style="color:#6666;font-size:12px;padding: 0 0 0 8px;">
                {{ data.location && data.location.offlineTime ? data.location.offlineTime : '' }}
              </span>
            </span>
            <!-- 视频监控 -->
          </el-tree>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped>
.side-p {
  /* padding: 5px 0 40px 5px; */
  width: 330px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  box-sizing: border-box;
  z-index: 999;
}

.side-box .left-icon,
.side-box .right-icon {
  line-height: 40px;
  cursor: pointer;
  position: absolute;
  top: 0;
  z-index: 12;
}

.side-box .left-icon {
  left: 5px;
}

.side-box .right-icon {
  right: 5px;
}

.side-box {
  padding: 5px 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.icon-down,
.icon-up {
  position: absolute;
  top: 20px;
  right: 10px;
  width: 19px;
  height: 30px;
  cursor: pointer;
}

.side-box .title {
  line-height: 30px;
}
.aside-trans-buttom {
  transition: all 0.5s;
  height: 120px !important;
}

.aside-trans-top {
  transition: all 0.5s;
  height: 100% !important;
}
.side-num .tab-btn {
  margin: 0;
  padding: 4px 5px;
  min-width: 50px;
  font-size: 14px;
  text-align: center;
}

.side-num {
  text-align: center;
  line-height: 34px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 260px;
  flex-shrink: 0;
  box-sizing: border-box;
}
.side-num .all-model {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.side-num .all-model .all {
  margin-right: 10px;
}
.pading-left {
  padding-left: 30px;
}

.side-num span {
  cursor: pointer;
}

.side-num .current {
  color: #333;
  float: left;
}

.border-bottom >>> {
  border-bottom-style: dashed;
}
.rotate-icon {
  -webkit-animation: icon-rotate 1s linear infinite;
  -moz-animation: icon-rotate 1s linear infinite;
  -ms-animation: icon-rotate 1s linear infinite;
  -o-animation: icon-rotate 1s linear infinite;
  animation: icon-rotate 1s linear infinite;
}

@-webkit-keyframes icon-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@-moz-keyframes icon-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@-ms-keyframes icon-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes icon-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes icon-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

<script>
import { Tooltip, Tree, Scrollbar } from 'element-ui'
import { lastRecodes } from '@/api/vehicle'
import { getDateStr, getCopyObj } from '@/utils/util'
export default {
  components: {
    ElTooltip: Tooltip,
    ElTree: Tree,
    ElScrollbar: Scrollbar
  },
  data() {
    const data = this.getData()
    return {
      ...data
    }
  },
  props: {
    info: {
      type: Object,
      default: () => new Object
    },
    defaultProps: {
      type: Object,
      default: () => new Object
    }
  },
  created() {
    // this.updateTree()
  },
  beforeDestroy() {
    this.data = []
    clearTimeout(this.tid)
  },
  methods: {
    getData() {
      return {
        asideOpend: true,
        lock: true,
        isShare: true,
        searchInput: '',
        carInfo: this.info,
        treeShowState: 'all',
        openKeys: [],
        data: [],
        tid: null,
        oldVal: ''
      }
    },
    /**
     * 10分钟更新一次
     */
    updateTree() {
      var curTime = new Date().getTime();
      this.tid = setTimeout(() => {
        this.data = this.updateTreeState(this.data, curTime);
        this.updateTree();
      }, 600 * 1000);
    },
    /**
     * 更新车辆状态
     * @param {Array} arr 树数据
     * @param {Number} curTime 当前时间的时间戳
     */
    updateTreeState(arr, curTime) {
      var minutes15 = 15 * 60 * 1000;
      for (const [index, elem] of arr.entries()) {
        // 为车辆节点，且状态不为离线和未激活状态
        const state = elem.location ? elem.location.state : null;
        if (elem.type == 2 && state != 2 && state != 3 && state != 6) {
          var timeStr = getDateStr(elem.location.gpsTime).replace(/\-/g, '/');
          var gpsTimes = new Date(timeStr).getTime();
          // 当前时间减去定位时间大于15分钟加上上报频率，且是运行或者停车才改变
          if (curTime - gpsTimes > minutes15 + elem.upFrequency * 1000 && (state === 0 || state === 1)) {
            if (state === 0) {
              this.$set(this.carInfo, 'stop', this.carInfo.stop --)
              // console.log('stop离线')
            } else {
              this.$set(this.carInfo, 'run', this.carInfo.run --)
              // console.log('run离线')
            }
            this.$set(this.carInfo, 'offline', this.carInfo.offline ++)
            elem.location.state = 2;
          }
        } else {
          if (Array.isArray(elem.child) && elem.child.length) {
            this.updateTreeState(elem.child, curTime);
          }
        }
      }
      return arr;
    },
    /**
     * 设置树的数据
     */
    setData(data, id) {
      this.data = data
      this.openKeys.push(id)
    },
    /**
     * 点击切换状态，根据状态来展示树节点
     * @param {String} type 状态值
     */
    changeTreeType(type) {
      // 切换一次更新一次地图的marker点
      // this.changeChecked();
      this.treeShowState = type
      if (!this.searchInput || this.searchInput.length > 2) {
        this.$refs.tree.filter(this.searchInput)
      } else {
        this.$refs.tree.filter('')
      }
    },
    /**
     * 左侧树盒子切换展开闭合的动画
     */
    handleAnimtion() {
      if (!this.lock) {
        return
      }
      this.lock = false;
      this.asideOpend = !this.asideOpend
      const tid = setTimeout(() => {
        this.lock = true
        clearTimeout(tid)
      }, 500)
    },
    /**
     * 切换共享的状态
     */
    changeInfo() {
      this.isShare = !this.isShare;
      this.isShareFn(this.isShare);
    },
    /**
     * 点击切换过滤
     * @param {Boolean} isShare 是否过滤
     */
    isShareFn(isShare) {
      if (this.searchInput.length >= 2) {
        this.$refs.tree.filter(this.searchInput);
      } else {
        this.$refs.tree.filter('');
      }
      var obj = {
        all: 0,
        run: 0,
        stop: 0,
        offline: 0,
        alarm: 0,
        share: 0
      };
      this.carInfo = this.getStateTotall(this.data, obj, isShare);
    },
    /**
     * 计算树的各种状态下的车辆总数
     * @param {Array} tree 树的数据
     * @param {Object} obj 初始值的json
     * @param {Boolean} isShare 是否过滤共享
     * @return {Object} obj 返回计算之后的数据
     */
    //计算树的各种状态下的车辆总数
    getStateTotall(tree, obj, isShare) {
      for (const v of tree.values()) {
        if (v.type == '2') {
          if (v.allot == 1) {
            obj.share++; // 分享
          }
          if (isShare) {
            //包含分配车辆
            if (!!v.location ){
              if(v.location.state == 0){
                obj.stop++; // 静止
              } else if (v.location.state == 1){
                obj.run++; // 运行
              } else if (v.location.state == 2 || v.location.state == 3 || v.location.state == 6){
                obj.offline++; // 离线    
              } else {
                  console.log(v); //其他
              }
              if (v.location.alam == 1) {
                obj.alarm++; // 告警
              }
            }
          } else {
            if (v.allot == 0) {
              obj.all++; // 全部
            }
            if (v.location && v.allot == 0) {
              if (v.location.state == 0) {
                obj.stop++;
              } else if (v.location.state == 1) {
                obj.run++;
              } else if (v.location.state == 2 || v.location.state == 3 || v.location.state == 6) {
                obj.offline++;
              }
              if (v.location.alam == 1) {
                obj.alarm++;
              }
            }
          }
        } else {
          if (!!v.child && v.child.length > 0) {
            this.getStateTotall(v.child, obj, isShare);
          }
        }
      }
      return obj;
    },
    /**
     * 设置车辆的值
     */
    setCarInfo(key, val) {
      this.$set(this.carInfo, key, this.carInfo[key] + val)
    },
    /**
     * 树的复选框勾选
     * @param {Object} data 当前勾选的data数据
     * @param {Object} node 当前勾选的node数据
     */
    changeChecked(data, node) {
      this.$emit('check', data, node)
    },
    /**
     * 点击树的报警图标然后弹窗报警弹窗
     * @param {Object} data 当前节点的数据
     */
    handleAlarm(data) {
      eventBus.$emit("changeAlamPop", data);
    },
    /**
     * 点击树节点
     * @param {Object} data 当前勾选的data数据
     * @param {Object} node 当前勾选的node数据
     */
    handleNode(data, node) {
      // 必须勾选且是车辆节点
      if (node.checked && data.type != 3 && data.type != 1) {
        this.$emit('node-click', data, node)
      }
    },
    /**
     * 点击树节点被展开之后隐藏摄像头的复选框
     * @param {Object} data 当前勾选的data数据
     * @param {Object} node 当前勾选的node数据
     */
    handleOpen(data, node) {
      // 展开的车辆节点
      if (data.type == 2 && data.child instanceof Array && data.child.length) {
        this.$nextTick(() => {
          const aCamera = document.getElementsByClassName('camera');
          const arr = new Array(aCamera.length);
          one: for (const i of arr.keys()) {
            const aSpan = aCamera[i].parentNode.parentNode.children;
            const arr2 = new Array(aSpan.length)
            two: for (const j of arr2.keys()) {
              const cName = aSpan[j].getAttribute('class');
              if (cName.indexOf('el-checkbox') > -1) {
                aSpan[j].style.display = 'none';
                break two;
              }
            }
          }
        })
      }
    },
    /**
     * 输入框input事件
     * @param {Event} ev event对象
     */
    changeInput(ev) {
      const val = ev.target.value;
      // 通过优化输入来尽量减少调用过滤的方法
      if (this.oldVal === val) return;
      this.oldVal = val;
      setTimeout(() => {
        if (val === this.oldVal) {
          if (!val) {
            this.clear();
          } else if (val.length >= 2) {
            this.$refs.tree.filter(val);
          }
        }
      }, 400)
    },
    /**
     * 清除输入框的值
     */
    clear() {
      const oldTree = getCopyObj(this.data);
      const keys = this.$refs.tree.getCheckedKeys();
      this.data = [];
      this.$nextTick(() => {
        this.data = oldTree;
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(keys);
        })
      })
    },
    /**
     * 树过滤的方法
     */
    filterNode(value, data) {
      var boole = false;      
      // 根据车牌号、终端号、SIM号、VIN号筛选
      if (value) {
        const valCase = value.toUpperCase();
        const name = data.name ? data.name.toUpperCase() : '';
        const veh = data.vehTerminalNo ? data.vehTerminalNo.toUpperCase() : '';
        const plateNo = data.vehPlateNo ? data.vehPlateNo.toUpperCase() : '';
        const vin = data.vehVin ? data.vehVin.toUpperCase() : '';
        const sim = data.sim ? data.sim.toUpperCase() : '';
        if (name.indexOf(valCase) > -1 || veh.indexOf(valCase) > -1 || plateNo.indexOf(valCase) > -1 ||
         vin.indexOf(valCase) > -1 || sim.indexOf(valCase) > -1) {
          // 是否展示分享的
          if (this.isShare) {
            boole = true;
          } else {
            // 等于0不是分享，1是分享的
            if (data.allot == 0) {
              boole = true;
            }
          }
        }
      }
      const state = data.location ? data.location.state : null;
      const alam = data.location ? data.location.alam : null;
      this.$nextTick(() => {
        this.handleOpen(data)
      })
      switch (this.treeShowState) {
        case 'all': //全部的
          if (!value) {
            // 是否展示分享
            if (this.isShare) {
              return true;
            } else {
              if (data.allot == 0) {
                return true;
              } else {
                return false;
              }
            }
          }
          return boole;
          break;
        case 'run': //运行的
          if (!value) {
            if (this.isShare) {
              if (state == '1') {
                return true;
              } else {
                return false;
              }
            } else {
              if (state == '1' && data.allot == 0) {
                return true;
              } else {
                return false;
              }
            }
          } else {
            if (state == '1' && boole) {
              return true;
            } else {
              return false;
            }
          }
          break;
        case 'stop': //停止
          if (!value) {
            if (this.isShare) {
              if (state == '0') {
                return true;
              } else {
                return false;
              }
            } else {
              if (
                state == '0' &&
                data.allot == 0
              ) {
                return true;
              } else {
                return false;
              }
            }
          } else {
            if (state == '0' && boole) {
              return true;
            } else {
              return false;
            }
          }
          break;
        case 'offline': //离线
          if (!value) {
            if (this.isShare) {
              if (state == '2' || state == '3' || state == '6') {
                return true;
              } else {
                return false;
              }
            } else {
              if ((state == '2' || state == '3' || state == '6') && data.allot == 0) {
                return true;
              } else {
                return false;
              }
            }
          } else {
            if ((state == '2' || state == '3' || state == '6') && boole) {
              return true;
            } else {
              return false;
            }
          }
          break;
        default:
          //告警
          if (!value) {
            if (this.isShare) {
              if (alam == '1') {
                return true;
              } else {
                return false;
              }
            } else {
              if (alam == '1' && data.allot == 0) {
                return true;
              } else {
                return false;
              }
            }
          } else {
            if (alam == '1' && boole) {
              return true;
            } else {
              return false;
            }
          }
      }
    },
     /**
     * 双击树节点
     * @param data 节点的data
     * @param node 节点的node
     */
    dblNode(data, node) {
      this.$emit('dblNode', data, node)
    } 
  }
}
</script>