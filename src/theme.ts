import { computed, ref, watchEffect } from 'vue'

export type ThemePref = 'system' | 'light' | 'dark'

const THEME_KEY = 'vue-pew-theme'

export function useTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  const pref = ref<ThemePref>(
    stored === 'light' || stored === 'dark' ? stored : 'system',
  )

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const systemDark = ref(media.matches)
  media.addEventListener('change', (e) => (systemDark.value = e.matches))

  const isDark = computed(
    () =>
      pref.value === 'dark' || (pref.value === 'system' && systemDark.value),
  )

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem(THEME_KEY, pref.value)
  })

  function cycle() {
    pref.value =
      pref.value === 'system' ? 'light' : pref.value === 'light' ? 'dark' : 'system'
  }

  return { pref, isDark, cycle }
}
