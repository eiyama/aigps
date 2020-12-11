<template>
  <div class="center-box">
    <div class="title">{{ $t('divisionManage.centerTitle.title') }}</div>
    <div class="center-content">
      <div class="type-bar">
        <div class="left">{{ $t('otherText.yesSelect') }}{{ checkNum }}</div>
        <div class="search-bar">
          <el-input v-model="searchVal" :placeholder="$t('placeholder.carNum')" class="search-input" size="small" @keyup.enter.native="upEnter">
            <i slot="suffix" class="el-input__icon search el-icon-search" @click="upEnter"></i>
          </el-input>
        </div>
      </div>
      <el-scrollbar class="scroll-y" width="100%" style="flex:1;">
        <el-tree
          class="border-blue"
          :expand-on-click-node="false"
          empty-text
          :default-expanded-keys="centerOpenKeys"
          show-checkbox
          :data="centerTree"
          @node-click="handleNode"
          @check="check"
          node-key="id"
          highlight-current
          ref="centerTree"
          :props="defaultProps"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="!data.child || !data.child.length" style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe606;</span>
            <!-- 文件图标闭合 -->
            <span v-if="data.child && data.child.length && node.expanded" style="color:#00a8d4;font-size:12px;" class="icon iconfont">&#xe602;</span>
            <!-- 文件图标展开 -->
            <span v-if="data.child && data.child.length && !node.expanded" style="color:#00a8d4;font-size:14px;" class="icon iconfont">&#xe642;</span>
            <span v-if="data.select" style="font-size: 14px;background: #00a8d4;color: #fff;padding: 0 5px;">{{ node.label }}</span>
            <span v-if="!data.select" style="font-size: 14px;padding: 0 5px;">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getOperButton, parentId, testTreeName, notIsChild } from '@/utils/data'
import { getAssigned, addGpsAllotVehicle } from '@/api/sysetsmM/dpt'
import { Message, Scrollbar, Tree } from 'element-ui'

export default {
  components: {
    ElScrollbar: Scrollbar,
    ElTree: Tree
  },
  data() {
    return {
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      checkNum: 0,
      searchVal: '',
      centerTree: [],
      centerOpenKeys: [],
      parentNode: {},
      curNode: {}
    }
  },
  props: {
    evBus: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.evBus.$on('handleNode', this.handleNodeFn);
    this.evBus.$on('handleMoveLeft', this.handleMoveLeft);
    this.evBus.$on('removeNode', this.removeNode);
  },
  beforeDestroy() {
    this.evBus.$off('handleNode', this.handleNodeFn);
    this.evBus.$off('handleMoveLeft', this.handleMoveLeft);
    this.evBus.$off('removeNode', this.removeNode);
  },
  methods: {
    /**
     * 左侧树点击节点更新中间树
     * @param {Object} data 节点的数据
     * @param {Boolean} isHandle true是点击节点，false只是调用方法
     */
    handleNodeFn(data, isHandle) {
      if (isHandle) {
        this.parentNode = data;
      }
      return new Promise(resolve => {
        getAssigned(data.id).then(res => {
          if (res.success) {
            const list = res.result.items;
            this.centerTree = list;
            this.centerOpenKeys.push(list[0].id);
            this.checkNum = 0;
            this.$nextTick(() => {
              // 如果中间输入框有值且长度大于2就过滤树
              if (this.searchVal.length >= 2) {
                this.$refs.centerTree.filter(this.searchVal);
              }
              if (isHandle) {
                this.curNode = list[0];
                this.$refs.centerTree.setCurrentKey(list[0].id);
              }
              resolve();
            });
          }
        })
        .catch(error => {
          
        });
      })
    },
    // 点击中间树节点
    handleNode(data, node) {
      // 证明这是车辆还是部门
      if (data.type == '2') {
        // 如果是车辆不允许高亮
        this.$refs.centerTree.setCurrentKey(this.curNode.id);
        return;
      }
      this.curNode = data;
      this.evBus.$emit('handleNodeCenter', data);

    },
    /**
     * 中间树勾选改变选中值
     */
    check() {
      var curNodes = this.$refs.centerTree.getCheckedNodes();
      this.checkNum = curNodes.reduce((total, v, i, arr) => {
        if (v.type == 2) {
          total ++;
        }
        return total;
      }, 0);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.toUpperCase().indexOf(value.toUpperCase()) !== -1;
    },
    /**
     * 回车键或点击搜索图标过滤树
     */
    upEnter() {
      const val = this.searchVal;
      if (!val || val.length >= 2) {
        this.$refs.centerTree.filter(val);
      }
    },
    /**
     * 向中间树添加车辆
     * @param {Array} arr 车辆数据
     */
    async handleMoveLeft(arr) {
      try {
        await this.addGpsAllotVehicle(arr);
        // 保存已勾选的节点
        const curNode = this.getCarId();
        await this.handleNodeFn(this.parentNode, false);
        this.$nextTick(() => {
          this.$refs.centerTree.setCurrentKey(this.curNode.id);
          for (const v of curNode.values()) {
            this.$refs.centerTree.setChecked(v, true);
          }
        });
        this.evBus.$emit('handleNodeCenter', this.curNode);
      } catch(err) {

      }
    },
    /**
     * 添加车辆
     * @param {Array} arr 车辆数据
     */
    addGpsAllotVehicle(arr) {
      return new Promise(resolve => {
        const data = {
          departmentId: this.curNode.id,
          dptName: this.curNode.name,
          vehicle: arr
        }
        addGpsAllotVehicle(data).then(res => {
          if (res.success) {
            Message({
              type: "success",
              message: this.$t('success.add')
            });
            resolve(res);
          }
        })
        .catch(err => {

        });
      })
    },
    /**
     * 获取勾选的车辆数据
     * @return {Array} 返回一个数组
     */
    getCarId() {
      const checkNode = this.$refs.centerTree.getCheckedNodes();
      if (checkNode && checkNode.length) {
        return checkNode.reduce((oArr, v) => {
          if (v.type == 2) {
            oArr.push(v.id);
          }
          return oArr;
        }, [])
      } else {
        return [];
      }
    },
    /**
     * 删除节点
     * @param {Array} ids 要删除的id
     */
    removeNode(ids) {
      for (const v of ids.values()) {
        this.$refs.centerTree.setChecked(v, false);
        this.$refs.centerTree.remove(v);
      }
      this.checkNum = 0;
    }
  }
}
</script>

<style scoped>
.title {
  height: 30px;
  padding: 10px 0 0;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.left-box,
.center-box,
.right-box {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}
.left-box .left-content,
.center-box .center-content,
.right-box .right-content {
  flex: 1;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 1px;
  overflow: hidden;
}
.type-bar {
  overflow: hidden;
  height: 40px;
  border-bottom: 1px solid #ddd;
}
.type-bar span {
  display: block;
  float: left;
  width: 32px;
  height: 32px;
  font-size: 20px;
  color: #00a8d4;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  margin: 4px 0 0 !important;
  box-sizing: border-box;
  border: 1px solid #fff;
}
.type-bar span:hover {
  border: 1px solid #dedede;
  border-radius: 2px;
}
.type-bar .search-bar {
  float: right;
  position: relative;
  top: 4px;
  right: 5px;
}
.type-bar .search-bar .search-input {
  width: 160px;
}
.type-bar .search-bar .search {
  cursor: pointer;
  font-size: 16px;
}
.car-num-list {
  padding: 6px 20px 0;
}
.type-bar .left {
  float: left;
  margin: 11px 0 0 10px;
  line-height: 19px;
  font-size: 14px;
  color: #00a8d4;
}
</style>