<!-- 安全证据查询 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar" @query="query" @check="check"></tab-bar>
    <list :list="listData" />
    <div class="block">
      <el-pagination :disabled="pageing.isShow" class="pagination el-input--mini" :page-size="pageing.limit" @current-change="changePage"
        :page-sizes="['20', '50', '80', '100']" @size-change="changeSize" layout="total, sizes, prev, pager, next, jumper"
        :total="pageing.totalCount" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTreeRepeatValue, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getDateTime } from '@/utils/util'
import { getReportPhotoListSafe } from '@/api/video'
import TabBar from '@/components/tabBar'
import List from './components/list'
import { Message, Pagination } from 'element-ui'

export default {
  name: 'QueryAlarm',
  components: {
    TabBar,
    List,
    ElPagination: Pagination
  },
  data() {
    const searchList = getCopyObj(this.$t('queryAlarm.searchList'));
    const pageing = {
      limit: 20,
      curPage: 1,
      totalCount: 0,
      isShow: false
    }
    return {
      searchList,
      listData: [],
      operButton: {},
      pageing
    }
  },
  computed: {
    ...mapGetters([
      'menuTree',
      'jsession'
    ])
  },
  watch: {
    searchList: {
      deep: true,
      handler(newVal, oldVal) {
        this.pageing.curPage = 1;
        this.pageing.isShow = true;
      }
    }
  },
  async created() {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    // 给时间选择框赋值
    searchList.startEndTime.model = getTodays()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {

    }
  },
  methods: {
    /**
     * 查询
     */
    query() {
      const ids = this.searchList.vehTerminalNo.id;
      const selectTime = this.searchList.startEndTime.model;
      if (!ids) {
        Message.error(this.$t('error.selectCar'));
        return;
      } else if (!selectTime || !selectTime.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      this.pageing.totalCount = 0;
      this.pageing.curPage = 1;

      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const vehiIdno = this.searchList.vehTerminalNo.model;
      const dates = this.searchList.startEndTime.model;
      // 多媒体类型
      const mediaType = this.searchList.mediaType.model;
      const ageerType = this.searchList.ageerType.model;
      // 报警类型，默认全选，如果用户不选择就全选
      const key = ageerType ? 'alarmType2' : 'alarmType';
      const alarmType = this.searchList[key].id || this.getAlaAllId(key).join();
      const curPage = this.pageing.curPage;
      const limit = this.pageing.limit;
      const data = {
        begin: dates[0],
        end: dates[1],
        alarmType,
        mediaType,
        vehiIdno,
        curPage,
        limit,
        jsession: this.jsession
      }
      getReportPhotoListSafe(data).then(res => {
        if (res.result == 0) {
          const list = res.infos || [];
          const alarmList = this.searchList[key].tree;
          for (const v of list.values()) {
            v.stm = v.fileTime ? getDateTime(v.fileTime) : getDateTime(v.fileSTime);
            v.alarmText = this.getAlarmText(v.alarmType, alarmList);
          }
          this.listData = list;
          const totalCount = res.pagination.totalRecords;
          this.pageing.totalCount = totalCount;
          this.pageing.isShow = false;
          // this.$set(this.pageing, 'totalCount', totalCount);
          // this.$set(this.pageing, 'isShow', false);
        }
      });
    },
    /**
     * 每页条数改变
     * @param {Number} limit 改变之后的每页条数
     */
    changeSize(limit) {
      this.pageing.limit = limit;
      this.query();
    },
    /**
     * 当前页码改变
     * @param {Number} curPage 改变之后的当前页码
     */
    changePage(curPage) {
      this.pageing.curPage = curPage;
      this.requestInfo();
    },
    /**
     * 获取报警的全部id
     * @return arr 返回一个数组
     */
    getAlaAllId(key, tree) {
      let arr = [];
      if (!tree) {
        tree = this.searchList[key].tree;
      }
      for (const v of tree.values()) {
        if (v.type == 2) {
          arr.push(v.id);
        } else {
          if (v.options.length) {
            arr = [...arr, ...this.getAlaAllId(key, v.options)];
          }
        }
      } 
      return arr;
    },
    /**
     * 根据id查找报警类型
     * @param id 报警的id
     * @param alarmList 所有的报警的数组
     * @return 返回一个对应id的报警值
     */
    getAlarmText(id, alarmList) {
      let str = '';
      for (const v of alarmList.values()) {
        // 证明找到了
        const idArr = v.id.split(',');
        const index = idArr.findIndex(elem => id == elem);
        if (index > -1) {
          str = v.label;
        }  else {
          if (!str && Array.isArray(v.options) && v.options.length) {
            str = this.getAlarmText(id, v.options);
          }
        }
      }
      return str;
    },
    /**
     * 转成天-时-分-秒
     */
    getDays(val) {
      if (val <= 0) {
        return '0';
      } else if (!val) {
        return '--';    
      } else {
        return getDateHMS(val, this.$t('otherText'));
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
      var arr = [];
      var arr2 = [];
      for (let [index, elem] of res.entries()) {
        if (elem.type == 2) {
          arr.push(elem.vehTerminalNo);
          arr2.push(elem.name);
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList.vehTerminalNo.id = arr.join();
      this.searchList.vehTerminalNo.model = arr2.join();
    }
  }
}
</script>

<style scoped>
.content {
  flex: 1;
  padding: 22px 0 0 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  position: relative;
}
.block {
  display: flex;
  justify-content: center;
}
</style>
