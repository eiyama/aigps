<!-- 用户管理 -->
<template>
  <div class="content">
    <tab-bar ref="tabBar" :addTitle="$t('userManage.addTitle')" :reviseTitle="$t('userManage.reviseTitle')" :listLi="listLi"
      :rules="rules" :searchList="searchList" :tree="tree" :defaultProps="defaultProps" :operButton="operButton"
      @addConfirm="addConfirm" @clickAdd="clickAdd" @reviseConfirm="reviseConfirm" @clickRevise="clickRevise"
      @clickTreeNode="handleNodeClick" @clickDelete="clickDelete" @query="query"></tab-bar>
    <my-table ref="table" isCheck :tableData="tableData" :tableTitle="tableTitle" @request="requestList" @selectAll="selectAll" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getOperButton, parentId } from '@/utils/data'
import { rule } from '@/utils'
import { getCopyObj } from '@/utils/util'
import { getSmUser, getDepartmentAll } from '@/api/sysetsmM/dpt'
import { addSmUser, upSmUser, delSmUser } from '@/api/sysetsmM/menu'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { MessageBox, Message } from 'element-ui'
export default {
  name: 'UserManage',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const rules = {
      userCode: rule('isEmpty', this.$t('userManage.rules.userCode')),
      userName: rule('isEmpty', this.$t('userManage.rules.userName')),
      dptName: rule('isEmpty', this.$t('userManage.rules.dptName')),
      userMd5pwd: rule('isPsw', this.$t('userManage.rules.userMd5pwd'))
    }
    const listLi = getCopyObj(this.$t('userManage.listLi'));
    const searchList = getCopyObj(this.$t('userManage.searchList'));
    const tableTitle = this.$t('userManage.tableTitle');
    return {
      rules,
      listLi,
      searchList,
      tableTitle,
      tableData: [],
      parentId,
      tree: [],
      treeCurNode: {},
      curNode: {},
      defaultProps: {
        children: 'child',
        label: 'dptName'
      },
      operButton: {},
    }
  },
  computed: {
    ...mapGetters([
      'menuTree',
      'userInfo'
    ])
  },
  watch: {
    searchList: {
      deep: true,
      handler(newVal, oldVal) {
        const pageing = {
          isShow: true,
          totalCount: 0,
          curPage: 1
        }
        this.$refs.table.setPageing(pageing);
      }
    }
  },
  async created() {
    const code = this.$route.query.code;
    const url = this.$route.path;
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, url);
        break;
      }
    }
    try {
      const res = await getDepartmentAll({ id: this.userInfo.id });
      if (res.result) {
        const tree = res.result.items;
        this.listLi.dptName.tree = tree;
        this.listLi.dptName.props = this.defaultProps;
        // this.listLi.dptName.opendId = [tree[0].id];
      }
    } catch(err) {

    }
  },
  mounted() {
    this.requestList();
  },
  methods: {
    /**
     * 请求数据
     */
    requestList() {
      var userName = this.searchList.userName.model || '';
      var userCode = this.searchList.userCode.model || '';
      var dptName = this.searchList.dptName.model || '';
      const pageing = this.$refs.table.getPageing();
      var skipCount = (pageing.curPage - 1) * pageing.limit;
      const data = {
        userName,
        userCode,
        dptName,
        skipCount,
        maxResultCount: pageing.limit
      }
      getSmUser(data).then(res => {
        if (res.success) {
          const list = res.result.items;
          for (const v of list.values()) {
            v.type = this.listLi.userType.children[+v.userType - 1];
          }
          this.tableData = list;
          const pageing = {
            totalCount: res.result.totalCount,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)
        }
      })
      .catch(err => {

      });
    },
    //点击确认
    addConfirm(res) {
      var that = this;
      var obj = {};
      for (var key in res) {
        obj[key] = res[key].model;
      }
      obj.userIsAvailable = !!obj.userIsAvailable;
      obj.userType += 1;
      obj.dptId = this.treeCurNode.id;
      // obj.userDespwd = '';
      delete obj['dptName'];
      delete obj['id'];
      addSmUser(obj).then(res => {
        if (res.success) {
          this.$refs.tabBar.addShowAndHide(false);
          this.requestList();
          Message({
            type: 'success',
            message: this.$t('success.add')
          });
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击修改
     */
    clickRevise() {
      this.$set(this.rules, 'userMd5pwd', rule('isPsw2', this.$t('userManage.rules.userMd5pwd2'), true));
      this.treeCurNode = {};
      const num = this.tableData.reduce((total, v) => {
        if (v.check) {
          this.curNode = v;
          total ++;
        }
        return total;
      }, 0);
      if (num === 1) {
        this.$refs.tabBar.reviseShowAndHide(true);
        for (var key in this.listLi) {
          this.listLi[key].model = this.curNode[key];
        }
        this.listLi.userType.model -= 1;
        this.listLi.userIsAvailable.model = +this.listLi.userIsAvailable.model;
      } else {
          Message.error(this.$t('error.noData'));
      }
    },
    /**
     * 修改确定
     */
    reviseConfirm() {
      var obj = {};
      for (var key in this.listLi) {
        obj[key] = this.listLi[key].model;
      }
      obj.userIsAvailable = !!obj.userIsAvailable;
      obj.userType += 1;
      //如果treeCurNode有证明修改了部门，没有证明没有修改
      obj.dptId = this.treeCurNode.id || this.curNode.dptId;
      obj.id = this.curNode.id;
      obj.userMd5pwd = obj.userMd5pwd || '';
      obj.isRevisePsw = +!!obj.userMd5pwd;
      obj.userDespwd = '';
      obj.dataFlag = '';
      // 选择不修改密码就为空字符串
      delete obj['dptName'];
      upSmUser(obj).then(res => {
        if (res.success) {
          this.$refs.tabBar.reviseShowAndHide(false);
          this.curNode = res.result;
          Message({
            message: this.$t('success.revise'),
            type: "success"
          });
          this.requestList();
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击查询按钮
     */
    query() {
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.table.setPageing(pageing)
      this.requestList();
    },
    /**
     * 点击树节点
     */
    handleNodeClick(data) {
      this.treeCurNode = data;
      this.listLi.dptName.model = data.dptName;
    },
    /**
     * 全部勾选
     */
    selectAll(check) {
      for (const v of this.tableData.values()) {
        v.check = check;
      }
    },
    /**
     * 点击添加数据
     */
    clickAdd() {
      this.$refs.tabBar.addShowAndHide(true);
      this.treeCurNode = {};
      this.$set(this.rules, 'userMd5pwd', rule('isPsw', this.$t('userManage.rules.userMd5pwd')));
    },
    /**
     * 删除的方法
     */
    deleteTableInfo(ids) {
      MessageBox.confirm(this.$t('message.delete'), this.$t('message.title'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: "warning"
      })
        .then(() => {
          delSmUser(ids).then(res => {
            if (res.success) {
              Message({
                type: "success",
                message: this.$t('success.delete')
              });
              this.requestList();
            } 
          })
          .catch(err => {

          });
        })
        .catch(() => {});
    },
    /**
     * 删除数据
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
      this.deleteTableInfo(ids.join());
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
  padding: 25px 0 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-model {
  height: 100%;
  position: relative;
}

.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
</style>