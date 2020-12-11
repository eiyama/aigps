<!-- 胎压弹窗 -->
<template>
  <popup-view :isShow.sync="isShow" :isZoom="false" :title="info.name" :css="{ width: '530px', height: 'auto' }">
    <div id="tire_pressure" class="box">
      <div class="top">
        <span class="left">
          <span class="icon"></span>
          <em>{{ tyrePressureI18n.tipBarName }}</em>
        </span>
        <span class="center">
          <span class="icon"></span>
          <em>{{ tyrePressureI18n.tipTemperatureName }}</em>
        </span>
      </div>
      <div class="num-ber">
        <em>{{ tyrePressureI18n.tipNumBerName }}</em>
        <em class="num">{{ info.number }}</em>
      </div>
      <div class="time">{{ tyrePressureI18n.timeName + info.gpsTime }}</div>
      <div class="contain">
        <div class="info left">
          <div class="li" v-for="(v,index) in info.tirePressInfos" :key="index">
            <span class="title">{{ v.axis + tyrePressureI18n.axis + v.num + tyrePressureI18n.round }}</span>
            <span v-if="v.pressure !== undefined || v.temperature !== undefined" class="num-bar" id="one_axis2">
              <em class="bar" :class="(v.pressure >= 13 || v.pressure <= 4) ? 'font-red' : ''">{{ v.pressure == $t('otherText.invalid') ? v.pressure : v.pressure + 'bar' }}</em>
              <span class="border"></span>
              <em :class="v.temperature >= 85 ? 'font-red' : ''" class="num">{{ v.temperature == $t('otherText.invalid') ? v.temperature : v.temperature + '℃' }}</em>
            </span>
            <span v-else class="num-no">{{ tyrePressureI18n.notInstalled }}</span>
          </div>
        </div>
        <div class="center">
          <div class="li" :class=" (!!v.pressure && !!v.temperature) ? (v.pressure >= 13 || v.pressure <= 4 || v.temperature >= 85) ? 'bg-red' : 'bg-ccc' : '' " v-for="(v,index) in info.tirePressInfos" :key="index"></div>
        </div>
      </div>
      <div class="type-bar">
        <span class="icon-bg-ccc"></span>
        <em>{{ tyrePressureI18n.normal }}</em>
        <span class="icon-bg-red"></span>
        <em>{{ tyrePressureI18n.abnormal }}</em>
      </div>
      <a @click="queryMore" href="javascript:;" class="btn">{{ tyrePressureI18n.viewReport }}</a>
    </div>
  </popup-view>
</template>

<script>
import PopupView from '@/components/map/PopupView'
export default {
  name: 'TyrePressurePop',
  components: {
    PopupView
  },
  data() {
    return {
      tyrePressureI18n: {},
      isShow: true
    }
  },
  created() {
    this.tyrePressureI18n = this.$t('tyrePressure');
  },
  mounted() {
  },
  //页面卸载之后关闭推送清除内存
  beforeDestroy() {
  },
  methods: {
    changeAndShow() {
      this.$emit('changeAndShow');
    },
    // 跳转报表页面
    queryMore() {
      this.$emit('queryMore');
    },
  },
  watch: {},
  props: {
    info: [Object, Array],
  },
}
</script>


<style scoped>
.box {
  /*width: 100%;*/
  /*border: 2px solid #2b3d4e;*/
  background: #fff;
  z-index: 1010;
  padding: 30px 0 10px;
  position: relative;
}
.box:hover {
  cursor: move;
}
.box div,
.box span,
.box em {
  font-size: 12px;
}
.box .title-box {
  overflow: hidden;
  background: #373d40;
  padding: 0 10px;
}
.box .title-box .remove {
  font-size: 20px;
  float: right;
  line-height: 30px;
  color: #fff;
  cursor: pointer;
}
.box .title-box .car-num {
  float: left;
  line-height: 30px;
  color: #fff;
}
.box .top {
  overflow: hidden;
  margin: 10px auto 0;
  line-height: 16px;
  color: #93a2b7;
  padding: 0 10px;
  position: relative;
  box-sizing: border-box;
  top: 0;
  left: 0;
}
.box .top .left,
.box .top .center {
  float: left;
  display: block;
  overflow: hidden;
  position: relative !important;
}
.box .top .center {
  float: right;
}
.box .info {
  position: absolute;
  width: 100%;
  top: 77px;
  left: 0;
  padding: 0 5px 0 3px;
}
.box .info .li:nth-child(1) {
  margin-left: 100px;
}
.box .info .li:nth-child(2) {
  margin-left: 144px;
  margin-right: 40px;
}
.box .info .li:nth-child(5) {
  margin-left: 145px;
}
.box .info .li:nth-child(9) {
  margin-left: 145px;
}
.box .info .li:nth-child(13) {
  margin-left: 145px;
}
.box .info .li:nth-child(17) {
  margin-left: 145px;
}
.box .info .li:nth-child(21) {
  margin-left: 145px;
}
.box .info .li:nth-child(3),
.box .info .li:nth-child(4),
.box .info .li:nth-child(5),
.box .info .li:nth-child(6) {
  margin-top: 52px;
}
.box .info .li:nth-child(11),
.box .info .li:nth-child(12),
.box .info .li:nth-child(13),
.box .info .li:nth-child(14) {
  margin-top: 22px;
}
.top .icon {
  display: block;
  width: 4px;
  height: 16px;
  float: left;
  background: #7489a4;
  margin-right: 5px;
}
.top .left {
  margin-right: 10px;
}
.box .contain {
  margin: 10px auto 0;
  overflow: hidden;
  position: relative;
}
.box .contain .right {
  width: 164px;
  margin: 77px 0 0 -5px;
}
.box .contain .li {
  width: 90px;
  float: left;
  margin: 10px 0 0 5px;
}

.box .contain .li .title {
  display: block;
  height: 22px;
  line-height: 22px;
  background: #7489a4;
  text-align: center;
  font-size: 12px;
  color: #fff;
}
.box .contain .li .num-bar {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #c9c9c9;
  color: #222;
  line-height: 20px;
  border-top: none;
}
.box .contain .li .bar {
  float: left;
  padding: 0 2px;
}
.box .contain .li .border {
  float: left;
  display: block;
  width: 1px;
  background: #7489a4;
  height: 14px;
}
.box .contain .li .num {
  float: right;
  padding: 0 2px;
}
.box .contain .li .num-no {
  display: block;
  border: 1px solid #c9c9c9;
  color: #666;
  line-height: 20px;
  border-top: none;
  text-align: center;
}
.box .contain .left .one {
  margin-left: 87px;
}
.box .contain .right .one {
  margin-right: 87px;
}
.box .contain .li .hidden {
  display: none !important;
}
.box .contain .center {
  background: url(../assets/image/allMonitor/carImg.png);
  background-size: 100% 100%;
  width: 124px;
  height: 375px;
  overflow: hidden;
  margin: 0 auto;
  padding: 75px 0 0 8px;
}
.box .center .li:nth-child(1) {
  margin-left: 21px;
}
.box .center .li:nth-child(2) {
  margin-left: 47px;
  margin-right: 10px;
}
.box .center .li:nth-child(5) {
  margin-left: 46px;
}
.box .center .li:nth-child(9) {
  margin-left: 46px;
}
.box .center .li:nth-child(13) {
  margin-left: 46px;
}
.box .center .li:nth-child(17) {
  margin-left: 46px;
}
.box .center .li:nth-child(21) {
  margin-left: 46px;
}
.box .center .li:nth-child(3),
.box .center .li:nth-child(4),
.box .center .li:nth-child(5),
.box .center .li:nth-child(6) {
  margin-top: 57px;
}
.box .center .li:nth-child(11),
.box .center .li:nth-child(12),
.box .center .li:nth-child(13),
.box .center .li:nth-child(14) {
  margin-top: 28px;
}

.box .center .li {
  float: left;
  margin: 10px 0 0 3px;
  width: 15px;
  height: 40px;
  border-radius: 2px;
  border: 2px solid #7489a4;
  box-sizing: border-box;
}
.box .type-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 0;
}
.box .type-bar em {
  display: block;
  margin: 0 5px;
}
.box .type-bar span {
  width: 20px;
  height: 20px;
  margin-left: 12px;
}
.box .btn {
  display: block;
  width: 160px;
  height: 34px;
  background: #16a6f8;
  line-height: 34px;
  text-align: center;
  color: #fff;
  margin: 10px auto 0;
  border-radius: 5px;
  font-size: 14px;
}
.box .type-bar .icon-bg-ccc {
  background: #7489a4;
}
.box .type-bar .icon-bg-red {
  background: #fb1f02;
}
.box .type-bar .icon-bg-yellow {
  background: #fb8f02;
}
.box .contain .bg-red,
.box .contain .bg-ccc {
  background: #fb1f02 !important;
  width: 15px !important;
  border: none !important;
  height: 40px !important;
}
.box .contain .bg-ccc {
  background: #7489a4 !important;
}
.box .contain .font-red {
  color: #fb1f02 !important;
}
.box .contain .font-yellow {
  color: #fb8f02 !important;
}
.box .time,
.box .num-ber {
  position: absolute;
  top: 60px;
  color: #93a2b7;
}
.box .num-ber em {
  color: #93a2b7;
}
.box .num-ber {
  right: 10px;
  overflow: hidden;
}
.box .time {
  left: 10px;
}
</style>
