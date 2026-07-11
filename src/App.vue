<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <h1>Vue Pew</h1>
        <span class="subtitle">座位分組工具</span>
      </div>
      <div class="stats">
        已分配 <strong>{{ assignedCount }}</strong> / {{ ROWS * COLS }} 席
      </div>
    </header>

    <main class="layout">
      <section class="card board">
        <h2 class="card-title">座位表</h2>
        <p class="card-desc">先在右側選擇群組，點擊座位加入該組；再點一次取消。</p>
        <SeatGrid :rows="ROWS" :cols="COLS" :cells="cellMap" @toggle="toggleSeat" />
      </section>

      <aside class="card panel">
        <h2 class="card-title">群組</h2>
        <p class="card-desc">雙擊名稱可以重新命名。</p>
        <GroupPanel
          :groups="groups"
          :selected-index="selectedIndex"
          @select="selectedIndex = $event"
          @remove="removeGroup"
          @add="addGroup"
          @shuffle="shuffleGroups"
        />
      </aside>
    </main>

    <Transition name="fade">
      <div v-if="hint" class="toast">{{ hint }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SeatGrid from './components/SeatGrid.vue'
import GroupPanel from './components/GroupPanel.vue'
import type { CellInfo, Group } from './types'
import { randomPastelColor, shuffle } from './utils'

const ROWS = 10
const COLS = 10

const groups = ref<Group[]>([
  {
    name: 'Group 1',
    color: '#aefeed',
    metas: [
      { row: 1, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  { name: 'Group 2', color: '#cfacfc', metas: [{ row: 3, col: 3 }] },
  { name: 'Group 3', color: '#caecbc', metas: [] },
])

const selectedIndex = ref<number | null>(0)

const hint = ref('')
let hintTimer: ReturnType<typeof setTimeout> | undefined

// 由 groups 反推出每個座位格的顯示資訊
const cellMap = computed(() => {
  const map = new Map<string, CellInfo>()
  groups.value.forEach((group, groupIndex) => {
    group.metas.forEach((meta, metaIndex) => {
      map.set(`${meta.row},${meta.col}`, {
        color: group.color,
        index: metaIndex + 1,
        groupIndex,
        groupName: group.name,
      })
    })
  })
  return map
})

const assignedCount = computed(() =>
  groups.value.reduce((sum, group) => sum + group.metas.length, 0),
)

function showHint(message: string) {
  hint.value = message
  clearTimeout(hintTimer)
  hintTimer = setTimeout(() => (hint.value = ''), 2200)
}

function toggleSeat(row: number, col: number) {
  if (selectedIndex.value === null) {
    showHint('請先在右側選擇一個群組')
    return
  }
  const cell = cellMap.value.get(`${row},${col}`)
  if (cell) {
    const owner = groups.value[cell.groupIndex]
    owner.metas.splice(
      owner.metas.findIndex((meta) => meta.row === row && meta.col === col),
      1,
    )
    // 點到同組的座位＝取消選取，不再重新加入
    if (cell.groupIndex === selectedIndex.value) return
  }
  groups.value[selectedIndex.value].metas.push({ row, col })
}

function addGroup() {
  groups.value.push({
    name: `Group ${groups.value.length + 1}`,
    color: randomPastelColor(),
    metas: [],
  })
}

function removeGroup(index: number) {
  groups.value.splice(index, 1)
  if (selectedIndex.value === null) return
  if (selectedIndex.value === index) {
    selectedIndex.value = groups.value.length > 0 ? 0 : null
  } else if (selectedIndex.value > index) {
    selectedIndex.value--
  }
}

function shuffleGroups() {
  groups.value.forEach((group) => {
    group.metas = shuffle(group.metas)
  })
  showHint('已重新隨機排序各組座位編號')
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.brand h1 {
  margin: 0;
  font-size: 1.35rem;
  letter-spacing: 0.5px;
  color: var(--accent);
}

.subtitle {
  color: var(--muted);
  font-size: 0.9rem;
}

.stats {
  color: var(--muted);
  font-size: 0.9rem;
}

.stats strong {
  color: var(--text);
}

.layout {
  max-width: 1080px;
  margin: 24px auto;
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px;
}

.card-title {
  margin: 0 0 4px;
  font-size: 1.05rem;
}

.card-desc {
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 0.85rem;
}

.board {
  overflow-x: auto;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  box-shadow: var(--shadow);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}
</style>
