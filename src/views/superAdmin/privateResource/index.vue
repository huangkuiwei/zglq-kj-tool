<template>
  <el-container
    style="height:100%;margin-left: 1px;"
    class="commonKu"
  >
    <el-main class="buildMain">
      <!-- 检索栏 -->
      <div
        class="mainTop"
        style="margin-bottom:1px;box-sizing: content-box;padding: 0;"
      >
        <div
          class="flex ai-center"
          style="width: 100%;"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-upload2"
            @click="multipleUpload"
          >
            上传
          </el-button>
          <el-form style="display:flex;align-items:center; flex-wrap: wrap;margin-left: auto;">
            <el-input
              v-model="searchForm.FileName"
              placeholder="请输入关键词找构件"
              prefix-icon="el-icon-search"
              style="width:180px;margin-right:15px"
              clearable
              size="small"
            />
          </el-form>
        </div>
      </div>
      <!-- 列表 -->
      <el-row style="background:#fff;height:calc(100vh - 170px)">
        <el-table
          ref="multipleTable"
          class="t-table"
          :data="publicData"
          stripe
          :header-cell-style="$thStyle"
          style="font-size: 13px"
          height="100%"
        >
          <el-table-column
            type="index"
            align="center"
            :label="$t('base.button.index')"
          />
          <el-table-column :label="$t('base.button.name')">
            <template slot-scope="scope">
              <el-link
                style="cursor:pointer"
                :underline="false"
                @click="viewInfo(scope.row)"
              >
                {{ scope.row.fileName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            prop="parameterization"
            align="center"
            label="是否参数化"
          />
          <el-table-column
            width="120px"
            prop="fileSize"
            align="center"
            :label="$t('base.button.fileSize')"
          />
          <el-table-column
            :label="$t('base.formLabel.operation')"
            align="center"
            width="220"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleBuild('EDIT', scope.row)"
              >
                {{ $t('base.button.edit') }}
              </el-button>
              <el-button
                type="text"
                style="color: #F56C6C;"
                @click="deleteBuild(false, scope.row)"
              >
                {{ $t('base.button.delete') }}
              </el-button>
            </template>
          </el-table-column>
          <div
            slot="empty"
            class="empty"
          >
            <img :src="tableEmptyImage">
            <span>{{ $t('base.button.noData') }}</span>
          </div>
        </el-table>
      </el-row>
      <el-pagination
        :pager-count="5"
        class="t-pagination"
        :current-page.sync="searchForm.page"
        :page-sizes="[10, 20, 40]"
        :page-size="searchForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="paginationCurrentChange"
      />

      <!-- 编辑构件 -->
      <el-dialog
        v-dialogDrag
        title="编辑构件"
        :visible.sync="addVisible"
        width="420px"
        :modal="true"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="AddForm"
          :rules="rules"
          label-width="100px"
          label-suffix="："
        >
          <el-form-item
            :label="$t('base.button.kind')"
            required
          >
            <el-cascader
              ref="type"
              v-model="AddForm.oneTypeIuid"
              style="width: 100%"
              size="large"
              clearable
              :props="typeProps"
              :emit-path="true"
              :options="typeArr"
            >
              <el-button
                slot="append"
                icon="el-icon-plus"
              />
            </el-cascader>
          </el-form-item>
          <el-form-item
            label="文件上传"
            prop="filePath"
          >
            <el-input
              v-model="uploadFileName"
              disabled
              placeholder="请选择文件"
              :readonly="true"
            >
              <!-- <el-button v-if="addOrEdit=='Add'" slot="append" icon="el-icon-plus">
                <input class="fileFolderUploadBtn" type="file" name="file" @change="submitFile" alt="请选择文件" />
              </el-button> -->
            </el-input>
            <el-progress
              v-if="fileProgress != 0"
              style="margin-top: 5px;"
              :status="fileProgress >= 100 ? 'success' : null"
              :percentage="fileProgress"
            />
          </el-form-item>
          <el-form-item label="是否参数化">
            <el-select
              v-model="AddForm.Parameterization"
              :placeholder="$t('base.button.pleaseSelect')"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="(item, index) in parameterData"
                :key="index"
                :label="item.itemText"
                :value="item.iuid"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="sure"
          >{{ $t('base.button.confirm') }}</el-button>
          <el-button @click="handleClose">{{ $t('base.button.cancel') }}</el-button>
        </span>
      </el-dialog>
      <!-- 批量上传构件 -->
      <el-dialog
        v-dialogDrag
        title="上传构件"
        :visible.sync="listAddVisible"
        width="420px"
        :modal="true"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="AddForm"
          :rules="rules"
          label-width="100px"
          label-suffix="："
        >
          <el-form-item
            :label="$t('base.button.kind')"
            required
          >
            <el-cascader
              ref="type"
              v-model="AddForm.oneTypeIuid"
              style="width: 100%"
              size="large"
              clearable
              :props="typeProps"
              :emit-path="true"
              :options="typeArr"
            />
          </el-form-item>
          <el-form-item
            label="文件上传"
            prop="filePath"
          >
            <el-button
              icon="el-icon-plus"
              size="small"
              :disabled="this.AddForm.oneTypeIuid.length == 0 || this.AddForm.oneTypeIuid[0] == ''"
            >
              上传
              <input
                v-show="!(this.AddForm.oneTypeIuid.length == 0 || this.AddForm.oneTypeIuid[0] == '')"
                class="fileFolderUploadBtn"
                type="file"
                name="file"
                multiple
                alt="请选择bim文件"
                @change="submitFile"
              >
            </el-button>
            <div v-if="listUploadTotal > 0">
              正在上传：
              {{ listUploadCount }}
              {{ listPercent > 0 && listPercent < 100 ? ` (${listPercent}%) ` : '' }} / {{ listUploadTotal }}
            </div>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            :disabled="listUploadCount < listUploadTotal"
            @click="listAddVisible = false"
          >{{
            listUploadCount !=
              0 &&
              listUploadCount == listUploadTotal ? '完 成' : '关 闭' }}</el-button>
        </span>
      </el-dialog>
      <!-- 模型浏览 -->
      <div
        v-if="showMask"
        class="mask"
      >
        <div
          class="close"
          @click="closeModel"
        >
          <i
            class="el-icon-error"
            size="30"
            style="color: #fff;"
          />
        </div>
      </div>
      <iframe
        v-if="showModel"
        ref="imodelIframe1"
        :src="FileUrl"
        frameborder="0"
        class="common-lib-iframe"
        @load="sendFileData"
      />
    </el-main>
  </el-container>
</template>
<script>
import postApi from '@/api/document/indexApi.js'
import zskFileApi from "@/api/zsk/index.js";
import commonApi from "@/api/common";
import tableEmptyImage from "@/assets/tableEmpty.png";
import { decrypt } from '@/utils'
import Axios from 'axios'
let axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  name: 'ComResource',
  components: {
  },

  filters: {
    typeName(e) {
      return typeMap[e]
    }
  },
  props: ['page'],
  data() {
    return {
      total: 0,
      tableEmptyImage: tableEmptyImage,
      searchForm: {
        Parameterization: '',
        LOD: '',
        Suitplatform: '',
        FileName: '',
        Collectionbit: false,
        classType: '',
        pagesize: 10,
        page: 1,
        orderby: 'CreateTime'
      },
      rules: {
        oneTypeIuid: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        filePath: [{ required: true, message: '请上传文件', trigger: 'blur' }],
      },
      parameterData: [],
      nowTreeNode: '',
      typeProps: {
        value: 'iuid',
        label: 'itemText',
        children: 'child',
        checkStrictly: false,
        leaf: 'iuid'
      },
      publicData: [],
      addVisible: false,

      listAddVisible: false,
      listUploadCount: 0,
      listUploadTotal: 0,
      listFiles: [],

      labelList: [],
      baseUrl: process.env.VUE_APP_BASE_API,
      baseImageUrl: process.env.VUE_APP_BASE_API + '/api/home/GetimgFile?fileUrl=',
      typeArr: [],
      detailsData: '',
      pictureMode: true,
      addOrEdit: '',
      AddForm: {
        type: 'Add',
        oneTypeIuid: '', //分类
        FileName: '', //文件名
        FileSize: '', //文件大小
        filePath: '', //文件路径
        Parameterization: '', //参数化
        Suitplatform: [], //适用平台,
        LOD: '', //LOD等级
        imgfile: [], //缩略图
        remarks: '', //备注
      },
      showFileName: '',
      fileProgress: 0,
      isitGlobal: '',
      editData: [],
      rowIuid: '',

      showMask: false,
      showModel: false,
      FileUrl: '',
      listPercent: 0,
    }
  },
  computed: {
    uploadFileName() {
      let name = ''
      name = this.showFileName.slice(this.showFileName.lastIndexOf('\\') + 1)
      return name
    },
    apiControllerStr() {
      return 'publiclibrarynew'
    },
  },
  watch: {
    '$route'(to, from) {
      if (to.path == '/privateResource') {
        this.searchForm.page = 1
        this.nowTreeNode = to.query.iuid || ''
        this.searchForm.classType = to.query.iuid || ''
      }
    },
    listAddVisible() {
      if (!this.listAddVisible) {
        this.listFiles = []
        this.listUploadCount = 0
        this.listUploadTotal = 0
        this.AddForm.oneTypeIuid = ''
      }
    },
    searchForm: {
      handler(newValue, oldValue) {
        this.queryProjectList()
      },
      deep: true
    }
  },
  mounted() {
    this.nowTreeNode = this.$route.query.iuid || ''
    this.searchForm.classType = this.$route.query.iuid || ''
    this.queryAll()
  },
  methods: {
    // 页面数据
    //左侧树点击
    treeClick(data) {
      this.searchForm.page = 1
      this.searchForm.classType = data.iuid
      this.nowTreeNode = data.iuid
    },
    async queryAll() {
      await this.querySelectData('Parameterization')
      await this.querySelectData('Component')
      await this.queryProjectList()
    },

    paginationCurrentChange(val) {
      this.searchForm.page = val
    },
    handleSizeChange(val) {
      this.searchForm.pagesize = val
    },
    //查询参数化、LOD、适用平台数据
    async querySelectData(code, check, add) {
      var res = ''
      let data = await axios.get("/api/Home/GetItemInfoData?TypeCode=" + code, '', this.baseUrl);
      res = data.data
      if (code == 'Parameterization') {
        this.parameterData = res.data
      } else if (code == 'Component') {
        this.typeArr = this.getTreeData(res.data)
      }
    },
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].child == undefined || data[i].child.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].child = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].child);
        }
      }
      return data;
    },
    viewInfo(data) {
      this.showMask = true;
      this.showModel = true;
      let filePath = data.turnPath ? data.turnPath : data.filePath;
      this.FileIUID = data.iuid;
      this.FileUrl = process.env.VUE_APP_ViewOrigin + "/?" + this.$turnEncryptParams(filePath);
      this.sendFileData()
    },
    // 查看模型
    iframePostMes(iframeWin, command, Data) {
      iframeWin.postMessage(
        {
          command,
          Data,
        },
        '*'
      );
    },
    closeModel() {
      this.iframePostMes(this.$refs['imodelIframe1'].contentWindow, 'ImodelClose', null)
      setTimeout(() => {
        this.showMask = false;
        this.showModel = false
      }, 100)
    },
    sendFileData() {
      this.$nextTick(() => {
        this.iframePostMes(this.$refs['imodelIframe1'].contentWindow, 'onlyShowModel', { backgroundColor: '#fff' })
      })
    },
    //查询构件图览数据
    async queryProjectList() {
      var formData = this.$objectToFormData(this.searchForm)
      var res = await zskFileApi.post("/api/" + this.apiControllerStr + "/GetpublicData", formData, this.baseUrl);
      this.publicData = res.data.map(item => {
        return {
          ...item,
          suitplatformName: !!item.suitplatform ? item.suitplatform.split(',').join('-') : '',
          filePath: decrypt(item.filePath || ''),
          turnPath: decrypt(item.turnPath || '')
        }
      })
      this.total = res.count
    },

    // 文件处理相关
    //删除构件
    deleteBuild(type, data) {
      this.deleteBuildFun(data.iuid)
    },
    async deleteBuildFun(iuid) {
      var res = await postApi.get("/api/" + this.apiControllerStr + "/GetsinglepublicimgDelete?IUID=" + iuid, '');
      if (res.code == 1) {
        this.$success(res.msg);
        this.queryProjectList()
        this.$store.state.app.queryPrivateResourceTree = 'refresh'
      }
    },
    handleClose() {
      this.addVisible = false
      this.handleFile(this.DebrisIUID)
    },
    //清除碎片文件
    async handleFile(iuid) {
      var res = await postApi.get("/api/Home/Getfragmentdelete?IUID=" + iuid, '');
    },

    //上传文件
    async submitFile(file) {
      var files = file.target.files
      this.listFiles = files
      this.listUploadCount = 0
      this.listUploadTotal = files.length
      this.uploadFile()
      if (this.fileProgress >= 100.00) {
        this.fileProgress = 100
      }

    },
    async uploadFile() {
      this.AddForm.filePath = ''
      let DebrisIUID = this.$NewGuid()
      await this.fileSubt(this.listFiles[this.listUploadCount], 0, DebrisIUID)
    },
    async fileSubt(file, i, DebrisIUID) {
      if (i > shardCount) {
        return;
      }
      var name = file.name, //文件名
        size = file.size, //总大小shardSize = 2 * 1024 * 1024,
        shardSize = 1 * 1024 * 1024, //以1MB为一个分片
        shardCount = Math.ceil(size / shardSize); //总片数
      if (!this.addVisible && !this.listAddVisible) {
        //请求分片文件删除接口
        this.AddForm.filePath = ''
        this.fileProgress = 0
        return false;
      }

      //计算每一片的起始与结束位置
      var start = i * shardSize,
        end = Math.min(size, start + shardSize);
      //构造一个表单，FormData是HTML5新增的
      var form = new FormData();
      form.append("data", file.slice(start, end)); //slice方法用于切出文件的一部分
      form.append("totalSize", size);
      form.append("fileName", name);
      form.append("totalChunks", shardCount == 0 ? 1 : shardCount); //总片数
      form.append("chunkNumber", i + 1); //当前是第几片
      form.append("DebrisIUID", DebrisIUID);
      var res = await commonApi.fileUploadFile(form);

      if (res.code == 0 && res.mergeOk) {
        this.fileProgress = parseInt(Number(res.progress))
        this.AddForm.filePath = res.filePath
        this.showFileName = res.savePathText
        this.listPercent = 100
        this.listSubmitForm(size, name)

      } else if (res.code == 0 && !res.mergeOk) {
        i = res.number++;
        this.listPercent = Number(res.progress)
        this.AddForm.filePath = res.filePath
        this.showFileName = res.savePathText
        await this.fileSubt(file, i, DebrisIUID)
      }
    },
    multipleUpload() {
      this.listAddVisible = true
      this.listUploadCount = 0
      this.isitGlobal = ''
      this.AddForm.oneTypeIuid = [this.nowTreeNode];
    },
    async listSubmitForm(size, name) {
      var formData = new FormData();
      formData.append("onetype", this.AddForm.oneTypeIuid[0]);
      formData.append("FileName", name);
      formData.append("FileSize", size);
      formData.append("FilePath", this.AddForm.filePath);
      formData.append("type", 'Add');
      var res = await zskFileApi.post("/api/" + this.apiControllerStr + "/publiclibraryAdd", formData, this.baseUrl);
      if (res.code == 1) {
        this.rowIuid = ''
        this.listUploadCount += 1

        if (this.listUploadCount < this.listUploadTotal) {
          this.uploadFile()
        } else if (this.listUploadCount == this.listUploadCount) {
          this.queryProjectList()
          this.$store.state.app.queryPrivateResourceTree = 'refresh'
        }
      }
    },

    async handleBuild(type, row) {
      this.addVisible = true
      this.addOrEdit = type

      this.rowIuid = row.iuid
      var res = await postApi.get("/api/" + this.apiControllerStr + "/GetpubliclibraryEditData?IUID=" + row.iuid, '');
      if (res.code == 1) {
        this.AddForm = {
          oneTypeIuid: res.data.onetypeData, //分类1
          FileName: res.data.savePathText, //文件名
          filePath: res.data.filePath, //文件路径
          Suitplatform: res.data.suitplatformData, //适用平台,
          LOD: res.data.lod, //LOD等级
          imgfile: [],
          remarks: res.data.remarks, //备注
          Parameterization: res.data.parameterization //参数化
        }
        this.showFileName = res.data.savePathText
      }
    },

    async sure() {
      if (this.AddForm.oneTypeIuid.length == 0 || this.AddForm.oneTypeIuid[0] == '') {
        this.$warning('请选择分类')
        return
      } else if (this.addOrEdit == 'ADD') {
        this.submitForm('Add')
      } else {
        this.submitForm('Edit')
      }
    },
    async submitForm(type) {
      var formData = new FormData();
      formData.append("onetype", this.AddForm.oneTypeIuid[0]);
      formData.append("FileName", this.AddForm.FileName);
      formData.append("FileSize", this.AddForm.FileSize);
      formData.append("FilePath", this.AddForm.filePath);
      formData.append("Suitplatform", !!this.AddForm.Suitplatform ? this.AddForm.Suitplatform.join(',') : '');
      formData.append("LOD", this.AddForm.LOD);
      formData.append("type", type);
      for (let k in this.AddForm.imgfile) {
        formData.append('imgfile' + k, this.AddForm.imgfile[k].raw)
      }
      formData.append("remarks", this.AddForm.remarks);
      formData.append("Parameterization", this.AddForm.Parameterization);
      formData.append("IUID", this.rowIuid);
      var res = await zskFileApi.post("/api/" + this.apiControllerStr + "/publiclibraryAdd", formData, this.baseUrl);
      if (res.code == 1) {
        this.addVisible = false
        this.rowIuid = ''
        this.$success(res.msg);
        this.queryProjectList()
        this.$store.state.app.queryPrivateResourceTree = 'refresh'
      }
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/publicBuild.scss";


.t-pagination {
  height: 53px;
  padding: 12px 0 0;
  border-top: 1px solid #DCDFE6;
  text-align: right;
  padding-right: 20px;
  z-index: 99;
  background-color: #fff
}

.active {
  background-color: rgba(45, 175, 205, 0.2);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phoEmpty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 25px;
  color: #888;
  text-align: center;
}

.mainTop {
  height: 44px;
  background-color: #fff;
  flex-wrap: wrap;
  padding: 6px 10px 2px;
  white-space: nowrap;
}

.common-lib-iframe {
  background-color: #fff;
  position: fixed;
  top: calc(10vh + 50px);
  left: 20vw;
  width: 60vw;
  height: calc(80vh - 50px);
  z-index: 1502;
}

.mask {
  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    right: calc(20vw - 36px);
    top: 64px;
    cursor: pointer;
    font-size: 30px;
  }
}
</style>