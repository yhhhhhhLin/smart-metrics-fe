<template>
  <div class="node-wrapper">
    <div class="node-content" :style="{ paddingLeft: level * 20 + 'px' }">
      <span v-if="node.children?.length" @click.stop="toggleExpand" class="expand-icon">
        {{ isExpanded ? '-' : '+' }}
      </span>
      <span
          class="node-label"
          :class="{ selected: node.id === selectedId }"
          @click="select"
      >
        {{ node.title }}
      </span>
    </div>
    <div v-show="isExpanded" class="children">
      <TreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :level="level + 1"
          :selected-id="selectedId"
          @select="emitSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  node: Object,
  level: Number,
  selectedId: [String, Number]
})
const emit = defineEmits(['select'])

const isExpanded = ref(true)
const toggleExpand = () => (isExpanded.value = !isExpanded.value)
const select = () => emit('select', props.node)
const emitSelect = (node) => emit('select', node)
</script>

<style scoped>
.node-content {
  padding: 6px 12px;
  cursor: pointer;
}
.node-content:hover {
  background: #f5f5f5;
}
.node-label.selected {
  color: #1890ff;
  font-weight: bold;
}
.expand-icon {
  width: 20px;
  display: inline-block;
}
</style>
