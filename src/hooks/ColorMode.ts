type ColorModeType = 'auto' | 'light' | 'dark';

interface ColorModeResult {
  colorMode: Ref<ColorModeType>;
  isDark: ComputedRef<boolean>;
  toggleColorMode: (type: ColorModeType) => void;
}

export const useColorMode = (): ColorModeResult => {
  const colorMode = ref<ColorModeType>(utools.dbStorage.getItem('/key/color-mode') || 'auto');
  const isDark = computed(() => {
    if (colorMode.value === 'dark') {
      return true;
    } else if (colorMode.value === 'light') {
      return false;
    }
    return utools.isDarkColors();
  });

  function onAutoColor() {
    if (colorMode.value != 'auto') {
      return;
    }
    document.body.setAttribute('arco-theme', utools.isDarkColors() ? 'dark' : 'light');

  }

  window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", onAutoColor);

  function renderColorMode() {
    if (colorMode.value === 'light') {
      document.documentElement.removeAttribute('theme-mode');
    } else if (colorMode.value === 'dark') {
      document.documentElement.setAttribute('theme-mode', 'dark');
    } else {
      document.documentElement.setAttribute('theme-mode', utools.isDarkColors() ? 'dark' : 'light');
    }
  }

  renderColorMode();

  watch(colorMode, val => {
    utools.dbStorage.setItem('/key/color-mode', val);
    renderColorMode();
  });

  const toggleColorMode = (type: ColorModeType) => {
    colorMode.value = type;
  }

  return {colorMode, isDark, toggleColorMode}

}