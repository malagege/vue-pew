<template>
  <div
    class="seat-grid"
    :style="{ gridTemplateColumns: `repeat(${cols}, var(--seat-size))` }"
  >
    <template v-for="r in rows" :key="r">
      <button
        v-for="c in cols"
        :key="`${r}-${c}`"
        class="seat"
        :class="{ filled: cellAt(r - 1, c - 1) }"
        :style="
          cellAt(r - 1, c - 1)
            ? { background: cellAt(r - 1, c - 1)!.color }
            : undefined
        "
        :title="cellAt(r - 1, c - 1)?.groupName"
        @click="emit('toggle', r - 1, c - 1)"
      >
        {{ cellAt(r - 1, c - 1)?.index ?? '' }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CellInfo } from '../types'

const props = defineProps<{
  rows: number
  cols: number
  cells: Map<string, CellInfo>
}>()

const emit = defineEmits<{
  toggle: [row: number, col: number]
}>()

function cellAt(row: number, col: number): CellInfo | undefined {
  return props.cells.get(`${row},${col}`)
}
</script>

<style scoped>
.seat-grid {
  display: grid;
  gap: 6px;
  width: max-content;
  margin: 0 auto;
}

.seat {
  width: var(--seat-size);
  height: var(--seat-size);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--seat-bg);
  color: var(--text);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.1s, border-color 0.1s, box-shadow 0.1s;
}

.seat:hover {
  border-color: var(--accent);
  transform: scale(1.08);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25);
}

.seat.filled {
  border-color: rgba(0, 0, 0, 0.15);
  font-weight: 600;
  /* 座位底色是使用者選的粉彩色，固定深色文字才看得清楚 */
  color: #1f2937;
}
</style>
