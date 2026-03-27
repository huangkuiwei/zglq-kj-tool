<!--  -->
<template>
  <el-form
    ref="projectForm"
    :model="projectForm"
    :rules="createProjectRules"
    label-suffix=":"
    label-width="130px"
    size="small"
  >
    <div class="flex">
      <div style="width: 550px">
        <el-form-item
          prop="projectName"
          :label="$t('projects.label.name')"
        >
          <el-input
            v-model="projectForm.projectName"
            style="width: 300px"
            :placeholder="$t('base.button.input')"
          />
        </el-form-item>
        <el-form-item
          prop="projectType"
          :label="$t('projects.label.type')"
          style="height: 32px;"
        >
          <el-select
            v-model="projectForm.projectType"
            style="width: 300px"
            :popper-append-to-body="false"
            :placeholder="$t('base.button.pleaseSelect')"
            @change="projectTypeChange"
          >
            <el-option
              v-for="item in projectTypeOptions"
              :key="item.iuid"
              :label="item.name"
              :value="item.iuid"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="adminName"
          :label="$t('projects.label.admin')"
        >
          <el-select
            v-model="projectForm.adminName"
            style="width: 300px;"
          >
            <el-option
              v-for="item in memberList"
              :key="item.iuid"
              :label="item.userName"
              :value="item.iuid"
            />
          </el-select>
        </el-form-item>

        <!-- 国外选择洲国，国内选省市县 -->
        <el-form-item
          prop="country"
          :label="$t('projects.label.area')"
        >
          <el-cascader
            v-model="projectForm.country"
            :options="countries"
            style="width: 300px;"
            clearable
            :props="{ value: 'name', label: 'name' }"
          />
        </el-form-item>

        <!-- <member-picker :isMultiple="true" dialogTitle="选择负责人" @cancelCheck="cancelCheck" @queryMember="queryMember" :checkList="adminUser" :memberList="memberList" @submit="changeAdmin" :dialogVisible.sync="memberPickerVisible" /> -->
        <el-form-item
          :label="$t('projects.label.status')"
          style="height: 32px;"
        >
          <el-cascader
            v-model="projectForm.designPhaseIUID"
            :options="ProjectDesignPhaseOptions"
            style="width: 300px;"
            clearable
            :props="{ value: 'iuid', label: 'itemText', children: 'child' }"
          />
        </el-form-item>

        <!-- 项目模板模块 -->
        <!-- <el-form-item label="项目模板：" v-if="projectType2Name !== '桥梁大师项目'">
          <el-input style="width: 300px" v-model="projectForm.ProjectTemplate" readonly placeholder="请选择项目模板文件">
            <el-button slot="append" icon="el-icon-plus"></el-button>
          </el-input>
          <input class="templatefileBtn" v-show="false" :disabled="type === 'ADD' ? false : true" type="file" name="file" accept=".xls,.xlsx" @change="selectTemplateFile" alt="请选择文件" />
        </el-form-item> -->

        <!-- 全局项目 -->
        <!-- <el-form-item :label="$t('projects.label.isGlobal')" prop="isitGlobal" v-if="isAdmin == true">
          <el-radio-group v-model="projectForm.isitGlobal" size="mini">
            <el-radio label="1">{{ $t('projects.label.yes') }}</el-radio>
            <el-radio label="0">{{ $t('projects.label.no') }}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item :label="$t('projects.label.image')">
          <el-upload
            class="avatar-uploader poster"
            action=""
            :show-file-list="false"
            :on-change="fileListChange"
            :auto-upload="false"
            accept="image/*"
          >
            <img
              v-if="projectForm.images || projectFormImages"
              :src="projectFormImages ? projectFormImages : getImgUrl(projectForm.images)"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('projects.label.overview')">
          <el-input
            v-model="projectForm.overview"
            type="textarea"
            style="width: 300px"
            :rows="5"
            :placeholder="$t('base.button.input')"
          />
        </el-form-item>
        <el-button
          type="primary"
          :loading="submitLoading"
          style="width: 88px;float: right;"
          size="small"
          @click="onSubmit"
        >
          {{ type == 'ADD' ? $t('base.button.create') : $t('base.button.save') }}
        </el-button>
      </div>
    </div>
  </el-form>
</template>

<script>
import projectAllApi from "@/api/project/all/index";
import postApi from "@/api/document/indexApi";
import china from '@/libs/mapJson/china.json'
import world from "@/libs/mapJson/world.json"
let countries = world;
import { mapGetters } from "vuex";
import memberPicker from '@/components/memberPicker/index.vue'
import i18n from '../../../../static/locales'
export default {
  name: "BaseInfo",
  components: {
    memberPicker
  },
  props: ['ProjectIUID', 'type', 'projectTypeOptions', 'ProjectDesignPhaseOptions', 'close', 'loadData'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('所在地区不能为空'));
      } else if (Array.isArray(value)) {
        if (!value[0] || !value[1]) {
          callback(new Error('所在地区不能为空'));
        }
      }

      console.log('value', value)

      callback();
    };

    return {
      countries,
      imageOrigin: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl=",
      projectForm: {},
      createProjectRules: {
        projectType: [
          { required: true, message: '请选择项目类型', trigger: 'blur' }
        ],
        adminName: [
          { required: true, message: '请选择项目负责人', trigger: 'blur' }
        ],
        country: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
      },
      submitLoading: false,
      projectUserNames: '',
      projectType2Name: '',
      showClearIcon: false,
      memberPickerVisible: false,
      projectFormImages: "",
      memberList: [],
      adminUser: [],

    };
  },
  watch: {
    ProjectIUID(val) {
      if (val) {
        this.initData()
      }
    },
    type(val) {
      if (val == 'ADD') {
        this.projectForm = {
          iuid: null,
          adminName: this.user.username,
          adminID: this.user.userID,
          country: [],
          ddUserAvatar: this.user.avatar
        };
      }
    },
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.user.isadministrator
    },
    ...mapGetters(['user'])
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.queryMember()
      if (this.type != 'ADD') {
        this.queryUpdateData()
      } else {
        this.projectForm = {
          iuid: null,
          adminName: this.user.username,
          adminID: this.user.userID,
          country: [],
          ddUserAvatar: this.user.avatar
        };
        this.adminUser = [{
          userName: this.projectForm.adminName,
          userID: this.projectForm.adminID,
          ddUserAvatar: this.projectForm.ddUserAvatar
        }]
      }
    },
    getImgUrl(url) {
      return process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl=" + encodeURIComponent(url)
    },
    async queryUpdateData() {
      var res = await projectAllApi.querySingleProjectData(this.ProjectIUID, "", '1');
      if (res.code === 1) {
        this.projectForm = {
          ...res.data,
          country: undefined
        };
        this.projectForm.country = res.data.district != '' ? [res.data.province, res.data.city, res.data.district] : [res.data.province, res.data.city]
        this.projectForm.designPhaseIUID = res.data.designPhaseIUID.split(',')
        this.adminUser = [
          { userName: this.projectForm.adminName, userID: this.projectForm.adminID, ddUserAvatar: this.projectForm.ddUserAvatar }
        ]
      }
    },
    async queryMember(name) {
      let form = new FormData()
      form.append('type', null)
      form.append('page', 1)
      form.append('rows', 999)
      form.append('ProjectIUID', this.ProjectIUID)
      let res = await postApi.post('/api/Users/GetProjectUsersData', form)
      if (res.code == 1) {
        this.memberList = res.data
      }
    },
    cancelCheck(idx) {
      this.adminUser.splice(idx, 1)
      this.$forceUpdate()
    },
    changeAdmin(e) {
      this.projectForm.adminName = e[0].userName;
      this.projectForm.adminID = e[0].userID;
      this.memberPickerVisible = false
    },
    fileListChange(file, fileList) {
      var _self = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (e) {
        _self.projectFormImages = e.currentTarget.result;
        _self.projectForm.images = file.raw; //this.$imageBase64UrlToBlob(e.currentTarget.result,file.name);
      };
    },
    projectTypeChange() { },
    async onSubmit() {
      this.submitLoading = true;
      this.$refs['projectForm'].validate(async (valid) => {
        if (valid) {
          if (this.projectForm.projectType == "" || this.projectForm.projectName == "" || this.projectForm.adminName == "") {
            this.$message.error("请输入带*的条目!");
            this.projectFormImages = null;
            this.submitLoading = false;
            return;
          }
          this.projectForm.isInsideApp = "1";

          console.log('this.projectForm', this.projectForm)

          if (this.projectForm.designPhaseIUID != undefined) {
            this.projectForm.designPhaseIUID = this.projectForm.designPhaseIUID.join(',')
          }
          if (this.projectForm.country.length > 0) {
            this.projectForm.province = this.projectForm.country[0]
            this.projectForm.city = this.projectForm.country[1]
            this.projectForm.district = this.projectForm.country[2] ? this.projectForm.country[2] : ''
          } else if (this.projectForm.country.length == 0) {
            this.projectForm.province = ''
            this.projectForm.city = ''
            this.projectForm.district = ''
          }

          var formData = this.$objectToFormData(this.projectForm);
          if (this.type === "ADD") {
            var res = await projectAllApi.insert(formData);
            this.submitLoading = false;
            if (res.code == 1) {
              this.$addSuccess();
              this.$emit('loadData');
              this.$emit('close');
            } else {
              this.$error(res.msg)
            }
          } else {
            var res = await projectAllApi.updateProject(formData);
            this.submitLoading = false;
            if (res.code == 1) {
              this.$editSuccess();
              this.$emit('close');
              this.$emit('loadData');
            } else {
              this.$error(res.msg)
            }
          }
        } else {
          this.submitLoading = false;
          return false
        }
      })
    },
    checkResponsiblePerson() {

      this.memberPickerVisible = true
    },
    checkPerson() { },
    selectTemplateFile() { }
  }
}

</script>
<style></style>
