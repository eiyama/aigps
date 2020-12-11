<template>
  <el-dialog :title="$t('alarmManage.handleForm.handleTitle')" :visible.sync="isShow" width="600px">
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item :label="$t('alarmManage.handleForm.vehTerminalNo')">{{rowInfo.vehPlateNo}}</el-form-item>
      <el-form-item :label="$t('alarmManage.handleForm.alarmInfo')">{{rowInfo.alaDisplay || rowInfo.alarmDisplay}}</el-form-item>
      <el-form-item :label="$t('alarmManage.handleForm.mome')">
        <el-input type="textarea" v-model="rowInfo.memo"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="isShow = false">{{ $t('button.cancel') }}</el-button>
      <el-button size="small" type="primary" @click="handleAlarmInfo">{{ $t('button.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>

</style>

<script>
import { batchDealWithNew, dealWithNew, dealWithMultiNew , HandleMultiAlarmNew} from '@/api/alarm'
import { getDateStr } from '@/utils/util'
import { Dialog, Form, FormItem, Message } from 'element-ui'

export default {
  components: {
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem
  },
  data() {
    return {
      rowInfo: {},
      isShow: false
    }
  },
  created() {
    eventBus.$on('handleAlarm', this.handleAlarm)
  },
  beforeDestroy() {
    eventBus.$off('handleAlarm', this.handleAlarm)
  },
  methods: {
    /**
     * 点击报警
     * @param {Object} res 数据
     */
    handleAlarm(res) {
      this.isShow = true
      this.rowInfo = res
    },
    /**
     * 点击确认处理（处理单个）
     */
    handleAlarmInfo() {
      let ids = this.rowInfo.id || this.rowInfo.ids ;
    //  console.log(ids);
      const me = this;
      let vehTerminalNos = this.rowInfo.vehTerminalNo
      if (ids) {
        ids = ids.split(",");             
        const data = {
          ids,          
          alarmHandleContent: this.rowInfo.memo || ''
        }
        HandleMultiAlarmNew(data).then(res => {
          if (res.success) {
            me.$set(this.rowInfo, 'memo', '')
            me.isShow = false
            // eventBus.$emit('handleAlaCallback', vehTerminalNos);
            eventBus.$emit('upAlarm'); // 处理之后更新报警查询的表格
            Message({
              message: me.$t('success.alarm'),
              type: 'success'
            })
          }
        })
        .catch(err => {

        })
      }  
    },
    /**
     * 提交批量报警处理
     */
    handleAlarmsInfo() {
      const data = {
        vehTerminalNo: this.rowInfo.vehTerminalNo,
        begin: this.rowInfo.gpsAlarmStartTime,
        end: this.rowInfo.alaTime,
        // id: that.rowInfo.id,
        alarmDisplay: this.rowInfo.alarmDisplay,
        alarmCategory: this.rowInfo.alarmCategory,
        alaHandlerContent: this.rowInfo.memo || ''
      }
      batchDealWithNew(data).then(res => {
        if (res.success) {
          this.$set(this.rowInfo, 'memo', '')
          this.isShow = false
          eventBus.$emit('upAlarm') // 处理之后更新报警查询的表格
          Message({
            message: this.$t('success.alarm'),
            type: 'success'
          })
        }
      })
      .catch(err => {

      })
    },
    /**
     * 根据id批量提交处理
     */
    handleAlarmIds() {
      const data = {
        begin: this.rowInfo.begin,
        end: this.rowInfo.end,
        ids: this.rowInfo.ids,
        alaHandlerContent: this.rowInfo.memo
      }
      dealWithMultiNew(data).then(res => {
        this.$set(this.rowInfo, 'memo', '')
        this.isShow = false
        eventBus.$emit('handleAlaCallback')
        Message({
          message: this.$t('success.alarm'),
          type: 'success'
        })
      })
      .catch(err => {
        
      })
    },
    /**
     * 关闭弹窗前的回调
     */
    beforeClose() {
      this.$emit('close')
    }
  }
}
</script>