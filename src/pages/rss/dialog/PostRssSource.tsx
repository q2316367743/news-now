import {
  ColorPicker,
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
import {deleteRss, postRss} from "@/store";
import {NewsInstanceForRssProps} from "@/sources/abs/NewsInstanceForRss";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {router} from "@/plugin/router";


interface RootObject {
  id: string;
  logo: string;
  primaryColor: string;
  title: string;
  website: string;
  source: string;
  browser: 'pc' | 'mobile' | 'custom';
  browserWidth: number;
  browserHeight: number;
  browserUserAgent: string;
}

function buildData(rss: NewsInstanceForRssProps): RootObject {
  return {
    ...rss,
    ...(typeof rss.browser === 'string' ? {
      browser: rss.browser,
      browserWidth: 1200,
      browserHeight: 800,
      browserUserAgent: '',
    } : {
      browser: 'custom',
      browserWidth: rss.browser.width,
      browserHeight: rss.browser.height,
      browserUserAgent: rss.browser.userAgent,
    })
  } as RootObject
}

export function openPostRssSourceDialog(rss?: NewsInstanceForRssProps) {
  const option = !!rss ? '修改' : '添加';
  const data = ref<RootObject>(rss ? buildData(rss) : {
    id: '/rss/' + Date.now(),
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
    header: option + 'RSS源',
    placement: "center",
    draggable: true,
    confirmBtn: option,
    width: 600,
    closeOnOverlayClick: false,
    closeOnEscKeydown: false,
    default: () => <div class={'px-4px'}>
      <Form data={data.value}>
        <FormItem label={'主题色'} labelAlign={'top'} name={'primaryColor'}>
          <ColorPicker v-model={data.value.primaryColor} recentColors={false} colorModes={['monochrome']}
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
      postRss({
        ...data.value,
        browser: data.value.browser === 'custom' ? {
          width: data.value.browserWidth,
          height: data.value.browserHeight,
          userAgent: data.value.browserUserAgent
        } : data.value.browser
      }).then(() => {
        dp.destroy();
        MessageUtil.success(option + '成功');
        router.push({
          path: '/',
          query: {
            redirect: '/tab/rss'
          }
        });
      }).catch(e => {
        MessageUtil.success(option + '添加失败', e);
      }).finally(() => {
        dp.update({confirmLoading: false});
      })
    }
  })
}

export function openDeleteRssSourceDialog(rss: NewsInstanceForRssProps) {
  MessageBoxUtil.confirm("是否删除RSS源", "删除RSS源", {
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  }).then(() => {
    deleteRss(rss.id).then(() => {
      MessageUtil.success("删除成功");
      router.push({
        path: '/',
        query: {
          redirect: '/tab/rss'
        }
      });
    }).catch(e => {
      MessageUtil.success("删除失败", e);
    })
  })
}