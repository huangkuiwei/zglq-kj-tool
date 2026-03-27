<template>
  <el-container
    style="height:100%;margin-left: 1px;"
    class="commonKu"
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
            icon="el-icon-plus"
            @click="handleBuild('ADD')"
          >
            {{ $t('base.button.create') }}
          </el-button>
          <el-form style="display:flex;align-items:center; flex-wrap: wrap;margin-left: auto;">
            <el-form-item
              label=""
              style="display:flex;margin-right:15px"
            >
              <el-select
                v-model="searchForm.materialLibraryTypeIUID"
                size="small"
                :placeholder="$t('base.button.kind')"
                clearable
                style="width:120px"
              >
                <el-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :label="item.itemText"
                  :value="item.iuid"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label=""
              style="display:flex;margin-right:15px"
            >
              <el-select
                v-model="searchForm.label"
                size="small"
                :placeholder="$t('base.button.label')"
                clearable
                style="width:120px"
              >
                <el-option
                  v-for="(item, index) in labelData"
                  :key="item + index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-input
              v-model="searchForm.name"
              :placeholder="$t('base.button.inputKeyword')"
              prefix-icon="el-icon-search"
              style="width:180px;margin-right:15px"
              clearable
              size="small"
            />
          </el-form>
          <el-button
            type="primary"
            size="small"
            plain
            :icon="pictureMode ? 'el-icon-menu' : 'el-icon-tickets'"
            @click="pictureMode = !pictureMode"
          >
            {{ pictureMode ? $t('base.label.list') : $t('base.label.picture') }}
          </el-button>
        </div>
      </div>
      <!-- 列表 -->
      <el-row
        v-if="!pictureMode"
        style="height:calc(100vh - 158px);background:#fff"
      >
        <el-table
          ref="multipleTable"
          class="t-table"
          :data="materialData"
          stripe
          :header-cell-style="$thStyle"
          style="font-size: 13px"
          height="100%"
        >
          <el-table-column
            v-if="page != 'resource'"
            width="100px"
            type="index"
            align="center"
            :label="$t('base.button.index')"
          />
          <el-table-column
            align="center"
            :label="$t('base.button.preview')"
          >
            <template slot-scope="scope">
              <img
                style="width:80px;height:80px;border:none;padding:10px 0;cursor:pointer;object-fit: contain;"
                :src="imageUrl + encodeURIComponent((encrypt(item.imgFilePath)))"
                @click="openFileList(scope.row)"
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('base.button.name')">
            <template slot-scope="scope">
              <el-link
                style="cursor:pointer"
                :underline="false"
                @click="openFileList(scope.row)"
              >
                {{ scope.row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialLibraryTypeName"
            align="center"
            :label="$t('base.button.kind')"
          />
          <el-table-column
            prop="label"
            align="center"
            :label="$t('base.button.label')"
          />
          <el-table-column
            prop="remark"
            align="center"
            :label="$t('base.button.remark')"
          />
          <el-table-column
            :label="$t('base.formLabel.operation')"
            align="center"
            width="220"
          >
            <template slot-scope="scope">
              <el-button
                v-if="user.iscorpadmin"
                type="text"
                @click="handleBuild('EDIT', scope.row)"
              >
                {{ $t('base.button.edit') }}
              </el-button>
              <el-button
                v-if="user.iscorpadmin"
                type="text"
                style="color: #F56C6C;"
                @click="deleteBuild(scope.row)"
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
      <!-- 图览 -->
      <el-row
        v-else
        style="height:calc(100vh - 158px);background:#fff;overflow:auto"
      >
        <div class="mainCon">
          <!-- <div> -->
          <div
            class="flex wrap"
            style="padding:0 20px"
          >
            <div
              v-for="(item, index) in materialData"
              :key="index"
              class="mainConLi img-item"
            >
              <div @click="openFileList(item)">
                <img
                  :src="imageUrl + encodeURIComponent((encrypt(item.imgFilePath)))"
                  style="object-fit: contain;"
                >
                <div class="filename">
                  {{ item.name }}
                </div>
              </div>
              <div
                class="mainFlex img-btn"
                style="position:absolute;bottom:0;width:100%"
              >
                <el-button
                  size="mini"
                  type="text"
                  style="font-size: 15px;flex:1"
                  class="btn-group"
                  @click="handleBuild('EDIT', item)"
                >
                  <i
                    class="el-icon-edit"
                    style="font-size:15px"
                  />{{ $t('base.button.edit') }}
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  style="font-size: 15px;flex:1"
                  class="btn-group"
                  @click="deleteBuild(item)"
                >
                  <i
                    class="el-icon-delete"
                    style="font-size:15px"
                  />{{ $t('base.button.delete') }}
                </el-button>
              </div>
            </div>
            <div
              v-if="materialData.length == 0"
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
      <!-- 材质数据列表 -->
      <file-list
        :data="currentMaterialData"
        :visible.sync="listDataVisible"
        @closeFileList="closeFileList"
      />
      <!-- 新增编辑材质库 -->
      <el-dialog
        v-dialogDrag
        :title="addOrEdit == 'ADD' ? '创建材质库' : '编辑材质库'"
        :visible.sync="addVisible"
        width="420px"
        :modal="true"
        :close-on-click-modal="false"
      >
        <el-form
          ref="form"
          :model="AddForm"
          :rules="rules"
          size="small"
          label-width="88px"
          label-suffix=":"
        >
          <el-form-item
            :label="$t('base.button.name')"
            prop="name"
          >
            <el-input
              v-model="AddForm.name"
              type="text"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item
            :label="$t('base.button.kind')"
            prop="materialLibraryTypeIUID"
          >
            <el-select
              v-model="AddForm.materialLibraryTypeIUID"
              size="small"
              placeholder="请选择分类"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.itemText"
                :value="item.iuid"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('base.button.label')">
            <el-select
              v-model="AddForm.label"
              style="width: 100%;"
              allow-create
              filterable
              placeholder="请输入标签"
              clearable
            >
              <el-option
                v-for="(item, index) in labelData"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="缩略图"
            required
          >
            <el-upload
              class="avatar-uploader library"
              action="batchImportUrl"
              :on-change="uploadSuccess"
              :on-remove="removeFile"
              :auto-upload="false"
              accept="image/*"
              :show-file-list="false"
            >
              <img
                v-if="posterUrl"
                :src="posterUrl"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('base.button.remark')">
            <el-input
              v-model="AddForm.remark"
              type="text"
              placeholder="备注"
            />
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
import fileList from "./fileList.vue";
import request from '@/utils/request'

export default {
	name: 'MaterialLibrary',
	components: {
		fileList
	},
	data() {
		return {
			encrypt,
			total: 0,
			tableEmptyImage: tableEmptyImage,
			typeList: [],
			labelData: [],
			searchForm: {
				name: '',
				label: '',
				materialLibraryTypeIUID: '',
				rows: 10,
				page: 1,
			},
			rules: {
				name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
				materialLibraryTypeIUID: [{ required: true, message: '请选择分类', trigger: 'blur' }],
			},
			materialData: [],
			currentMaterialData: {},
			listDataVisible: false,
			dialogVisible: false,
			addVisible: false,
			baseUrl: process.env.VUE_APP_BASE_API,

			pictureMode: true,
			addOrEdit: '',
			AddForm: {
				name: '', //文件名
				materialLibraryTypeIUID: '', //分类
				label: '', //标签
				file: '', //文件
				remark: '', //备注
			},
			posterUrl: '',
      imageUrl: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl="
		}
	},
	computed: {
		...mapGetters(["user"]),
	},
	watch: {
		addVisible() {
			if (!this.addVisible) {
				this.AddForm = {
					name: '', //文件名
					materialLibraryTypeIUID: '', //分类
					label: '', //标签
					file: '', //文件
					remark: '', //备注
				}
				this.posterUrl = ''
				this.$refs['form'].resetFields()
			}
		},
		searchForm: {
			handler(val) {
				this.queryMaterialData()
			},
			deep: true
		}
	},
	async mounted() {
		this.initData()
	},
	methods: {
		async initData() {
			await this.getMaterialType()
			await this.getMaterialLabel()
			await this.queryMaterialData()
		},
		async getMaterialType() {
			var res = await postApi.get("/api/Home/GetItemInfoData?TypeCode=MaterialLibraryType");
			this.typeList = res.data
		},
		async getMaterialLabel() {
			var res = await postApi.post("/api/MaterialLibrary/QueryMaterialLibraryByLabel");
			this.labelData = res.data
		},

		//查询材质数据
		async queryMaterialData() {
			this.materialData = []
			var formData = this.$objectToFormData(this.searchForm)
			var res = await postApi.post("/api/MaterialLibrary/GetMaterialLibraryByPage", formData);
			this.materialData = res.data
			this.total = res.count
		},
		openFileList(data) {
			console.log(1);
			this.currentMaterialData = data;
			this.listDataVisible = true;

      // 日志
      let formData = new FormData();
      formData.append('Filename', data.name)
      formData.append('logtype', 'Gg_texture_data')
      request.post('api/Log/AddFileviewing', formData)
		},
		closeFileList() {
			this.currentMaterialData = {};
			this.listDataVisible = false;
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


		//删除材质
		deleteBuild(data) {
			this.$confirm('确认删除', '提示', { type: 'warning' }).then(() => {
				this.deleteBuildFun(data.iuid)
			})
		},
		async deleteBuildFun(iuid) {
			let arr = [iuid]
			var res = await postApi.post("/api/MaterialLibrary/DeleteMaterialLibrary", arr);
			if (res.code == 1) {
				this.$success(res.msg);
				this.initData()
				this.dialogVisible = false
			}
		},
		uploadSuccess(file) {
			this.posterUrl = URL.createObjectURL(file.raw);
			this.AddForm.file = file
		},
		removeFile(file) {
			this.AddForm.file = ''
		},

		async handleBuild(type, row) {
			this.addVisible = true
			this.addOrEdit = type
			if (type == 'EDIT') {
				var res = await postApi.get("/api/MaterialLibrary/GetMaterialLibraryByEdit?IUID=" + row.iuid);
				if (res.code == 1) {
					this.AddForm = res.data;
					var imageRes = await commonApi.getImageBase64Str(encrypt(res.data.imgFilePath))
					var raw = this.$dataURLtoFile(imageRes.data.base64Str, imageRes.data.fileName);
					this.AddForm.file = {
						raw,
					}
					this.posterUrl = this.baseUrl + '/' + res.data.imgFilePath
				}
			}
		},
		async sure() {
			if (!this.posterUrl) {
				this.$warning('请上传图片')
				return
			} else {
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.submitForm()
					}
				})
			}
		},
		async submitForm(type) {
			var formData = new FormData();
			if (this.addOrEdit == 'EDIT') {
				formData.append("iuid", this.AddForm.iuid);
			}
			formData.append("name", this.AddForm.name);
			formData.append("materialLibraryTypeIUID", this.AddForm.materialLibraryTypeIUID);
			formData.append("label", this.AddForm.label);
			formData.append("remark", this.AddForm.remark);
			formData.append("file1", this.AddForm.file.raw);
			var res = await postApi.post("/api/MaterialLibrary/SaveMaterialLibrary", formData);
			if (res.code == 1) {
				this.addVisible = false
				this.$success(res.msg);
				this.initData()
			}
		},
	},
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/publicBuild.scss";

.img-item {
	&:hover {
		.img-btn {
			display: flex;
		}
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
  