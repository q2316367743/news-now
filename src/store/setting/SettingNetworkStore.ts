import { defineStore } from "pinia";
import { buildSettingNetwork, SettingNetwork } from "@/entity";
import {
  getFromOneByAsync,
  saveOneByAsync,
} from "@/utils/utools/DbStorageUtil";
import { AxiosRequestConfig } from "axios";
import { LocalNameEnum } from "@/global/LocalNameEnum";

export const useSettingNetworkStore = defineStore("SettingNetworkStore", () => {
  const setting = ref<SettingNetwork>(buildSettingNetwork());
  const rev = ref<string>();

  const engineTimeout = computed(() => setting.value.engineTimeout);
  const minDelay = computed(() => setting.value.minDelay);

  watchDebounced(
    setting,
    async () => {
      rev.value = await saveOneByAsync(
        LocalNameEnum.SETTING_NETWORK,
        setting.value,
      );
    },
    { debounce: 300, deep: true },
  );

  const init = async () => {
    const res = await getFromOneByAsync<SettingNetwork>(
      LocalNameEnum.SETTING_NETWORK,
    );
    rev.value = res?.rev;
    if (res.record) {
      setting.value = res.record;
    }
  };

  const fillAxiosConfig = (config: AxiosRequestConfig) => {
    if (setting.value.userAgent) {
      config.headers = {
        "User-Agent": setting.value.userAgent,
        ...config.headers,
      };
    }
    if (setting.value.proxyMode === 2) {
      config.proxy = {
        host: setting.value.proxyHost,
        port: setting.value.proxyPort,
        protocol: setting.value.proxyType,
      };
      if (setting.value.proxyUsername && setting.value.proxyPassword) {
        config.proxy.auth = {
          username: setting.value.proxyUsername,
          password: setting.value.proxyPassword,
        };
      }
    }
  };

  return {
    setting,
    engineTimeout,
    minDelay,
    init,
    fillAxiosConfig,
  };
});
