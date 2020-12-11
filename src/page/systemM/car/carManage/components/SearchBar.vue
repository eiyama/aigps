<template>
  <div class="search-bar">
    <div class="li">
      <span class="label">{{ searchList.search.label }}</span>
      <el-autocomplete size="small"
                       clearable
                       v-model="searchList.search.model"
                       :fetch-suggestions="querySearchAsync"
                       :placeholder="searchList.search.placeholder"
                       :style="{width: `${searchList.search.width || 160}px`}"
                       @select="handleSelect"
                       @keyup.enter.native="handleSearch" />
    </div>
    <div class="li">
      <span class="label">{{ searchList.dptIds.label }}</span>
      <el-input v-model="searchList.dptIds.model"
                clearable
                auto-complete="off"
                size="small"
                :placeholder="searchList.dptIds.placeholder"
                @click.native.stop="handleClick"
                @input.native="changeInput"
                @clear="handleClear"
                @keyup.enter.native="handleSearch" />
      <popup-tree :tree="searchList.dptIds.tree"
                  :defaultProps="searchList.dptIds.defaultProps"
                  :isShow.sync="isShow"
                  :labels="labels"
                  :opendIdArr="opendIdArr"
                  :isCheck="searchList.dptIds.showcheck"
                  ref="popupTree"
                  @check="check" />
    </div>
    <div class="li">
      <span class="label">{{ searchList.type.label }}</span>
      <el-select v-model="searchList.type.model"
                 size="small"
                 multiple
                 collapse-tags
                 :style="{width: `${searchList.type.width || 160}px`}"
                 :placeholder="searchList.type.placeholder">
        <el-option v-for="(item, index) in searchList.type.list"
                   :key="index"
                   :label="item.devtName"
                   :value="item.id" />
      </el-select>
    </div>

    <div class="li">
      <span class="label">{{ searchList.vehExpired.label }}</span>
      <el-date-picker size="small"
                      :style="{ width: `${searchList.vehExpired.width || 160}px` }"
                      value-format="yyyy-MM-dd"
                      v-model="searchList.vehExpired.model"
                      type="date"
                      :picker-options="pickerOptions"
                      :placeholder="searchList.vehExpired.placeholder" />
    </div>
    <div class="li">
      <el-button @click="handleSearch"
                 type="primary"
                 size="small"
                 icon="el-icon-search">
        {{ $t('button.search') }}
      </el-button>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  overflow: hidden;
  .li {
    float: left;
    margin: 0 10px 5px 0;
    position: relative;
    .label {
      float: left;
      line-height: 33px;
    }
    ::v-deep .el-input,
    ::v-deep .el-autocomplete,
    ::v-deep .el-select {
      width: 220px;
      float: left;
    }

    ::v-deep .dpt-tree {
      float: right;
      left: auto;
      right: -10px;
    }
  }
}
</style>

<script>
import { Input, Button, Autocomplete, Select, Option, DatePicker } from 'element-ui'
import { getSearch } from '@/api/sysetsmM/car'
import { getCopyObj } from '@/utils/util'
import { getPickerOptions2 } from '@/utils/data'
import PopupTree from './PopupTree'

export default {
  name: 'SearchBar',
  components: {
    ElInput: Input,
    ElButton: Button,
    ElAutocomplete: Autocomplete,
    ElSelect: Select,
    ElOption: Option,
    ElDatePicker: DatePicker,
    PopupTree
  },
  data () {
    const pickerOptions = getPickerOptions2(this.$t('otherText'))
    const searchList = getCopyObj(this.$t('carManage.searchList'))
    return {
      restaurants: [],
      labels: ['dptName'],
      isShow: false,
      oldVal: '',
      opendIdArr: [],
      pickerOptions,
      searchList
    }
  },
  watch: {
    searchList: {
      deep: true,
      handler (newVal, oldVal) {
        this.$emit('initPageing')
      }
    }
  },
  created () {
    const { $route, searchList } = this
    const { vehPlateNo } = $route.query
    if (vehPlateNo) searchList.search.model = vehPlateNo
  },
  methods: {
    async querySearchAsync (val, cb) {
      if (!val || val.length < 2) {
        cb(this.restaurants)
        return
      }
      try {
        const res = await getSearch({ val, take: 20 })
        const list = res.result
        const newArr = list.reduce((arr, v) => {
          const { vehPlateNo, vehTerminalNo } = v
          const obj = {
            vehPlateNo,
            vehTerminalNo,
            value: `${v.vehPlateNo}/${v.vehTerminalNo}`
          }
          arr.push(obj)
          return arr
        }, [])
        cb(newArr)
        this.restaurants = newArr
      } catch (err) {
        cb([])
      }
    },
    /**
     * 远程搜索选中
     * @param  {Object} item 点击当前对象的数据
     */
    handleSelect (item) {
      const { searchList } = this
      this.$set(searchList.search, 'model', item.vehPlateNo)
    },
    /**
 * 设置设备类型
 */
    setDevType (list) {
      const { searchList } = this
      searchList.type.list = list
    },
    /**
 * 设置部门名称的tree数据
 */
    setDptNameTree (tree) {
      const { searchList } = this
      searchList.dptIds.tree = tree
      this.opendIdArr.push(tree[0].id)
    },
		/**
	     * 点击tree的输入框
	     */
    handleClick () {
      const { isShow } = this
      // 为true的时候不执行
      if (isShow) return
      this.isShow = true
    },
    /**
     * 输入框值改变
     */
    changeInput (e) {
      const val = e.target.value
      // 通过优化输入来尽量减少调用过滤的方法
      if (this.oldVal === val) return
      this.oldVal = val
      const tid = setTimeout(() => {
        clearTimeout(tid)
        if (val === this.oldVal) {
          if (!val) {
            this.handleClear()
          } else if (val.length >= 2) {
            this.$refs.popupTree.filter(val)
          }
        }
      }, 400)
    },
    /**
     * 点击清除树的输入框
     */
    handleClear () {
      const { searchList } = this
      const tree = searchList.dptIds.tree
      searchList.dptIds.id = ''
      const oldTree = getCopyObj(tree)
      searchList.dptIds.tree = []
      this.$nextTick(() => {
        searchList.dptIds.tree = oldTree
      })
    },
    /**
     * 树的复选框选中的时候
     * @param  {Array} arr 选中的所有节点的node
     */
    check (arr) {
      const { searchList } = this
      if (!(arr instanceof Array) || !arr.length) {
        searchList.dptIds.model = ''
        searchList.dptIds.id = ''
        return
      }
      const names = []
      const ids = []
      for (const v of arr.values()) {
        names.push(v.dptName)
        ids.push(v.id)
      }
      // 输入框赋值
      searchList.dptIds.model = names.join()
      // 将id保存起来
      searchList.dptIds.id = ids.join()
    },
    /**
     * 点击查询
     */
    handleSearch () {
      this.$emit('handleSearch')
    },
    /**
     * 获取查询参数
     * @return {Object} data
     */
    getSearchData () {
      const { searchList } = this
      const data = {}
      for (const [k, v] of Object.entries(searchList)) {
        data[k] = v.model || ''
      }
      data.type = data.type ? data.type.join() : ''
      data.dptIds = searchList.dptIds.id || ''
      return data
    }
  }
}
</script>
