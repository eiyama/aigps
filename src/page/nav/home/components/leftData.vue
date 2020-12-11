<template>
  <div class="left">
    <div class="pie-box nav-bg">
      <h4 class="title">
        {{ i18nInfo.title }}
        <span class="btn" @click="handleBtn">{{ i18nInfo.historyOnline }}</span>
      </h4>
      <div class="canvas-model">
        <!-- <div id="pie"></div> -->
        <chart-pie ref="pie" />
        <div class="info">
          <div class="li">
            <p>{{ i18nInfo.vehicleTotal }}</p>
            <div class="num">
              <em>{{ info.vehicleTotal || 0 }}</em>
              <span>{{ otherText.truck }}</span>
            </div>
          </div>
          <div class="li">
            <p>{{ i18nInfo.vehicleOnline }}</p>
            <div class="num">
              <em>{{ info.vehicleOnline || 0 }}</em>
              <span>{{ otherText.truck }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mileage">
      <div class="l-mileage">
        <h3>{{ i18nInfo.mileageTodayTotal }}</h3>
        <div class="num">
          <em id="TotalOdo">{{ info.mileageTodayTotal || 0 }}</em>
          <span>{{ otherText.km }}</span>
        </div>
      </div>
      <div class="r-mileage">
        <div class="li">
          <p>{{ i18nInfo.hoursAverage }}</p>
          <div class="num">
            <em>{{ info.hoursAverage || 0 }}</em>
            <span>{{ otherText.hour }}</span>
          </div>
        </div>
        <div class="li">
          <p>{{ i18nInfo.mileageAverage }}</p>
          <div class="num">
            <em>{{ info.mileageAverage || 0 }}</em>
            <span>{{ otherText.km }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left {
  flex: 9;
  padding: 0 30px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.pie-box {
  /* height: 244px; */
  height: 52%;
  padding: 10px 0;
  /* margin-bottom: 30px; */
  display: flex;
  flex-direction: column;
}
.canvas-model {
  /* overflow: hidden; */
  display: flex;
  justify-content: space-between;
  flex: 1;
  overflow: hidden;
}
.pie-box .title {
  color: #fff;
  font-size: 18px;
  line-height: 38px;
  padding: 0 0 6px;
  text-align: center;
  position: relative;
}
.pie-box .title .btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  line-height: 18px;
  border: 1px solid #fff;
  padding: 0 3px;
  cursor: pointer;
}
.canvas-model .info {
  /* float: left; */
  width: 46%;
  /* flex: 1; */
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: space-around;
  /* width: 180px; */
}

.msg-info {
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.msg-info .state {
  margin: 0 10px;
  color: #5c718c;
  display: block;
}
.msg-info .state .iconfont {
  font-size: 30px;
  margin: 0 10px 0 0;
}
.msg-info .state .name {
  font-size: 14px;
  display: block;
  float: right;
  line-height: 30px;
}
.canvas-model .info .li, .r-mileage .li {
  background: #fff;
  width: 93%;
  height: 38%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.r-mileage .li {
  height: 45%;
}
.canvas-model .info .li p,  .r-mileage .li p {
  font-size: 16px;
  color: #333 !important;
  /* line-height: 36px; */
  text-align: center;
}
.canvas-model .info .li .num, .r-mileage .li .num{
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000 !important;
}
 .r-mileage .li .num em {
  color: #000 !important;
 }
.canvas-model .info .li:last-child,  .r-mileage .li:last-child {
  background: #f8da78;
  /* margin-top: 20px; */
}
.canvas-model .info .li span,  .r-mileage .li span {
  font-size: 14px;
  margin: 5px 5px 0;
}
.canvas-model .info .li em,  .r-mileage .li em {
  margin: 0 5px;
  font-size: 26px !important;
  /* height: 42px; */
  /* line-height: 42px; */
  font-weight: bold;
}
.mileage {
  background-color: #4298e2;
  /* padding: 20px; */
  box-sizing: border-box;
  overflow: hidden;
  height: 42%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mileage .l-mileage {
  /* float: left; */
  /* width: 226px; */
  /* position: relative; */
  /* top: 40.5px; */
  /* left: 0; */
  width: 50%;
  height: 50%;
  padding: 0 0 0 3%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

}
.mileage .r-mileage {
  /* float: right; */
  /* width: 184px; */
  width: 50%;
  height: 88%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.mileage h3 {
  margin-bottom: 10px;
  color: #fff;
}
.mileage .num {
  font-size: 16px;
  color: #fff;
  text-align: center;
}
.mileage .num em {
  font-size: 2vw;
  color: #f9db79;
  font-weight: bold;
}
</style>

<script>
import ChartPie from '@/components/chartPie'

export default {
  components: {
    ChartPie
  },
  data() {
    return {
      info: {}
    }
  },
  props: {
    otherText: {
      type: Object,
      default: {}
    },
    i18nInfo: {
      type: Object,
      default: {}
    }
  },
  methods: {
    // 环形图
    pie(info) {
      this.info = info;
      const opt = {
        color: ['#f8da78', '#98a1b0'],
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: [info.vehicleUseRate, this.i18nInfo.vehicleUseRate].join('\n'),
            font: '20px Microsoft YaHei',
            textAlign: 'center',
            fill: '#fff'
          }
        },
        serie: {
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          data: [
            {
              value: info.vehicleOnline
            },
            {
              value: info.vehicleTotal - info.vehicleOnline
            }
          ],
          radius: ['90', '70'],
          hoverAnimation: false
        },
        legend: {
          show: false,
          selectedMode: true
        },
        tooltip: {
          show: false
        }
      }
      this.$refs.pie.chartsRender(opt);
    },
    /**
     * 点击按钮弹出历史车辆在线率
     */
    handleBtn() {
      this.$emit('handleBtn')
    }
  }
}
</script>