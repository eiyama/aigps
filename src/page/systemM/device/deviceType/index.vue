<!-- 设备协议管理 -->
<template>
  <div class="content">
    <tab-bar ref="tabBar" :addTitle="$t('deviceType.addModelTitle')" :reviseTitle="$t('deviceType.reviseModelTitle')"
      :listLi="listLi" :rules="rules" :operButton="operButton" formLabelWidth="124px" @addConfirm="addConfirm"
      @clickAdd="clickAdd" @reviseConfirm="reviseConfirm" @clickRevise="clickRevise" @clickDelete="clickDelete" />
    <my-table :tableData="tableData" :tableTitle="tableTitle" :tableMoreConList="tableTitle" isCheck :isPageing="false" @selectAll="selectAll" />
  </div>
</template>



<script>
import { mapGetters } from 'vuex'
import { getOperButton, isNameRepeat } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { rule } from '@/utils'
import { getDeviceType, addDeviceType, upDeviceType, delDeviceType, getProtocolType } from '@/api/sysetsmM/device'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'deviceType',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const listLi = getCopyObj(this.$t('deviceType.listLi'));
    const ruleMsg = this.$t('deviceType.rules');
    const rules = {
      devtCode: rule('isEmpty', ruleMsg.devtCode),
      devtName: rule('isEmpty', ruleMsg.devtName),
      prtId: rule('isEmpty', ruleMsg.prtId),
      devtFactory: rule('isEmpty', ruleMsg.devtFactory),
      frequency: rule('isFrequency', ruleMsg.frequency)
    }
    const tableTitle = this.$t('deviceType.tableTitle');
    return {
      listLi,
      rules,
      tableTitle,
      tableData: [],
      operButton: {},
      curNode: {},
      prtCurNode: {}
    };
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  created() {
    const { $route, $store, menuTree } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    this.requestType()
    this.requestInfo()
  },
  methods: {
    /**
     * 点击添加一条数据
     */
    clickAdd() {
      this.$refs.tabBar.addShowAndHide(true);
    },
    /**
     * 获取表格数据
     */
    requestInfo() {
      getDeviceType().then(res => {
        if (res.result) {
          const list = res.result.items;
          this.tableData = list;
        }
      })
      .catch(err => {

      });
    },
    /**
     * 获取下拉框的协议类型
     */
    requestType() {
      getProtocolType().then(res => {
        if (res.result) {
          const list = res.result.items
          this.listLi.prtId.list = list;
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击确认
     */
    addConfirm(res) {
      const name = res.devtName.model;
      const isRepeat = isNameRepeat({
        tree: this.tableData,
        nameK: 'devtName',
        name
      });
      if (isRepeat) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      const data = {};
      for (const [k, v] of Object.entries(res)) {
        data[k] = v.model;
      }
      addDeviceType(data).then(res => {
        if (res.result) {
          this.$refs.tabBar.addShowAndHide(false);
          Message({
            type: 'success',
            message: this.$t('success.add')
          });
          this.requestInfo();
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击修改
     */
    clickRevise() {
      const num = this.tableData.reduce((total, v) => {
        if (v.check) {
          this.curNode = v;
          total ++;
        }
        return total;
      }, 0);
      if (num !== 1) {
        Message.error(this.$t('error.noData'));
        return;
      }
      this.$refs.tabBar.reviseShowAndHide(true);
      for (const [k, v] of Object.entries(this.listLi)) {
        v.model = this.curNode[k];
      }
    },
    /**
     * 修改确认
     */
    reviseConfirm() {
      const name = this.listLi.devtName.model;
      const id = this.curNode.id;
      const isRepeat = isNameRepeat({
        tree: this.tableData,
        nameK: 'devtName',
        idK: 'id',
        name,
        id
      });
      if (isRepeat) {
        Message.error(this.$t('error.nameRepeat'));
        return;
      }
      const data = {}
      for (const [k, v] of Object.entries(this.listLi)) {
        data[k] = v.model;
      }
      data.id = id;
      upDeviceType(data).then(res => {
        if (res.result) {
          this.$refs.tabBar.reviseShowAndHide(false);
          this.curNode = res.result;
          Message({
            message: this.$t('success.revise'),
            type: 'success'
          });
          this.requestInfo();
        }
      })
      .catch(err => {

      });
    },
    /**
     * 全部勾选或取消
     */
    selectAll(check) {
      for (const v of this.tableData.values()) {
        v.check = check;
      }
    },
    /**
     * 请求删除数据
     * @param {Array} ids 要删除的id
     */
    deleteTableInfo(ids) {
      this.$confirm(this.$t('message.delete'), this.$t('message.title'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      })
        .then(() => {
          delDeviceType(ids.join()).then(res => {
            if (res.result) {
              Message({
                type: 'success',
                message: this.$t('success.delete')
              });
              for (const v of ids.values()) {
                const i = this.tableData.findIndex(e => e.id === v);
                if (i !== -1) {
                  this.tableData.splice(i, 1);
                }
              }
            }
          })
          .catch(err => {

          });
        })
        .catch(() => {});
    },
    /**
     * 删除选中的数据
     */
    clickDelete() {
      const ids = this.tableData.reduce((initArr, v) => {
        if (v.check) {
          initArr.push(v.id);
        }
        return initArr;
      }, []);

      if (!ids.length) {
        Message.error(this.$t('error.noData'));
        return;
      }
      this.deleteTableInfo(ids);
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
}

.table-box {
  padding: 10px 5 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
</style>
