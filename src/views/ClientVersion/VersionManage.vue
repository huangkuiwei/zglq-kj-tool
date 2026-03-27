<template>
  <div class="version-manage-content">
    <div class="left-app-content">
      <el-tabs tab-position="left" v-model="currentApp" style="height: 200px" @tab-click="handleTabChange">
        <el-tab-pane v-for="item in appList" :key="item.label" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-version-list">
      <div class="table-operator-content">
        <el-button type="primary" size="small" @click="handleOpenUpload">上传<i class="el-icon-upload el-icon--right"></i></el-button>
      </div>
      <div class="table-data-content">
        <el-table :data="currentTableData" border style="width: 100%">
          <el-table-column type="index" width="50" :label="$t('base.button.index')"></el-table-column>
          <el-table-column prop="name" label="安装包名称" width="240">
          </el-table-column>
          <el-table-column prop="versioncode" label="版本" width="200">
          </el-table-column>
          <el-table-column prop="updatelog" label="更新日志"> </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="220">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
            <template slot-scope="scope">
              <el-button @click="handleOpenUpdate(scope.row)" type="text" size="small">更新</el-button>
              <el-button type="text" size="small" @click="handleDownloadApp(scope.row)">{{ $t('base.button.download') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination style="flex-shrink: 0" :pageTotal="totalNum" :pageIndex="pageNum" @handleCurrentChange="paginationCurrentChange" @handleSizeChange="handleSizeChange" />
    </div>
    <el-dialog title="上传新版本" modal destroy-on-close :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="dialogFormVisible" :before-close="handleBeforeCloseUpload">
      <el-form :model="uploadFormData" :rules="uploadFormRules" ref="versionForm">
        <el-form-item label="安装包" label-width="120px">
          <el-upload class="upload-demo" ref="upload" action="#" accept=".exe" :limit="1" :multiple="false" :auto-upload="false" :file-list="fileList" :on-exceed="handleExceed" :beforeUpload="beforeUpload" :http-request="handleUpload" :on-preview="handlePreview" :on-remove="handleRemove" :on-progress="handleProgress">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传exe文件</div>
          </el-upload>
          <el-progress :percentage="uploadPercent" v-show="showUploadProgress"></el-progress>
        </el-form-item>
        <el-form-item label="安装包名称" label-width="120px" prop="name">
          <el-input v-model="uploadFormData.name" autocomplete="off" placeholder="请输入安装包名称"></el-input>
        </el-form-item>
        <el-form-item label="版本号" label-width="120px" prop="versioncode">
          <el-input v-model="uploadFormData.versioncode" autocomplete="off" placeholder="请输入版本号"></el-input>
        </el-form-item>
        <el-form-item label="更新日志" label-width="120px" prop="updatelog">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入更新日志" v-model="uploadFormData.updatelog">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog('versionForm')">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" @click="handleFormSubmit('versionForm')">{{ $t('base.button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { decrypt, encrypt } from "@/utils";
import postApi from "@/api/document/indexApi.js";
import { put, signatureUrl, getFileNameUUID, multiPut } from "./ossconfig";

import pagination from "@/components/pagination/index";

export default {
  name: "VersionManage",
  components: {
    pagination
  },
  data() {
    return {
      // oss config
      ossConfig: {
        region: "",
        accessKeyId: "",
        accessKeySecret: "",
        bucket: "",
      },
      // ----右侧选项列表-----
      // 当前的选项
      currentApp: "1",
      appprefix: {
        '1': 'BIMWindows',
        '2': 'BIMFactory',
        '3': 'BIMGPT',
        '4': 'BIM-Modeling',
        '5': 'BIM-Site',
        '6': 'BIMStation'
      },
      // 选项列表
      appList: [
        {
          label: "看模王",
          name: "1",
        },
        {
          label: "翻模王",
          name: "2",
        },
        {
          label: "总模王",
          name: "3",
        },
        {
          label: "一模通",
          name: "4",
        },
        {
          label: "临建通",
          name: "5",
        },
      ],
      // ----------- 每个选项的表格数据 ---------
      totalNum: 0,
      pageNum: 1,
      pageRows: 20,
      currentTableData: [],
      // --------------- 弹窗 ----------------
      // 弹窗显示控制
      dialogFormVisible: false,
      uploadFormRules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        versioncode: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        updatelog: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      // 上传新安装包表单对象
      uploadFormData: {
        type: 0, //类型：1：看模王、2：总模王、3：翻模王、4：一模通、5：临建通
        name: '',
        versioncode: '',
        osspath: '',
        updatelog: '',
      },
      // 上传文件列表
      fileList: [],
      uploadPercent: 0,
      showUploadProgress: false,
    };
  },
  mounted() {
    this.getTableList();
    this.getOSSconfig();
  },
  methods: {
    async getOSSconfig() {
      let res = await postApi.get("/api/Version/Getossdeploy");
      if (res.code == 1) {
        this.ossConfig = JSON.parse(decrypt(res.data));
      }
    },
    // app切换
    handleTabChange(comp) {
      this.currentApp = comp.name;
      this.currentTableData = [];
      this.$nextTick(() => {
        this.getTableList();
      });
    },
    async getTableList() {
      let formData = new FormData();
      formData.append('type', this.currentApp);
      formData.append('page', this.pageNum);
      formData.append('rows', this.pageRows);
      let res = await postApi.post("/api/Version/GetpageVersion", formData);
      if (res.code == 1) {
        this.currentTableData = res.data || [];
        this.totalNum = res.count || 0;
      }
    },
    paginationCurrentChange(curPage) {
      this.pageNum = curPage;
      this.getTableList();
    },
    handleSizeChange(curSize) {
      this.pageRows = curSize;
      this.getTableList();
    },
    // 关闭弹窗
    handleCloseDialog(formName) {
      this.isUpdateRowId = '';
      this.fileList = [];
      this.$refs[formName] && this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 上传弹窗
    handleOpenUpload() {
      this.fileList = [];
      this.uploadFormData = {
        type: Number(this.currentApp), //类型：1：看模王、2：总模王、3：翻模王、4：一模通、5：临建通
        name: '',
        versioncode: '',
        osspath: '',
        updatelog: '',
      }
      this.dialogFormVisible = true;
    },
    // 更新
    handleOpenUpdate(row) {
      this.isUpdateRowId = row.id;
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        let startIndex = row.osspath.indexOf('clientApp');
        let endIndex = row.osspath.indexOf('?');
        let osspath = row.osspath.slice(startIndex, endIndex);
        this.uploadFormData = {
          type: row.type, //类型：1：看模王、2：总模王、3：翻模王、4：一模通、5：临建通
          name: row.name,
          versioncode: row.versioncode,
          osspath: osspath,
          updatelog: row.updatelog,
        }
        this.fileList = [{ name: row.name, url: osspath }];
      });
    },
    // 下载
    handleDownloadApp(row) {
      let aLink = document.createElement("a");
      aLink.download = row.name + '.exe';
      aLink.style.display = "none";
      aLink.href = row.osspath;
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    },
    handleFormSubmit(formName) {
      if (!this.fileList.length > 0) {
        this.$message({
          message: '安装包未上传',
          type: 'warning'
        });
        return;
      }

      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let submitData = {
            ...this.uploadFormData,
            type: Number(this.currentApp),
            osspath: this.fileList[0].url,
            ...this.isUpdateRowId ? { id: this.isUpdateRowId } : {} // 更新时提交带上id 新增一条数据不带id
          }
          const formData = new FormData();
          Object.keys(submitData).forEach(key => {
            formData.append(key, submitData[key]);
          });
          let res = await postApi.post("/api/Version/TaskCallback", formData);
          if (res.code == 1) {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.getTableList();
          }
          else {
            this.$message.error('提交失败');
          }
        } else {
          return false;
        }
      });
    },
    // 上传弹窗关闭前
    handleBeforeCloseUpload(done) {
      done();
    },

    // 上传组件
    getFileNameExt(name) {
      return name.substring(name.lastIndexOf(".")); //.txt
    },
    async beforeUpload(file) {
      // 限制上传类型
      const fileExtensions = this.getFileNameExt(file.name) === ".exe";
      if (!fileExtensions) {
        this.$message.error("只能上传exe文件!");
      }
      // //限制的上限为20M
      // const max20M = file.size / 1024 / 1024 < 20;
      // if (!max20M) {
      //   this.$message.error('上传文件大小不能超过 20MB!');
      // }
      return fileExtensions; // && max20M;
    },
    handleUpload(option) {
      // 获取文件的后缀名
      // let objName = getFileNameUUID()
      let fileName = option.file.name;
      let index = fileName.lastIndexOf(".");
      let obj = fileName.substring(index, fileName.length);
      // 生成的文件名，保留文件后缀名，进行拼接
      let objName =
        (this.appprefix[this.currentApp] || this.currentApp) +
        "_" +
        getFileNameUUID() +
        this.getFileNameExt(option.file.name);


      this.$message.success("开始上传");
      // 调用 ali-oss 中的方法,flieName是存放的文件夹名称，可自己定义
      multiPut(`clientApp/${objName}`, option.file, this.handleProgress, this.ossConfig).then((res) => {
        if (res && res.res.status === 200) {
          this.$message.success("上传成功");

          this.fileList = [{ name: fileName, url: `clientApp/${objName}` }];
          // 上传成功之后，转换真实的地址
          // signatureUrl(`clientApp/${objName}`).then((res) => {
          //   console.log(res);
          //   this.fileList = [{ name: fileName, url: res }];
          // });
        } else {
          this.$message.error("上传失败");
        }
      });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    cancelUpload() {
      this.fileList = [];
      this.$refs.upload.clearFiles();
      this.$refs.upload.abort();
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.fileList = [];
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleProgress(percentage) {
      // console.log('进度');
      if (percentage) {
        this.showUploadProgress = true;
        let percent = Math.floor(percentage * 100);
        this.uploadPercent = percent;
        if (percentage === 1) {
          this.showUploadProgress = false;
          this.uploadPercent = 0;
        }
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传1个文件，请删除后再选择文件`);
      // console.log(files, fileList);
    },
  },
};
</script>
<style lang="scss" scoped>
.version-manage-content {
  width: calc(100vw - 260px);
  height: 100%;
  display: flex;

  .left-app-content {
    width: 160px;
    display: flex;
    justify-content: center;
  }

  .right-version-list {
    flex-grow: 1;
    flex-shrink: 0;

    .table-operator-content {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-start;
    }

    .table-data-content {
      .el-table {
        width: 100%;
      }
    }
  }
}
</style>
