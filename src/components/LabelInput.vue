<template>
  <span class="label-input">
    <input
      v-if="editing"
      ref="inputEl"
      v-model="model"
      type="text"
      @keyup.enter="editing = false"
      @blur="editing = false"
    />
    <span v-else class="label-text" title="雙擊修改名稱" @dblclick="startEdit">
      {{ model }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'

const model = defineModel<string>({ required: true })

const editing = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

async function startEdit() {
  editing.value = true
  await nextTick()
  inputEl.value?.focus()
  inputEl.value?.select()
}
</script>

<style scoped>
.label-input {
  display: inline-block;
}

.label-input input {
  width: 100%;
  font: inherit;
  padding: 2px 6px;
  border: 1px solid var(--accent);
  border-radius: 6px;
  outline: none;
  background: var(--card);
  color: var(--text);
}

.label-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}
</style>
