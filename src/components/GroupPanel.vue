<template>
  <div class="group-list">
    <label
      v-for="(group, i) in groups"
      :key="i"
      class="group-item"
      :class="{ active: selectedIndex === i }"
    >
      <input
        class="group-radio"
        type="radio"
        name="group"
        :checked="selectedIndex === i"
        @change="$emit('select', i)"
      />
      <input
        v-model="group.color"
        class="group-color"
        type="color"
        title="變更群組顏色"
      />
      <LabelInput v-model="group.name" class="group-name" />
      <span class="group-count">{{ group.metas.length }}</span>
      <button
        class="group-remove"
        title="刪除群組"
        @click.prevent="$emit('remove', i)"
      >
        ✕
      </button>
    </label>

    <p v-if="groups.length === 0" class="group-empty">
      還沒有群組，先新增一個吧！
    </p>

    <div class="panel-actions">
      <button class="btn btn-primary" @click="$emit('add')">＋ 新增群組</button>
      <button class="btn" @click="$emit('shuffle')">🔀 隨機分組排序</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Group } from '../types'
import LabelInput from './LabelInput.vue'

defineProps<{
  groups: Group[]
  selectedIndex: number | null
}>()

defineEmits<{
  select: [index: number]
  remove: [index: number]
  add: []
  shuffle: []
}>()
</script>

<style scoped>
.group-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.group-item:hover {
  border-color: #c7d2fe;
}

.group-item.active {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.group-radio {
  accent-color: var(--accent);
}

.group-color {
  width: 30px;
  height: 26px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.group-name {
  flex: 1;
  min-width: 0;
}

.group-count {
  min-width: 22px;
  text-align: center;
  font-size: 0.75rem;
  background: #eef2f7;
  border-radius: 999px;
  padding: 2px 6px;
  color: var(--muted);
}

.group-remove {
  border: none;
  background: none;
  color: var(--muted);
  border-radius: 6px;
  padding: 2px 6px;
}

.group-remove:hover {
  color: #dc2626;
  background: #fee2e2;
}

.group-empty {
  color: var(--muted);
  font-size: 0.85rem;
  text-align: center;
  margin: 4px 0;
}

.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}

.btn {
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  transition: background 0.15s;
}

.btn:hover {
  background: #f3f4f6;
}

.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.btn-primary:hover {
  background: #4338ca;
}
</style>
