import {DialogPlugin} from "tdesign-vue-next";
import reward from '@/assets/image/reward.png';

export function openRewardDialog() {
  DialogPlugin({
    header: '赏赞码',
    placement: 'center',
    footer: false,
    width: 400,
    default: () => <img class="w-full" src={reward} alt="wechat-reward"/>
  })
}