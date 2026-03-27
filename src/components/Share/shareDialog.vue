<template>
  <el-dialog v-dialogDrag title="分享" class="t-dialog" style="text-align: left;" width="700px" :visible="visible" :before-close="closeDialog" :close-on-click-modal="false" :modal="true">
    <template v-if="!checkLoading">
      <el-form size="small" v-if="stepIndex == 1 && !shareCountError" ref="shareParamsForm" :rules="rules" :model="form" label-width="110px">
        <el-form-item label="分享形式：">
          <div>
            <el-radio-group v-model="form.Isvisible" size="mini">
              <el-radio :label="false">有提取码</el-radio>
              <el-radio :label="true">无提取码</el-radio>
            </el-radio-group>
          </div>
          <div style="padding: 15px 20px 10px 20px; background-color: #F5F7FA" v-if="form.Isvisible == false">
            <!-- <el-radio v-model="form.pwdSetWay" :label="1" style="display:inherit">系统随机生成提取码</el-radio> -->
            <el-radio v-model="form.pwdSetWay" :label="2" style="display: inherit; margin-top: 10px">自定义提取码</el-radio>
            <div v-if="form.pwdSetWay == 2">
              <div style="color: #747071; font-size: 12px"> 重复使用同一提取码有泄露风险，请谨慎操作 </div>
              <el-input v-if="form.pwdSetWay == 2" v-model="form.Pssword" style="width: 70px"></el-input>
              <!-- <div style="color:#747071;font-size:12px">支持4位字母或数字</div> -->
            </div>
          </div>
        </el-form-item>
        <!--<el-form-item label="允许下载文件：">-->
        <!--  <el-radio-group v-model="form.Isallow" size="mini">-->
        <!--    <el-radio label="1">允许下载</el-radio>-->
        <!--    <el-radio label="2">只允许浏览</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="有效期：" prop="ShareType">
          <div class="flex ai-center" style="height: 32px;">
            <el-radio-group v-model="form.ShareType" size="mini">
              <!--<el-radio label="0">永久有效</el-radio>-->
              <el-radio label="1">1天</el-radio>
              <el-radio label="3">3天</el-radio>
              <el-radio label="7">7天</el-radio>
              <!--<el-radio label="30">30天</el-radio>-->
              <!--<el-radio label="true">自定义日期</el-radio>-->
            </el-radio-group>
            <el-date-picker style="width: 130px; margin-left: 5px" v-if="form.ShareType == 'true'" v-model="form.EffectiveDate" align="center" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="指定视图：" v-if="isview">
          <el-select v-model="form.viewname" clearable>
            <el-option v-for="item of viewData" :key="item" :value="item">{{ item }}</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="shareCountError">
        <span style="white-space: normal;line-height: 26px;display: inline-block;">抱歉，您本次的分享有<span style="font-size:16px;color:#33CC99"> {{ shareFileCount }} </span>个文件，您开通的版本最多只能分享 <span style="font-size:16px;color:#F56C6C"> {{ limitShareCount }} </span>个文件，请联系公司管理员进行版本升级或在图档-我的分享中取消部分已分享的文件。 <el-link icon="el-icon-question" style="font-size: 16px !important; vertical-align: text-bottom" :underline="false" @click="showShareCountItem"></el-link>
        </span>
        <el-table class="t-table" ref="multipleTable" :data="corpUserHasShareData" :max-height="500" stripe :header-cell-style="$thStyle" style="width: 100%;font-size: 13px;margin-top: 10px;position: unset;">
          <el-table-column prop="AAA" width="50px"> </el-table-column>
          <el-table-column prop="userName" label="账号"> </el-table-column>
          <el-table-column prop="shareCount" label="已分享文件数量"></el-table-column>
        </el-table>
      </div>
      <shareResult :shareUrl="shareUrl" :shareUrlM="shareUrlM" :isVisible="form.Isvisible" :password="form.Pssword" @closeDialog="closeDialog" v-if="stepIndex === 2 && !shareCountError" />
      <span v-if="stepIndex === 1 && !shareCountError" slot="footer" class="dialog-footer">
        <div>
          <el-button size="small" type="primary" @click="setShareParam" :loading="nextStepLoading">发起审批</el-button>
          <el-button size="small" @click="closeDialog">{{ $t('base.button.cancel') }}</el-button>
        </div>
      </span>
    </template>
    <el-spinner v-else style="width: 100%; text-align: center; margin-top: 30px"></el-spinner>
  </el-dialog>
</template>
<script>
import projectFileApi from "@/api/document/indexApi.js";
import shareResult from "@/components/Share/shareResult";
export default {
  props: {
    //目前需要字段 rowData.iuid (文件iuid) rowData.FileType(文件类型 1.项目 2.文档) rowData.FileName(文件名称)
    rowData: {
      type: Object | Array,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isZsk: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    shareResult,
  },
  watch: {
    rowData: {
      handler(newValue, oldValue) {
        this.NewGuid = this.$NewGuid();
      },
      immediate: true,
      deep: true, // 实现深度监听
    },
    visible: {
      handler() {
        if (this.visible) {
          this.shareCheck();
        }
      },
      immediate: true
    },
  },
  data() {
    return {
      form: {
        ShareType: "1",
        EffectiveDate: null,
        Isvisible: true,
        Pssword: null,
        pwdSetWay: 2,
        Isallow: "2",
        viewname: undefined
      },
      NewGuid: null,
      rules: {},
      shareUrl: null,
      shareUrlM: null,
      stepIndex: 1,
      nextStepLoading: false,
      checkLoading: true,
      shareCountError: false,
      limitShareCount: 0,
      shareFileCount: 0,
      corpUserHasShareData: null,
      isview: false,
      viewData: []
    };
  },
  mounted() {
    this.stepIndex = 1;
  },
  methods: {
    showShareCountItem() {
      this.$store.state.app.shareCountItemContainerVisible = true
    },
    async shareCheck() {
      var list = this.postShareListComTransfer()
      var res = await projectFileApi.post("/api/Drawing/DrawingShareCheckForWeb", {
        list
      });
      if (res.code == 1) {
        if (res.data.shareCountError) {
          this.limitShareCount = res.data.limitShareCount;
          this.shareFileCount = res.data.shareFileCount;
          this.shareCountError = true;
          this.queryCorpUserHasShareData()
        } else {
          this.shareCountError = false;
          this.isview = res.data.isview
          this.viewData = res.data.viewData || []
          //this.shareCountError = true
        }
        this.checkLoading = false
      }
    },
    async queryCorpUserHasShareData() {
      var res = await projectFileApi.get("/api/Drawing/DrawingShareList");
      if (res.code == 1) {
        this.corpUserHasShareData = res.data
      }
    },
    async setShareParam() {
      if (!this.form.Isvisible && this.form.pwdSetWay == 2) {
        const reg = /(?=[A-Za-z0-9]{8}$)[\d]*[A-Za-z][\d]*[A-Za-z][\d]*[A-Za-z][\d]*[A-Za-z][\d]*/im;
        if (!this.form.Pssword || this.form.Pssword.length == 0) {
          this.$error("请输入提取码");
          return;
        }
        // if (reg.test(this.form.Pssword)) {
        //   this.$error('请输入4位字母或者数字')
        //   return
        // }
      }
      this.nextStepLoading = true;
      if (!this.form.EffectiveDate) {
        this.form.EffectiveDate = "";
      }
      // function isArrayFn(value){
      //   if (typeof Array.isArray === "function") {
      //     return Array.isArray(value);
      //   }else{
      //     return Object.prototype.toString.call(value) === "[object Array]";
      //   }
      // }
      // var list = []
      // if(isArrayFn(this.rowData)){
      //   this.rowData.forEach(element => {
      //     let ele_iuid = ['/myCollectionKnowledgeBase','/myCollection'].indexOf(this.$route.path) > -1?element.mainIUID:element.iuid
      //     let ele_fileType = element.fileType
      //     let ele_fileName = element.fileName
      //     list.push({
      //       ...this.form,
      //       MainIUID:ele_iuid,
      //       FileType:ele_fileType,
      //       Name:ele_fileName
      //     })
      //   });
      // }
      // else {
      //   this.form.MainIUID = ['/myCollectionKnowledgeBase','/myCollection'].indexOf(this.$route.path) > -1?this.rowData.mainIUID:this.rowData.iuid
      //   this.form.FileType = this.rowData.fileType
      //   this.form.Name = this.rowData.fileName
      //   list = [this.form]
      // }
      var list = this.postShareListComTransfer()
      var res = await projectFileApi.post("/api/Drawing/DrawingShare", {
        list
      });
      if (res.code == 1) {
        // this.shareUrl = this.$shareUrl + "?" + res.data;
        // this.shareUrlM = this.$shareUrlH5 + "?" + res.data;
        // this.stepIndex = 2;
        this.$emit('shareWorkflow', res.data)
      }
      this.nextStepLoading = false;
    },
    postShareListComTransfer() {
      function isArrayFn(value) {
        if (typeof Array.isArray === "function") {
          return Array.isArray(value);
        } else {
          return Object.prototype.toString.call(value) === "[object Array]";
        }
      }
      var list = []
      if (isArrayFn(this.rowData)) {
        this.rowData.forEach(element => {
          let ele_iuid = ['/myCollectionKnowledgeBase', '/myCollection'].indexOf(this.$route.path) > -1 ? element.mainIUID : element.iuid
          let ele_fileType = element.fileType
          let ele_fileName = element.fileName
          list.push({
            ...this.form,
            MainIUID: ele_iuid,
            FileType: ele_fileType,
            Name: ele_fileName
          })
        });
      } else {
        this.form.MainIUID = ['/myCollectionKnowledgeBase', '/myCollection'].indexOf(this.$route.path) > -1 ? this.rowData.mainIUID : this.rowData.iuid
        this.form.FileType = this.rowData.fileType
        this.form.Name = this.rowData.fileName
        list = [this.form]
      }
      return list
    },
    closeDialog() {
      this.stepIndex = 1;
      this.$emit("update:visible", false);
    },
  },
};
</script>
