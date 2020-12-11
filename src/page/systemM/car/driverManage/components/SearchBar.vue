<template>
	<div class="search-bar">
	  	<div class="li">
	  		<span class="label">{{ searchList.driveName.label }}</span>
	  		<el-input
				v-model="searchList.driveName.model"
				clearable
				auto-complete="off"
				size="small"
				:placeholder="searchList.driveName.placeholder"
			  	@keyup.enter.native="handleSearch"
			/>
	  	</div>
	  
	  	<div class="li">
		  	<el-button
				@click="handleSearch"
				type="primary"
				size="small"
				icon="el-icon-search"
			>
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
		::v-deep .el-input {
			width: 160px;
			float: left;
		}
	}
}
</style>

<script>
import { Input, Button } from 'element-ui'
import { getCopyObj } from '@/utils/util'

export default {
	name: 'SearchBar',
	components: {
		ElInput: Input,
		ElButton: Button
	},
	data() {
    	const searchList = getCopyObj(this.$t('driverManage.searchList'))
		return {
			restaurants: [],
        	labels: ['dptName'],
        	isShow: false,
        	oldVal: '',
        	searchList
		}
	},
	watch: {
		searchList: {
			deep: true,
			handler(newVal, oldVal) {
				this.$emit('initPageing')
			}
		}
	},
	methods: {
	    /**
	     * 点击查询
	     */
	    handleSearch() {
	    	this.$emit('handleSearch')
	    },
	    /**
	     * 获取查询参数
	     * @return {Object} data
	     */
	    getSearchData() {
	    	const { searchList } = this
	    	const data = {}
	    	for (const [k, v] of Object.entries(searchList)) {
				data[k] = v.model || ''
			}
			// console.log(data)
			return data
	    }
	}
}
</script>
