<template>
  <div
    class="app-container background table-box"
    :style="{ height: 'calc(100vh - 51px)' }"
    style="padding: 0; width: 100%"
  >
    <template v-if="hasCorp">
      <div class="flex ai-center oper-bar">
        <!-- <el-button -->
        <!--   v-if="$hasPermi('projects:projectchunkson:projectadd')" -->
        <!--   icon="el-icon-plus" -->
        <!--   type="primary" -->
        <!--   plain -->
        <!--   size="small" -->
        <!--   @click="handleAdd()" -->
        <!-- > -->
        <!--   {{ $t("projects.button.add") }} -->
        <!-- </el-button> -->
        <el-button
          v-if="tableSelection.length > 0 && pathName != 'myCollectionProject' && pathName != 'lately'"
          icon="el-icon-delete"
          plain
          size="small"
          type="danger"
          @click="handleDelete(true)"
        >
          {{ $t("base.button.delete") }}
        </el-button>
        <div
          class="flex ai-center"
          style="margin-left: auto"
        >
          <!-- 查询 -->
          <el-input
            v-model="searchForm.ProjectName"
            class="top-search"
            style="width: 183px;margin-right: 15px;"
            size="small"
            :placeholder="$t('projects.search')"
            @change="handleSearch"
          />
          <el-form
            ref="form"
            :model="searchForm"
            class="searchForm"
            label-width="74px"
            :inline="true"
            size="small"
            @submit.native.prevent
          >
            <el-form-item v-if="$deployName == 'luqiao'">
              <el-select
                v-model="searchForm.province"
                style="width: 140px"
                :placeholder="$t('projects.label.country')"
                clearable
                @visible-change="(e) => { if (e) { this.queryCountries(); } }"
                @change="handleSearch"
              >
                <el-option
                  v-for="(item, idx) in countriesOptions"
                  :key="item.province + idx"
                  :label="item.province"
                  :value="item.province"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="searchForm.projectTypeIUID"
                style="width: 140px"
                :placeholder="$t('projects.label.type')"
                clearable
                @change="handleSearch"
              >
                <el-option
                  v-for="item in projectTypeOptions"
                  :key="item.iuid"
                  :label="item.name"
                  :value="item.iuid"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-cascader
                v-model="searchForm.DesignPhaseIUID"
                style="width: 140px"
                :options="ProjectDesignPhaseOptions"
                :placeholder="$t('base.label.projectPhase')"
                clearable
                :props="{ value: 'iuid', label: 'itemText', children: 'child' }"
                @change="handleSearch"
              />
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="searchForm.CreateTime"
                type="month"
                style="width: 140px"
                value-format="yyyy-MM"
                :placeholder="$t('base.label.createDate')"
                clearable
                @change="handleSearch(...arguments, 'time')"
              />
            </el-form-item>
            <el-form-item>
              <div
                class="flex ai-center"
                style="position: relative"
              >
                <!-- <div class="search-box flex ai-center" :class="{ show: showSearch }">
                  <el-button type="text" icon="el-icon-search" size="small" style="padding: 0 11px" @click="handleSearch"></el-button>
                </div> -->

                <!-- 查询 -->
                <!-- <el-button circle :type="searchForm.ProjectName != '' ? 'primary' : ''" icon="el-icon-search" id="search_btn" size="small" style="margin-left: 0" @click="$store.commit('SET_SHOW_SEARCH', true)"></el-button> -->
                <!-- 刷新 -->
                <!-- <el-button circle icon="el-icon-refresh-right" size="small" style="margin-left: 5px" @click=" searchForm.ProjectName = ''; loadData();"></el-button> -->
                <!-- 图览 -->
                <el-button
                  v-if="!pictureMode"
                  key="picture"
                  icon="el-icon-menu"
                  size="small"
                  @click="modeChange(true)"
                >
                  {{ $t('base.label.picture') }}
                </el-button>
                <!-- 列表 -->
                <el-button
                  v-else
                  key="list"
                  icon="el-icon-s-fold"
                  size="small"
                  @click="modeChange(false)"
                >
                  {{ $t('base.label.list') }}
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div
        class="container-padding"
        :style="{ padding: '0 20px' }"
      >
        <el-row
          v-if="!pictureMode"
          class="content-inner table"
          style="margin-bottom: 0"
        >
          <el-table
            ref="multipleTable"
            class="t-table"
            :data="tableData"
            stripe
            :header-cell-style="$thStyle"
            style="font-size: 13px"
            :style="{ 'margin-top': '0' }"
            :height="'100%'"
            :default-sort="{ prop: $route.name == 'lately' ? 'browseDate' : 'createTime', order: 'descending', }"
@selection-change="handleSelectionChange" @sort-change="sortChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              show-overflow-tooltip
              :label="$t('projects.label.name')"
            >
              <template slot-scope="scope">
                <i class="iconFile" />
                <el-link
                  :underline="false"
                  @click="linkToFilePage(scope.row)"
                >
                  {{ scope.row.projectName }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectTypeName"
              width="140px"
              :label="$t('projects.label.type')"
            />
            <!--el-table-column prop="projectTemplate" label="项目模板"></el-table-column-->
            <el-table-column
              prop="projectAddress"
              show-overflow-tooltip
              :label="$t('projects.label.address')"
            >
              <template slot-scope="scope">
                {{ scope.row.projectAddress ? scope.row.projectAddress : scope.row.province ?
                  scope.row.province + "/" + scope.row.city + (scope.row.district ? "/" + scope.row.district : "") : ""
                }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="$route.name == 'lately'"
              prop="browseDate"
              sortable="custom"
              :label="$t('base.formLabel.latelyTime')"
            />
            <el-table-column
              prop="createTime"
              sortable="custom"
              :label="$t('base.label.createTime')"
            />
            <!-- <el-table-column -->
            <!--   width="180px" -->
            <!--   prop="active" -->
            <!--   :label="$t('base.formLabel.operation')" -->
            <!-- > -->
            <!--   <template slot-scope="scope"> -->
            <!--     <template v-if="!$isRead"> -->
            <!--       <el-tooltip -->
            <!--         v-if="scope.row.isCollection == 0" -->
            <!--         effect="dark" -->
            <!--         :content="$t('projects.cardtips.collect')" -->
            <!--         placement="top" -->
            <!--         style=" width: 25px; height: 25px; margin-right: 10px; line-height: 25px; text-align: center; " -->
            <!--       > -->
            <!--         <el-link -->
            <!--           :underline="false" -->
            <!--           icon="iconfont icon-quxiaoshoucang" -->
            <!--           @click="collectionPoject(scope.row)" -->
            <!--         /> -->
            <!--       </el-tooltip> -->
            <!--       <el-tooltip -->
            <!--         v-if="scope.row.isCollection == 1" -->
            <!--         effect="dark" -->
            <!--         :content="$t('projects.cardtips.cancelCollect')" -->
            <!--         placement="top" -->
            <!--         style=" width: 25px; height: 25px; margin-right: 10px; line-height: 25px; text-align: center; " -->
            <!--       > -->
            <!--         <el-link -->
            <!--           :underline="false" -->
            <!--           icon="iconfont icon-shoucang" -->
            <!--           style="color: #ffe039" -->
            <!--           @click="cancelCollectionPoject(scope.row)" -->
            <!--         /> -->
            <!--       </el-tooltip> -->
            <!--       <el-tooltip -->
            <!--         class="tableOpeColMargin" -->
            <!--         effect="dark" -->
            <!--         :content="$t('projects.cardtips.detail')" -->
            <!--         placement="top" -->
            <!--       > -->
            <!--         <el-link -->
            <!--           :underline="false" -->
            <!--           icon="el-icon-tickets" -->
            <!--           @click="handleOpeProject('DETAIL', scope.row)" -->
            <!--         /> -->
            <!--       </el-tooltip> -->
            <!--       <el-dropdown -->
            <!--         v-if="scope.row.isCreator === 1" -->
            <!--         class="tableOpeColMargin" -->
            <!--         trigger="click" -->
            <!--         size="small" -->
            <!--       > -->
            <!--         <el-link -->
            <!--           :underline="false" -->
            <!--           icon="el-icon-setting" -->
            <!--         /> -->
            <!--         <el-dropdown-menu slot="dropdown"> -->
            <!--           <el-dropdown-item @click.native="handleEdit('base', scope.row)"> -->
            <!--             {{ $t("projects.nav.base") }} -->
            <!--           </el-dropdown-item> -->
            <!--           <el-dropdown-item @click.native="handleEdit('member', scope.row)"> -->
            <!--             {{ $t("projects.nav.member") }} -->
            <!--           </el-dropdown-item> -->
            <!--           <el-dropdown-item @click.native="handleEdit('permission', scope.row)"> -->
            <!--             {{ $t("projects.nav.permission") }} -->
            <!--           </el-dropdown-item> -->
            <!--           <el-dropdown-item @click.native="handleEdit('workflow', scope.row)"> -->
            <!--             {{ $t("projects.nav.workflow") }} -->
            <!--           </el-dropdown-item> -->
            <!--         </el-dropdown-menu> -->
            <!--       </el-dropdown> -->
            <!--       <el-tooltip -->
            <!--         v-if="scope.row.isCreator === 1" -->
            <!--         class="tableOpeColMargin" -->
            <!--         effect="dark" -->
            <!--         :content="$t('projects.cardtips.delete')" -->
            <!--         placement="top" -->
            <!--       > -->
            <!--         <el-link -->
            <!--           :underline="false" -->
            <!--           icon="iconfont icon-delete" -->
            <!--           @click="handleDelete(false, scope.row)" -->
            <!--         /> -->
            <!--       </el-tooltip> -->
            <!--     </template> -->

            <!--     <template v-else> -->
            <!--       <el-tooltip -->
            <!--         v-if="scope.row.isCollection == 0 && !scope.row.bitmyxm" -->
            <!--         effect="dark" -->
            <!--         :content="$t('projects.cardtips.syncProject')" -->
            <!--         placement="top" -->
            <!--         style=" width: 20px; height: 25px; line-height: 25px; text-align: center; " -->
            <!--       > -->
            <!--         <el-link -->
            <!--           :underline="false" -->
            <!--           icon="el-icon el-icon-refresh" -->
            <!--           @click="syncProject(scope.row)" -->
            <!--         /> -->
            <!--       </el-tooltip> -->
            <!--     </template> -->
            <!--   </template> -->
            <!-- </el-table-column> -->
            <div
              slot="empty"
              class="empty"
            >
              <img :src="tableEmptyImage">
              <span>{{ $t('base.button.noData') }}</span>
            </div>
            <!-- <tableEmptyCom /> -->
          </el-table>
        </el-row>
        <el-row
          v-else
          class="content-inner scrollContainer hide-scroll"
          style="width: 100%; overflow: auto"
        >
          <div
            v-if="noData"
            class="flex ai-center jc-center"
            style="margin-top: 10vh; color: #999"
          >
            {{ $t('base.button.noData') }}
          </div>
          <div
            ref="cardBox"
            class="flex wrap"
          >
            <div
              v-for="(item, index) in tableData"
              :key="index"
              class="card-item"
            >
              <div
                class="grid-content bg-purple"
                :class="{ projecBorder: tableSelection.length > 0 ? tableSelection[0].iuid == item.iuid : false, }"
                @contextmenu.prevent="openMenu($event, item)"
              >
                <el-image
                  v-if="item.images"
                  style=" width: 100%; height: 176px; border-top-left-radius: 8px; border-top-right-radius: 8px; "
                  :src="item.images"
                  fit="cover"
                  @click="linkToFilePage(item)"
                >
                  <div
                    slot="error"
                    class="image-slot"
                    @click="linkToFilePage(item)"
                  >
                    <img
                      :src="defaultProjectImage"
                      style=" width: 100%; height: 176px; border-top-left-radius: 8px; border-top-right-radius: 8px; background-size: cover; border: 1px solid #ebeef5; "
                    >
                  </div>
                </el-image>
                <el-image
                  v-else
                  style=" width: 100%; height: 176px; border-top-left-radius: 8px; border-top-right-radius: 8px; border: 1px solid #ebeef5; "
                  :src="defaultProjectImage"
                  fit="cover"
                  @click="linkToFilePage(item)"
                />
                <div class="describe">
                  <h3
                    style="font-size: 16px; color: #303133; margin-bottom: 0"
                    @click="linkToFilePage(item)"
                  >
                    {{
                      item.projectName }}
                  </h3>
                  <div style="display: flex; width: 100%">
                    <p
                      style=" margin-top: 5px; height: 15px; width: 75%; flex-grow: 1; "
                      @click="linkToFilePage(item)"
                    >
                      {{ item.projectTypeName }}
                    </p>
                    <!-- <div style=" margin-top: 5px; margin-left: 35px; width: fit-content; flex-shrink: 0; "> -->
                    <!--   <template v-if="!$isRead"> -->
                    <!--     <el-tooltip -->
                    <!--       v-if="item.isCollection == 0 && !item.bitmyxm" -->
                    <!--       effect="dark" -->
                    <!--       :content="$t('projects.cardtips.collect')" -->
                    <!--       placement="top" -->
                    <!--       style=" width: 20px; height: 25px; line-height: 25px; text-align: center; " -->
                    <!--     > -->
                    <!--       <el-link -->
                    <!--         :underline="false" -->
                    <!--         icon="iconfont icon-quxiaoshoucang" -->
                    <!--         @click="collectionPoject(item)" -->
                    <!--       /> -->
                    <!--     </el-tooltip> -->
                    <!--     <el-tooltip -->
                    <!--       v-if="item.isCollection == 1 && !item.bitmyxm" -->
                    <!--       effect="dark" -->
                    <!--       :content="$t('projects.cardtips.cancelCollect')" -->
                    <!--       placement="top" -->
                    <!--       style=" width: 20px; height: 25px; line-height: 25px; text-align: center; " -->
                    <!--     > -->
                    <!--       <el-link -->
                    <!--         :underline="false" -->
                    <!--         icon="iconfont icon-shoucang" -->
                    <!--         style="color: #ffe039" -->
                    <!--         @click="cancelCollectionPoject(item)" -->
                    <!--       /> -->
                    <!--     </el-tooltip> -->
                    <!--     <template v-if="user.iscorpadmin || item.isCreator"> -->
                    <!--       <el-dropdown -->
                    <!--         trigger="click" -->
                    <!--         size="small" -->
                    <!--         :placement="'bottom'" -->
                    <!--       > -->
                    <!--         <el-link -->
                    <!--           :underline="false" -->
                    <!--           style="font-size: 14px; margin-top: -2px" -->
                    <!--           icon="el-icon-setting" -->
                    <!--         /> -->
                    <!--         <el-dropdown-menu slot="dropdown"> -->
                    <!--           <el-dropdown-item @click.native="handleEdit('base', item)"> -->
                    <!--             {{ $t("projects.nav.base") }} -->
                    <!--           </el-dropdown-item> -->
                    <!--           <el-dropdown-item @click.native="handleEdit('member', item)"> -->
                    <!--             {{ $t("projects.nav.member") }} -->
                    <!--           </el-dropdown-item> -->
                    <!--           <el-dropdown-item @click.native="handleEdit('permission', item)"> -->
                    <!--             {{ $t("projects.nav.permission") }} -->
                    <!--           </el-dropdown-item> -->
                    <!--           <el-dropdown-item @click.native="handleEdit('workflow', item)"> -->
                    <!--             {{ $t("projects.nav.workflow") }} -->
                    <!--           </el-dropdown-item> -->
                    <!--         </el-dropdown-menu> -->
                    <!--       </el-dropdown> -->
                    <!--       <el-tooltip -->
                    <!--         v-if="!item.bitmyxm" -->
                    <!--         effect="dark" -->
                    <!--         :content="$t('projects.cardtips.delete')" -->
                    <!--         placement="top" -->
                    <!--         style=" width: 20px; height: 25px; line-height: 25px; text-align: center; " -->
                    <!--       > -->
                    <!--         <el-link -->
                    <!--           :underline="false" -->
                    <!--           class="el-icon-delete" -->
                    <!--           @click="handleDelete(false, item)" -->
                    <!--         /> -->
                    <!--       </el-tooltip> -->
                    <!--     </template> -->
                    <!--   </template> -->

                    <!--   <template v-else> -->
                    <!--     <el-tooltip -->
                    <!--       v-if="item.isCollection == 0 && !item.bitmyxm" -->
                    <!--       effect="dark" -->
                    <!--       :content="$t('projects.cardtips.syncProject')" -->
                    <!--       placement="top" -->
                    <!--       style=" width: 20px; height: 25px; line-height: 25px; text-align: center; " -->
                    <!--     > -->
                    <!--       <el-link -->
                    <!--         :underline="false" -->
                    <!--         icon="el-icon el-icon-refresh" -->
                    <!--         @click="syncProject(item)" -->
                    <!--       /> -->
                    <!--     </el-tooltip> -->
                    <!--   </template> -->
                    <!-- </div> -->
                  </div>
                </div>
                <el-row class="buttonStyle">
                  <div
                    class="flex ai-center jc-between"
                    style="padding: 0 15px"
                  >
                    <div class="flex ai-center">
                      <img
                        style=" width: 30px; height: 30px; border-radius: 50%; margin-right: 5px; "
                        :src="item.adminUserAvatar ? imageOrigin + encodeURIComponent(encrypt(item.adminUserAvatar)) : defaultAvatar"
                      >
                      <span class="account-name">{{ item.adminName }}</span>
                    </div>
                    <div style="color: #c0c4cc; font-size: 14px">
                      {{ $dayjs(item.createTime) }}
                    </div>
                  </div>
                </el-row>
              </div>
            </div>
            <div
              v-for="i in compensateCount"
              style="width: 306px; height: 0"
            />
          </div>
        </el-row>
      </div>
      <pagination
        :page-total="total"
        :page-index="pageIndex"
        :page-number="pageSize"
        @handleCurrentChange="paginationCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </template>
    <el-dialog
      v-dialogDrag
      :modal="true"
      title="项目详情"
      :visible.sync="detailDialogVisble"
      width="425px"
    >
      <el-form
        ref="form"
        :model="projectForm"
        label-suffix="："
        label-width="100px"
        size="small"
      >
        <el-form-item :label="$t('projects.label.name')">
          <label>{{ projectForm.projectName }}</label>
        </el-form-item>

        <el-form-item :label="$t('projects.label.type')">
          <label>{{ projectForm.projectTypeName }}</label>
        </el-form-item>
       
        <el-form-item :label="$t('projects.label.admin')">
          <label>{{ projectForm.adminName }}</label>
        </el-form-item>
        <el-form-item :label="$t('projects.label.member')">
          <label>{{ projectForm.userName }}</label>
        </el-form-item>
        <!-- <el-form-item label="项目模板：">
      <label>{{ projectForm.ProjectTemplate }}</label>
      </el-form-item> -->
        <el-form-item :label="$t('projects.label.area')">
          <label>{{ projectForm.projectAddress ? projectForm.projectAddress : projectForm.province ? projectForm.province
            + "/" + projectForm.city + (projectForm.district ? "/" + projectForm.district : "") : "" }}</label>
        </el-form-item>
        <el-form-item :label="$t('projects.label.image')">
          <img
            v-if="projectForm.images"
            style="width: 200px"
            :src="projectForm.images"
            class="avatar"
          >
        </el-form-item>
        <el-form-item :label="$t('projects.label.overview')">
          <label>{{ projectForm.overview }}</label>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          style="width: 88px"
          size="small"
          @click="detailDialogVisble = false"
        >
          {{
            $t("base.button.close") }}
        </el-button>
      </div>
    </el-dialog>
    <project-setting
      :project-data="projectForm"
      :project-type-options="projectTypeOptions"
      :project-design-phase-options="ProjectDesignPhaseOptions"
      :type.sync="projectOpeType"
      @loadData="loadData"
      @openProject="linkToFilePage(projectForm)"
    />
  </div>
</template>

<script>
import {
  read,
  utils
} from "xlsx";
import defaultAvatar from "@/assets/robot.svg";
import {
  mapGetters
} from "vuex";
import projectSetting from "@/views/project/projectSetting/index.vue";
import projectAllApi from "@/api/project/all/index";
import local from "@/utils/auth";
// import mapComponents from "@/components/2DMap";
import defaultProjectImage from "@/assets/projectDefaultImg.png";
import pagination from "@/components/pagination/index";
import tableEmptyCom from "@/components/Table/tableEmpty";
import tableEmptyImage from "@/assets/tableEmpty.png";
import postApi from "@/api/document/indexApi.js";
import commonApi from "@/api/common.js";
import {
  encrypt,
  decrypt
} from "@/utils";
import request from "@/utils/request";

export default {
  components: {
    // mapComponents,
    pagination,
    tableEmptyCom,
    projectSetting,
  },
  computed: {
    ...mapGetters([
      "clientHeight",
      "clientWidth",
      "showSearch",
      "isCollapse",
      "user",
    ]),
    // compensateCount() {
    // 空位补偿数量  flex > around模式：使同排数量不满时候位靠左对齐
    // },

    recentFile() {
      let name = "无";
      let file = this.lastProjectInfo;
      if (file.fileName) {
        let index = file.fileName.lastIndexOf(".");
        name = file.fileName.slice(0, index);
      }
      return name;
    },
    recentFileSuffix() {
      let sfx = "";
      let file = this.lastProjectInfo;
      if (file.fileName) {
        let index = file.fileName.lastIndexOf(".");
        sfx = file.fileName.slice(index);
      }
      return sfx;
    },
  },
  data() {
    return {
      noData: false,
      settingVisible: false,
      searchForm: {
        province: "",
        projectTypeIUID: "",
        DesignPhaseIUID: [],
        CreateTime: "",
        ProjectName: "",
      },
      compensateCount: 0,
      userState: "",
      tableEmptyImage: tableEmptyImage,
      defaultProjectImage: defaultProjectImage,
      defaultAvatar: defaultAvatar,
      pictureMode: true,
      tableData: null,
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      orderBy: "DESC",
      dialogVisble: false,
      detailDialogVisble: false,
      countriesOptions: [],
      projectTypeOptions: [],
      projectUserNames: null,
      projectFormImages: null, //for 图片base64数据流
      projectType2Name: "",
      createProjectRules: {
        ProjectType: [{
          required: true,
          message: "请选择项目类型",
          trigger: "blur"
        },],
        AdminName: [{
          required: true,
          message: "请选择项目负责人",
          trigger: "blur"
        },],
        ProjectName: [{
          required: true,
          message: "请输入项目名称",
          trigger: "blur"
        },],
      },
      projectForm: {},
      projectOpeType: "close",
      templateFile: "",
      tableSelection: [],
      submitLoading: false,
      rightClickItem: {
        isCreator: 0,
      },
      clickMenuvisible: false,
      top: 0,
      left: 0,
      projectCollectionFormData: {
        IUID: "",
        ProjectName: "",
        Iscollection: "",
      },
      pathName: "",
      responsiblePersonDialogVisible: false,
      companyPersonData: [],
      responsiblePersonChecked: {},
      companyMemberDialogVisible: false,
      companyMemberChecked: [],
      companyMemberCheckAll: false,
      isIndeterminate: true,
      imageOrigin: process.env.VUE_APP_BASE_API + "/api/home/GetimgFile?fileUrl=",
      encrypt,
      lastProjectInfo: {},
      ProjectDesignPhaseOptions: [], //项目状态选项
      hasCorp: false,
      showClearIcon: false,
    };
  },
  watch: {
    clickMenuvisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  created() {
    this.pathName = this.$route.name;
    commonApi.queryCorpSpace().then((r) => {
      this.hasCorp = r.data.hasCorp;
    });
    //恢复页码
    this.resetPageIndex();
  },
  async mounted() {
    console.log(this.$turnEncryptParams("D:\\file\\11221.bim&view=22"));
    let slideWidth = this.isCollapse ? 60 : 280; //左栏宽度
    this.userState = local.getUser().isadministrator;
    window.addEventListener("scroll", this.handleScroll, true);
    this.pictureMode =
      typeof this.$route.query.projectIsPictureMode == "undefined" ?
        true :
        this.$route.query.projectIsPictureMode === "true";
    if (this.pathName == "teamwork") this.pictureMode = false;
    this.loadProjectTypeOptions();

    await this.loadData();
    this.getProjectDesignPhaseOptions();
    //卡片模式恢复界面滚动位置
    if (this.pictureMode && this.resetScrollPositionTrigger) {
      this.resetScrollPosition();
    }
    this.$nextTick(() => {
      if (!!this.$refs.cardBox) {
        let width = this.$refs.cardBox.offsetWidth - slideWidth - 40; //右栏宽度
        let count = Math.floor(width / 306); // 每行排布个数
        this.compensateCount = count - 1;
      }
    });
    let _this = this;
    window.onresize = () => {
      if (!!_this.$refs.cardBox) {
        let width = _this.$refs.cardBox.offsetWidth - slideWidth - 40; //右栏宽度
        let count = Math.floor(width / 306); // 每行排布个数
        _this.compensateCount = count - 1;
      }
    };

    this.$root.$on('changeLanguage', async () => {
      this.loadProjectTypeOptions();
      await this.loadData();
      this.getProjectDesignPhaseOptions();
    })
  },
  methods: {
    async queryCountries() {
      if (this.$route.path === '/lately' ||
          this.$route.path === '/all' ||
          this.$route.path === '/myCreated' ||
          this.$route.path === '/myParticipateIn' ||
          this.$route.path === '/myCollectionProject'
      ) {
        let formData = new FormData();
        formData.append("dataRule", this.$route.name);
        var res = await postApi.post(
            "/api/ProjectManagement/QueryProjectProvince",
            formData
        );
        if (res.code == 1) {
          this.countriesOptions = res.data;
          this.countriesOptions.unshift({
            province: this.$t("teamwork.approve.all"),
          });
        }
      }
    },
    projectDialogClose() {
      this.submitLoading = false;
      this.responsiblePersonChecked = {};
    },
    async getProjectDesignPhaseOptions() {
      var res = await postApi.get(
        "/api/Home/GetItemInfoData?TypeCode=ProjectStatus&bitcheck=false"
      );
      if (res.code == 1) {
        this.ProjectDesignPhaseOptions = res.data;
      }
    },
    changeStatus(event) {
      request.post(
        `api/ProjectFile/UserWhetherToEnterAdd?WhetherToEnter=${event}`
      );
    },
    resetPageIndex() {
      if (this.pathName == this.$store.state.app.projectLeftMenuActive) {
        this.resetScrollPositionTrigger = true;
        // this.pageIndex = this.$store.state.app.projectPageIndex;
        // this.pageSize = this.$store.state.app.projectPageNumber;
      } else {
        //记录项目当前界面
        this.$store.state.app.projectLeftMenuActive = this.pathName;
      }
    },
    resetScrollPosition() {
      if (document.getElementsByClassName("scrollContainer").length > 0) {
        document.getElementsByClassName("scrollContainer")[0].scrollTop =
          this.$store.state.app.projectPageScrollTop;
      }
    },
    handleScroll(e) {
      //记录项目卡片模式下的滚动距离
      if (
        e.target.className.indexOf("scrollContainer") > -1 &&
        this.pictureMode
      ) {
        this.$store.state.app.projectPageScrollTop = e.target.scrollTop;
      }
      this.clickMenuvisible = false;
    },
    paginationCurrentChange(val) {
      this.$store.state.app.projectPageIndex = val;
      this.pageIndex = val;
      this.loadData();
    },
    handleSizeChange(val) {
      this.$store.state.app.projectPageNumber = val;
      this.pageSize = val;
      this.loadData();
    },
    openMenu(e, item) {
      this.rightClickItem = item;
      this.top = e.clientY;
      this.left = e.clientX;
      this.clickMenuvisible = true;
    },
    closeMenu() {
      this.clickMenuvisible = false;
    },

    getMapClicklnglats(e) {
      this.mapClicklngLat = e;
    },
    modeChange(mode) {
      this.tableSelection = [];
      this.pictureMode = mode;
    },
    handleSearch() {
      this.pageIndex = 1;
      this.loadData();
    },
    handleSelectionChange(val) {
      this.tableSelection = val;
    },
    // projectClick (item) {
    //   var arr = [];
    //   arr.push(item);
    //   this.tableSelection = arr;
    // },
    handleLinkToBoard(row) {
      this.$router.push({
        path: "/board",
      });
    },
    handleDelete(isBatch, row) {
      if (isBatch && this.tableSelection.length === 0) {
        this.$error("请选中一行操作");
        return;
      }
      this.$confirm("确定要删除吗？").then(async () => {
        let postData;
        if (isBatch) {
          postData = this.tableSelection.map((item) => {
            return {
              iuid: item.iuid,
            };
          });
        } else {
          postData = [{
            iuid: row.iuid,
          },];
        }
        var res = await projectAllApi.delete(postData);
        if (res.code === 1) {
          this.$deleteSuccess();
          if (this.tableData.length == 1 && this.pageIndex > 1) {
            this.pageIndex = this.pageIndex - 1;
          }
          this.loadData();
        } else if (res.code == -1) {
          this.$confirm("部分文件被占用,请确认是否关闭占用中文件", {
            confirmButtonText: "关闭文件",
          }).then(async (r) => {
            if (r) { }
          });
        }
      });
    },
    async loadData() {
      if (this.$deployName == "luqiao") {
        await this.queryCountries();
      }
      this.noData = false;
      var postData = new FormData();
      if (this.$deployName == "luqiao") {
        let province =
          this.searchForm.province == this.$t("teamwork.approve.all") ?
            "" :
            this.searchForm.province;
        postData.append("province", province);
      }
      postData.append(
        "ProjectName",
        this.searchForm.ProjectName ? this.searchForm.ProjectName : ""
      );
      postData.append("page", this.pageIndex);
      postData.append("rows", this.pageSize);
      postData.append("dataRule", this.$route.name);
      postData.append("Orderby", this.orderBy);
      postData.append(
        "DesignPhaseIUID",
        this.searchForm.DesignPhaseIUID.join(",")
      );
      postData.append("projectTypeIUID", this.searchForm.projectTypeIUID);
      postData.append(
        "CreateTime",
        this.searchForm.CreateTime == null ? "" : this.searchForm.CreateTime
      );

      var res = await projectAllApi.queryProjectPageList(postData);
      // filePath 和 turnPath 解码
      res.data &&
        res.data.forEach((item) => {
          item.filePath = decrypt(item.filePath || "");
          item.turnPath = decrypt(item.turnPath || "");
          item.images =
            this.imageOrigin + encodeURIComponent(item.imagesOriginal);
        });
      this.tableData = res.data;
      if (res.count == 0) {
        this.noData = true;
      }
      this.total = res.count;
    },
    sortChange(column) {
      if (column.order === null) {
        this.orderBy === "DESC" ?
          (column.order = "ascending") :
          (column.order = "descending");
        column.column.order = column.order;
      }
      this.orderBy = column.order == "ascending" ? "ASC" : "DESC";
      this.loadData();
    },
    projectTypeChange(e) {
      this.projectType2Name = this.projectTypeOptions.find(
        (item) => item.iuid == e
      ).name;
    },

    async handleOpeProject(type, row) {
      this.projectForm = row;
      this.detailDialogVisble = true;
    },
    handleAdd() {
      this.projectForm = {};
      this.projectOpeType = "ADD";
    },
    handleEdit(command, row) {
      this.projectOpeType = command;
      this.projectForm = row;
    },
    async loadProjectTypeOptions() {
      var res = await projectAllApi.queryProjectTypeList();
      this.projectTypeOptions = res.data;
    },
    cancleCheckResponsiblePerson() {
      //新增时
      this.responsiblePersonChecked = {};
      //编辑时
      this.responsiblePersonDialogVisible = false;
    },
    confirmCheckResponsiblePerson() {
      var checkedUser = this.companyPersonData.find((item) => {
        return item.userId == this.responsiblePersonChecked;
      });
      // debugger
      this.projectForm.adminID = checkedUser.userId;
      this.projectForm.adminName = checkedUser.userName;
      this.responsiblePersonDialogVisible = false;
    },
    timeClear(e) {
      console.log(e);
      if (e == null) {
        this.searchForm.CreateTime = "";
      }
    },
    selectTemplateFile(e) {
      this.templateFile = "";
      const files = e.target.files;
      // 如果没有文件名
      if (files.length <= 0) {
        return;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return;
      }
      var that = this;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          // 切换为新的调用方式
          const workbook = read(data, {
            type: "binary",
          });
          const allws = [];
          let sheetNo = 0;
          for (const sheet in workbook.Sheets) {
            const wsname = workbook.SheetNames[sheetNo];
            // 切换为新的调用方式 生成json表格内容
            const ws = utils.sheet_to_json(workbook.Sheets[wsname]);
            allws.push(ws);
            //                alert(JSON.stringify(ws));
            sheetNo++;
          }
          //  this.projectForm.projectTemplate = JSON.stringify(allws);
          //  alert(JSON.stringify(ws));
          this.convertToJson(allws);
          // 后续为自己对ws数据的处理
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    convertToJson(allws) {
      var allData = [];
      var data = JSON.parse(JSON.stringify(allws[0]));
      for (var i = 0; i < data.length; i++) {
        var str = JSON.stringify(data[i]);
        var strs = str.split(":");
        if (strs.length == 2) {
          var index1 = strs[0].indexOf('"');
          var index2 = strs[0].lastIndexOf('"');
          var level = strs[0].substring(index1 + 1, index2);
          index1 = strs[1].indexOf('"');
          index2 = strs[1].lastIndexOf('"');
          var name = strs[1].substring(index1 + 1, index2);
          var item = {
            level: parseInt(level),
            name: name,
          };
          allData.push(item);
        }
      }
      if (allData.length < 1 || allData[0].level != 1) {
        this.projectForm.projectTemplate = JSON.stringify({
          treeData: [],
          fields: [],
        });
        return;
      }
      var treeData = [];
      for (var i = 0; i < allData.length; i++) {
        var root;
        if (allData[i].level == 1) {
          root = {
            level: 1,
            name: allData[i].name,
            children: [],
            rowNo: i,
          };
          treeData.push(root);
        }
      }
      var subItems = [];
      treeData.forEach((item) => subItems.push(item));
      while (subItems.length > 0) {
        var subSubItems = [];
        for (var j = 0; j < subItems.length; j++) {
          this.addSubItems(
            subItems[j],
            j + 1 < subItems.length ? subItems[j + 1].rowNo : 10000,
            allData,
            subSubItems
          );
        }
        subItems = [];
        subSubItems.forEach((item) => subItems.push(item));
      }
      //       console.log(treeData);
      // 处理项目属性字段
      /*     allData = [];
         data = JSON.parse(JSON.stringify(allws[1]));
          for(var i = 0; i < data.length; i ++) {
           var str = JSON.stringify(data[i]);
           var strs = str.split(':');
           if(strs.length == 2) {
             var index1 = strs[0].indexOf('\"');
             var index2 = strs[0].lastIndexOf('\"');
             var level = strs[0].substring(index1+1, index2);
             index1 = strs[1].indexOf('\"');
             index2 = strs[1].lastIndexOf('\"');
             var name = strs[1].substring(index1+1, index2);
             var item = {level: parseInt(level), name: name};
             allData.push(item);
           }
         }
      */
      var templateData = {
        treeData: treeData,
        fields: [],
      };
      //   console.log(templateData);
      this.projectForm.projectTemplate = JSON.stringify(templateData);
    },
    // 检查当前节点的后续行，如果是其子节点则加入
    addSubItems(fatherItem, nextrow, allData, subItems) {
      var k = fatherItem.rowNo + 1;
      if (k >= nextrow) return;
      var item;
      if (k < allData.length && allData[k].level == fatherItem.level + 1) {
        item = {
          level: allData[k].level,
          name: allData[k].name,
          children: [],
          rowNo: k,
        };
        fatherItem.children.push(item);
        subItems.push(item);
        k++;
        for (var i = k; i < allData.length; i++) {
          if (i >= nextrow) break;
          if (allData[i].level == fatherItem.level + 1) {
            item = {
              level: allData[i].level,
              name: allData[i].name,
              children: [],
              rowNo: i,
            };
            fatherItem.children.push(item);
            subItems.push(item);
          }
        }
      }
    },
    async checkResponsiblePerson() {
      //查询企业内部人员
      var res = await postApi.get("/api/WebAccount/QueryCompanyPerson");
      if (res.code === 1) {
        this.companyPersonData = res.data;
        this.responsiblePersonDialogVisible = true;
      }
      // this.$dd.ready(function () {
      //   _self.$dd.biz.contact.complexPicker({
      //     title: "选择负责人", //标题
      //     corpId: res.data.corpId, //企业的corpId
      //     multiple: false, //是否多选
      //     limitTips: "超出了可选人数", //超过限定人数返回提示
      //     maxUsers: 1, //最大可选人数
      //     pickedUsers: [_self.projectForm.adminID], //已选用户
      //     pickedDepartments: [], //已选部门
      //     disabledUsers: [], //不可选用户
      //     disabledDepartments: [], //不可选部门
      //     requiredUsers: [], //必选用户（不可取消选中状态）
      //     requiredDepartments: [], //必选部门（不可取消选中状态）
      //     appId: res.data.appId, //微应用Id，企业内部应用查看AgentId
      //     permissionType: "GLOBAL", //可添加权限校验，选人权限，目前只有GLOBAL这个参数
      //     responseUserOnly: true, //返回人，或者返回人和部门
      //     startWithDepartmentId: 0, //仅支持0和-1
      //     onSuccess: function (result) {
      //       /**
      //             result: {
      //                 selectedCount:1,                              //选择人数
      //                 users:[{"name":"","avatar":"","userid":""}]， //返回选人的列表，列表中的对象包含name（姓名），avatar（用户头像），emplId（用户工号）三个字段
      //                 departments:[{"id":,"name":"","number":}]     //返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
      //             }
      //             */
      //       console.log(result);
      //       _self.projectForm.adminID = result.users[0].emplId;
      //       _self.projectForm.adminName = result.users[0].name;
      //     },
      //     onFail: function (err) {
      //       console.log(JSON.stringify(err));
      //     },
      //   });
      // });
    },
    handleCompanyMemberCheckAllChange(val) {
      this.companyMemberChecked = val ?
        this.companyPersonData.map((item) => item.userId) :
        [];
      this.isIndeterminate = false;
    },
    handleCheckedCompanyMemberChange(value) {
      let checkedCount = value.length;
      this.companyMemberCheckAll =
        checkedCount === this.companyPersonData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.companyPersonData.length;
    },
    cancleCheckCompanyMember() {
      //新增时
      this.companyMemberChecked = [];
      this.companyMemberCheckAll = false;
      this.isIndeterminate = true;
      //编辑时
      this.companyMemberDialogVisible = false;
    },
    confirmCheckCompanyMember() {
      var users = [];
      this.companyMemberChecked.forEach((item) => {
        var checkedUser = this.companyPersonData.find((ele) => {
          return ele.userId === item;
        });
        if (checkedUser !== undefined) {
          users.push({
            UserID: checkedUser.userId,
            UserName: checkedUser.userName,
          });
        }
      });
      this.projectForm.projectUserList = users;
      this.companyMemberDialogVisible = false;
    },
    async checkPerson() {
      //查询企业内部人员
      var res = await postApi.get("/api/WebAccount/QueryCompanyPerson");
      if (res.code === 1) {
        this.companyPersonData = res.data;
        this.companyMemberDialogVisible = true;
      }
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
    share(row) {
      this.$pauseFunction();
    },
    download(row) {
      this.$pauseFunction();
    },
    browseData(iuid) {
      projectAllApi.addProjectBrowseData(iuid);
    },
    async linkToFilePage(row) {
      await request.post(
        "/api/ProjectFile/UserProjectFileInforAdd", {}, {
        transformRequest: () => {
          let formData = new FormData();
          formData.append("MainIUID", row.iuid);
          if (this.lastProjectInfo.fileIUID) {
            formData.append("FileIUID", this.lastProjectInfo.fileIUID);
          }
          return formData;
        },
      }
      );
      let projectDetail = await request.post(
        `/api/ProjectManagement/ProjectUpdateData?iuid=${row.iuid}&isInsideApp=1`
      );
      await this.browseData(row.iuid);

      let formData = new FormData();
      formData.append('projectname', row.projectName)
      formData.append('logtype', 'Projectviewing')
      request.post('api/Log/AddFileviewing', formData)

      this.$router.push({
        path: "/projectFile",
        query: {
          projectId: row.iuid,
          isDoc: row.bitmyxm,
          projectName: row.projectName,
          projectIsPictureMode: this.pictureMode,
          path: this.$route.path == "/" ? "/all" : this.$route.path,
        },
      });
    },
    //项目收藏
    collectionPoject(data) {
      this.projectCollectionFormData.IUID = data.iuid;
      this.projectCollectionFormData.ProjectName = data.projectName;
      this.projectCollectionFormData.Iscollection = 1;
      this.projectCollectPost();
    },

    // 同步项目
    syncProject(item) {
      this.$confirm('确定要同步该项目下的所有文件吗？').then(() => {
        const loading = this.$loading({
          text: '正在同步项目，请稍等...',
          body: true,
          lock: true,
          background: '#00000060',
        })

        request.get('api/TaskManagement/ProjectFilesSynchronous', {
          params: {
            ProjectIUID: item.iuid
          },
          timeout: 0
        }).then((res) => {
          loading.close()

          if (res.code === 1) {
            this.$message.success('项目同步成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },

    cancelCollectionPoject(data) {
      this.projectCollectionFormData.IUID = data.iuid;
      this.projectCollectionFormData.ProjectName = data.projectName;
      this.projectCollectionFormData.Iscollection = 0;
      this.projectCollectPost();
    },
    async projectCollectPost() {
      var formData = new FormData();
      formData.append("IUID", this.projectCollectionFormData.IUID);
      formData.append(
        "ProjectName",
        this.projectCollectionFormData.ProjectName
      );
      formData.append(
        "Iscollection",
        this.projectCollectionFormData.Iscollection
      );
      var res = await projectAllApi.projectCollection(formData);
      if (res.data == 1 && this.projectCollectionFormData.Iscollection == 1) {
        this.$message({
          message: res.msg,
          type: "success",
        });
        this.loadData();
      } else {
        this.$message({
          message: res.msg,
          type: "success",
        });
        this.loadData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.oper-bar {
  height: 60px;
  flex-shrink: 0;
  padding: 0 20px;
  border-bottom: 1px solid #f2f2f2;
}

.content-inner {
  height: calc(100vh - 164px);
}

.remember {
  padding: 15px 20px 0;
  color: #606266;
  height: 60px;
  font-size: 14px;
  width: calc(100% + 40px);
  position: relative;
  left: -20px;
  top: -20px;
  border-bottom: 1px solid #d6dae3;
  display: flex;
  align-items: center;
  justify-content: space-between;

  >div {
    width: calc(50% - 20px);
    display: flex;
    align-items: center;
    //  border: 1px solid #c0c4cc;
    //  border-radius: 4px;
    padding-right: 16px;

    >.left {
      display: flex;
      align-items: center;

      // flex-grow: 1;
      .lastFile {
        max-width: 230px;
        word-break: break-all;
        overflow: hidden;
        text-align: right;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      >.logo {
        padding: 5px;
        // background: linear-gradient(180deg, rgba(64, 158, 255, 0.3) 0%, rgba(64, 129, 255, 0.69) 100%);
        margin-right: 10px;

        >img {
          height: 28px;
        }

        >.tip {
          background: #555555;
          font-size: 16px;
        }

        >.name {
          color: #333333;
        }
      }
    }

    >.right {
      display: flex;
      align-items: center;

      >div {
        display: flex;
        align-items: center;
        color: #409eff;
        margin-left: 20px;
        cursor: pointer;

        >img {
          height: 14px;
          margin-right: 5px;
        }
      }
    }
  }
}

.contextmenu {
  margin: 0;
  padding: 0;
  background: #ffffff;
  z-index: 2000;
  position: absolute;
  list-style-type: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  /* box-shadow: 1px 2px 3px 1px rgba(0, 0, 0, 0.3); */
  box-shadow: 1px 2px 3px 2px rgba(0, 0, 0, 0.08);
}

.contextmenu li {
  margin: 0;
  cursor: pointer;
  width: 128px;
  height: 32px;
  line-height: 32px;
  padding-left: 20px;
}

.contextmenu li:hover {
  background: #ebeef5;
}

.bg-purple {
  /* height: 348px; */
  height: 310px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(235, 238, 245, 1);
  // border-top-left-radius: 4px;
  // border-top-right-radius: 4px;
  border-radius: 8px;
  position: relative;
}

.bg-purple:hover {
  cursor: pointer;
  transform: translateY(-3px);
  -webkit-transform: translateY(-3px);
  -moz-transform: translateY(-3px);
  box-shadow: 2px 0px 6px 1px rgba(0, 0, 0, 0.08);
  box-shadow: 2px 0px 6px 1px rgba(0, 0, 0, 0.08);
  -webkit-box-shadow: 2px 0px 6px 1px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 2px 0px 6px 1px rgba(0, 0, 0, 0.08);
}

.projecBorder {
  border: 1px solid #409eff;
}

.describe p {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  position: relative;
  max-height: 22px;
  overflow: hidden;
  min-height: 22px;
}

.describe {
  /* height: 102px; */
  /*  height: 62px; */
  padding: 0 15px;
}

.remarkP {
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.describe h3 {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  line-height: 30px;
  margin-top: 10px;
}

.buttonStyle {
  margin-bottom: 0px;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #ebeef5;
}

.templatefileBtn {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 60px;
  opacity: 0;
  cursor: pointer;
}

.select-person-container {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
}

.person-option {
  width: 100px;
  display: -webkit-box !important;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-align: left;
  cursor: pointer;
}

.card-item {
  border-radius: 8px;
  // overflow: hidden;
  position: relative;
  margin: 10px;
  width: 286px;
  display: inline-block;
  transition: all 0.1s;
}

.account-name {
  color: #606266;
  font-size: 13px;
  width: 130px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
