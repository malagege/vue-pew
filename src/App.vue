<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <h1>Vue Pew</h1>
        <span class="subtitle">座位分組工具</span>
      </div>
      <div class="topbar-right">
        <div class="stats">
          已分配 <strong>{{ assignedCount }}</strong> / {{ rows * cols }} 席
        </div>
        <button class="theme-btn" title="切換主題（系統 → 淺色 → 深色）" @click="cycle">
          {{ themeLabel }}
        </button>
      </div>
    </header>

    <main class="layout">
      <section class="card board">
        <div class="board-head">
          <div>
            <h2 class="card-title">座位表</h2>
            <p class="card-desc">先在右側選擇群組，點擊座位加入該組；再點一次取消。</p>
          </div>
          <div class="size-controls">
            <label>
              列
              <input v-model.number.lazy="rows" type="number" min="1" :max="MAX_SIZE" />
            </label>
            <span class="size-x">×</span>
            <label>
              欄
              <input v-model.number.lazy="cols" type="number" min="1" :max="MAX_SIZE" />
            </label>
          </div>
        </div>
        <SeatGrid :rows="rows" :cols="cols" :cells="cellMap" @toggle="toggleSeat" />
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
          @export="exportGroups"
          @import="importGroups"
          @clear="clearAll"
        />
      </aside>
    </main>

    <Transition name="fade">
      <div v-if="hint" class="toast">{{ hint }}</div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SeatGrid from './components/SeatGrid.vue'
import GroupPanel from './components/GroupPanel.vue'
import type { CellInfo, Group, Seat } from './types'
import { randomPastelColor, shuffle } from './utils'
import { useTheme } from './theme'

const STORAGE_KEY = 'vue-pew-groups'
const MAX_SIZE = 30
const DEFAULT_SIZE = 10

const { pref, cycle } = useTheme()

const themeLabel = computed(() =>
  pref.value === 'system' ? '🖥️ 系統' : pref.value === 'light' ? '☀️ 淺色' : '🌙 深色',
)

interface PersistedState {
  rows: number
  cols: number
  groups: Group[]
}

function freshGroups(): Group[] {
  return [
    { name: 'Group 1', color: '#aefeed', metas: [] },
    { name: 'Group 2', color: '#cfacfc', metas: [] },
    { name: 'Group 3', color: '#caecbc', metas: [] },
  ]
}

function demoState(): PersistedState {
  const groups = freshGroups()
  groups[0].metas.push({ row: 1, col: 1 }, { row: 2, col: 2 })
  groups[1].metas.push({ row: 3, col: 3 })
  return { rows: DEFAULT_SIZE, cols: DEFAULT_SIZE, groups }
}

// 驗證外部資料（localStorage / 匯入檔）的形狀，不合法回傳 null
function sanitizeGroups(
  data: unknown,
  maxRows: number,
  maxCols: number,
): Group[] | null {
  if (!Array.isArray(data)) return null
  const result: Group[] = []
  for (const item of data) {
    if (typeof item !== 'object' || item === null) return null
    const { name, color, metas } = item as Record<string, unknown>
    if (
      typeof name !== 'string' ||
      typeof color !== 'string' ||
      !Array.isArray(metas)
    ) {
      return null
    }
    const seats: Seat[] = []
    for (const meta of metas) {
      if (typeof meta !== 'object' || meta === null) return null
      const { row, col } = meta as Record<string, unknown>
      const r = Number(row)
      const c = Number(col)
      if (
        !Number.isInteger(r) ||
        !Number.isInteger(c) ||
        r < 0 ||
        r >= maxRows ||
        c < 0 ||
        c >= maxCols
      ) {
        return null
      }
      seats.push({ row: r, col: c })
    }
    result.push({ name, color, metas: seats })
  }
  return result
}

function sanitizeState(data: unknown): PersistedState | null {
  // 舊版格式：整份資料就是群組陣列（固定 10×10）
  if (Array.isArray(data)) {
    const groups = sanitizeGroups(data, DEFAULT_SIZE, DEFAULT_SIZE)
    return groups ? { rows: DEFAULT_SIZE, cols: DEFAULT_SIZE, groups } : null
  }
  if (typeof data !== 'object' || data === null) return null
  const obj = data as Record<string, unknown>
  const r = Number(obj.rows)
  const c = Number(obj.cols)
  if (
    !Number.isInteger(r) ||
    !Number.isInteger(c) ||
    r < 1 ||
    r > MAX_SIZE ||
    c < 1 ||
    c > MAX_SIZE
  ) {
    return null
  }
  const groups = sanitizeGroups(obj.groups, r, c)
  return groups ? { rows: r, cols: c, groups } : null
}

function loadState(): PersistedState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = sanitizeState(JSON.parse(raw))
      if (parsed) return parsed
    } catch {
      // 壞掉的資料直接忽略，回到預設值
    }
  }
  return demoState()
}

const initial = loadState()
const rows = ref(initial.rows)
const cols = ref(initial.cols)
const groups = ref<Group[]>(initial.groups)

const selectedIndex = ref<number | null>(groups.value.length > 0 ? 0 : null)

const hint = ref('')
let hintTimer: ReturnType<typeof setTimeout> | undefined

// 尺寸變更：夾在合法範圍內，並移除超出新範圍的座位
watch([rows, cols], () => {
  if (!Number.isInteger(rows.value) || rows.value < 1) rows.value = 1
  else if (rows.value > MAX_SIZE) rows.value = MAX_SIZE
  if (!Number.isInteger(cols.value) || cols.value < 1) cols.value = 1
  else if (cols.value > MAX_SIZE) cols.value = MAX_SIZE

  let removed = 0
  groups.value.forEach((group) => {
    const before = group.metas.length
    group.metas = group.metas.filter(
      (meta) => meta.row < rows.value && meta.col < cols.value,
    )
    removed += before - group.metas.length
  })
  if (removed > 0) showHint(`已移除 ${removed} 個超出新範圍的座位`)
})

watch(
  [groups, rows, cols],
  () =>
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ rows: rows.value, cols: cols.value, groups: groups.value }),
    ),
  { deep: true },
)

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

function exportGroups() {
  const data: PersistedState = {
    rows: rows.value,
    cols: cols.value,
    groups: groups.value,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'vue-pew-seats.json'
  link.click()
  URL.revokeObjectURL(url)
  showHint('已匯出座位表 JSON')
}

async function importGroups(file: File) {
  try {
    const parsed = sanitizeState(JSON.parse(await file.text()))
    if (!parsed) {
      showHint('匯入失敗：檔案格式不正確')
      return
    }
    rows.value = parsed.rows
    cols.value = parsed.cols
    groups.value = parsed.groups
    selectedIndex.value = parsed.groups.length > 0 ? 0 : null
    showHint('匯入成功')
  } catch {
    showHint('匯入失敗：不是有效的 JSON 檔')
  }
}

function clearAll() {
  if (!window.confirm('確定要清空所有群組與座位分配嗎？')) return
  groups.value = freshGroups()
  selectedIndex.value = 0
  showHint('已清空座位表')
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
  background: var(--topbar-bg);
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

.topbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stats {
  color: var(--muted);
  font-size: 0.9rem;
}

.stats strong {
  color: var(--text);
}

.theme-btn {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  font-size: 0.85rem;
  transition: background 0.15s, border-color 0.15s;
}

.theme-btn:hover {
  border-color: var(--border-hover);
  background: var(--hover);
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

.board-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.size-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 0.85rem;
  white-space: nowrap;
}

.size-controls input {
  width: 58px;
  margin-left: 4px;
  padding: 4px 6px;
  font: inherit;
  color: var(--text);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.size-controls input:focus {
  outline: none;
  border-color: var(--accent);
}

.size-x {
  color: var(--muted);
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  background: var(--toast-bg);
  color: var(--toast-text);
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
