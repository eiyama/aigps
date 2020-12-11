<template>
  <el-dialog :title="$t('allMonitor.sendCommandTitle')" :visible.sync="isShow" width="30%" :before-close="close">
    <el-tabs v-model="instructPopVal.tabsVal" type="card">
      <el-tab-pane label="发送指令" name="instruct">
        <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="$t('allMonitor.sendCommandVehTerminalNo')">{{curMarker.vehTerminalNo}}</el-form-item>
          <el-form-item :label="$t('allMonitor.sendCommandContext')">
            <el-input type="textarea" v-model="context"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="油路控制" name="oil-way">
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item v-show="!!instructPopVal.isVideoDevice" label="sim：">{{curMarker.sim}}</el-form-item>          
          <el-form-item v-show="!instructPopVal.isVideoDevice" :label="$t('allMonitor.sendCommandVehTerminalNo')">{{curMarker.vehTerminalNo}}</el-form-item>            
          <el-form-item label="指令类型">
            <el-select size="small" v-model="instructPopVal.selectVal" placeholder="请选择">
              <el-option v-for="(v, i) of instructPopVal.selectArr" :key="i" :label="v.label" :value="!!instructPopVal.isVideoDevice ? v.value2 : v.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">{{$t('button.cancel')}}</el-button>
      <el-button size="small" type="primary" @click="sendOrder">{{$t('button.confirm')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { sendMsg } from '@/api/dpt'
import { Dialog, Tabs, TabPane, Form, FormItem, Select, Option, Message } from 'element-ui'
export default {
  components: {
    ElDialog: Dialog,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    ElForm: Form,
    ElFormItem: FormItem,
    ElSelect: Select,
    ElOption: Option
  },
  data() {
    const data = this.getData()
    return data
  },
  props: {
    curMarker: {
      type: Object,
      default: {}
    }
  },
  beforeDestroy() {
    // const data = this.getData()
    // for (const [k, v] of Object.entries(data)) {
    //   this[k] = v
    // }
  },
  methods: {
    getData() {
      const arr = [
        {
          value: 0,
          value2: 'OK',
          label: '恢复油路'
        },
        {
          value: 1,
          value2: 'CUT',
          label: '正常断油'
        },
        {
          value: 85,
          value2: 'DIRECT',
          label: '立即断油'
        }
      ]
      return {
        instructPopVal: {
          selectArr: arr,
          tabsVal: 'instruct',
          selectVal: 0
        },
        context: '',
        isShow: false
      }
    },
    /**
     * 设置显示隐藏
     */
    setIsShow(state) {
      this.isShow = true
      this.$set(this.instructPopVal, 'isVideoDevice', state)
      if (state) {
        this.$set(this.instructPopVal, 'selectVal', 'OK')
      } else {
        this.$set(this.instructPopVal, 'selectVal', 0)
      }
    },
    close() {
      this.context = ''
      this.isShow = false
    },
    /**
     * 发送指令
     */
    sendOrder() {
      var that = this;
      let data = {};
      if (this.instructPopVal.tabsVal === 'instruct') {
        data = this.getInfo(0x8300, this.context)
      } else if (this.instructPopVal.tabsVal === 'oil-way') {
        // 视频设备发送短信
        if (this.instructPopVal.isVideoDevice) {
          data = {
            sim: that.curMarker.sim,
            msg: this.instructPopVal.selectVal
          }
          this.request(data, 'SendMsg')
          return
        }
        data = this.getInfo(0xA006, this.instructPopVal.selectVal)
      }
      this.request(data, 'SendText')
    },
    /**
     * 发送请求
     * @param {Object} data 请求的参数
     * @param {String} url 请求url的后缀
     */
    request(data, url) {
      sendMsg(data, url).then(res => {
        this.context = ''
        this.isShow = false
        Message({
          message: this.$t('success.sendCommand'),
          type: 'success'
        })
      })
      .catch(err => {

      })
    },
    /**
     * 获取参数
     */
    getInfo(messageId, context) {
      return {
        vehTerminalNo: this.curMarker.vehTerminalNo,
        messageId,
        context,
        flag: '1'
      }
    }
  }
}
</script>