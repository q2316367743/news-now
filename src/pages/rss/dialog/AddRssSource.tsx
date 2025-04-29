import {
  ColorPickerPanel,
  DialogPlugin,
  Form,
  FormItem,
  Input,
  InputNumber,
  RadioGroup,
  Textarea
} from "tdesign-vue-next";
import {randomColor} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {saveRss} from "@/store";

export function openAddRssSourceDialog() {
  const data = ref({
    id: 'rss-' + Date.now(),
    logo: '',
    primaryColor: randomColor(),
    title: '',
    website: '',
    source: '',
    browser: 'pc' as 'pc' | 'mobile' | 'custom',
    browserWidth: 1200,
    browserHeight: 800,
    browserUserAgent: '',
  });
  const browserOptions = [
    {label: 'PC', value: 'pc'}, {label: '移动端', value: 'mobile'}, {
      label: '自定义',
      value: 'custom'
    }];
  const dp = DialogPlugin({
    header: '添加RSS源',
    placement: "center",
    draggable: true,
    confirmBtn: '添加',
    width: 600,
    closeOnOverlayClick: false,
    closeOnEscKeydown: false,
    default: () => <div class={'px-4px'}>
      <Form data={data.value}>
        <FormItem label={'主题色'} labelAlign={'top'} name={'primaryColor'}>
          <ColorPickerPanel v-model={data.value.primaryColor} recentColors={false} colorModes={['monochrome']}
                            swatchColors={[]} format={'HEX'}/>
        </FormItem>
        <FormItem label={'logo'} labelAlign={'top'} name={'logo'}>
          <Input v-model={data.value.logo} placeholder={'请输入logo链接'}/>
        </FormItem>
        <FormItem label={'网站标题'} labelAlign={'top'} name={'title'}>
          <Input v-model={data.value.title} placeholder={'请输入网站标题'}/>
        </FormItem>
        <FormItem label={'网站链接'} labelAlign={'top'} name={'website'} help={'此处为官网链接'}>
          <Input v-model={data.value.website} placeholder={'请输入网站链接'}/>
        </FormItem>
        <FormItem label={'RSS链接'} labelAlign={'top'} name={'source'} help={'此处才是RSS的链接'}>
          <Input v-model={data.value.source} placeholder={'请输入网RSS链接'}/>
        </FormItem>
        <FormItem label={'浏览器打开方式'} labelAlign={'top'} name={'browser'}>
          <RadioGroup v-model={data.value.browser} options={browserOptions}/>
        </FormItem>
        {data.value.browser === 'custom' && <>
          <FormItem label={'浏览器宽度'} labelAlign={'top'} name={'browserWidth'}>
            <InputNumber v-model={data.value.browserWidth} min={100}/>
          </FormItem>
          <FormItem label={'浏览器高度'} labelAlign={'top'} name={'browserHeight'}>
            <InputNumber v-model={data.value.browserHeight} min={100}/>
          </FormItem>
          <FormItem label={'浏览器UserAgent'} labelAlign={'top'} name={'browserUserAgent'}>
            <Textarea v-model={data.value.browserUserAgent} placeholder={'请输入网站链接'}
                      autosize={{minRows: 3, maxRows: 5}}/>
          </FormItem>
        </>}
      </Form>
    </div>,
    onConfirm() {
      dp.update({confirmLoading: true});
      saveRss({
        ...data.value,
        browser: data.value.browser === 'custom' ? {
          width: data.value.browserWidth,
          height: data.value.browserHeight,
          userAgent: data.value.browserUserAgent
        } : data.value.browser
      }).then(() => {
        dp.destroy();
        MessageUtil.success('添加成功');
      }).catch(e => {
        MessageUtil.success('添加失败', e);
      }).finally(() => {
        dp.update({confirmLoading: false});
      })
    }
  })
}