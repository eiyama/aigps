<template>
  <div class="table-box">
    <el-scrollbar class="main scroll-y">
      <ul>
        <li v-for="(v, i) of list" :key="i">
          <span @click="handleAct(v)" v-if="v.mediaType == 0" class='img'>
            <img :src="v.fileUrl" alt=""/>
          </span>
          <span @click="handleAct(v)" v-else class='img'>
            <span class="iconfont icon-bofang select-color"></span>
          </span>
          <span class="hr"></span>
          <span class="info">
            <span>
              <em class="name">车牌号码：</em>
              <em class="text">{{ v.vehiIdno }}</em>
            </span>
            <span>
              <em class="name">上传时间：</em>
              <em class="text">{{ v.stm }}</em>
            </span>
          </span>
          <span class="alarm-type select-color">
            <em class="icon"></em>
            <em class="text">{{ v.alarmText }}</em>
          </span>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.table-box {
  padding: 30px 0 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.main {
  flex: 1;
}
.main >>> .is-horizontal {
  display: none;
}
.main ul {
  overflow: hidden;
  margin: -20px -20px 0 0;
}
.main ul li {
  float: left;
  width: 360px;
  margin: 20px 20px 0 0;
  border: 1px solid #dae0e6;
}
.main li span, .main li em {
  display: block;
  overflow: hidden;
}
.main li .img {
  height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.main li .img img {
  max-width: 360px;
  max-height: 360px;
}
.main li .img .iconfont {
  font-size: 40px;
}
.main li .hr {
  height: 1px;
  background: #dae0e6;
}
.main li .info {
  padding: 10px 20px 0;
}
.main li .info span:last-child {
  border-bottom: 1px solid #dae0e6;
  padding: 0 0 10px;
}
.main .info span em {
  float: left;
  line-height: 34px;
}
.main .info span .name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
.main .info span .text {
  font-size: 14px;
  color: #666;
}
.main .alarm-type {
  padding: 10px 20px;
}
.main .alarm-type em {
  float: left;
}
.main .alarm-type .icon {
  width: 10px;
  height: 10px;
  background: #00A8D4;
  margin: 12px 5px 0;
}
.main .alarm-type .text {
  font-size: 16px;
  line-height: 34px;
}
</style>

<script>
import { Scrollbar } from 'element-ui'

export default {
  components: {
    ElScrollbar: Scrollbar
  },
  name: 'List',
  data() {
    return {
      
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  created() {

  },
  methods: {
    /**
     * 点击操作显示报警
     * @param row 点击的当前行的数据
     */
    handleAct(row) {
      // console.log(row);
      row.alarmStatus = true;
      row.did = row.devIdno;
      eventBus.$emit('handleAct', row);
    }
  }
}
</script>