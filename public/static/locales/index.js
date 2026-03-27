import VueI18n from 'vue-i18n'
import Vue from 'vue'
Vue.use(VueI18n)

import en from './en'
import zhCn from './zh-cn'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

// const loadLanguage = async (locale) => {
//   const langUrl = `/lang/${locale}.json`;
//   const response = await fetch(langUrl);
//   const messages = await response.json();

//   // 现在将messages注入到i18n实例中
//   this.$i18n.setLocaleMessage(locale, messages);
//   this.$i18n.locale = locale;
// }

let english = {}
english = Object.assign(en, english)
english = Object.assign(enLocale, english)

let chinese = {}
chinese = Object.assign(zhCn, chinese)
chinese = Object.assign(zhLocale, chinese)

const messages = {
  en: {
    ...english
  },
  zhCn: {
    ...chinese
  }
}
let i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zhCn', // 设置语言
  fallbackLocale: 'zhCn', // 缺省语言
  messages, // 设置messages库
})
export default i18n
