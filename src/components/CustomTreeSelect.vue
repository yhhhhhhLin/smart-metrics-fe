<template>
  <div class="custom-tree-select">
    <div class="selected-display" @click="toggleDropdown">
      {{ selectedNode?.title || '请选择目录' }}
      <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
    </div>

    <div v-show="isOpen" class="tree-container">
      <TreeNode
          v-for="node in treeData"
          :key="node.id"
          :node="node"
          :level="0"
          :selected-id="modelValue"
          @select="handleSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  treeData: Array,
  modelValue: [String, Number]
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedNode = ref(null)

const toggleDropdown = () => (isOpen.value = !isOpen.value)

const handleSelect = (node) => {
  selectedNode.value = node
  emit('update:modelValue', node.id)
  isOpen.value = false
}

watch(
    () => props.modelValue,
    (val) => {
      const findNode = (nodes) => {
        for (const node of nodes) {
          if (node.id === val) return node
          if (node.children?.length) {
            const found = findNode(node.children)
            if (found) return found
          }
        }
        return null
      }
      selectedNode.value = findNode(props.treeData)
    },
    { immediate: true }
)
</script>

<style scoped>
.custom-tree-select {
  position: relative;
  width: 300px;
}
.selected-display {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
.tree-container {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  max-height: 300px;
  overflow-y: auto;
  z-index: 999;
}
.arrow {
  float: right;
}
</style>
