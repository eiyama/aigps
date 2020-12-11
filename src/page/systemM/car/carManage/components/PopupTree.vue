<template>
	<el-scrollbar
	    v-show="isShow"
	    class="dpt-tree border scroll-y"
	    @click.native.stop
	>
		<el-tree
			class="border-blue"
			empty-text
			accordion
			ref="tree"
			highlight-current
			:expand-on-click-node="false"
			:data="tree"
			:node-key="nodeKey"
			:props="defaultProps"
			:default-expanded-keys="opendIdArr"
			:show-checkbox="isCheck"
			:filter-node-method="filterNode"
			@node-click="handleNode"
			@check="check"
		>
		</el-tree>
	</el-scrollbar>
</template>

<style scoped lang="scss">
.dpt-tree {
	position: absolute;
	top: 42px;
	left: -10px;
	z-index: 999999;
	background: #fff;
	width: 240px;
	height: 300px;
	box-shadow: 0 1px 5px #666;
	overflow: hidden;
}
</style>

<script>
	import { Tree, Scrollbar } from 'element-ui'

	export default {
		name: 'PopupTree',
		components: {
			ElTree: Tree,
			ElScrollbar: Scrollbar
		},
		props: {
			tree: {
				type: Array,
				default: () => []
			},
			defaultProps: {
				type: Object,
				default: {}
			},
			nodeKey: {
				type: String,
				default: 'id'
			},
			isShow: {
				type: Boolean,
				default: false
			},
			isCheck: {
				type: Boolean,
				default: false
			},
			labels: {
				type: Array,
				default: () => []
			},
			opendIdArr: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
			}
		},
		created() {
		},
		mounted() {
			document.documentElement.addEventListener('click', this.handleTreeHide)
		},
		beforeDestroy() {
			document.documentElement.removeEventListener('click', this.handleTreeHide)
		},
		methods: {
			handleTreeHide() {
				this.$emit('update:isShow', false)
			},
			/**
			 * 点击树节点
			 * @param {Object} data 树的当前节点
			 */
			handleNode(data) {
				this.$emit('handleNode', data)
			},
			/**
			 * 输入框输入的时候
			 */
			filter(val) {
				const { $refs } = this
				$refs.tree.filter(val)
			},
			/**
			 * 树过滤
			 */
			filterNode(value, data) {
				const { labels } = this
				if (!value || !labels.length) return true
				return labels.some(label => {
					const name = data[label]
					return name.toUpperCase().indexOf(value.toUpperCase()) > -1
				})
				
			},
			/**
			 * 树的check事件
			 * @return {[type]} [description]
			 */
			check() {
				const { $refs } = this
				const checkNodes = $refs.tree.getCheckedNodes()
				this.$emit('check', checkNodes)
			}
		}
	}
</script>