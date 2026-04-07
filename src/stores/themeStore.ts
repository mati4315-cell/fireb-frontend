import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // Check localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const isDark = ref(savedTheme ? savedTheme === 'dark' : prefersDark);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const setTheme = (dark: boolean) => {
    isDark.value = dark;
  };

  // Watch for changes and sync with DOM and localStorage
  watch(isDark, (val) => {
    const root = document.documentElement;
    if (val) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, { immediate: true });

  return {
    isDark,
    toggleTheme,
    setTheme
  };
});
