<template>
  <div class="content border">
    <div class="current">
      <h5 class="cur-title">{{ $t('menuManage.curModelTitle') }}</h5>
    </div>
    <tab-bar class="row-PL" ref="tabBar" :searchList="searchList" :listLi="listLi" :operButton="operButton" :rules="rules" @query="query(null)" @clickAdd="modelClickAddInfo" @addConfirm="addModelConfirm" @clickRevise="reviseModelInfo" @reviseConfirm="reviseModelConfirm" @clickDelete="clickDelete"/>
    <my-table ref="table" isCheck :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" @selectAll="selectAll" />
  </div>
</template>

<script>
import { getOperButton, notIsChild, compaer, isNameRepeat } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { rule } from '@/utils'
import { addSmModule, upSmModule, delSmModule } from '@/api/sysetsmM/menu'
import { mapGetters } from 'vuex'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

import { MessageBox, Message } from 'element-ui'

export default {
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('menuManage.searchList'))
    const listLi = getCopyObj(this.$t('menuManage.modelListLi'))
    const tableTitle = this.$t('menuManage.tableTitle')
    const paging = {
      disabled: false,
      pageSize: 20,
      total: 0
    }
    const rules = {
      moduleName: rule('isEmpty', this.$t('menuManage.menuRules.moduleName')),
      moduleUniqeCode: rule('isEmpty', this.$t('menuManage.menuRules.moduleUniqeCode')),
      moduleEntrance: rule('isEmpty', this.$t('menuManage.menuRules.moduleEntrance'))
    }
    return {
      paging,
      rules,
      listLi,
      searchList,
      tableTitle,
      tableData: [],
      operButton: {},
      modelInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  props: {
    tableDataAll: {
      type: [Array, Object],
      default: []
    },
    curNode: {
      type: Object,
      default: {}
    },
    treeData: {
      type: [Array, Object],
      default: []
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  created() {
    var code = this.$route.query.code
    var url = this.$route.path
    var modelUrl = url.replace('menuManage', 'modelManage')
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, modelUrl)
        break
      }
    }
  },
  methods: {
    /**
     * 获取表格数据
     * @param {String} id 当前的菜单id
     */
    getByMenuID(id) {
      getByMenuID(id).then(res => {
        if (res.result) {
          const arr = res.result.items || []
          this.tableData = arr
          this.tableDataAll = getCopyObj(arr)
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
      this.curNode = curNode
      this.getByMenuID(curNode.id)
    },
    /**
     * 点击查询的回调
     */
    query(data) {
      const modelCode = this.searchList.modelCode.model
      const modelName = this.searchList.modelName.model
      const arr = data || this.tableDataAll
      if (modelCode || modelName) {
        // this.tableData = JSON.parse(JSON.stringify(this.tableDataAll))
        this.tableData = arr.filter((v, i, arr) => {
          v.flag = v.dataFlag == 1 ? this.$t('otherText.enable') : this.$t('otherText.prohibit')
          const isName = v.moduleName.indexOf(modelName)
          const isCode = v.moduleUniqeCode.indexOf(modelCode)
          if (modelCode && modelName) {
            if (isName > -1 && isCode > -1) {
              return true
            }
          } else if (modelCode && !modelName) {
            if (isCode > -1) {
              return true
            }
          } else if (!modelCode && modelName) {
            if (isName > -1) {
              return true
            }
          }
        })
      } else {
        // 为空的时候全部展示出来
        for (const v of arr.values()) {
          v.flag = v.dataFlag == 1 ? this.$t('otherText.enable') : this.$t('otherText.prohibit')
        }
        this.tableData = getCopyObj(arr)
      }
    },
    /**
     * 子组件点击增加模块按钮
     */
    modelClickAddInfo() {
      // 根节点不能添加
      if (this.curNode.id == this.parentId) {
        Message.error(this.$t('error.menuRoot'))
        return
      }
      //判断是不是叶子节点
      const boole = notIsChild(this.treeData, this.curNode.id)
      if (!boole) {
        Message.error(this.$t('error.notNode'))
        return
      }
      this.$refs.tabBar.addShowAndHide(true)
    },
    /**
     * 子组件点击增加模块确认
     */
    addModelConfirm(res) {
      const name = res.moduleName.model
      const boole = isNameRepeat({ tree: this.tableDataAll, nameK: 'moduleName', name })
      if (boole) {
        Message.error(this.$t('error.nameRepeat'))
        return
      }
      var data = {}
      for (var key in res) {
        data[key] = res[key].model
      }
      data.menuId = this.curNode.id
      addSmModule(data).then(res => {
        if (res.success) {
          this.$refs.tabBar.addShowAndHide(false)
          Message({
            message: this.$t('success.add'),
            type: 'success'
          })
          const obj = res.result
          let arr = JSON.parse(JSON.stringify(this.tableDataAll))
          arr.push(obj)
          arr.sort(compaer('sortNum'))
          this.$emit('upData', arr)
          this.query(arr)
        }
      })
      .catch(err => {

      })
    },
    /**
     * 子组件点击修改模块
     */
    reviseModelInfo() {
      const ids = this.tableData.reduce((initArr, v) => {
        if (v.check) {
          this.modelInfo = v
          initArr.push(v.id)
        }
        return initArr
      }, [])

      if (ids.length !== 1) {
        Message.error(this.$t('error.noData'))
        return
      }
      for (const [k, v] of Object.entries(this.listLi)) {
        //选中修改的参数赋值给弹窗
        const val = this.modelInfo[k]
        if (isNaN(+val) || !val) {
          v.model = val
        } else {
          v.model = +val
        }
      }
      this.$refs.tabBar.reviseShowAndHide(true)
    },
    /**
     * 子组件点击修改模块确定
     */
    reviseModelConfirm(listLi) {
      const name = listLi.moduleName.model
      const id = this.modelInfo.id
      const boole = isNameRepeat({
        tree: this.tableDataAll,
        nameK: 'moduleName',
        idK: 'id',
        name,
        id
      })
      if (boole) {
        Message.error(this.$t('error.nameRepeat'))
        return
      }
      var obj = {}
      for (var key in listLi) {
        obj[key] = listLi[key].model
      }
      obj.menuId = this.curNode.id
      obj.id = id
      obj.dataFlag = obj.dataFlag
      upSmModule(obj).then(res => {
        if (res.success) {
          // 排序码没有修改
          var index = this.tableDataAll.findIndex(elem => elem.id == id)
          let arr = JSON.parse(JSON.stringify(this.tableDataAll))
          arr.splice(index, 1, res.result)
          arr = arr.sort(compaer('sortNum'))
          this.$emit('upData', arr)
          // 调用query方法去修改表格的数据
          this.query(arr)
          this.modelInfo = res.result
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
     * 点击删除模块
     */
    clickDelete() {
      const ids = this.tableData.reduce((initArr, v) => {
        if (v.check) {
          this.modelInfo = v
          initArr.push(v.id)
        }
        return initArr
      }, [])

      if (!ids.length) {
        Message.error(this.$t('error.noData'))
        return
      }
      MessageBox.confirm(this.$t('message.delete'), this.$t('message.title'), {
        confirmButtonText: this.$t('button.confirm'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      })
        .then(() => {
          delSmModule(ids.join()).then(res => {
            if (res.success) {
              const arr = getCopyObj(this.tableDataAll)
              for (const v of ids.values()) {
                // 当前菜单下所有的模块的数组也要改变
                for (const [j, e] of arr.entries()) {
                  if (v == e.id) {
                    arr.splice(j, 1)
                  }
                }
                // 表格展示的数据
                for (const [j, e] of this.tableData.entries()) {
                  if (v == e.id) {
                    this.tableData.splice(j, 1)
                  }
                }
              }
              this.$emit('upData', arr)
              this.modelInfo = {}
              Message({
                type: 'success',
                message: this.$t('success.delete')
              })
            }
          })
        })
        .catch(() => {})
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
  padding: 0 0 0 5px;
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
  padding: 20px 0;
}
</style>