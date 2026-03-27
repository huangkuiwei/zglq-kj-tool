<!-- 富文本编辑器 -->
<template>
  <div>
    <quill-editor :style="{ width: width }" v-model="text" ref="myQuillEditor" :options="editorOption" @change="chagne($event.html)" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
    </quill-editor>
  </div>
</template>

<script>
import { quillEditor, Quill } from 'vue-quill-editor'
// quill富文本
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import i18n from '../../static/locales'

export default {
  name: "",
  data() {
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
      ["blockquote"], // 引用
      [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
      [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
      [{ font: [] }], // 字体种类
      [{ align: [] }], // 对齐方式
      ['clean'], // 清除文本格式
      ['link', 'image'] // 链接、图片、视频
    ]
    return {
      editorOption: {
        placeholder: i18n.t('base.button.enterQuestion'),
        modules: {
          toolbar: {
            container: toolbarOptions,
          }
        }
      },
      text: '',
    };
  },
  props: ['content', 'width'],
  components: {
    quillEditor
  },
  watch: {
    'content'(val) {
      this.text = val
    }
  },
  created() {
    this.text = this.content
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    chagne(e) {
      this.$emit('update:content', e)
      this.$forceUpdate()
    },
    onEditorBlur() { },
    onEditorFocus() { },
    onEditorReady() { },
  }
}

</script>
<style scoped>
.ql-editor {
  height: 200px;
}

.ql-container {
  height: 200px;
}
</style>
