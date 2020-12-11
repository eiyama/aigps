<!-- 部门管理 -->
<template>
  <div class="wrapper">
    <left-tree ref="leftTree" :evBus="evBus"  />
    <center-tree ref="cenTree" :evBus="evBus" />
    <div class="move-info">
      <div class="move-btn">
        <span @click="handleMoveLeft" class="el-icon-d-arrow-left"></span>
        <span @click="clickMoveRight" class="el-icon-d-arrow-right"></span>
      </div>
    </div>
    <right-list ref="list" :evBus="evBus" />
</div>
</template>
<script>
import Vue from 'vue';
import LeftTree from './components/leftTree';
import CenterTree from './components/centerTree';
import RightList from './components/rightList';
import { Message } from 'element-ui'

export default {
  name: 'divisionManage',
  components: {
    CenterTree,
    LeftTree,
    RightList
  },
  data() {
    const evBus = new Vue;
    return {
      evBus
    }
  },
  created() {
  },
  beforeDestroy() {
    this.evBus = null;
  },
  methods: {
    /**
     * 点击向左添加数据
     */
    handleMoveLeft() {
      const arr = this.$refs.list.getCheckList();
      if (!arr.length) {
        Message.error(this.$t('divisionManage.msgSelectCar'));
        return;
      }
      this.evBus.$emit('handleMoveLeft', arr);
    },
    /**
     * 点击向右撤销数据
     */
    clickMoveRight() {
      var that = this;
      //获取所有选中的节点返回一个array
      var arr = this.$refs.cenTree.getCarId();
      //调用这个方法，将所有的选中的type为2的车辆Id返回出来
      if (!arr.length) {
        Message.error(this.$t('divisionManage.msgSelectCancelCar'));
        return;
      }
      this.evBus.$emit('handleMoveRight', arr);
    }
  }
}
</script>
<style scoped>
.wrapper {
  padding: 10px;
  background:#fff;
  flex:1;
  display:flex;
  overflow: hidden;
}
.move-info {
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
</style>