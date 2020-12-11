<template>
  <div class="wrap">
    <tab-bar :searchList="searchList" :operButton="operButton" @query="query" />
    <h2 class="title-color">轨道交通能耗计量系统</h2>
    <div class="date msg-color">{{ date }}</div>
    <div class="imgs">
      <div v-for="(v, i) in list" :key="i" class="item content-color">
        <ul>
          <li>
            <span class="label">正向电能：</span>
            <span class="text">{{ v.forwardPowerDisplay }}</span>
          </li>
          <li>
            <span class="label">反向电能：</span>
            <span class="text">{{ v.reversePowerDisplay }}</span>
          </li>
          <li>
            <span class="label">电压：</span>
            <span class="text">{{ v.voltageDisplay }}</span>
          </li>
          <li>
            <span class="label">电流：</span>
            <span class="text">{{ v.currentDisplay }}</span>
          </li>
          <li>
            <span class="label">功率：</span>
            <span class="text">{{ v.powerDisplay }}</span>
          </li>
        </ul>
      </div>
      <div v-for="e of (6 - list.length)" :key="e" class="item"></div>
      <img src="@/assets/image/index/train.png" alt="" />
    </div>
    <div class="info">
      <span class="name">总计</span>
      <div class="item">
        <div class="title">当前平均值（5分钟内）</div>
        <ul>
          <li>
            <span class="label">电流：</span>
            <span class="text">{{ info.currentAvgDisplay }}</span>
          </li>
          <li>
            <span class="label">电压：</span>
            <span class="text">{{ info.voltageAvgDisplay }}</span>
          </li>
          <li>
            <span class="label">正向电能：</span>
            <span class="text">{{ info.forwardPowerAvgDisplay }}</span>
          </li>
          <li>
            <span class="label">反向电能：</span>
            <span class="text">{{ info.reversePowerAvgDisplay }}</span>
          </li>
          <li>
            <span class="label">功率：</span>
            <span class="text">{{ info.powerAvgDisplay }}</span>
          </li>
        </ul>

        <ul>
          <li>
            <span class="label">总正向电能：</span>
            <span class="text">{{ info.forwardPowerTotalDisplay }}</span>
          </li>
          <li>
            <span class="label">总反向电能：</span>
            <span class="text">{{ info.reversePowerTotalDisplay }}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 加按钮 三天，一周，一个月 -->
    <div class="btn-bar">
      <el-button size="small" :type="curIndex === 3 ? 'primary' : ''" @click="handleBtn(3)" >一个月</el-button>
      <el-button size="small" :type="curIndex === 2 ? 'primary' : ''" @click="handleBtn(2)" >一周</el-button>
      <el-button size="small" :type="curIndex === 1 ? 'primary' : ''" @click="handleBtn(1)" >三天</el-button>
      <el-button size="small" :type="curIndex === 0 ? 'primary' : ''" @click="handleBtn(0)" >五分钟</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateTime } from '@/utils/util'
import { getMeterStatistics } from '@/api/dataSearch/busine'
import TabBar from '@/components/tabBar'
import { Message } from 'element-ui'

export default {
  name: 'lightRail',
  components: {
    TabBar
  },
  data() {
    const searchList = getCopyObj(this.$t('lightRail.searchList'));
    return {
      searchList,
      parent: null,
      date: '',
      info: {},
      list: [],
      operButton: {},
      curIndex: 0,
      tid: null,
      tid2: null,
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  watch: {
    searchList: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.tid2) {
          clearTimeout(this.tid2);
          this.tid2 = null;
        }
      }
    }
  },
  created() {
    const code = this.$route.query.code;
    const url = this.$route.path;
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, url);
        break;
      }
    }
    this.setDate();
  },
  beforeDestroy() {
    if (this.tid) {
      clearTimeout(this.tid);
      this.tid = null;
    }
    if (this.tid2) {
      clearTimeout(this.tid2);
      this.tid2 = null;
    }
  },
  methods: {
    setDate() {
      this.date = getDateTime();
      this.tid = setTimeout(() => {
        this.setDate();
      }, 1000);
    },
    /**
     * 点击查询
     */
    query() {
      const id = this.searchList.carName.model;
      if (!id) {
        Message.error('请输入终端号！');
        return;
      } else if (this.tid2) {
        return;
      }
      this.requestInfo();
    },
    /**
     * 获取数据
     */
    requestInfo() {
      const id = this.searchList.carName.model;
      const curTime = new Date().getTime();
      const startTime = this.getDateTime(this.curIndex);
      const data = {
        vehTerminalNo: id,
        vehGroupName: 'string',
        startTime
      }
      getMeterStatistics(data).then(res => {
        if (res.result) {
          this.info = res.result;
          this.list = res.result.dCEnergyMeters;
          this.tid2 = setTimeout(() => {
            this.requestInfo();
          }, 8000);
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击按钮
     */
    handleBtn(i) {
      if (i === this.curIndex) return;
      this.curIndex = i;
      this.query();
    },
    /**
     * 根据当前类型返回不同的日期时间
     */
    getDateTime(i) {
      let curDate = new Date();
      if (i === 0) {
        curDate.setSeconds(curDate.getSeconds() - 3e2);
      } else if (i === 1) {
        curDate.setDate(curDate.getDate() - 3);
      } else if (i === 2) {
        curDate.setDate(curDate.getDate() - 7);
      } else if (i === 3) {
        curDate.setMonth(curDate.getMonth() - 1);
      }
      const times = curDate.getTime();
      return getDateTime(times);
    }
  }
}
</script>

<style scoped>
.wrap {
  flex: 1;
  background: #fff;
  padding: 10px;
}
.wrap h2 {
  text-align: center;
}
.date {
  padding: 10px 0 0;
}
.imgs {
  display: flex;
  padding: 20px 0 0;
}
.imgs img {
  width: 300px;
}
.imgs .item, .imgs .empty div {
  flex: 1;
  border: 1px solid #00a8d4;
  margin: 0 5px 0 0;
}
.imgs .empty {
  display: flex;
  flex: 1;
}
ul {
  padding: 10px 0 0;
}
.imgs ul li {
  text-align: center;
  line-height: 28px;
}
.info {
  display: flex;
  padding: 20px 0 0;
}
.info .name {
  display: block;
  padding: 0 20px 0 0;
}
.info ul {
  overflow: hidden;
  margin: 0 -10px 0 0;
}
.info ul li {
  float: left;
  line-height: 28px;
  margin: 0 10px 0 0;
}
.btn-bar {
  padding: 20px 0 0;
}
.btn-bar >>> .el-button {
  float: right;
  margin: 0 10px 0 0;
}
</style>