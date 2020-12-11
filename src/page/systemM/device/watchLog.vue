<template>
  <div class="content">
    <tab-bar
      :operButton="operButton"
      :searchList="searchList"
      isBoxMin
      @check="handleCheck"
      @query="handleWatch"
      @changeSelect="changeSelect"
    ></tab-bar>
    <div class="btn-bar">
      <el-button type="primary" @click="handleAdd" size="small" icon="el-icon-plus"></el-button>
      <el-button type="primary" @click="handleClear" size="small" icon="el-icon-close"></el-button>
      <!-- <el-button type="primary" @click="handleWatch" size="small" icon="el-icon-search"></el-button> -->
    </div>
    <div ref="tableBox" class="table-box">
      <div class="model" v-for="(v, index) of tables" :key="index">
        <div class="cur-title">
          <span>{{ $t('watchLog.vehPlateNo') + v.vehPlateNo }}</span>
          <em>{{ $t('watchLog.vehTerminalNo') + v.vehTerminalNo }}</em>
          <em>{{ $t('watchLog.msgId') + v.msgId }}</em>
        </div>
        <el-table
          stripe
          border
          ref="table"
          :data="v.tableData"
          class="center"
          size="mini"
          style="text-align:center;width:100%;"
          :id="v.id"
        >
          <el-table-column
            :label="$t('otherText.index')"
            type="index"
            :index="index => index + 1"
            width="60"
          ></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item
                  :class="item.width ? 'wid-active' : ''"
                  v-for="(item,key) in $t('watchLog.tableMoreConList')"
                  :key="key"
                  :label="item.label"
                >
                  <span>{{ props.row[item.prop] }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item,key) in $t('watchLog.tableTitle')"
            :key="key"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
import Websocket from '@/conmon/js/websocket.js'
import { getOperButton } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import TabBar from '@/components/tabBar'
import { Message, Table, TableColumn, Form, FormItem } from 'element-ui'

export default {
  name: 'WatchLog',
  components: {
    TabBar,
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElForm: Form,
    ElFormItem: FormItem
  },
  data() {
    return {
      ws: null, // websocket实例
      terminalNos: [
        // { TerminalNo: "40021680231", MsgIds: [512, 1] },
        // { TerminalNo: "40021682046", MsgIds: [512, 1] }
      ], // 请求参数
      operButton: {}, // 控制tabBar拥有哪些功能
      searchList: {}, // tarBar搜索的数据
      tables: [], // 表格数组
      carInfo: [], // 保存勾选的车辆信息
      oldSelectArr: [''], // 保存上一次的多选数据
      checkList: [], // 复选框的值
      treeRef: null // 复选框树的ref对象
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  created() {
    this.searchList = JgetCopyObj(this.$t('watchLog.searchList'))
    this.ws = new Websocket.webSocket();

    // 获取控制tarBar组件显示哪些功能的obj
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {

    }
  },
  // 组件关闭之前
  beforeDestroy() {
    if (this.ws.connection) {
      this.ws.connection.stop();
    }
    this.ws = null;
  },
  methods: {
    monitor() {
      this.ws.connection
        .invoke('SendMessage', this.terminalNos)
        .catch(err => console.error(JSON.stringify(err)));
    },
    // 开启websocket
    connect() {
      const that = this;
      this.ws.connectWebSocket(
        'DeviceMonitorHub',
        (key, data) => {
          // console.log(key, data);
          const index = that.tables.findIndex(
            elem => elem.vehTerminalNo == key
          );
          if (index > -1) {
            if (that.tables[index].tableData.length >= 100) {
              that.tables[index].tableData.shift();
            }
            that.tables[index].tableData.push({
              vehTerminalNo: key,
              hex: data.hex,
              vehPlateNo: that.tables[index].vehPlateNo
            });
          }
        },
        () => {
          this.monitor();
        }
      );
    },
    // 点击勾选复选框
    handleCheck(res, tree) {
      var arr = [];
      var arr2 = [];
      this.treeRef = tree;
      this.checkList = res;
      this.carInfo = [];
      for (const [index, elem] of res.entries()) {
        // 为子节点且id不为空
        if (elem.type == 2) {
          arr.push(elem.vehTerminalNo);
          arr2.push(elem.name);
          this.carInfo.push({
            vehTerminalNo: elem.vehTerminalNo,
            vehPlateNo: elem.name
          });
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList.vehTerminalNo.vehTerminalNo = arr.join();
      this.searchList.vehTerminalNo.model = arr2.join();
      if (res.length > 0) {
        this.isSelectCar = true;
      } else {
        this.isSelectCar = false;
      }
    },
    // 点击添加表格
    handleAdd() {
      var msgId = this.searchList.msgIds.model;
      if (this.carInfo.length == 0) {
        Message.error(this.$t('error.selectCar'));
        return;
      } else if (!msgId) {
        Message.error(this.$t('watchLog.msgId'));
        return;
      }
      for (const [i, v] of this.carInfo.entries()) {
        this.tables.push({
          vehTerminalNo: v.vehTerminalNo,
          vehPlateNo: v.vehPlateNo,
          id: 'table' + i,
          msgId: msgId.join(),
          tableData: []
        });
        this.terminalNos.push({
          TerminalNo: v.vehTerminalNo,
          // MsgIds: msgId.replace(/\，/g, ",").split(",")
          MsgIds: msgId.join() ? msgId : []
        });
      }
      // 添加之后去掉复选框的勾选，多选恢复初始化
      this.searchList.msgIds.model = [''];
      this.oldSelectArr = [''];
      this.carInfo = [];
      this.searchList.vehTerminalNo.model = '';
      for (const [i, v] of this.checkList.entries()) {
        this.treeRef.setChecked(v.id, false);
      }
    },
    // 点击清除
    handleClear() {
      if (this.ws.connection) {
        // 关闭监控
        this.ws.connection.stop();
      }
      // 清除数据
      this.tables = [];
      this.terminalNos = [];
    },
    // 点击监听
    handleWatch() {
      if (this.tables.length === 0) {
        Message.error(this.$t('error.addCar'));
        return;
      }
      if (this.ws.connection) {
        // 有值证明已开启websocket，现在需要发请求
        this.monitor();
      } else {
        // 没有值证明没有开启websocket
        this.connect();
      }
    },
    // 复选框选中
    check(res, tree) {
      var arr = [];
      var arr2 = [];
      this.checkList = res;
      const terminalNos = [];
      const msgId = this.searchList.msgIds.model;
      this.carInfo = [];
      for (const [index, elem] of res.entries()) {
        // 为子节点且id不为空
        if (elem.type == 2) {
          arr.push(elem.vehTerminalNo);
          arr2.push(elem.name);
          this.carInfo.push({
            vehTerminalNo: elem.vehTerminalNo,
            vehPlateNo: elem.name
          });
          // 如果有的话就证明是以前选中的
          const j = this.terminalNos.findIndex(
            e => e.TerminalNo == elem.vehTerminalNo
          );
          if (j > -1) {
            // 上一次勾选的
            terminalNos.push({
              TerminalNo: elem.vehTerminalNo,
              MsgIds: this.terminalNos[j].MsgIds
            });
          } else {
            // 本次勾选的
            terminalNos.push({
              TerminalNo: elem.vehTerminalNo,
              // MsgIds: msgId.replace(/\，/g, ",").split(",")
              MsgIds: msgId
            });
          }
        }
      }
      this.terminalNos = terminalNos;
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList.vehTerminalNo.vehTerminalNo = arr.join();
      this.searchList.vehTerminalNo.model = arr2.join();
      if (res.length > 0) {
        this.isSelectCar = true;
      } else {
        this.isSelectCar = false;
      }
    },
    // 查询
    query() {
      if (this.carInfo.length === 0) {
        Message.error(this.$t('otherText.selectCar'));
        return;
      }
      this.tables = [];
      for (const [index, elem] of this.carInfo.entries()) {
        // 一辆车一个表格
        this.tables.push({
          vehTerminalNo: elem.vehTerminalNo,
          vehPlateNo: elem.vehPlateNo,
          id: `table${index}`,
          tableData: []
        });
      }
      if (this.ws.connection) {
        // 有值证明已开启websocket，现在需要发请求
        this.monitor();
      } else {
        // 没有值证明没有开启websocket
        this.connect();
      }
    },
    // 多选选中
    changeSelect(val) {
      // 多选id的值
      var valArr = this.searchList.msgIds.model;
      // 多选id下拉框的list
      var list = this.searchList.msgIds.list;
      var index = valArr.findIndex(elem => elem == '');
      // 上一次有没有勾选全部
      var oldIndex = this.oldSelectArr.findIndex(elem => elem == '');
      // 全部默认空，如果大于-1且上一次的数据等于-1就证明本次选中了全部，或者除了全部之外其他的都选中了，也代表全部，反之没有
      if ((index > -1 && oldIndex == -1) || list.length - 1 == valArr.length) {
        // 选中全部
        this.searchList.msgIds.model = [''];
      } else {
        // 证明上一次是全部，本次需要去掉全部
        if (index > -1) {
          this.searchList.msgIds.model.splice(index, 1);
        }
      }
      // 更新上一次数据
      this.oldSelectArr = this.searchList.msgIds.model;
    }
  }
};
</script>
<style scoped>
.content {
  flex: 1;
  padding: 22px 0 0 40px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.table-box {
  padding: 10px 5 0;
  flex: 1;
  overflow: scroll;
}
.table-box .model {
  /* box-sizing: border-box; */
  margin: 20px 0 0;
}
.table-box .model .cur-title {
  overflow: hidden;
  padding: 0 0 10px;
  color: #333;
  font-size: 16px;
}
.table-box .model .cur-title em {
  margin-left: 5px;
}
.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
</style>
