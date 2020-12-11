<template>
  <div class="box" :style="info.css || {}" >
    <div class="wrapper" >
      <div v-show="!!info.title" class="title">
        {{ info.title }}
        <span @click.stop="handleColse(info.index)" class="el-icon-close"  />
      </div>
      <div class="content">
        <ul v-if="(info.baseInfo instanceof Array)">
          <li v-for="(v, i) of info.baseInfo" :key="i">
            <span class="label">{{ v.label }}</span>
            <span class="val" :class="v.click ? 'active' : ''" @click="handleActive(v.click)">{{ v.val }}</span>
          </li>
        </ul>

        <div class="right" v-if="(info.otherArr instanceof Array)">
          <div v-for="(v, i) of info.otherArr" :key="i" class="li">
            <span class="label">{{ v.label }}</span>
            <span class="val">{{ v.val }}</span>
          </div>
        </div>
      </div>

      <slot />
      <div class="btns" v-if="(info.btns instanceof Array) && info.btns.length">
        <el-button v-for="(v, i) of info.btns" :key="i" :id="v.id" type="primary" size="mini" @click.prevent="handleBtn(v.id)">{{ v.text }}</el-button>
      </div>
    </div>
    <div class="arrow">
      <img src="http://api0.map.bdimg.com/images/iw3.png" alt="">
    </div>
  </div>
</template>

<script>
import { Button } from 'element-ui'
export default {
  components: {
    ElButton: Button
  },
  data() {
    return {

    }
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    handleColse(index) {
      this.$emit('handleColse', index)
    },
    handleBtn(id) {
      this.$emit('handleBtn', id)
    },
    handleActive(isClick) {
      if (!isClick) return
      this.$emit('handleActive')
    }
  }
}
</script>

<style lang="scss" scoped> 
.box {
  background: #fff;
  // padding: 0 0 20px;
  // box-shadow: rgb(0, 0, 0) 0px 1px 9px -3px; 
  border-radius: 8px; 
  cursor: text;
  visibility: visible;   
  .wrapper {
    overflow: hidden;
    border-radius: 8px 8px  0 0;
    .title {
      line-height: 36px;
      color: #fff;
      font-size: 16px;
      padding: 0 15px;
      font-weight: bold;
      background: #373d40;
      span {
        float: right;
        font-size: 20px;
        position: relative;
        top: 8px;
        cursor: pointer;
      }
    }
    .content {
      position: relative;
      
    }
    ul {
      padding: 5px 15px 0;
      li {
        line-height: 21px;
        overflow: hidden;
        span {
          font-size: 13px;
          color: #666;
        }
        .label {
          color: #333;
          font-weight: bold;
          height: 100%;
          float: left;
        }
        .active {
          cursor: pointer;
          color: #00a8d4;
        }
      }
    }
    .right {
      position: absolute;
      top: 0;
      right: 0;
      padding: 10px 20px 0;
      .li {
        line-height: 30px;
        span {
          font-size: 14px;
          // color: #666;
        }
        .label {
          color: #333;
          font-weight: bold;
          height: 100%;
          float: left;
        }
      }
    }
    .btns {
      padding: 5px 10px 0;
      overflow: hidden;
      margin-right: -8px;
      .el-button {
        padding: 5px 4px;
        float: left;
        margin: 0 6px 5px 0;
        // min-width: 70px;
      }
      .el-button:last-child{
        margin-right: 0;
      }
    }
  }
  .arrow {
    box-sizing: content-box;
    overflow: hidden;
    position: absolute;
    z-index: -1;
    left: 50%;
    top: 100%;
    width: 34px;
    height: 50px;
    margin: -24px 0 0 -17px;
    img {
      box-sizing: content-box;
      border: none;
      margin-left: -186px;
      margin-top: -691px;
      max-width: none;
      width: 690px;
      height: 786px;
      box-shadow: rgb(0, 0, 0) 0px 1px 9px -3px;
    }
  }
}
</style>