<template>
  <el-container
    v-if="visible"
    class="materialList-box"
  >
    <el-main class="buildMain">
      <div
        class="mainTop"
        style="margin-bottom:1px;box-sizing: content-box;"
      >
        <div
          class="flex ai-center"
          style="width: 100%;"
        >
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-arrow-left"
            @click="$emit('closeFileList')"
          >
            {{ $t('base.button.back') }}
          </el-button>
          <div style="margin-left: 15px;">
            {{ data.name }}
          </div>
          <div style="display:flex;align-items:center; flex-wrap: wrap;margin-left: auto;">
            <el-button
              type="primary"
              icon="el-icon-upload2"
              style="margin-right: 15px;"
              size="small"
              @click="handleBuild('ADD')"
            >
              {{ $t('base.button.upload') }}
            </el-button>
            <el-input
              v-model="searchForm.name"
              placeholder="请输入关键词"
              prefix-icon="el-icon-search"
              style="width:180px;margin-right:15px"
              clearable
              size="small"
            />
          </div>
        </div>
      </div>
      <!-- 图览 -->
      <el-row style="height:calc(100vh - 158px);background:#fff;overflow:auto">
        <div class="mainCon">
          <!-- <div> -->
          <div
            class="flex wrap"
            style="padding:0 20px"
          >
            <div
              v-for="(item, index) in materialListData"
              :key="index"
              class="mainConLi img-item"
            >
              <div @click="viewInfo(item)">
                <el-image
                  :preview-src-list="srcList"
                  fit="contain"
                  :src="imageUrl + encodeURIComponent((encrypt(item.filePath)))"
                  style="object-fit: contain;"
                  @click="setSrcList(item)"
                />
                <div class="filename">
                  {{ item.fileName }}
                </div>
              </div>
              <div
                class="mainFlex img-btn"
                style="position:absolute;bottom:0;width:100%"
              >
                <el-button
                  size="mini"
                  type="text"
                  style="font-size: 15px;flex:1;color: #f56c6c;background-color: #fff;"
                  class="btn-group"
                  @click="deleteBuild(false, item)"
                >
                  <i
                    class="el-icon-delete"
                    style="font-size:15px"
                  />{{ $t('base.button.delete') }}
                </el-button>
              </div>
            </div>
            <div
              v-if="materialListData.length == 0"
              slot="empty"
              class="phoEmpty"
            >
              <span>{{ $t('base.button.noData') }}</span>
            </div>
          </div>
          <!-- </div> -->
        </div>
      </el-row>
      <el-pagination
        :pager-count="5"
        class="t-pagination"
        :current-page.sync="searchForm.page"
        :page-sizes="[10, 20, 40]"
        :page-size="searchForm.rows"
        layout="total, sizes, prev, pager, next, jumper"
@size-change="handleSizeChange" :total="total" background @current-change="paginationCurrentChange"
      />
      <!-- 新增材质 -->
      <el-dialog
        v-dialogDrag
        title="上传材质图片"
        append-to-body
        :visible.sync="addVisible"
        width="420px"
        :modal="true"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="AddForm"
          size="small"
          label-width="64px"
          label-suffix=":"
        >
          <el-form-item
            label="图片"
            prop="file"
            required
          >
            <div class="thumbnail">
              <el-upload
                class="avatar-uploader library"
                action="batchImportUrl"
                list-type="picture-card"
                :file-list="fileList"
                multiple
                :on-change="uploadSuccess"
                :on-remove="removeFile"
                :auto-upload="false"
                accept="image/*"
              >
                <i class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </div>
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
          <el-button @click="addVisible = false">{{ $t('base.button.cancel') }}</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { mapGetters } from "vuex";
import postApi from '@/api/document/indexApi.js'
import commonApi from "@/api/common";
import tableEmptyImage from "@/assets/tableEmpty.png";
import { decrypt, encrypt } from '@/utils'
import request from '@/utils/request'
export default {
    name: 'MaterialFile',
    props: {
        closeFileList: {
            type: Function,
            default: () => { }
        },
        data: {
            type: Object,
            default: () => { }
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            encrypt,
            total: 0,
            srcList: [],
            tableEmptyImage: tableEmptyImage,
            searchForm: {
                name: '',
                rows: 10,
                page: 1,
            },
            fileList: [],
            materialListData: [],
            dialogVisible: false,
            addVisible: false,
            baseUrl: process.env.VUE_APP_BASE_API,
            detailsData: '',
            pictureMode: true,
            addOrEdit: '',
            AddForm: {
                file: [], //文件
            },
            imageUrl: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl="
        }
    },
    computed: {
        ...mapGetters(["user"]),
    },
    watch: {
        visible(val) {
            if (val) {
                this.queryMaterialListData()
            }
        },
        addVisible() {
            if (!this.addVisible) {
                this.fileList = []
                this.$refs['form'].resetFields()
            }
        },
        searchForm: {
            handler(val) {
                this.queryMaterialListData()
            },
            deep: true
        }
    },
    methods: {
        setSrcList(item) {
            this.srcList = [this.baseUrl + '/' + item.filePath]

          // 日志
          let formData = new FormData();
          formData.append('Filename', item.fileName)
          formData.append('logtype', 'Gg_texture_data')
          request.post('api/Log/AddFileviewing', formData)
        },

        //查询材质图览数据
        async queryMaterialListData() {
            let form = new FormData()
            form.append('page', this.searchForm.page)
            form.append('rows', this.searchForm.rows)
            form.append('fileName', this.searchForm.name)
            form.append('IUID', this.data.iuid)
            var res = await postApi.post("/api/MaterialLibrary/GetMaterialLibraryFileByPage", form);
            this.materialListData = res.data
            this.total = res.count
        },

        // 清空条件
        emptyCondition() {
            this.searchForm = {
                name: '',
                label: '',
                materialLibraryTypeIUID: '',
                rows: 10,
                page: 1
            }
        },
        //切换图览列表
        modeChange(mode) {
            this.pictureMode = mode;
        },
        paginationCurrentChange(val) {
            this.searchForm.page = val
        },
        handleSizeChange(val) {
            this.searchForm.rows = val
        },

        //查看材质详情	
        viewInfo(data, type) {
            if (type == 'detail') {
                this.dialogVisible = true
                this.detailsData = data
            }
        },

        //删除材质
        deleteBuild(type, data) {
            this.$confirm('确认删除', '提示', { type: 'warning' }).then(() => {
                if (type == false) {
                    this.deleteBuildFun(data.iuid)
                } else {
                    this.deleteBuildFun(this.detailsData.iuid)
                }
            })
        },
        async deleteBuildFun(iuid) {
            let arr = [iuid]
            var res = await postApi.post("/api/MaterialLibrary/DeleteMaterialLibraryFile", arr);
            if (res.code == 1) {
                this.$success(res.msg);
                this.queryMaterialListData()
                this.dialogVisible = false
            }
        },
        uploadSuccess(file, fileList) {
            this.fileList = fileList
        },
        removeFile(file, fileList) {
            this.fileList = fileList
        },

        async handleBuild(type, row) {
            this.addVisible = true
            this.addOrEdit = type
        },
        async sure() {
            if (this.fileList.length == 0) {
                this.$warning('请上传图片')
            } else {
                this.submitForm()
            }
        },
        async submitForm(type) {
            var formData = new FormData();
            formData.append("iuid", this.data.iuid);
            this.fileList.forEach((item, index) => {
                formData.append("file" + index, item.raw);
            })
            var res = await postApi.post("/api/MaterialLibrary/UploadFilesList", formData);
            if (res.code == 1) {
                this.addVisible = false
                this.$success(res.msg);
                this.queryMaterialListData()
            }
        },
    },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/publicBuild.scss";

.materialList-box {
    width: 100%;
    height: calc(100vh - 51px);
    position: absolute;
    z-index: 1002;
    left: 0;
    top: 0;
}

.img-item {
    &:hover {
        .img-btn {
            display: flex;
        }
    }

    .el-image {
        width: calc(100% - 10px);
        height: 180px;
        margin: 20px 5px;
    }

    .img-btn {
        display: none;
    }
}

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
</style>
  