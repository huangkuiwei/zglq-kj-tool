<template>
  <el-container
    style="height:100%;margin-left: 1px;"
    class="commonKu"
  >
    <el-main class="buildMain">
      <!-- 检索栏 -->
      <div
        v-if="['resource', 'private'].includes(page)"
        class="mainTop"
        :style="page == 'private' ? { marginTop: '-12px', paddingLeft: '0' } : {}"
        style="margin-bottom:1px;box-sizing: content-box;"
      >
        <div
          class="flex ai-center"
          style="width: 100%;"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-upload2"
            @click="handleBuild('ADD')"
          >
            {{
              $t('base.button.upload') }}
          </el-button>
          <el-button
            v-if="page == 'private'"
            type="primary"
            size="small"
            icon="el-icon-upload2"
            @click="multipleUpload"
          >
            批量上传
          </el-button>
          <el-form style="display:flex;align-items:center; flex-wrap: wrap;margin-left: auto;">
            <template v-if="page != 'private'">
              <el-checkbox
                v-if="page == 'resource'"
                v-model="searchForm.Collectionbit"
                style="margin-right:15px"
              >
                {{ $t('base.label.collected') }}
              </el-checkbox>
              <el-form-item
                label=""
                style="display:flex;margin-right:15px"
              >
                <el-select
                  v-model="searchForm.Parameterization"
                  size="small"
                  placeholder="参数化"
                  clearable
                  style="width:120px"
                >
                  <el-option
                    v-for="(item, index) in parameterData"
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
                  v-model="searchForm.LOD"
                  size="small"
                  placeholder="LOD等级"
                  clearable
                  style="width:120px"
                >
                  <el-option
                    v-for="item in levelData"
                    :key="item.itemIndex"
                    :label="item.itemText"
                    :value="item.iuid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label=""
                style="display:flex"
              >
                <el-cascader
                  v-model="searchForm.Suitplatform"
                  placeholder="适用平台"
                  value-key="iuid"
                  :emit-path="false"
                  :props="headOptionProps"
                  :options="platformData"
                  clearable
                  style="width: 120px;margin-right:15px"
                  size="small"
                />
              </el-form-item>
            </template>
            <el-input
              v-model="searchForm.FileName"
              :placeholder="$t('base.label.inputKeywordsToFindComponents')"
              prefix-icon="el-icon-search"
              style="width:180px;margin-right:15px"
              clearable
              size="small"
            />
            <div
              v-if="page != 'private'"
              class="topRight mainFlex"
            >
              <el-button
                v-if="!pictureMode"
                key="picture"
                type="primary"
                icon="el-icon-menu"
                size="small"
                style="margin-right:15px"
                @click="modeChange(true)"
              >
                {{ $t('base.label.picture') }}
              </el-button>
              <el-button
                v-else
                key="list"
                icon="el-icon-tickets"
                size="small"
                style="margin-right:15px"
                @click="modeChange(false)"
              >
                {{ $t('base.label.list') }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 列表 -->
      <el-row
        v-if="!pictureMode"
        :style="{ height: `calc(100vh - ${page == 'private' ? 166 : page == 'resource' ? 153 : 103}px)` }"
        style="background:#fff"
      >
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
            v-if="page != 'resource'"
            width="100px"
            type="index"
            align="center"
            :label="$t('base.button.index')"
          />
          <el-table-column
            v-if="page != 'private'"
            align="center"
            :label="$t('base.button.preview')"
          >
            <template slot-scope="scope">
              <img
                style="width:80px;height:80px;border:none;padding:10px 0;cursor:pointer;object-fit: contain;"
                :src="baseImageUrl + encodeURIComponent(scope.row.imgfile)"
                @click="viewInfo(scope.row)"
              >
            </template>
          </el-table-column>
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
            v-if="['myComponents', 'resourceApprove'].includes(page)"
            prop="type"
            align="center"
            :label="$t('base.button.status')"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.type == '1' ? '' : scope.row.type == '2' ? 'success' : 'danger'"
                size="small"
              >
                {{ scope.row.type | typeName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="120px"
            prop="parameterization"
            align="center"
            :label="$t('base.button.parameterized')"
          />
          <el-table-column
            v-if="page == 'private'"
            width="120px"
            prop="fileSize"
            align="center"
            :label="$t('base.button.fileSize')"
          />
          <el-table-column
            v-if="page != 'private'"
            prop="suitplatformName"
            align="center"
            :label="$t('base.button.platform')"
          />
          <el-table-column
            v-if="page != 'private'"
            prop="lod"
            align="center"
            :label="$t('base.button.LODLevel')"
          />

          <template v-if="['myComponents', 'resourceApprove'].includes(page)">
            <el-table-column
              prop="remarks"
              align="center"
              :label="$t('base.button.remark')"
            />
            <el-table-column
              prop="idea"
              align="center"
              :label="$t('base.button.opinion')"
            />
          </template>

          <el-table-column
            :label="$t('base.formLabel.operation')"
            align="center"
            width="240"
          >
            <template slot-scope="scope">
              <template v-if="page == 'resource'">
                <el-button
                  v-if="scope.row.collectbit == 0"
                  type="text"
                  @click="collect(scope.row)"
                >
                  {{ $t('base.button.collect') }}
                </el-button>
                <el-button
                  v-if="scope.row.collectbit == 1"
                  type="text"
                  @click="cancelCollect(scope.row)"
                >
                  {{ $t('base.button.cancelCollection') }}
                </el-button>
                <el-button
                  type="text"
                  @click="downLoad(scope.row)"
                >
                  {{ $t('base.button.download') }}
                </el-button>
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
                  @click="deleteBuild(false, scope.row)"
                >
                  {{ $t('base.button.delete') }}
                </el-button>
              </template>
              <template v-if="page == 'private'">
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
                  @click="deleteBuild(false, scope.row)"
                >
                  {{ $t('base.button.delete') }}
                </el-button>
              </template>
              <template v-else-if="page == 'myComponents'">
                <el-button
                  type="text"
                  @click="handleBuild('EDIT', scope.row)"
                >
                  {{ $t('base.button.edit') }}
                </el-button>
                <el-button
                  type="text"
                  :disabled="scope.row.type != '1'"
                  @click="deleteBuild(false, scope.row)"
                >
                  {{ $t('base.button.withdraw') }}
                </el-button>
              </template>
              <template v-else-if="page == 'resourceApprove'">
                <el-button
                  type="text"
                  @click="handleBuild('EDIT', scope.row)"
                >
                  {{ $t('base.button.edit') }}
                </el-button>
                <el-button
                  type="text"
                  :disabled="scope.row.type != '1'"
                  @click="handleAgree(scope.row)"
                >
                  {{ $t('base.button.agree') }}
                </el-button>
                <el-button
                  type="text"
                  :disabled="scope.row.type != '1'"
                  style="color: #F56C6C;"
                  @click="handleReject(scope.row)"
                >
                  {{ $t('base.button.back') }}
                </el-button>
              </template>
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
        :style="{ height: `calc(100vh - ${page == 'private' ? 166 : page == 'resource' ? 153 : 103}px)` }"
        style="background:#fff;overflow:auto"
      >
        <div class="mainCon">
          <!-- <div> -->
          <div
            class="flex wrap"
            style="padding:0 20px"
          >
            <div
              v-for="(item, index) in publicData"
              :key="index"
              class="mainConLi"
              @mouseover="mouseover(index)"
              @mouseleave="mouseleave()"
            >
              <div @click="viewInfo(item)">
                <img
                  :src="baseImageUrl + encodeURIComponent(item.imgfile)"
                  style="object-fit: contain;"
                >
                <div class="filename">
                  {{ item.fileName }}
                </div>
              </div>
              <template v-if="user.isadministrator">
                <el-tag
                  v-if="$modelFileSuffix.indexOf(item.fileSuffix.toLowerCase()) > -1 && item.statusType != 3"
                  size="mini"
                  type="warning"
                  style="position:absolute;top:10px;left:10px;margin:0"
                >
                  转码中
                </el-tag>
              </template>
              <img
                v-if="item.parameterization == '参数化'"
                src="@/assets/csh.svg"
                style="width:20px;height:20px;position:absolute;top:10px;right:10px;margin:0"
              >
              <div
                v-if="btnVisible && index == current"
                class="mainFlex"
                style="position:absolute;bottom:0;width:100%"
              >
                <el-button
                  v-if="!item.collectbit"
                  size="mini"
                  type="text"
                  style="font-size: 15px;flex:1;margin:0"
                  class="btn-group"
                  @click="collect(item)"
                >
                  <i
                    class="iconfont icon-quxiaoshoucang"
                    style="font-size:15px"
                  />{{ $t('base.button.collect') }}
                </el-button>
                <el-button
                  v-if="item.collectbit"
                  size="mini"
                  type="text"
                  style="font-size: 15px;flex:1;margin:0"
                  class="btn-group"
                  @click="cancelCollect(item)"
                >
                  <i
                    class="iconfont icon-shoucang"
                    style="font-size:15px;color:#FFE039"
                  />{{ $t('base.button.cancelCollection') }}
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  style="font-size: 15px;flex:1"
                  class="btn-group"
                  @click="downLoad(item)"
                >
                  <i
                    class="iconfont icon-download"
                    style="font-size:15px"
                  />{{ $t('base.button.download') }}
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  style="font-size: 15px;flex:1"
                  class="btn-group"
                  @click="viewInfo(item, 'detail')"
                >
                  <i
                    class="el-icon-tickets"
                    style="font-size:15px"
                  />{{ $t('base.button.detail') }}
                </el-button>
              </div>
            </div>
            <div
              v-if="publicData.length == 0"
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
        :page-size="searchForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="paginationCurrentChange"
      />
      <!-- 查看详情 -->
      <el-dialog
        v-dialogDrag
        :title="detailsData.fileName"
        :visible.sync="dialogVisible"
        width="500px"
        :modal="true"
      >
        <!-- <div>分类：{{ detailsData.onetype }}</div> -->
        <el-carousel
          arrow="always"
          indicator-position="none"
          height="250px"
          :interval="5000"
        >
          <el-carousel-item
            v-for="(item, index) in imgData"
            :key="index"
          >
            <img
              :src="baseImageUrl + encodeURIComponent(item.filePath)"
              style="width:100%;height:100%;object-fit: contain;"
            >
            <div style="position:absolute;right:15%;bottom:0px">
              {{ index + 1 }}/{{ imgData.length }}
            </div>
          </el-carousel-item>
        </el-carousel>
        <div
          class="mainFlexBetween"
          style="padding:10px 0"
        >
          <div
            class="emphasis"
            style="cursor:pointer;"
          >
            <i class="el-icon-warning" />
            <el-button
              type="text"
              size="small"
              @click="showQrcode"
            >
              这个构件有问题？点这里
            </el-button>
            <!-- <a href="http://www.ksj.com.cn" target="_blank"></a> -->
          </div>
          <div style="line-height: 32px;">
            上传时间：{{ detailsData.createTime }}
          </div>
        </div>
        <div
          v-if="false"
          class="sourcesArtifacts mainFlexBetween"
        >
          <div
            v-if="false"
            style="display:flex;align-items:center"
          >
            构件来源:<img
              src="@/assets/companyLogo.png"
              style="height:20px"
              @click="window.open('https://www.ksj.com.cn/')"
            >
          </div>
          <div v-else>
            <!--flex占位用-->
          </div>
          <div
            class="mainFlex"
            style="align-items:center"
          >
            <div style="margin-right:10px">
              <i class="el-icon-view" />
              <span>{{ detailsData.examineCount }}</span>
            </div>
            <div style="margin-right:10px">
              <i class="iconfont icon-quxiaoshoucang" />
              <span>{{ detailsData.collectionCount }}</span>
            </div>
            <div style="margin-right:10px">
              <i class="iconfont icon-download" />
              <span>{{ detailsData.downloadCount }}</span>
            </div>
          </div>
        </div>
        <div class="sourcesInfo">
          构件信息
        </div>
        <div style="padding:10px 10px;line-height:30px">
          <div class="mainFlex">
            <div style="flex:0.3;text-align:right">
              分类-
            </div>
            <div style="flex:1">
              {{ detailsData.onetype }}
            </div>
          </div>
          <div class="mainFlex">
            <div style="flex:0.3;text-align:right">
              适用平台-
            </div>
            <div style="flex:1">
              {{ detailsData.suitplatformName }}
            </div>
          </div>
          <div class="mainFlex">
            <div style="flex:0.3;text-align:right">
              LOD等级-
            </div>
            <div style="flex:1">
              {{ detailsData.lod }}
            </div>
          </div>
          <div class="mainFlex">
            <div style="flex:0.3;text-align:right">
              参数化-
            </div>
            <div style="flex:1">
              {{ detailsData.parameterization }}
            </div>
          </div>
          <div class="mainFlex">
            <div style="flex:0.3;text-align:right">
              备注-
            </div>
            <div style="flex:1">
              {{ detailsData.remarks }}
            </div>
          </div>
        </div>
        <div
          class="mainFlex"
          style="padding:0 40px"
        >
          <el-button
            v-if="user.iscorpadmin"
            type="primary"
            size="small"
            style="flex:1"
            @click="handleBuild('EDIT', detailsData)"
          >
            {{ $t('base.button.edit') }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            style="flex:1"
            @click="downLoad(detailsData)"
          >
            {{ $t('base.button.download') }}
          </el-button>
          <el-button
            v-if="user.iscorpadmin"
            type="danger"
            size="small"
            style="flex:1"
            @click="deleteBuild(true, '')"
          >
            {{
              $t('base.button.delete') }}
          </el-button>
        </div>
      </el-dialog>
      <!-- 意见 -->
      <el-dialog
        title="意见"
        :visible.sync="replyDialogVisible"
        width="460px"
      >
        <el-input
          v-model="reply"
          :rows="4"
          type="textarea"
          placeholder="请输入意见"
        />
        <span slot="footer">
          <el-button
            size="small"
            @click="replyDialogVisible = false"
          >{{ $t('base.button.cancel') }}</el-button>
          <el-button
            size="small"
            type="primary"
            @click="submitReject"
          >{{ $t('base.button.confirm') }}</el-button>
        </span>
      </el-dialog>
      <!-- 新增编辑构件 -->
      <el-dialog
        v-dialogDrag
        :title="addOrEdit == 'ADD' ? '新增构件' : '编辑构件'"
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
              placeholder="请选择文件"
              :readonly="true"
            >
              <el-button
                slot="append"
                icon="el-icon-plus"
              >
                <input
                  class="fileFolderUploadBtn"
                  type="file"
                  name="file"
                  alt="请选择文件"
                  @change="submitFile"
                >
              </el-button>
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
          <template v-if="page != 'private'">
            <el-form-item label="适用平台">
              <el-cascader
                ref="refRegion"
                v-model="AddForm.Suitplatform"
                style="width: 100%"
                size="large"
                clearable
                :emit-path="true"
                :props="optionProps"
                :options="platformData"
              />
            </el-form-item>
            <el-form-item label="LOD等级">
              <el-select
                v-model="AddForm.LOD"
                :placeholder="$t('base.button.pleaseSelect')"
                clearable
                style="width:100%"
              >
                <el-option
                  v-for="(item, index) in levelData"
                  :key="index"
                  :label="item.itemText"
                  :value="item.iuid"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="缩略图"
              prop="imgfile"
            >
              <div class="thumbnail">
                <el-upload
                  class="avatar-uploader library"
                  action="batchImportUrl"
                  list-type="picture-card"
                  :file-list="AddForm.imgfile"
                  multiple
                  :on-change="setImgFile"
                  :on-remove="setImgFile"
                  :auto-upload="false"
                  accept="image/*"
                >
                  <i class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item :label="$t('base.button.remark')">
              <el-input
                v-model="AddForm.remarks"
                type="text"
                placeholder=""
              />
            </el-form-item>
          </template>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            :disabled="disabled"
            @click="sure"
          >{{ $t('base.button.confirm') }}</el-button>
          <el-button @click="handleClose">{{ $t('base.button.cancel') }}</el-button>
        </span>
      </el-dialog>
      <!-- 批量上传构件 -->
      <el-dialog
        v-dialogDrag
        title="批量上传构件"
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
          >{{ listUploadCount !=
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
import { mapGetters } from "vuex";
import postApi from '@/api/document/indexApi.js'
import zskFileApi from "@/api/zsk/index.js";
import commonApi from "@/api/common";
import tableEmptyImage from "@/assets/tableEmpty.png";
import { decrypt, encrypt } from '@/utils'

const typeMap = {
  '1': '审批中',
  '2': '已同意',
  '3': '已退回',
}
import Axios from 'axios'
import request from '@/utils/request'
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
      reply: '',
      replyDialogVisible: false,
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
        imgfile: [{ required: true, message: '请上传缩略图', trigger: 'blur' }],
      },
      sorting: 'all',
      headParameter: {
        itemIndex: 0
      },
      headLOD: {
        itemIndex: 0
      },
      showMask: false,
      headSuitplatform: [],
      parameterData: [],
      levelData: [],
      platformData: [],
      headOptionProps: {
        value: 'iuid',
        label: 'itemText',
        children: 'child',
        checkStrictly: false,
        leaf: 'iuid'
      },
      nowTreeNode: '',
      typeProps: {
        value: 'iuid',
        label: 'itemText',
        children: 'child',
        checkStrictly: false,
        leaf: 'iuid'
      },
      optionProps: {
        value: 'iuid',
        label: 'itemText',
        expandTrigger: 'hover',
        children: 'child',
        checkStrictly: false,
        leaf: 'iuid'
      },
      btnVisible: false,
      current: 0,
      publicData: [],
      imgData: [],
      dialogVisible: false,
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
      disabled: true,
      editData: [],
      rowIuid: '',

      showModel: false,
      FileUrl: '',
      FileIUID: '',
      listPercent: 0,
    }
  },
  computed: {
    ...mapGetters(["clientHeight", "user", "signalRTableData"]),
    uploadFileName() {
      let name = ''
      name = this.showFileName.slice(this.showFileName.lastIndexOf('\\') + 1)
      return name
    },
    apiControllerStr() {
      return this.page == 'private' ? 'publiclibrarynew' : 'publiclibrary'
    },
    libType() {
      return this.$store.state.app.libType
    }
  },
  watch: {
    '$route'(to, from) {

      if (to.path == '/privateResource') {
        this.searchForm.page = 1
        this.nowTreeNode = to.query.iuid || ''
        this.searchForm.classType = to.query.iuid || ''
      }
    },
    signalRTableData(val) {
      if (this.publicData.filter(item => item.iuid == this.signalRTableData.iuid).length > 0) {
        this.queryProjectList()
      }
    },
    libType: {
      deep: true,
      immediate: undefined,
      handler(val) {
        if (val.path != '') {
          this.treeClick(val.data)
        }
      },
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    listAddVisible() {
      if (!this.listAddVisible) {
        this.listFiles = []
        this.listUploadCount = 0
        this.listUploadTotal = 0
        this.AddForm.oneTypeIuid = ''
      }
    },
    addVisible() {
      if (!this.addVisible) {
        this.AddForm = {
          oneTypeIuid: '', //分类1
          FileName: '', //文件名
          FileSize: '', //文件大小
          filePath: '', //文件路径
          Suitplatform: '', //适用平台,
          LOD: '', //LOD等级
          imgfile: [], //缩略图
          remarks: '', //备注
          Parameterization: '', //参数化
        }
        this.isitGlobal = ''
        this.fileProgress = 0
        this.showFileName = ''
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
    this.pictureMode = this.page == 'resource' ? true : false
    if (this.page == 'private') {
      this.nowTreeNode = this.$route.query.iuid || ''
      this.searchForm.classType = this.$route.query.iuid || ''
    }
    this.queryAll()
  },
  methods: {
    // 页面数据
    //左侧树点击
    treeClick(data) {
      this.comFun('分类', data.itemText)
      this.searchForm.page = 1
      this.searchForm.classType = data.iuid
      this.nowTreeNode = data.iuid
    },
    //排序规则
    sortingData(val) {
      if (val == 'all') {
        this.searchForm.orderby = "CreateTime"
      } else if (val == 'moreDow') {
        this.searchForm.orderby = "downloadCount"
      } else {
        this.searchForm.orderby = "collectionCount"
      }
    },
    async queryAll() {
      await this.querySelectData('Parameterization')
      await this.querySelectData('LOD')
      await this.querySelectData('Suitplatform')
      await this.querySelectData('Component')
      await this.queryProjectList()
    },
    comFun(type, data) {
      let flag = false
      let ind = 0
      for (let i in this.labelList) {
        if (this.labelList[i].type === type) {
          flag = false
          ind = i
          break
        } else {
          flag = true
        }
      }
      if (flag) {
        this.labelList.push({
          type: type,
          name: data
        })
      } else {
        if (this.labelList.length != 0) {
          this.labelList[ind].name = data
        } else {
          this.labelList.push({
            type: type,
            name: data
          })
        }
      }
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
      if (this.page == 'private') {
        let data = await axios.get("/api/Home/GetItemInfoData?TypeCode=" + code, '', this.baseUrl);
        res = data.data
      }
      else {
        res = await postApi.get("/api/Home/GetItemInfoData?TypeCode=" + code, '', this.baseUrl);
      }
      if (code == 'Parameterization') {
        this.parameterData = res.data
      } else if (code == 'LOD') {
        this.levelData = res.data
      } else if (code == 'Suitplatform') {
        this.platformData = this.getTreeData(res.data)
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
    // 清空条件
    emptyCondition() {
      this.searchForm = {
        Parameterization: '',
        LOD: '',
        Suitplatform: '',
        orderby: 'CreateTime',
        FileName: '',
        classType: '',
        pagesize: 10,
        page: 1
      }
    },
    //切换图览列表
    modeChange(mode) {
      this.pictureMode = mode;
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
    //查看构件详情
    viewInfo(data, type) {
      if (type == 'detail') {
        this.dialogVisible = true
        this.detailsData = data
        this.queryImg(data.iuid)
      }
      else {
        if (this.$modelFileSuffix.concat(this.$ibimFileSuffix).indexOf(data.fileSuffix) == -1) {
          this.dialogVisible = true
          this.detailsData = data
          this.queryImg(data.iuid)
        } else {
          this.showMask = true;
          this.showModel = true;
          let filePath = data.turnPath ? data.turnPath : data.filePath;
          this.FileIUID = data.iuid;
          this.FileUrl = process.env.VUE_APP_ViewOrigin + "/?" + this.$turnEncryptParams(filePath);
          this.sendFileData()
          // this.$viewMode(data)
        }
      }

      this.recordNum(data.iuid, 'examine')

      let logtype = ''

      if (this.page === 'resource') {
        if (type == 'detail') {
          logtype = 'Gjk_Component_details'
        } else {
          logtype = 'Gjk_Component_view'
        }
      }

      // 日志
      let formData = new FormData();
      formData.append('Filename', data.fileName)
      formData.append('logtype', logtype)

      request.post('api/Log/AddFileviewing', formData)
    },
    async queryImg(iuid) {

      var res = await postApi.get("/api/" + this.apiControllerStr + "/GetsinglepublicimgData?IUID=" + iuid, '');
      this.imgData = res.data
    },

    //查询构件图览数据
    async queryProjectList() {
      this.searchForm.datatype = this.page == 'resource' ? 'public' : this.page == 'myComponents' ? 'my' : this.page == 'resourceApprove' ? 'all' : ''
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
      if (this.dialogVisible) {
        this.viewInfo(this.publicData.filter(item => item.iuid == this.detailsData.iuid)[0], 'detail')
      }
      this.total = res.count
    },

    //构件收藏
    async collect(data) {
      let formData = {
        IUID: data.iuid,
        Name: data.fileName,
      };
      var res = await commonApi.buildCollect(formData);
      if (res.code == 1) {
        this.$success(res.msg);
        this.queryProjectList()
        data.collectbit = true
      }
    },
    //取消构件收藏
    async cancelCollect(data) {
      var res = await postApi.post("/api/publiclibrary/publiclibraryBLLCollectionDelete?IUID=" + data.collectIUID, '');
      if (res.code == 1) {
        this.$success(res.msg);
        this.queryProjectList()
        data.collectbit = false
      }
    },

    // 文件处理相关
    //下载
    downLoad(data) {
      if (typeof (data.fullPath) == 'undefined') {
        data.fullPath = ''
      }
      data.fullPath = this.$route.name == 'commonBuildLibrary' ? '公共构件库' : data.fullPath
      this.$downloadFile(data, this);
      this.recordNum(data.iuid, 'download')
    },
    //删除构件
    deleteBuild(type, data) {
      this.$confirm('确认删除').then(() => {
        if (type == false) {
          this.deleteBuildFun(data.iuid)
        } else {
          this.deleteBuildFun(this.detailsData.iuid)
        }
      })
    },
    async deleteBuildFun(iuid) {
      var res = await postApi.get("/api/" + this.apiControllerStr + "/GetsinglepublicimgDelete?IUID=" + iuid, '');
      if (res.code == 1) {
        this.$success(res.msg);
        this.queryProjectList()
        if (this.page == 'private') {
          this.$store.state.app.queryPrivateResourceTree = 'refresh'
        } else {
          this.$store.state.app.queryResourceTree = 'refresh'
        }
        this.dialogVisible = false
      }
    },
    //记录查看、下载次数
    async recordNum(iuid, num) {
      var res = await postApi.get("/api/" + this.apiControllerStr + "/publiclibraryCumulativetimes?IUID=" + iuid + '&type=' + num, '');
    },
    handleClose() {
      this.addVisible = false
      this.handleFile(this.DebrisIUID)
    },
    //清除碎片文件
    async handleFile(iuid) {
      var res = await postApi.get("/api/Home/Getfragmentdelete?IUID=" + iuid, '');
    },
    setImgFile(file, fileList) {
      this.AddForm.imgfile = fileList
    },
    //上传文件
    async submitFile(file) {
      var files = file.target.files
      this.listFiles = files
      if (this.page == 'private') {
        this.listUploadCount = 0
        this.listUploadTotal = files.length
        this.uploadFile()
      } else {
        this.AddForm.FileName = files[0].name
        this.AddForm.FileSize = files[0].size
        let DebrisIUID = this.$NewGuid()
        await this.fileSubt(files[0], 0, DebrisIUID)
      }
      if (this.fileProgress >= 100.00) {
        this.fileProgress = 100
        this.disabled = false
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
      var res
      if (this.page != 'private') {
        res = await commonApi.fileUploadFile(form);
      } else {
        res = await commonApi.privateFileUploadFile(form);
      }

      if (res.code == 0 && res.mergeOk) {
        this.fileProgress = parseInt(Number(res.progress))
        this.AddForm.filePath = res.filePath
        this.showFileName = res.savePathText
        if (this.page == 'private') {
          this.listPercent = 100

          this.listSubmitForm(size, name)
        }

      } else if (res.code == 0 && !res.mergeOk) {
        i = res.number++;
        if (this.page == 'private') {
          this.listPercent = Number(res.progress)
        }
        this.fileProgress = parseInt(Number(res.progress))
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
      if (type == 'ADD') {
        this.isitGlobal = ''
        this.AddForm.oneTypeIuid = [this.nowTreeNode];
        this.AddForm.Parameterization = '' //参数化
        return
      } else {
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
          this.disabled = this.showFileName != '' ? false : true;

          res.data.imgfileData.map(async item => {
            var imageRes = await commonApi.getImageBase64Str(item)
            var raw = this.$dataURLtoFile(imageRes.data.base64Str, imageRes.data.fileName);
            this.AddForm.imgfile.push({
              raw,
              url: this.baseImageUrl + encodeURIComponent(item)
            })
          })
        }
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
        this.dialogVisible = false
        this.rowIuid = ''
        this.$success(res.msg);
        this.queryProjectList()
        if (this.page == 'private') {
          this.$store.state.app.queryPrivateResourceTree = 'refresh'
        } else {
          this.$store.state.app.queryResourceTree = 'refresh'
        }
      }
    },


    // 审批相关
    handleAgree(row) {
      this.$confirm('确定将该构件加入到公共构件库吗？').then(async () => {
        let data = {
          IUID: row.iuid
        }
        let res = await postApi.post("/api/" + this.apiControllerStr + "/EditideatypeAgree", this.$objectToFormData(data))
        if (res.code == 1) {
          this.queryProjectList()
          if (this.page == 'private') {
            this.$store.state.app.queryPrivateResourceTree = 'refresh'
          } else {
            this.$store.state.app.queryResourceTree = 'refresh'
          }
        }
      })
    },
    handleReject(row) {
      this.replyApprove = row
      this.replyDialogVisible = true
    },
    async submitReject() {
      let data = {
        IUID: this.replyApprove.iuid,
        idea: this.reply
      }
      let res = await postApi.post('/api/publiclibrary/EditideatypeReturn', this.$objectToFormData(data))
      if (res.code == 1) {
        this.$success(res.msg)
        this.replyDialogVisible = false
        this.reply = ''
        this.queryProjectList()
      }
    },

    // 页面交互
    mouseover(index) {
      this.btnVisible = true
      this.current = index
    },
    mouseleave() {
      this.btnVisible = false
      this.current = ''
    },
    showQrcode() {
      const h = this.$createElement;
      this.$msgbox({
        title: '帮助中心',
        message: h('div', { class: 'flex column ai-center' }, [
          h('img', { attrs: { src: require('../../../assets/qrcode-kj.png') }, style: 'width:200px;height:200px' }),
          h('div', { style: 'color: #000;margin-top:20px;font-size:16px' }, '扫码联系我们')
        ]),
        showCancelButton: false,
        showConfirmButton: false,
        // confirmButtonText: '确定',
      })
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
