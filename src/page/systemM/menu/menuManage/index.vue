<!-- 系统管理 -->
<template>
  <div class="container">
    <!-- 菜单树 -->
    <menu-tree ref="menuTree" :treeData="treeData" :curNode="curNode" :tableData="tableData" :parentId="parentId" @setCurNode="setCurNode" @getMenuAll="getMenuAll" />
    <!-- 右侧表格 -->
    <right-table ref="rTable" :curNode="curNode" :tableDataAll="tableData" :treeData="treeData" :parentId="parentId" @upData="upData" />
  </div>
</template>

<script>
import { parentId } from '@/utils/data'
import { getMenuAll, getByMenuID } from '@/api/sysetsmM/menu'

import MenuTree from './components/menuTree'
import RightTable from './components/rightTable'

export default {
  name: 'menuManage',
  components: {
    RightTable,
    MenuTree
  },
  data() {
    return {
      treeData: [],
      tableData: [],
      curNode: {},
      parentId
    };
  },
  created() {
    this.getMenuAll();
  },
  methods: {
    /**
     * 获取树数据
     * @param {Boolean} curId 当前id
     */
    getMenuAll(curId) {
      const data = {
        id: parentId
      }
      getMenuAll(data).then(res => {
        if (res.success) {
          const list = res.result.items;
          this.treeData = list;
          this.$nextTick(() => {
            if (!curId) {
              this.$refs.menuTree.setCurrentKey(list[0].id);
              this.curNode = list[0];
              this.getByMenuID(list[0].id);
            } else {
              this.$refs.menuTree.setCurrentKey(curId);
            }
          })
        }
      })
      .catch(err => {
        
      })
    },
    /**
     * 获取表格数据
     * @param {String} id 当前的菜单id
     */
    getByMenuID(id) {
      getByMenuID(id).then(res => {
        if (res.success) {
          const arr = res.result.items;
          this.tableData = arr;
          this.$refs.rTable.query(this.tableData);
        }
      })
      .catch(err => {

      })
    },
    /**
     * 设置当前节点的参数
     * @param {Object} curNode 当前节点的data值
     */
    setCurNode(curNode) {
      this.curNode = curNode;
      this.getByMenuID(curNode.id);
    },
    /**
     * 修改树数据的值
     * @param {Array} tableData 要更新的数据
     */
    upData(tableData) {
      this.tableData = tableData;
    }
  }
}
</script>

<style scoped>
.container {
  flex: 1;
  padding: 5px;
  background: #fff;
  display: flex;
  overflow: hidden;
  border: none;
}
</style>