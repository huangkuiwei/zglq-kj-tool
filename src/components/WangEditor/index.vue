<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" :style="{ height: height+ 'px' }" class="text">
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "WangEditor",
  data() {
    return {
      editor: null,
      info_: null,
      imageUrl: null,  //图片上传的路径
      hadInit:false
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    height: {
      type:Number,
      required: true
    },
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value(val) {
      if(!val){
        val = '<p><br /></p>'
      }
      // 使用 v-model 时，设置初始值
      this.editor.txt.html(val);
      this.info_ = val;
    },
    // value() {
    //   if(!this.value){
    //     this.value = '<p><br /></p>'
    //   }
    //   // 使用 v-model 时，设置初始值
    //   this.editor.txt.html(this.value);
    //   this.info_ = this.value;
    // },
    hadInit(){
      if(this.hadInit){
        this.editor.txt.html(this.value);
        this.info_ = this.value;
      }
      
    },
  },
  mounted() {
    this.imageUrl = this.$uploadUrl
    this.seteditor();
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.zIndex = 100;
      this.editor.customConfig.uploadImgShowBase64 = true; // base 64 存储图片
      this.editor.customConfig.uploadImgServer = this.imageUrl; // 配置服务器端地址
      this.editor.customConfig.uploadImgParamsWithUrl = true;
      this.editor.customConfig.uploadImgHeaders = this.$uploadHeaders()// 自定义 header
      // this.editor.customConfig.uploadFileName = '' // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 1024 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 1; // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
      this.editor.customConfig.onchangeTimeout = 1;
      // 配置菜单
      this.editor.customConfig.menus = [
        "code", // 插入代码
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "undo", // 撤销
        "redo" // 重复
      ];

      // 自定义处理粘贴的文本内容
      /* this.editor.customConfig.pasteTextHandle = function (content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        if (content == '' && !content) return ''
        var html = content
        html = html.replace(/<\/?SPANYES[^>]*>/gi, "");//  Remove  all  SPAN  tags
        html = html.replace(/<(\w[^>]*)  lang=([^|>]*)([^>]*)/gi, "<$1$3");//  Remove  Lang  attributes
        html = html.replace(/<\\?\?xml[^>]*>/gi, "");//  Remove  XML  elements  and  declarations
        html = html.replace(/<\/?\w+:[^>]*>/gi, "");//  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
        html = html.replace(/&nbsp;/, "");//  Replace  the  &nbsp;
        html = html.replace(/\n(\n)*( )*(\n)*\n/gi, '\n');
        console.log('****', content)
        console.log('****', html)
        return html
      } */
      this.editor.customConfig.pasteTextHandle = function(content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        if (content == "" && !content) return "";
        var str = content;
        str = str.replace(/[\n\r]/g, "");
        str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, "");
        str = str.replace(/<style>[\s\S]*?<\/style>/gi, "");
        str = str.replace(/<\/?SPANYES[^>]*>/gi, ""); //  Remove  all  SPAN  tags
        str = str.replace(/<(\w[^>]*) lang=([^|>]*)([^>]*)/gi, "<$1$3"); //  Remove  Lang  attributes
        str = str.replace(/<\/?\w+:[^>]*>/gi, ""); //  Remove  Tags  with  XML  namespace  declarations:  <o:p></o:p>
        str = str.replace(/<span.*?>/gi, "");
        str = str.replace(/<\/span.*?>/gi, "");
        str = str.replace(/(<\/?!--.*?>)|(<!.*?-->)/g, "");
        str = str.replace(/[ | ]*\n/g, "\n");
        str = str.replace(/&nbsp;/gi, "");
        console.log("[debug]wangeditor replace result (content):", content);
        console.log("[debug]wangeditor replace result (str):", str);
        return str;
      };

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          var url = this.$ObsPath + result.data.fileUrl;
          insertImg(url);
          // 图片上传成功，插入图片的回调
        }
      };
      this.editor.customConfig.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };

      // 创建富文本编辑器
      this.editor.create();
      this.hadInit = true
    }
  }
};
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  /* height: 600px; */
}
</style>