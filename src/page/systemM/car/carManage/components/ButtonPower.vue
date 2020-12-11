<template>
	<div class="button-bar">
		<el-tooltip v-if="operButton.add" class="item" effect="dark" :content="$t('button.add')" placement="top">
			<span @click="handleAdd" class="el-icon-plus mini-btn margin-bottom"></span>
		</el-tooltip>
		<!-- 导入 -->
        <el-tooltip
           v-if="operButton.add"
           class="item"
           effect="dark"
           :content="$t('button.upload')"
           placement="top"
        >
           <span @click="handleUpload" class="el-icon-upload2 mini-btn button"></span>
        </el-tooltip>
		<el-tooltip v-if="operButton.revise" class="item" effect="dark" :content="$t('button.revise')" placement="top">
			<span @click="handleEdit" class="el-icon-edit mini-btn margin-bottom"></span>
		</el-tooltip>
		<el-tooltip
			v-if="operButton.delete"
			class="item"
			effect="dark"
			:content="$t('button.delete')"
			placement="top"
		>
			<span @click="clickDelete" class="el-icon-close button mini-btn margin-bottom"></span>
		</el-tooltip>
	</div>
</template>

<style scoped="scoped" lang="scss">
.button-bar {
	overflow: hidden;
	span {
		float: left;
	}
}
</style>

<script>
	import { Tooltip } from 'element-ui'
	
	export default {
		name: 'ButtonPower',
		components: {
			ElTooltip: Tooltip
		},
		data() {
			return {

			}
		},
		props: {
			operButton: {
				type: Object,
				default: {}
			}
		},
		methods: {
			handleAdd() {
				this.$emit('handleAdd')
			},
			handleEdit() {
				this.$emit('handleEdit')
			},
			clickDelete() {
				this.$emit('handleDelete')
			},
			handleUpload() {
				this.$emit('handleUpload')
			}
		}
	}
</script>