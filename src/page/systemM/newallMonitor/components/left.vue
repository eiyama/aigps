<!-- 添加 -->
<template>
  <div class="add-button">    
      <div class="model">
        <el-form 
                 :class="isBoxMin ? 'main-form-min' : 'main-form clearFloat'"
                 :model="listLi"
                 ref="ruleForm">
          <el-form-item v-show="!v.isHide"
                        v-for="(v, key) in listLi"
                        class="input-bar"
                        :key="key"
                        :label="v.label"
                        :prop="key"
                        :label-width="formLabelWidth">
            <!-- 输入框 -->
            <el-input v-if="v.type == 'input'"
                      v-model="v.model"
                      auto-complete="off"
                      :placeholder="v.placeholder || ''"
                      :disabled="!!v.disabled"
                      :readonly="!!v.readonly"
                      :clearable="!v.disabled || !v.readonly"
                      @click.native="handleInput(key)">
              <template v-if="!!v.prepend"
                        slot="prepend">{{ v.prepend }}</template>
              <template v-if="!!v.append"
                        slot="append">{{ v.append }}</template>
            </el-input>
            <!-- 输入框number -->
            <el-input v-if="v.type == 'number'"
                      :placeholder="v.placeholder || ''"
                      v-model.number="v.model"
                      auto-complete="off"
                      clearable>
              <template v-if="!!v.prepend"
                        slot="prepend">{{ v.prepend }}</template>
              <template v-if="!!v.append"
                        slot="append">{{ v.append }}</template>
            </el-input>
            <!-- 密码 -->
            <el-input v-if="v.type == 'pwd'"
                      :placeholder="v.placeholder || ''"
                      type="password"
                      v-model="v.model"
                      auto-complete="off"
                      clearable></el-input>
            <!-- 单选 -->
            <template v-if="v.type == 'dropDown'">
              <el-radio v-model="v.model"
                        v-for="(item, index) in v.children"
                        :key="index"
                        :label="index">{{ item }}</el-radio>
            </template>
            <!-- 下拉 -->
            <template v-if="v.type == 'select1'">
              <el-select class="input-max"
                         v-model="v.model"
                         @change="changeSelect($event, key)"
                         :placeholder="v.placeholder || ''"
                         :disabled="!!v.disabled"
                         >
                <el-option v-for="(item, index) in v.list"
                           :key="index"
                           :label="item[v.key.id]"
                           :value="item[v.key.value]"></el-option>
              </el-select>
            </template>
            <!-- 时间 -->
            <el-date-picker v-if="v.type == 'time'"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="v.model"
                            type="datetime"
                            :placeholder="$t('placeholder.times')"
                            align="right"
                            :picker-options="pickerOptions"
                            :disabled="!!v.disabled"
            ></el-date-picker>
            <!-- 日期 -->
            <el-date-picker :disabled="!!v.disabled"
                            v-if="v.type == 'date'"
                            value-format="yyyy-MM-dd"
                            v-model="v.model"
                            type="date"
                            :picker-options="pickerOptions"
                            :placeholder="$t('placeholder.times')"></el-date-picker>
            <!-- 固定时间 -->
            <el-time-select v-if="v.type == 'fixedTime'"
                            v-model="v.model"
                            :picker-options="v.pickerOptions"
                            :placeholder="v.placeholder || $t('placeholder.time')"
                            @focus="timeSelectFocus($event, key)"></el-time-select>
            <!-- 树 -->
            <template v-if="v.type == 'tree'">
              <el-input :ref="`${key}1`"
                        @click.native.stop="focus(v.idk, key, v.showcheck)"
                        v-model="v.model"
                        :placeholder="v.placeholder || ''"
                        @input.native="valueChange($event, key, v.showcheck)"
                        @clear="clear(key, v.showcheck)"
                        auto-complete="off"
                        clearable></el-input>
              <el-scrollbar v-show="isShow"
                            @click.native.stop="handleFocus(key)"
                            class="dtp-tree border scroll-y">
                <el-tree class="border-blue"
                         :show-checkbox="!!v.showcheck"
                         :ref="key"
                         empty-text
                         accordion
                         :expand-on-click-node="false"
                         :default-expanded-keys="v.opendId"
                         :data="v.tree"
                         @node-expand="handleFocus(key)"
                         @node-collapse="handleFocus(key)"
                         @node-click="handleNodeClick($event, $event, v.showcheck)"
                         @check="check($event, key)"
                         node-key="id"
                         highlight-current
                         :props="v.props"
                         :filter-node-method="filterNode(v.props.label)">
                </el-tree>
              </el-scrollbar>
            </template>
            <!--省市区选择  -->

          </el-form-item>
        </el-form>
      </div>     
  
  </div>
</template>

<script>
import { Radio, InputNumber, TimeSelect, Upload, Input, Button, Tree, DatePicker, Select, Option, Dialog, Form, FormItem, Tooltip, Scrollbar } from 'element-ui'
import { getPickerOptions2, getKeyObj } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
export default {
  name: 'ClickButtonAdd',
  components: {
    ElRadio: Radio,
    ElInputNumber: InputNumber,
    ElTimeSelect: TimeSelect,
    ElUpload: Upload,
    ElInput: Input,
    ElButton: Button,
    ElTree: Tree,
    ElDatePicker: DatePicker,
    ElSelect: Select,
    ElOption: Option,
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem,
    ElTooltip: Tooltip,
    ElScrollbar: Scrollbar
  },
  data () {
    const pickerOptions = getPickerOptions2(this.$t('otherText'))
    return {
      opendId: [],
      pickerOptions,
      isShow: false,
      oldVal: '',
      upImg: {},
      lock: true // 控制动画不能连续执行的锁
    }
  },
  mounted () {
    document.documentElement.addEventListener('click', this.handleTreeHide)
  },
  beforeDestroy () {
    document.documentElement.removeEventListener('click', this.handleTreeHide)
  },
  methods: {
		/**
		 * 点击关闭树
		 */
    handleTreeHide () {
      this.isShow = false
    },
		/**
		 * 点击确认按钮
		 * @param {String} formName form表单的ref
		 * @param {Boolean} isOthere 不是点击的确认按钮
		 */
    addConfirm (formName, isOthere) {
      let oRef = this.$refs[formName]
      // 如果是数组就校验下标为0的
      if (Array.isArray(this.$refs[formName])) {
        oRef = this.$refs[formName][0]
      }
      oRef.validate((valid) => {
        if (valid) {
          this.$emit('addConfirm', this.listLi, isOthere)
        } else {
          return false
        }
      })
    },
		/**
		 * 点击添加按钮
		 */
    clickAdd () {
      this.$emit('clickAddInfo')
    },
		/**
		 * 打开的回调
		 */
    addOpen () {
      if (!this.$refs.ruleForm) return
      // 证明是遍历出来的
      if (this.isBox) {
        for (const [i, v] of this.$refs.ruleForm.entries()) {
          this.$refs.ruleForm[i].clearValidate()
        }
      } else {
        this.$refs.ruleForm.clearValidate()
      }
    },
		/**
		 * 关闭时的回调
		 */
    close () {
      this.$emit('close')
      // 证明是遍历出来的
      if (this.isBox) {
        for (var key in this.listLi) {
          for (var k in this.listLi[key].child) {
            if (this.listLi[key].child[k].default != undefined) {
              this.listLi[key].child[k].model = this.listLi[key].child[k].default
            } else {
              this.listLi[key].child[k].model = ''
            }
          }
        }
      } else {
        for (var key in this.listLi) {
          if (this.listLi[key].default != undefined) {
            this.listLi[key].model = this.listLi[key].default
          } else {
            this.listLi[key].model = ''
          }
        }
      }
      this.$emit('update:addDialog', false)
    },
		/**
		 * 点击树节点事件
		 * @param {Object} data 当前节点的数据
		 * @param {Object} node 当前节点的node
		 * @param {Boolean} isCheck 是否是复选框
		 */
    handleNodeClick (data, node, isCheck) {
      this.$emit('node-click', data);
      if (!isCheck) this.isShow = false;
    },
		/**
		 * 点击让树输入框获取焦点
		 */
    handleFocus (key) {
      this.$refs[`${key}1`][0].focus()
    },
		/**
		 * 树过滤
		 */
    filterNode (label) {
      return (value, data) => {
        if (!value) return true
        const name = data[label] || ''
        return name.toUpperCase().indexOf(value.toUpperCase()) !== -1
      }
    },
		/**
		 * 搜索树的输入框值改变
		 * @param {Event} ev 输入框的event对象
		 * @param {String} key 当前选项的key值
		 * @param {Boolean} check 是否是复选框树
		 */
    valueChange (ev, key, isCheck) {
      const val = ev.target.value
      // 通过优化输入来尽量减少调用过滤的方法
      if (this.oldVal === val) return
      this.oldVal = val
      setTimeout(() => {
        if (val === this.oldVal) {
          if (!val) {
            if (!isCheck) {
              this.$refs[key][0].setCurrentKey(null)
            }
            this.clear(key, isCheck)
          } else if (val.length >= 2) {
            this.$refs[key][0].filter(val)
          }
        }
      }, 400)
    },
		/**
		 * 树的输入框点击清除按钮
		 * @param {String} key 当前的key
		 * @param {Boolean} isCheck 是否是复选框
		 * @param {String} k 多一层对象的时候
		 */
    clear (key, isCheck, k) {
      if (isCheck) {
        this.$refs[key][0].setCheckedKeys([])
        this.$emit('check', [], key)
      } else {
        this.$emit('searchValChange', key)
        this.$refs[key][0].setCurrentKey(null)
      }
      const obj = k ? this.listLi[k].child[key] : this.listLi[key]
      obj.id = ''
      const oldTree = getCopyObj(obj.tree)
      obj.tree = []
      this.$nextTick(() => {
        obj.tree = oldTree
      })
      this.$refs[`${key}1`][0].focus()
    },
		/**
		 * 保存并关联车辆
		 */
    addIsRelationCar (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('addIsRelationCar', this.listLi)
        } else {
          return false
        }
      })
    },
		/**
		 * 树复选框被选中
		 */
    check (ev, key) {
      const checkNodeAll = this.$refs[key][0].getCheckedNodes()
      this.$emit('check', checkNodeAll, key)
    },
		/**
		 * 固定时间触发焦点
		 */
    timeSelectFocus ($event, key) {
      this.$emit('timeSelectFocus', key)
    },
		/**
		 * 触发树输入框的焦点
		 * @param {String} idk 树的id键名
		 * @param {Array} ids 当前要勾选的id
		 * @param {String} key 树组件的ref
		 * @param {Boolean} isCheck 是否是复选框
		 */
    focus (idk, key, isCheck, k) {
      if (this.isShow) return
      this.isShow = true
      const obj = k ? this.listLi[k].child[key] : this.listLi[key]
      const opendId = obj.opendId
      if (!opendId || !opendId.length) {
        const id = idk ? obj.tree[0][idk] : obj.tree[0].id
        obj.opendId = [id]
      }
      if (!isCheck) return
      const ids = obj.id
      if (ids) {
        const arr = ids.split(',')
        this.$refs[key][0].setCheckedKeys(arr)
      } else {
        this.$refs[key][0].setCheckedKeys([])
      }
    },
    // 点击图标执行动画
    handleAnmation (isSwitch, data, key) {
      if (!this.lock) {
        return
      }
      this.lock = false
      this.$set(data, key, !isSwitch)
      setTimeout(() => {
        this.lock = true
      }, 300)
    },
		/**
		 * 下拉框选择的时候
		 * @param {String} val 当前选中的值
		 * @param {String} key 当前数据的key
		 */
    changeSelect (val, key) {
      this.$emit('changeSelect', val, key)
    },
    /**
     * 点击input输入框
		 * @param {String} key 当前数据的key
     */
    handleInput (key) {
      this.$emit('handleInput', key)
    }
  },
  props: {
    listLi: {
      type: Object,
      default: () => { }
    },
    addTitle: {
      type: String,
      default: ''
    },
    rules: {
      type: Object,
      default: () => { }
    },
    formLabelWidth: {
      type: String,
      default: '120px'
    },
    addDialog: {
      type: Boolean,
      default: false
    },
    buttonShow: {
      type: Boolean,
      default: false
    },
    hideBtn: {
      type: Boolean,
      default: false
    },
    // 为true使用单排从上往下排列
    isBoxMin: {
      type: Boolean,
      default: false
    },
    // 是否需要多一层盒子包裹
    isBox: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.main-form {   
  margin-left: -30px;
  padding: 10px 0 0;
}
.main-form .input-bar {
  margin-left: 30px;
  width: 344px;
  position: relative;
  float: left;
}
.main-form-min {
  padding: 0 58px !important;
}
.input-max {
  width: 220px;
}
.el-input,
.upload-demo,
.upload-demo {
  width: 220px !important;
}
.upload-demo {
  line-height: 0;
}
.upload-demo >>> .el-upload,
.upload-demo >>> .el-upload-dragger {
  width: 220px !important;
  height: 40px;
  overflow: hidden;
}
.upload-demo >>> .el-upload-dragger {
  float: left;
}
.upload-demo >>> .el-upload-dragger button {
  float: left;
  margin: 3px 0 0 8px;
}
.upload-demo >>> ul li {
  margin: 5px 0 0;
}
.dtp-tree {
  position: absolute;
  top: 42px;
  left: -10px;
  z-index: 999999;
  background: #fff;
  width: 240px;
  height: 300px;
  box-shadow: 0 1px 5px #666;
}
.cur-title {
  padding: 0 38px 10px;
  font-size: 15px;
}
.animationH0 {
  transition: 0.3s all;
  max-height: 0 !important;
}
.animationHAuto {
  transition: 0.3s all;
  max-height: 1000px !important;
}
.rotate0 {
  transform: rotate(0);
  transition: 0.3s all;
}
.rotate90 {
  transform: rotate(90deg);
  transition: 0.3s all;
}
</style>
