import {computed, onMounted, onUnmounted, ref, ComputedRef} from "vue";
import {createEventHook, EventHookOn} from "@vueuse/core";

export interface UseSubInputResult {

  /**
   * 当前子输入框的值，只读
   */
  value: ComputedRef<string>;

  /**
   * 设置子输入框的值
   * @param value 子输入框的值
   */
  setSubInput(value: string): void;

  /**
   * 子输入框失去焦点，插件应用获得焦点
   */
  focus(): void;

  /**
   * 子输入框获得焦点并选中子输入框的内容
   */
  select(): void;

  /**
   * 当数据变更
   */
  onChanged: EventHookOn<string>;

  /**
   * 当搜索时，按下Enter触发
   */
  onSearch: EventHookOn<string>

  /**
   * 当数据清空时，按下Enter触发
   */
  onClear: EventHookOn<void>
}

/**
 * 子输入框hook
 * @param initialValue 子输入框初始值
 * @param placeholder 占位符
 * @param isFocus 是否聚焦，默认true
 */
export function useSubInput(initialValue: string = '', placeholder?: string, isFocus?: boolean): UseSubInputResult {

  // 是否在注册中
  let registering = false;

  // 子输入框的值
  const subInput = ref(initialValue);
  // 子输入的包装值
  const subInputWrap = computed(() => subInput.value);

  // 当数据变化的hook
  const onChangedHook = createEventHook<string>();
  // 当搜索时的hook
  const onSearchHook = createEventHook<string>();
  // 当搜索时的hook
  const onClearHook = createEventHook<void>();

  // 键盘按下的事件监听
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && subInput.value) {
      onSearchHook.trigger(subInput.value);
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function register() {
    if (registering) {
      return;
    }
    registering = true;
    // 先移除之前的
    utools.removeSubInput();
    // 注册新的
    const interval = setInterval(() => {
      let res = utools.setSubInput(({text}) => {
        if (subInput.value !== text) {
          subInput.value = text;
          onChangedHook.trigger(text);
          if (!text) {
            onClearHook.trigger();
          }
        }
      }, placeholder, isFocus);
      // 如果注册成功
      if (res) {
        // 设置初始值
        if (initialValue) {
          utools.setSubInputValue(initialValue);
        }
        // 清除定时器
        clearInterval(interval);
        registering = false;
      }
    }, 100);
  }

  const visibility = useDocumentVisibility();

  watch(visibility, val => {
    if (val === 'visible') {
      // 当页面显示时进行注册
      register();
    }
  }, {immediate: true});

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  });

  onUnmounted(() => {
    utools.removeSubInput();
    window.removeEventListener('keydown', handleKeyDown);
  });

  function setSubInput(val: string) {
    subInput.value = val;
    utools.setSubInputValue(subInput.value);
  }

  return {
    value: subInputWrap,
    setSubInput,
    focus: () => utools.subInputFocus(),
    select: () => utools.subInputSelect(),
    onChanged: onChangedHook.on, onSearch: onSearchHook.on, onClear: onClearHook.on
  };
}