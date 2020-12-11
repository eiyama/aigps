<template>
  <div v-show="curIndex === 1" class="user-list">
    <!-- 已分配 -->
    <div class="center-box border-right">
      <div class="title-bar">
        <h6 class="title floatLeft">{{ $t('divisionManage.centerTitle.title') }}</h6>
        <el-input v-model="info.lVal" @keyup.enter.native="allocatedSearch" @input.native="changeVal($event, 'lTable')"
          class="input floatRight" size="small" :placeholder="$t('placeholder.roleSearch')">
          <i slot="suffix" @click="allocatedSearch" class="el-input__icon search el-icon-search"></i>
        </el-input>
      </div>
      <my-table ref="lTable" :tableData="lTableData" :tableTitle="tableTitle" layout="prev, pager, next" isCheck @request="getBindRoleUser" @selectAll="lSelectAll" />
    </div>
    <div class="move-info">
      <div class="move-btn">
        <span @click="clickBindRoles" class="el-icon-d-arrow-left"></span>
        <span @click="clickUnbindRoles" class="el-icon-d-arrow-right"></span>
      </div>
    </div>
    <!-- 未分配 -->
    <div class="right-box border-left">
      <div class="title-bar">
        <h6 class="title floatLeft">{{ $t('divisionManage.rightTitle.title') }}</h6>
        <el-input v-model="info.rVal" @keyup.enter.native="unassignedSearch" @input.native="changeVal($event, 'rTable')"
          class="input floatRight" size="small" :placeholder="$t('placeholder.roleSearch')">
          <i slot="suffix" @click="unassignedSearch" class="el-input__icon search el-icon-search"></i>
        </el-input>
      </div>
      <my-table ref="rTable" :tableData="rTableData" :tableTitle="tableTitle" layout="prev, pager, next" isCheck @request="getUnboundRoleUser" @selectAll="rSelectAll" />      
    </div>
  </div>
</template>

<script>
import { getBindRoleUser, getUnboundRoleUser, addUserToRole, delUserToRole } from '@/api/sysetsmM/power'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  components: {
    MyTable
  },
  data() {
    const tableTitle = this.$t('roleManage.tableTitle');
    return {
      info: {},
      lTableData: [],
      rTableData: [],
      id: '',
      tableTitle
    }
  },
  props: {
    curIndex: {
      type: Number,
      default: 0
    },
    parentId: {
      type: String
    }
  },
  methods: {
    /**
     * 请求数据
     */
    requestInfo(id) {
      this.id = id;
      this.getBindRoleUser();
      this.getUnboundRoleUser();
    },
    /**
     * 获取分页参数
     * @param {String} ref 表格组件的ref
     */
    getPageing(ref) {
      let search;
      if (ref === 'lTable') {
        search = this.info.lVal || '';
      } else {
        search = this.info.rVal || '';
      }
      const id = this.id;
      const pageing = this.$refs[ref].getPageing();
      const skipCount = (pageing.curPage - 1) * pageing.limit;
      const pageSize = pageing.limit;
      return {
        id,
        search,
        pageSize,
        skipCount
      }
    },
    /**
     * 请求已分配的用户数据
     */
    getBindRoleUser() {
      const data = this.getPageing('lTable');
      getBindRoleUser(data).then(res => {
        if (res.result) {
          this.$set(this.info, 'lOldVal', data.search);
          const list = res.result.items;
          this.lTableData = list;
          const totalCount = res.result.totalCount;
          const pageing = {
            totalCount,
            isShow: false 
          }
          this.$refs.lTable.setPageing(pageing);
        }
      })
      .catch(err => {

      });
    },
    /**
     * 获取未分配的数据
     */
    getUnboundRoleUser() {
      const data = this.getPageing('rTable');
      getUnboundRoleUser(data).then(res => {
        if (res.result) {
          this.$set(this.info, 'rOldVal', data.search);
          const list = res.result.items;
          this.rTableData = list;
          const totalCount = res.result.totalCount;
          const pageing = {
            totalCount,
            isShow: false 
          }
          this.$refs.rTable.setPageing(pageing);
        }
      })
      .catch(err => {

      });
    },
    /**
     * 输入框改变
     */
    changeVal(ev, ref) {
      const val = ev.target.value;
      let oldVal;
      if (ref === 'lTable') {
        oldVal = this.info.lOldVal || '';
      } else {
        oldVal = this.info.rOldVal || '';
      }
      let pageing = {}
      if ((oldVal && val !== oldVal) || (!oldVal && val)) {
        pageing.isShow = true;
      } else {
        pageing.isShow = false;
      }

      this.$refs[ref].setPageing(pageing);
    },
    /**
     * 已分配权限搜索
     */
    allocatedSearch() {
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.lTable.setPageing(pageing)
      this.getBindRoleUser();
    },
    /**
     * 未分配权限搜索
     */
    unassignedSearch() {
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.rTable.setPageing(pageing)
      this.getUnboundRoleUser();
    },
    /**
     * 点击给用户绑定角色
     */
    clickBindRoles() {
      // 证明未选择角色
      if (this.id === this.parentId) {
        Message.error(this.$t('roleManage.selectRoleMsg'));
        return;
      }
      
      const ids = this.rTableData.reduce((initArr, v) => {
        if (v.check) {
          initArr.push(v.id);
        }
        return initArr;
      }, []);
      if (!ids.length) {
        Message.error(this.$t('error.noData'));
        return;
      }
      const data = {
        roleId: this.id,
        userId: ids
      }

      addUserToRole(data).then(res => {
        if (res.result) {
          Message({
            type: "success",
            message: this.$t('success.add')
          });
          this.getUnboundRoleUser();
          this.getBindRoleUser();
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击给用户取消绑定角色
     */
    clickUnbindRoles() {
      if (this.id === this.parentId) {
        Message.error(this.$t('roleManage.selectRoleMsg'));
        return;
      }
      
      const ids = this.lTableData.reduce((initArr, v) => {
        if (v.check) {
          initArr.push(v.id);
        }
        return initArr;
      }, []);

      if (!ids.length) {
        Message.error(this.$t('error.noData'));
        return;
      }
      
      const data = {
        roleId: this.id,
        ids: ids.join()
      }
      delUserToRole(data).then(res => {
        if (res.result) {
          Message({
            type: "success",
            message: this.$t('success.delete')
          });
          this.getUnboundRoleUser();
          this.getBindRoleUser();
        }
      })
      .catch(err => {

      });
    },
    /**
     * 左边表格全选
     */
    lSelectAll(check) {
      for (const v of this.lTableData.values()) {
        v.check = check;
      }
    },
    /**
     * 右边表格全选
     */
    rSelectAll(check) {
      for (const v of this.rTableData.values()) {
        v.check = check;
      }
    }
  }
}
</script>

<style scoped>
.user-list {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.right-box, .center-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.right-box .input, .center-box .input {
  width: 245px !important;
}
.move-info {
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 0;
}
.move-info span {
  display: block;
  width: 40px;
  height: 28px;
  line-height: 28px;
  color: #fff;
  text-align: center;
  background: #00a8d4;
  font-size: 16px;
  margin: 10px auto;
  border-radius: 2px;
  cursor: pointer;
}
.user-list .title-bar {
  height: 32px;
  padding: 4px 5px;
  line-height: 32px;
}
.table-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1px;
  overflow: hidden;
}
.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
</style>