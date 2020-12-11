<!-- 系统管理 -->
<template>
  <div class="content">
    <tab-bar class="row-PL" ref="tabBar" isBoxMin :listLi="listLi" :searchList="search" :operButton="operButton" :rules="rules" @clickAdd="clickAddInfo" @addConfirm="addConfirm" @clickRevise="reviseInfo" @reviseConfirm="reviseConfirm" @clickDelete="clickDelete" @query="query" />
    <my-table ref="table" isCheck :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" @selectAll="selectAll" />
  </div>
</template>

<script>
import { getOperButton, compaer, isNameRepeat } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { rule } from '@/utils'
import { getOperationAll, addSmOperation, upSmOperation, delSmOperation } from '@/api/sysetsmM/menu'
import { mapGetters } from 'vuex'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

import { MessageBox, Message } from 'element-ui'

export default {
  components: {
    TabBar,
    MyTable
  },
  name: 'buttonManage',
  data() {
    const rules = {
      oprCode: rule('isEmpty', this.$t('buttonManage.operationRules.oprCode')),
      oprName: rule('isEmpty', this.$t('buttonManage.operationRules.oprName'))
    }
    const listLi = getCopyObj(this.$t('buttonManage.listLi'))
    const search = getCopyObj(this.$t('buttonManage.searchList'))
    const tableTitle =  this.$t('buttonManage.tableTitle')
    return {
      listLi,
      rules,
      search,
      tableTitle,
      tableData: [],
      tableDataAll: [],
      curNode: {},
      operButton: {}
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  created() {
    var code = this.$route.query.code;
    var url = this.$route.path;
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, url);
        break;
      }
    }
    this.requestInfo();
  },
  beforeDestroy() {
  },
  methods: {
    /**
     * 获取表格数据
     */
    requestInfo() {
      getOperationAll().then(res => {
        if (res.result) {
          const arr = res.result.items || []
          this.tableData = arr
          this.tableDataAll = getCopyObj(arr);
        }
      })
      .catch(err => {

      })
    },
    /**
     * 点击添加按钮
     */
    clickAddInfo() {
      this.$refs.tabBar.addShowAndHide(true);
    },
    /**
     * 点击添加确认按钮
     */
    addConfirm(res) {
      const name = res.oprName.model;
      const code = res.oprCode.model;
      // code和name不能重复
      const isName = isNameRepeat({
        tree: this.tableDataAll,
        nameK: 'oprName',
        name
      })
      const isCode = isNameRepeat({ 
        tree: this.tableDataAll,
        nameK: 'oprCode',
        name: code
      })
      if (isName || isCode) {
        Mmessage.error(this.$t('error.nameRepeat'));
        return;
      }
      var obj = {};
      for (var key in res) {
        obj[key] = res[key].model;
      }
      obj.oprType = +obj.oprType + 1;
      addSmOperation(obj).then(res => {
        if (res.success) {
          this.$refs.tabBar.addShowAndHide(false);
          Message({
            type: "success",
            message: this.$t('success.add')
          });
          this.tableDataAll.push(res.result);
          this.tableDataAll = this.tableDataAll.sort(compaer('sortNum'));
          this.query();
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击修改按钮
     */
    reviseInfo() {
      const num = this.tableData.reduce((count, v) => {
        if (v.check) {
          this.curNode = v
          count++
        }
        return count
      }, 0)
      // 证明选中一条数据
      if (num !== 1) {
        Message.error(this.$t('error.noData'))
        return
      }
      for (var key in this.listLi) {
        // 选中修改的参数赋值给弹窗
        this.listLi[key].model = this.curNode[key]
      }
      this.listLi.oprType.model = +this.listLi.oprType.model - 1
      this.$refs.tabBar.reviseShowAndHide(true)
    },
    /**
     * 点击修改确认按钮
     */
    reviseConfirm(res) {
      const name = res.oprName.model
      const code = res.oprCode.model
      const id = this.curNode.id
      // code和name不能重复
      const isName = isNameRepeat({
        tree: this.tableDataAll,
        nameK: 'oprName',
        idK: 'id',
        name,
        id
      })
      const isCode = isNameRepeat({ 
        tree: this.tableDataAll,
        nameK: 'oprCode',
        idK: 'id',
        name: code,
        id
      })
      if (isName || isCode) {
        Message.error(this.$t('error.nameRepeat'))
        return
      }
      var obj = {};
      for (var key in res) {
        obj[key] = res[key].model
      }
      obj.id = id
      obj.oprType = +obj.oprType + 1
      upSmOperation(obj).then(res => {
        if (res.success) {
          const j = this.tableDataAll.findIndex(elem => elem.id === id)
          if (j > -1) {
            this.tableDataAll.splice(j, 1, res.result)
            this.tableDataAll = this.tableDataAll.sort(compaer('sortNum'))
          }
          this.query()
          this.curNode = res.result
          this.$refs.tabBar.reviseShowAndHide(false)
          Message({
            message: this.$t('success.revise'),
            type: 'success'
          })
        }
      })
      .catch(err => {

      })
    },
    /**
     * 点击删除按钮
     */
    clickDelete() {
      const ids = this.tableData.reduce((arr, v) => {
        if (v.check) {
          arr.push(v.id);
        }
        return arr
      }, [])
      if (!ids.length) {
        Message.error(this.$t('error.noData'));
        return;
      }
      MessageBox.confirm(this.$t('message.delete'), this.$t('message.title'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      })
      .then(() => {
        delSmOperation(ids.join()).then(res => {
          if (res.success) {
            for (var i = 0; i < ids.length; i++) {
              // 当前菜单下所有的模块的数组也要改变
              for (var j = 0; j < this.tableDataAll.length; j++) {
                if (ids[i] == this.tableDataAll[j].id) {
                  this.tableDataAll.splice(j, 1);
                  j--;
                }
              }
              // 表格展示的数据
              for (var j = 0; j < this.tableData.length; j++) {
                if (ids[i] == this.tableData[j].id) {
                  this.tableData.splice(j, 1);
                  j--;
                }
              }
            }
            this.curNode = {};
            Message({
              type: "success",
              message: this.$t('success.delete')
            });
          }
        })
        .catch(err => {

        });  
      })
      .catch(() => { })
    },
    /**
     * 点击查询
     */
    query() {
      const name = this.search.handName.model;
      const code = this.search.handCode.model;
      this.tableData = getCopyObj(this.tableDataAll);
      if (name || code) {
        // this.tableDataAll是当前菜单的所以模块
        for (var i = 0;i < this.tableData.length;i++) {
          const v = this.tableData[i];
          const isCode = v.oprCode.indexOf(code);
          const isName = v.oprName.indexOf(name);
          // 根据indexOf来判断，这里是两个需要比较的参数
          if (name && code && (isCode == -1 || isName == -1)) {
            this.tableData.splice(i, 1);
            i--;
          } else if (name && !code && isName == -1) {
            this.tableData.splice(i, 1);
            i--;
          } else if (!name && code && isCode == -1) {
            this.tableData.splice(i, 1);
            i--;
          }
        }
      }
    },
    /**
     * 复选框全选
     * @param {Boolean} isCheck true是全选，false全不选
     */
    selectAll(isCheck) {
      for (const v of this.tableData.values()) {
        v.check = isCheck
      }
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
</style>