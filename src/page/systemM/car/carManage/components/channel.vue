<template>
  <!-- 通道参数设置 -->
  <div v-show="isShow" class="other">
    <div class="cur-title">
      <span style="margin-right: 5px; cursor: pointer;" class="el-icon-arrow-right"
        :class="isSwitch ? 'rotate90' : 'rotate0'" @click="handleAnmation()"></span>
      通道参数设置
    </div>
    <div class="animetion" :class="isSwitch ? 'animationHAuto' : 'animationH0'">
      <div class="input-bar">
        <span class="name">通道数目</span>
        <el-select @change="onChange" class="input" v-model="num">
          <el-option v-for="(item,index) of nums" :key="index" :label="index" :value="item-1"></el-option>
        </el-select>
      </div>
      <div class="datas">
        <div class="left">通道参数</div>
        <div class="right">
          <div v-for="(v, i) of datas" :key="i" class="li">
            <div class="num">{{ i+1 }}</div>
            <div class="input-group">
              <div class="input-bar">
                <span>{{ v.name.label }}</span>
                <el-input :style="{ width: v.name.width }" v-model="v.name.model"/>
              </div>
              <div class="input-bar">
                <span>{{ v.type.label }}</span>
                <el-select :style="{width: v.type.width + ' !important'}" class="input" v-model="v.type.model">
                  <el-option v-for="(item,index) in v.type.list" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Select, Option } from 'element-ui'

export default {
  components: {
    ElSelect: Select,
    ElOption: Option
  },
  data() {
    return {
      isSwitch: false,
      num: 0,
      nums: 16,
      datas: [],
      lock: true
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * 设置闭合或者展开
     * @param {Boolean} state
     */
    setState(state) {
      this.isSwitch = state;
    },
    /**
     * 设置通道参数
     * @param {Array} arr 重新赋值数据
     */
    setDatas(arr) {
      this.datas = [];
      for (const v of arr.values()) {
        const obj = this.getChannelData();
        obj.name.model = v.ChannelName;
        obj.type.model = v.ChannelType;
        this.datas.push(obj);
      }
      this.num = arr.length;
      this.isSwitch = false;
    },
    /**
     * 获取通道参数
     * @return {Array} 返回通道参数
     */
    getDatas() {
      return this.datas;
    },
    /**
     * 点击展开闭合动画
     */
    handleAnmation() {
      if (!this.lock) {
        return;
      }
      this.lock = false;
      this.isSwitch = !this.isSwitch;
      const tid = setTimeout(() => {
        clearTimeout(tid);
        this.lock = true;
      }, 300);
    },
    /**
     * 通道数select值改变的时候
     */
    onChange(val) {
      const arr = new Array(val);
      this.datas = [];
      for (const [i, v] of arr.entries()) {
        v = this.getChannelData();
        v.name.model = `ch${i+1}`;
        this.datas.push(v);
      }
    },
    /**
     * 获取通道参数
     */
    getChannelData() {
      return {
        name: {
          label: '名称：',
          width: '220px',
          model: ''
        },
        type: {
          label: '型号：',
          width: '220px',
          model: '模拟摄像头',
          list: [
            {
              label: '模拟摄像头',
              value: '模拟摄像头'
            },
            {
              label: '数字摄像头',
              value: '数字摄像头'
            },
            {
              label: '传感器',
              value: '传感器'
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped>
.input-bar {
  display: flex;
  padding: 10px 0 0;
}
.input-bar .name {
  display: block;
  width: 70px;
  line-height: 40px;
}
.input-bar .input {
  flex: 1;
}
.other {
  overflow: hidden;
  padding: 10px 9px 0;
}
.other .cur-title {
  font-size: 15px;
}
.datas {
  display: flex;
  padding: 10px 0 0;
}
.datas .left {
  padding: 0 5px;
  background: #f1f1f1;
  display: flex;
  align-items: center;
}
.datas .num {
  text-align: center;
  font-size: 14px;
  background: #f1f1f1;
}
.datas .right {
  flex: 1;
  overflow: hidden;
  padding: 0 0 0 5px;
}
.datas .input-group {
  margin-left: -108px;
  overflow: hidden;
  padding: 5px 0;
}
.datas .input-bar {
  float: left;
  margin-left: 108px;
}
.datas .input-bar span {
  display: block;
  width: 50px;
  line-height: 40px;
  text-align: right;
}
.animationH0 {
  transition: 0.3s all;
  max-height: 0 !important;
}
.animationHAuto {
  transition: 0.3s all;
  max-height: 10000px !important;
}
.rotate0 {
  transform: rotate(0);
  transition: 0.3s all;
}
.rotate90 {
  transform: rotate(90deg);
  transition: 0.3s all;
}
</style>