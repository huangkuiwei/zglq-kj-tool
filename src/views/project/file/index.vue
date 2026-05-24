<!-- // 项目页: 项目文件树及文件列表 -->
<template>
  <el-container>
    <div class="flex">
      <mainSideMenu />
      <el-aside
        class="menu-list1"
        :class="{ collapse: isCollapse }"
        :width="isCollapse ? '220px' : '0'"
      >
        <el-menu
          :default-active="currentIuid"
          class="file-menu"
          @select="handleSelect"
        >
          <!--显示项目标题-->
          <div
            class="menu-title flex ai-center jc-between"
            style="height: 59px"
          >
            <el-tooltip
              placement="bottom-start"
              effect="light"
              :content="projectName"
            >
              <div
                class="project-title"
                style="margin-left: 15px"
              >
                {{ projectName }}
              </div>
            </el-tooltip>
            <div
              v-if="!$isRead"
              style="flex-shrink: 0"
            >
              <el-button
                v-if="filePermissionCon.setupbit"
                type="text"
                circle
                style="margin-right: 15px; height: 32px; padding: 0"
                icon="el-icon-plus"
                @click="addGrouping('add')"
              />
            </div>
          </div>
          <!--目录路径-->
          <el-row style="border-top: 1px solid rgb(220, 223, 230); height: 0px" />
          <!--显示文件树-->
          <folder-tree
            v-if="loadID"
            ref="folderTree"
            :project-id="projectId"
            :parent-expand="parentExpand"
            :current-iuid="currentIuid"
            :folder-lists="folderLists"
            @handleLinkEdit="handleLinkEdit"
:file-permission-con="filePermissionCon" :sidebar-menu-list.sync="sidebarMenuList" :tree-empty="treeEmpty" :tree-open-nodes="treeOpenNodes" @handleOpeDelete="handleOpeDelete" @loadSidebarMenuList="loadSidebarMenuList" @saveTreeOpenNodes="saveTreeOpenNodes" @removeTreeOpenNodes="removeTreeOpenNodes" @openMenu="openMenu" @openChildren="openChildren" @handleDeleteFile="handleDeleteFile" @getFolderFullPath="getFolderFullPath" @linkToFilePage="linkToFilePage"
          />
          <!--文档资料时的我的收藏和我的分享-->
          <!--<div v-if="isMyDocument" class="myShareBox">-->
          <!--  <el-menu-item v-for="(route, index) in documentRouteMap" :key="index" :index="'_' + index" style="margin: 5px 0px; padding-left: 25px">-->
          <!--    <div style="width: 100%; display: flex" @click="handleMyDocument(route)">-->
          <!--      <i :class="route.icon"> </i>-->
          <!--      <span style="margin-left: 10px" slot="title">{{ route.name }}</span>-->
          <!--    </div>-->
          <!--  </el-menu-item>-->
          <!--</div>-->
          <div
            v-if="isCollapse && $sideBarLogo"
            class="asideLogo flex ai-center jc-center"
          >
            <img
              draggable="false"
              :src="$sideBarLogo"
              alt=""
            >
          </div>
        </el-menu>
      </el-aside>
    </div>
    <!--右侧项目文件列表区域-->
    <el-container v-if="myDocumentKind == -1">
      <el-main style="background-color: #dcdfe6; overflow-y: hidden">
        <div
          class="app-container background"
          style="margin-left: 1px; padding: 0; height: calc(100vh - 51px)"
        >
          <div
            class="table-box flex"
            style="margin-bottom: 0"
          >
            <div
              style="height: 60px; border-bottom: 1px solid #e5ebf6; padding-right: 20px"
              class="flex jc-between shrink ai-center"
            >
              <div
                class="flex ai-center grow"
                style="padding: 0 20px"
              >
                <el-breadcrumb
                  separator="/"
                  style="display: flex; font-size: 14px; flex-shrink: 0"
                >
                  <el-breadcrumb-item>
                    <a @click="goBack">{{ $t("leftNavs.projects") }}</a>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item>
                    <a @click="initData">
                      <template v-if="projectName.length > 4">
                        <el-tooltip
                          :content="projectName"
                          placement="bottom"
                          effect="dark"
                        >
                          <span>{{ projectName.slice(0, 4) + "…" }}</span>
                        </el-tooltip>
                      </template>
                      <template v-else>{{ projectName }}</template>
                    </a>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item>
                    <a @click="handleMainMenuClick">{{ currentName }}</a>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item v-if="folderLists.length >= 3">
                    <span>...</span>
                  </el-breadcrumb-item>
                  <el-breadcrumb-item
                    v-for="(i, index) in folderLists"
                    v-if="index > folderLists.length - 3"
                    :key="index"
                  >
                    <a @click="folderMenuClick(i, index)">{{ i.name }}</a>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>

              <div
                class="flex wrap ai-center jc-between"
                style="margin-left: auto"
              >
                <div
                  class="btn-group flex ai-center"
                  style="flex-shrink: 0"
                >
                  <!-- 搜索 -->
                  <el-input
                    v-model="searchRules.fileName"
                    class="top-search"
                    style="width: 183px; border: none"
                    size="small"
                    :placeholder="$t('projects.search')"
                    @change="loadData('clearSelect', false)"
                  />

                  <div
                    v-if="!$isRead"
                    class="btn_box flex jc-around"
                    style="padding-left: 10px"
                  >
                    <!-- 新建 -->
                    <!-- <el-popover -->
                    <!--   v-if="filePermissionCon.setupbit == true" -->
                    <!--   v-model="addFilePopVisible" -->
                    <!--   placement="bottom-start" -->
                    <!--   transition="el-zoom-in-top" -->
                    <!--   width="120" -->
                    <!--   trigger="click" -->
                    <!-- > -->
                    <!--   <div -->
                    <!--     class="fileFolderUploadHref" -->
                    <!--     @click="showfolderDialog('addFile')" -->
                    <!--   > -->
                    <!--     新建文件 -->
                    <!--   </div> -->
                    <!--   <div -->
                    <!--     class="fileFolderUploadHref" -->
                    <!--     @click="showfolderDialog('add')" -->
                    <!--   > -->
                    <!--     {{ $t("base.button.newFolder") }} -->
                    <!--   </div> -->
                    <!--   <el-button -->
                    <!--     slot="reference" -->
                    <!--     plain -->
                    <!--     type="primary" -->
                    <!--     size="small" -->
                    <!--     icon="el-icon-plus" -->
                    <!--   > -->
                    <!--     {{ -->
                    <!--       $t("base.button.new") }} -->
                    <!--   </el-button> -->
                    <!-- </el-popover> -->
                    <!-- 上传 -->
                    <!--<el-popover-->
                    <!--  v-if="filePermissionCon.setupbit == true"-->
                    <!--  v-model="uploadFilePopVisible"-->
                    <!--  placement="bottom"-->
                    <!--  transition="el-zoom-in-top"-->
                    <!--  width="120"-->
                    <!--  trigger="click"-->
                    <!--&gt;-->
                    <!--  <div-->
                    <!--    class="fileFolderUploadHref"-->
                    <!--    @click="uploadFilePopVisible = false"-->
                    <!--  >-->
                    <!--    上传文件-->
                    <!--    <input-->
                    <!--      ref="fileUploader"-->
                    <!--      class="fileFolderUploadBtn"-->
                    <!--      type="file"-->
                    <!--      name="file"-->
                    <!--      multiple-->
                    <!--      alt="请选择文件"-->
                    <!--      @change="submitFile($event)"-->
                    <!--    >-->
                    <!--  </div>-->
                    <!--  <div-->
                    <!--    class="fileFolderUploadHref"-->
                    <!--    @click="uploadFilePopVisible = false"-->
                    <!--  >-->
                    <!--    上传文件夹-->
                    <!--    <input-->
                    <!--      class="fileFolderUploadBtn"-->
                    <!--      type="file"-->
                    <!--      name="file"-->
                    <!--      webkitdirectory-->
                    <!--      alt="请选择文件夹"-->
                    <!--      @change="fileFolderUpload($event)"-->
                    <!--    >-->
                    <!--  </div>-->
                    <!--  <el-button-->
                    <!--    slot="reference"-->
                    <!--    size="small"-->
                    <!--    icon="el-icon-upload2"-->
                    <!--  >-->
                    <!--    {{-->
                    <!--      $t("base.button.upload")-->
                    <!--    }}-->
                    <!--  </el-button>-->
                    <!--</el-popover>-->
                    <!-- 桥梁大师项目设置 -->
                    <!-- <template -->
                    <!--   v-if="projectInfo && -->
                    <!--     projectInfo.projectTypeName === '桥梁大师项目' && -->
                    <!--     currentName === '桥梁' && -->
                    <!--     user.userID === projectInfo.creatorID -->
                    <!--   " -->
                    <!-- > -->
                    <!--   <el-dropdown -->
                    <!--     trigger="click" -->
                    <!--     placement="bottom-start" -->
                    <!--   > -->
                    <!--     <el-button -->
                    <!--       size="small" -->
                    <!--       icon="el-icon-s-operation" -->
                    <!--     > -->
                    <!--       设置 -->
                    <!--     </el-button> -->
                    <!--     <el-dropdown-menu slot="dropdown"> -->
                    <!--       <el-dropdown-item @click.native="projectSetting"> -->
                    <!--         工程设置 -->
                    <!--       </el-dropdown-item> -->
                    <!--       &lt;!&ndash; <el-dropdown-item @click.native="bridgeTable">桥梁表</el-dropdown-item> &ndash;&gt; -->
                    <!--       <el-dropdown-item @click.native="taskAllocation"> -->
                    <!--         任务分配 -->
                    <!--       </el-dropdown-item> -->
                    <!--       <el-dropdown-item -->
                    <!--         @click.native=" -->
                    <!--           rightClickItem.iuid = bridgeMasterFolders[0].iuid; -->
                    <!--           permissionSet('', rightClickItem); -->
                    <!--         " -->
                    <!--       > -->
                    <!--         权限设置 -->
                    <!--       </el-dropdown-item> -->
                    <!--     </el-dropdown-menu> -->
                    <!--   </el-dropdown> -->
                    <!-- </template> -->

                    <!-- 下载 -->
                    <template v-if="filePermissionCon.downloadbit">
                      <el-button
                        v-if="tableSelection.length >= 1"
                        size="small"
                        @click="singleDownLoadFun1"
                      >
                        <i
                          class="iconfont icon-download"
                          style="font-size: 12px"
                        />{{ $t('base.button.download') }}
                      </el-button>
                    </template>
                    <!-- 标段 -->
                    <!-- <el-button size="mini" v-if="!isMyDocument && tableSelection.length >= 0" @click="handleSetMainfile" icon="el-icon-setting">标段</el-button> -->
                    <!-- 审批 -->
                    <!--<el-button-->
                    <!--  size="small"-->
                    <!--  :disabled="!canApprove"-->
                    <!--  style="margin-left: 0; height: 32px"-->
                    <!--  icon="el-icon-startworkflow"-->
                    <!--  @click="handleApplyWorkflow"-->
                    <!--&gt;-->
                    <!--  {{ $t("base.button.approve")-->
                    <!--  }}-->
                    <!--</el-button>-->
                    <!-- 分享 -->
                    <!-- <template v-if="filePermissionCon.downloadbit"> -->
                    <!--   <shareMutiple -->
                    <!--     v-if="tableSelection.length >= 1 && $shareMultipleVisible(tableSelection)" -->
                    <!--     :project-id="projectId" -->
                    <!--     :size="'mini'" -->
                    <!--     :rows="tableSelection" -->
                    <!--     @loadWorkflow="loadWorkflow" -->
                    <!--     @loadData="loadData(...$event)" -->
                    <!--   /> -->
                    <!-- </template> -->
                    <!-- 删除 -->
                    <!-- <template v-if="filePermissionCon.deletebit"> -->
                    <!--   <el-button -->
                    <!--     size="small" -->
                    <!--     style="margin-left: 0; height: 32px" -->
                    <!--     type="danger" -->
                    <!--     :disabled="!deleteAble" -->
                    <!--     icon="el-icon-delete" -->
                    <!--     @click="handleDelete" -->
                    <!--   > -->
                    <!--     {{ $t("base.button.delete") }} -->
                    <!--   </el-button> -->
                    <!-- </template> -->

                    <!-- 20220930修改：只要勾选了多个就不展示这5个按钮 -->
                    <!-- <el-button size="mini" style="margin-left: 0" @click="decompression(tableSelection[0])" v-if="tableSelection.length == 1 &&
                      $zipFileSuffix.indexOf(tableSelection[0].fileSuffix) > -1
                    ">
                      <i class="el-icon-folder-opened"></i>解压
                    </el-button> -->
                    <!-- <template v-if="projectInfo.projectTypeName === '桥梁大师项目'"> -->
                    <!--   &lt;!&ndash; 路线数据 &ndash;&gt; -->
                    <!--   <el-button -->
                    <!--     v-if="folderLists[0] && folderLists[0].name === '路线资料'" -->
                    <!--     size="mini" -->
                    <!--     style="margin-left: 0; padding: 0" -->
                    <!--   > -->
                    <!--     <label -->
                    <!--       style="display: inline-block; padding: 9px 15px" -->
                    <!--       for="uploadlxsj" -->
                    <!--     > -->
                    <!--       <i class="el-icon el-icon-upload2" /> -->
                    <!--       导入 -->
                    <!--     </label> -->
                    <!--     <input -->
                    <!--       id="uploadlxsj" -->
                    <!--       style="display: none" -->
                    <!--       class="fileFolderUploadBtn" -->
                    <!--       type="file" -->
                    <!--       accept=".dl,.pmx,.zdm,.hdm,.dmg,.dmx" -->
                    <!--       name="file" -->
                    <!--       multiple -->
                    <!--       alt="导入路线数据" -->
                    <!--       @change="submitFile($event)" -->
                    <!--     > -->
                    <!--   </el-button> -->
                    <!--   &lt;!&ndash; 上部标准图 &ndash;&gt; -->
                    <!--   <el-button -->
                    <!--     v-if="folderLists[0] && folderLists[0].name === '上部标准图'" -->
                    <!--     size="mini" -->
                    <!--     style="margin-left: 0; padding: 0" -->
                    <!--   > -->
                    <!--     <label -->
                    <!--       style="display: inline-block; padding: 9px 15px" -->
                    <!--       for="uploadsbbzt" -->
                    <!--     > -->
                    <!--       <i class="el-icon el-icon-upload2" /> -->
                    <!--       导入 -->
                    <!--     </label> -->
                    <!--     <input -->
                    <!--       id="uploadsbbzt" -->
                    <!--       accept=".dwg" -->
                    <!--       style="display: none" -->
                    <!--       class="fileFolderUploadBtn" -->
                    <!--       type="file" -->
                    <!--       name="file" -->
                    <!--       multiple -->
                    <!--       alt="导入路线数据" -->
                    <!--       @change="submitFile($event)" -->
                    <!--     > -->
                    <!--   </el-button> -->
                    <!--   &lt;!&ndash; 下部标准图 &ndash;&gt; -->
                    <!--   <el-button -->
                    <!--     v-if="folderLists[0] && folderLists[0].name === '下部标准图'" -->
                    <!--     size="mini" -->
                    <!--     style="margin-left: 0; padding: 0" -->
                    <!--   > -->
                    <!--     <label -->
                    <!--       style="display: inline-block; padding: 9px 15px" -->
                    <!--       for="uploadxbbzt" -->
                    <!--     > -->
                    <!--       <i class="el-icon el-icon-upload2" /> -->
                    <!--       导入 -->
                    <!--     </label> -->
                    <!--     <input -->
                    <!--       id="uploadxbbzt" -->
                    <!--       accept=".dwg" -->
                    <!--       style="display: none" -->
                    <!--       class="fileFolderUploadBtn" -->
                    <!--       type="file" -->
                    <!--       name="file" -->
                    <!--       multiple -->
                    <!--       alt="导入路线数据" -->
                    <!--       @change="submitFile($event)" -->
                    <!--     > -->
                    <!--   </el-button> -->
                    <!-- </template> -->
                  </div>
                </div>

                <!-- <multiplePreViewBtn v-if="multiplePreViewVisible" :rows="tableSelection" /> -->
                <!-- <div style="display: flex; margin-right: 10px; position: relative"> -->
                <!--   &lt;!&ndash; <div class="search-box flex ai-center" :class="{ 'show': showSearch }"> -->
                <!--     <el-button type="text" icon="el-icon-search" size="small" style="padding:0 11px" @click="loadData('clearSelect', false)"></el-button> -->
                <!--   </div> &ndash;&gt; -->
                <!--   &lt;!&ndash; <el-button circle :type="searchRules.fileName != '' ? '  primary' : ''" icon="el-icon-search" id="search_btn" size="small" style="margin-left: 0" @click="$store.commit('SET_SHOW_SEARCH', true)"></el-button> &ndash;&gt; -->
                <!--   &lt;!&ndash; 刷新 &ndash;&gt; -->
                <!--   &lt;!&ndash; <el-button circle icon="el-icon-refresh-right" size="small" style="margin-left: 5px" @click="searchRules.fileName = ''; loadData('clearSelect', false)"></el-button> &ndash;&gt; -->
                <!--   &lt;!&ndash; 图览 &ndash;&gt; -->
                <!--   <el-button -->
                <!--     v-if="!pictureMode" -->
                <!--     key="picture" -->
                <!--     icon="el-icon-menu" -->
                <!--     size="small" -->
                <!--     style="margin-left: 5px" -->
                <!--     @click="modeChange(true)" -->
                <!--   > -->
                <!--     {{ $t('base.label.picture') }} -->
                <!--   </el-button> -->
                <!--   &lt;!&ndash; 列表 &ndash;&gt; -->
                <!--   <el-button -->
                <!--     v-else -->
                <!--     key="list" -->
                <!--     icon="el-icon-s-fold" -->
                <!--     size="small" -->
                <!--     style="margin-left: 5px" -->
                <!--     @click="modeChange(false)" -->
                <!--   > -->
                <!--     {{ $t('base.label.list') }} -->
                <!--   </el-button> -->
                <!-- </div> -->
              </div>
            </div>
            <div
              style="overflow: auto; flex-shrink: 0"
              :style="{ height: isBimWorks ? undefined : `calc(100vh - 163px)`, }"
            >
              <!--显示文件列表-->
              <el-row
                v-if="!pictureMode"
                class="table"
                style="width: calc(100% - 40px); margin-left: 20px; margin-top: 12px"
              >
                <el-table
                  ref="multipleTable"
                  class="t-table"
                  row-key="iuid"
                  :header-cell-style="$thStyle"
                  :data="tableData"
                  :height="`calc(100vh - 220px)`"
                  style="width: 100%; overflow-y: scorll; font-size: 14px"
                  @selection-change="handleSelectionChange"
                  @filter-change="filterChange"
                  @sort-change="sortChange"
@clickRow="tableRowClick"
                >
                  <el-table-column
                    :reserve-selection="true"
                    type="selection"
                    align="center"
                    width="55"
                  />
                  <el-table-column
                    prop="fileName"
                    :label="$t('base.button.fileName')"
                    min-width="200"
                    show-overflow-tooltip
                    sortable
                  >
                    <template slot-scope="scope">
                      <div
                        class="flex ai-center"
                        style="font-size: 14px"
                      >
                        <fileIconComponends
                          :full-path="getFolderFullPath"
                          :row="scope.row"
                          :is-bim-works="isBimWorks"
                          :is-in-table="true"
                          @linkToFilePage="linkToFilePage"
                        />
                        <el-tooltip
                          class="item"
                          effect="light"
                          :content="`该文件被${scope.row.checkUserName}签出`"
                          placement="top-start"
                        >
                          <img
                            v-if="scope.row.checkStatus === '1'"
                            src="@/assets/button/suo.svg"
                            alt=""
                            :title="scope.row.checkUserName"
                            style="width: 12px; height: 12px; margin-left: 8px"
                          >
                        </el-tooltip>
                        <el-tag
                          v-if="scope.row.bidSectionNumber"
                          type="edit"
                          size="mini"
                          effect="light"
                          style="margin-left: 8px"
                        >
                          {{ scope.row.bidSectionNumber }}
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('base.formLabel.operation')"
                    width="230"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <div class="flex ai-center jc-center">
                        <!-- TODO 桥梁大师项目测试 -->
                        <!-- <template v-if="projectInfo.projectTypeName === '桥梁大师项目' && currentName === '桥梁' && user.userID === projectInfo.creatorID && folderLists[0] && folderLists[0].name === '全桥布跨图'">
                         <el-tooltip v-if="hasEditableButton(scope.row)" class="tableOpeColMargin" effect="light" content="桥梁大师" placement="top">
                           <i class="el-icon-connection shrink" style="cursor: pointer; font-size: 20px; color: #98A2B4" @click="$modelFileSuffix.concat($ibimFileSuffix).includes(scope.row.fileSuffix.toLowerCase()) &&showTransferView('bridgeMaster', scope.row)" />
                         </el-tooltip>
                        </template> -->
                        <!-- 浏览和编辑 -->
                        <!-- <el-tooltip -->
                        <!--   v-if="filePermissionCon.bimlookbit" -->
                        <!--   class="tableOpeColMargin" -->
                        <!--   effect="light" -->
                        <!--   popper-class="tip-class" -->
                        <!--   content="模型查看" -->
                        <!--   placement="top" -->
                        <!--   style="padding-left: 5px" -->
                        <!-- > -->
                        <!--   <i -->
                        <!--     class="el-icon-view shrink" -->
                        <!--     :style="{ color: isIModelFile(scope.row) ? '#8f9ab4' : '#CCC', }" -->
                        <!--     style=" cursor: pointer; font-size: 20px; margin-top: 3px; display: block; " -->
                        <!--     @click=" isIModelFile(scope.row) && showTransferView($appList.find((item) => item.type == 'bimwindows'), scope.row)" -->
                        <!--   /> -->
                        <!-- </el-tooltip> -->
                        <!-- <i -->
                        <!--   v-else -->
                        <!--   class="el-icon-view shrink tableOpeColMargin" -->
                        <!--   style=" color: #ccc; cursor: not-allowed; font-size: 20px; margin-top: 3px; display: block; " -->
                        <!-- /> -->

                        <!-- 云编辑 -->
                        <!-- <template v-if="filePermissionCon.bimeditbit"> -->
                        <!--   <el-tooltip -->
                        <!--     v-if="hasEditableButton(scope.row) -->
                        <!--     " -->
                        <!--     popper-class="tip-class" -->
                        <!--     class="tableOpeColMargin" -->
                        <!--     effect="light" -->
                        <!--     content="模型编辑" -->
                        <!--     placement="top" -->
                        <!--   > -->
                        <!--     <el-dropdown -->
                        <!--       trigger="click" -->
                        <!--       placement="bottom-start" -->
                        <!--     > -->
                        <!--       <i -->
                        <!--         class="el-icon-model-edit shrink" -->
                        <!--         style="cursor: pointer" -->
                        <!--       /> -->
                        <!--       <el-dropdown-menu slot="dropdown"> -->
                        <!--         <el-dropdown-item -->
                        <!--           v-for="i in $appList.filter( -->
                        <!--             (item) => item.isEdit == true -->
                        <!--           )" -->
                        <!--           v-if="$hasPermi(`projects:editing:${i.type}`)" -->
                        <!--           :key="i.appName" -->
                        <!--           @click.native=" -->
                        <!--             isIModelFile(scope.row) && -->
                        <!--               showTransferView(i, scope.row) -->
                        <!--           " -->
                        <!--         > -->
                        <!--           <div class="flex ai-center jc-between"> -->
                        <!--             <div class="flex ai-center"> -->
                        <!--               <img -->
                        <!--                 style="width: 22px" -->
                        <!--                 :src="i.logo" -->
                        <!--                 alt="" -->
                        <!--               > -->
                        <!--               <span style="margin: 0 15px 0 5px">{{ -->
                        <!--                 i.appName -->
                        <!--               }}</span> -->
                        <!--             </div> -->
                        <!--           </div> -->
                        <!--         </el-dropdown-item> -->
                        <!--       </el-dropdown-menu> -->
                        <!--     </el-dropdown> -->
                        <!--   </el-tooltip> -->
                        <!--   <el-tooltip -->
                        <!--     v-else -->
                        <!--     disabled -->
                        <!--     class="tableOpeColMargin" -->
                        <!--   > -->
                        <!--     <i -->
                        <!--       class="el-icon-model-edit shrink" -->
                        <!--       style="opacity: 0.4; cursor: not-allowed" -->
                        <!--     /> -->
                        <!--   </el-tooltip> -->
                        <!-- </template> -->

                        <!-- <el-tooltip -->
                        <!--   v-if="$shareMultipleVisible([scope.row])" -->
                        <!--   content="分享" -->
                        <!--   class="tableOpeColMargin" -->
                        <!--   popper-class="tip-class" -->
                        <!--   effect="light" -->
                        <!--   placement="top" -->
                        <!-- > -->
                        <!--   <shareMutiple -->
                        <!--     :project-id="projectId" -->
                        <!--     type="list" -->
                        <!--     :rows="[scope.row]" -->
                        <!--     @loadWorkflow="loadWorkflow" -->
                        <!--     @loadData="loadData(...$event)" -->
                        <!--   /> -->
                        <!-- </el-tooltip> -->
                        <!-- <i -->
                        <!--   v-else -->
                        <!--   class="iconfont icon-share shrink tableOpeColMargin" -->
                        <!--   style="opacity: 0.4; font-size: 18px; cursor: not-allowed" -->
                        <!-- /> -->
                        <!-- 导出 -->

                        <template v-if="!$isRead">
                          <!--<template v-if="$hasPermi('projects:filefunction:derive')">-->
                          <!--  <el-dropdown-->
                          <!--    v-if="isIModelFile(scope.row) && scope.row.actionType === '2'"-->
                          <!--    trigger="click"-->
                          <!--    placement="bottom"-->
                          <!--    size="small"-->
                          <!--    style="padding-top: 2px"-->
                          <!--    class="tableOpeColMargin flex"-->
                          <!--    @command="handleExport(...arguments, scope.row)"-->
                          <!--  >-->
                          <!--    <el-tooltip-->
                          <!--      popper-class="tip-class"-->
                          <!--      effect="light"-->
                          <!--      content="导出"-->
                          <!--      placement="top"-->
                          <!--    >-->
                          <!--      <img-->
                          <!--        src="../../../assets/fileExport.svg"-->
                          <!--        class="el-icon-tickets shrink"-->
                          <!--        style="width: 18px; cursor: pointer"-->
                          <!--      >-->
                          <!--    </el-tooltip>-->
                          <!--    <el-dropdown-menu slot="dropdown">-->
                          <!--      <el-dropdown-item command="dgn">-->
                          <!--        dgn-->
                          <!--      </el-dropdown-item>-->
                          <!--      <template v-if="!$isSpace">-->
                          <!--        <el-dropdown-item command="obj">-->
                          <!--          obj-->
                          <!--        </el-dropdown-item>-->
                          <!--        <el-dropdown-item command="gltf">-->
                          <!--          gltf-->
                          <!--        </el-dropdown-item>-->
                          <!--        <el-dropdown-item command="ifc">-->
                          <!--          ifc-->
                          <!--        </el-dropdown-item>-->
                          <!--        <el-dropdown-item command="datasmith">-->
                          <!--          datasmith-->
                          <!--        </el-dropdown-item>-->
                          <!--      </template>-->

                          <!--      <template v-if="$webTitle === '数据资源协同平台'">-->
                          <!--        <el-dropdown-item command="obj">-->
                          <!--          obj-->
                          <!--        </el-dropdown-item>-->
                          <!--        <el-dropdown-item command="ifc">-->
                          <!--          ifc-->
                          <!--        </el-dropdown-item>-->
                          <!--      </template>-->
                          <!--    </el-dropdown-menu>-->
                          <!--  </el-dropdown>-->
                          <!--  <el-tooltip-->
                          <!--    v-else-->
                          <!--    disabled-->
                          <!--    class="tableOpeColMargin"-->
                          <!--  >-->
                          <!--    <img-->
                          <!--      src="../../../assets/fileExport.svg"-->
                          <!--      class="el-icon-tickets shrink"-->
                          <!--      style="width: 18px; cursor: pointer; opacity: 0.4"-->
                          <!--    >-->
                          <!--  </el-tooltip>-->
                          <!--</template>-->
                          <!-- 收藏 -->
                          <!-- <operateColCom :filePermissionCon="filePermissionCon" :row="scope.row" class="tableOpeColMargin" /> -->
                          <!-- 签入签出 -->
                          <!-- <template v-if="!isMyDocument"> -->
                          <!--   <template -->
                          <!--     v-if="$hasPermi('projects:filefunction:checknot') && -->
                          <!--       isIModelFile(scope.row) -->
                          <!--     " -->
                          <!--   > -->
                          <!--     <el-tooltip -->
                          <!--       v-if="scope.row.checkStatus === '1' && -->
                          <!--         scope.row.checkUser === user.userID -->
                          <!--       " -->
                          <!--       popper-class="tip-class" -->
                          <!--       class="tableOpeColMargin" -->
                          <!--       effect="light" -->
                          <!--       content="签入" -->
                          <!--       placement="top" -->
                          <!--     > -->
                          <!--       <i -->
                          <!--         class="el-icon-unlock shrink" -->
                          <!--         style="color: #8f9ab4; cursor: pointer; font-size: 20px" -->
                          <!--         @click="showLockView(scope.row, '0')" -->
                          <!--       /> -->
                          <!--     </el-tooltip> -->
                          <!--     <el-tooltip -->
                          <!--       v-else-if="scope.row.checkStatus === '1' && -->
                          <!--         scope.row.checkUser !== user.userID -->
                          <!--       " -->
                          <!--       disabled -->
                          <!--       class="tableOpeColMargin" -->
                          <!--       effect="light" -->
                          <!--       placement="top" -->
                          <!--     > -->
                          <!--       <i -->
                          <!--         class="el-icon-unlock shrink" -->
                          <!--         style="font-size: 20px; opacity: 0.4; cursor: not-allowed" -->
                          <!--       /> -->
                          <!--     </el-tooltip> -->
                          <!--     <el-tooltip -->
                          <!--       v-if="scope.row.checkStatus === '0' || -->
                          <!--         scope.row.checkStatus === null -->
                          <!--       " -->
                          <!--       popper-class="tip-class" -->
                          <!--       class="tableOpeColMargin" -->
                          <!--       effect="light" -->
                          <!--       content="签出" -->
                          <!--       placement="top" -->
                          <!--     > -->
                          <!--       <i -->
                          <!--         class="el-icon-lock shrink" -->
                          <!--         style="color: #8f9ab4; cursor: pointer; font-size: 20px" -->
                          <!--         @click="showLockView(scope.row, '1')" -->
                          <!--       /> -->
                          <!--     </el-tooltip> -->
                          <!--   </template> -->
                          <!--   <el-tooltip -->
                          <!--     v-else -->
                          <!--     disabled -->
                          <!--     class="tableOpeColMargin" -->
                          <!--     effect="light" -->
                          <!--   > -->
                          <!--     <i -->
                          <!--       class="el-icon-lock shrink" -->
                          <!--       style="font-size: 20px; opacity: 0.4; cursor: not-allowed" -->
                          <!--     /> -->
                          <!--   </el-tooltip> -->
                          <!-- </template> -->

                          <!-- 版本管理 -->
                          <!-- <el-tooltip -->
                          <!--   v-if="filePermissionCon.setupbit == true && -->
                          <!--     scope.row.fileSuffix.toLowerCase() != '' && -->
                          <!--     scope.row.filePath != '' -->
                          <!--   " -->
                          <!--   popper-class="tip-class" -->
                          <!--   class="tableOpeColMargin" -->
                          <!--   effect="light" -->
                          <!--   content="版本管理" -->
                          <!--   placement="top" -->
                          <!-- > -->
                          <!--   <i -->
                          <!--     class="el-icon-version shrink" -->
                          <!--     style="cursor: pointer" -->
                          <!--     @click="versionClick(scope.row)" -->
                          <!--   /> -->
                          <!-- </el-tooltip> -->
                          <!-- <el-tooltip -->
                          <!--   v-else -->
                          <!--   disabled -->
                          <!--   class="tableOpeColMargin" -->
                          <!-- > -->
                          <!--   <i -->
                          <!--     class="el-icon-version shrink" -->
                          <!--     style="opacity: 0.4; cursor: not-allowed" -->
                          <!--   /> -->
                          <!-- </el-tooltip> -->

                          <!-- 下载 -->

                          <template v-if="filePermissionCon.downloadbit">
                            <!--<el-tooltip v-if="scope.row.fileSuffix.toLowerCase() == '.bim'" popper-class="tip-class" class="tableOpeColMargin" effect="light" content="下载" placement="top">-->
                            <!--  <i class="el-icon-download" @click="downLoadBim(scope.row, true)" style="color: #8f9ab4;font-size: 18px;vertical-align: middle;cursor: pointer; "></i>-->
                            <!--</el-tooltip>-->
                            <el-tooltip
                              v-if="scope.row.fileSuffix.toLowerCase() == ''"
                              popper-class="tip-class"
                              class="tableOpeColMargin"
                              effect="light"
                              content="打包下载"
                              placement="top"
                            >
                              <i
                                v-if="!scope.row.downLoading"
                                class="el-icon-download"
                                style="color: #8f9ab4;font-size: 18px;vertical-align: middle;cursor: pointer; "
                                @click="downLoadFun(scope.row)"
                              />
                              <i
                                v-else
                                class="el-icon-loading"
                                style="color: #8f9ab4;font-size: 18px;vertical-align: middle;cursor: pointer; "
                              />
                            </el-tooltip>
                            <el-dropdown
                              v-else
                              trigger="click"
                              placement="bottom-start"
                              @visible-change="getExportList(...arguments, scope.row)"
                              @command="handleDropDownload"
                            >
                              <el-tooltip
                                content="文件下载"
                                placement="top"
                                effect="light"
                                popper-class="tip-class"
                                class="tableOpeColMargin"
                              >
                                <i
                                  class="el-icon-download"
                                  style="color: #8f9ab4; font-size: 18px; vertical-align: middle; cursor: pointer"
                                />
                              </el-tooltip>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="singleDownLoadFun(scope.row)">
                                  下载源文件
                                </el-dropdown-item>
                                <el-dropdown-item
                                  v-if="$modelFileSuffix.includes(scope.row.fileSuffix.toLowerCase())"
                                  @click.native="downLoadBim(scope.row)"
                                >
                                  下载bim文件
                                </el-dropdown-item>
                                <template v-for="el in fileExportList">
                                  <el-dropdown-item :command="el">
                                    {{ el.name }}
                                  </el-dropdown-item>
                                </template>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </template>
                          <i
                            v-else
                            class="el-icon-download downLoadBtn1"
                          />

                          <!-- <el-dropdown -->
                          <!--   trigger="click" -->
                          <!--   placement="bottom-start" -->
                          <!-- > -->
                          <!--   <i -->
                          <!--     class="el-icon-more" -->
                          <!--     style=" -->
                          <!--     color: #8f9ab4; -->
                          <!--     font-size: 18px; -->
                          <!--     vertical-align: middle; -->
                          <!--     cursor: pointer; -->
                          <!--   " -->
                          <!--   /> -->
                          <!--   <el-dropdown-menu slot="dropdown"> -->
                          <!--     &lt;!&ndash; 压缩文件解压 &ndash;&gt; -->

                          <!--     <el-dropdown-item -->
                          <!--       v-if="filePermissionCon.editbit == true && ['.rar', '.zip'].includes(scope.row.fileSuffix.toLowerCase())" -->
                          <!--       @click.native="decompression(scope.row)" -->
                          <!--     > -->
                          <!--       解压 -->
                          <!--     </el-dropdown-item> -->

                          <!--     <el-dropdown-item -->
                          <!--       v-if="filePermissionCon.editbit == true" -->
                          <!--       @click.native="copyTo('move', scope.row)" -->
                          <!--     > -->
                          <!--       {{ $t("projects.operation.move") -->
                          <!--       }} -->
                          <!--     </el-dropdown-item> -->
                          <!--     <el-dropdown-item -->
                          <!--       v-if="filePermissionCon.editbit == true" -->
                          <!--       @click.native="copyToCurrentFolder(scope.row)" -->
                          <!--     > -->
                          <!--       {{ -->
                          <!--         $t("projects.operation.copy") -->
                          <!--       }} -->
                          <!--     </el-dropdown-item> -->
                          <!--     <el-dropdown-item -->
                          <!--       v-if="filePermissionCon.editbit == true" -->
                          <!--       @click.native="copyTo('copy', scope.row)" -->
                          <!--     > -->
                          <!--       {{ -->
                          <!--         $t("projects.operation.copyTo") -->
                          <!--       }} -->
                          <!--     </el-dropdown-item> -->
                          <!--     <el-dropdown-item -->
                          <!--       v-if="filePermissionCon.editbit == true" -->
                          <!--       @click.native="showfolderDialog('reset', scope.row)" -->
                          <!--     > -->
                          <!--       {{ $t("projects.operation.rename") -->
                          <!--       }} -->
                          <!--     </el-dropdown-item> -->
                          <!--     &lt;!&ndash; <el-dropdown-item @click.native="permissionSet('', scope.row)" v-if="scope.row.fileSuffix == '' && scope.row.authorizebit == true">权限设置</el-dropdown-item> &ndash;&gt; -->
                          <!--     <template v-if="isIModelFile(scope.row)"> -->
                          <!--       <el-dropdown-item -->
                          <!--         v-if="$hasPermi('projects:filefunction:display')" -->
                          <!--         @click.native="viewBigScreen(scope.row)" -->
                          <!--       > -->
                          <!--         {{ -->
                          <!--           $t("projects.operation.bigScreen") -->
                          <!--         }} -->
                          <!--       </el-dropdown-item> -->
                          <!--       <el-dropdown-item @click.native="viewBigScreenAndTable(scope.row)"> -->
                          <!--         大屏展示(图表) -->
                          <!--       </el-dropdown-item> -->
                          <!--       <el-dropdown-item -->
                          <!--         v-if="$hasPermi('projects:filefunction:quality')" -->
                          <!--         divided -->
                          <!--         @click.native="showQuality(scope.row)" -->
                          <!--       > -->
                          <!--         {{ $t("projects.operation.quality") -->
                          <!--         }} -->
                          <!--       </el-dropdown-item> -->
                          <!--     </template> -->
                          <!--     <el-dropdown-item -->
                          <!--       v-if="$hasPermi('projects:filefunction:copypath') && -->
                          <!--         $modelFileSuffix3.concat(['.json']).indexOf( -->
                          <!--           scope.row.fileSuffix.toLowerCase() -->
                          <!--         ) != -1 -->
                          <!--       " -->
                          <!--       divided -->
                          <!--       @click.native="copyAddress(scope.row)" -->
                          <!--     > -->
                          <!--       复制实景地址 -->
                          <!--     </el-dropdown-item> -->
                          <!--     <template v-if="isIModelFile(scope.row)"> -->
                          <!--       <el-dropdown-item -->
                          <!--         v-if="$hasPermi('projects:filefunction:copypath') && -->
                          <!--           isIModelFile(scope.row) && -->
                          <!--           user.isadministrator -->
                          <!--         " -->
                          <!--         @click.native="copyPath(scope.row)" -->
                          <!--       > -->
                          <!--         {{ $t("projects.operation.copyPath") -->
                          <!--         }} -->
                          <!--       </el-dropdown-item> -->
                          <!--       <el-dropdown-item -->
                          <!--         v-if="$hasPermi('projects:filefunction:associated')" -->
                          <!--         @click.native="linkModel(scope.row)" -->
                          <!--       > -->
                          <!--         {{ -->
                          <!--           $t("projects.operation.linkDrawing") -->
                          <!--         }} -->
                          <!--       </el-dropdown-item> -->
                          <!--       <el-dropdown-item -->
                          <!--         v-if="$hasPermi('projects:filefunction:viewdrawings')" -->
                          <!--         @click.native="viewLinkModel(scope.row)" -->
                          <!--       > -->
                          <!--         {{ -->
                          <!--           $t("projects.operation.viewDrawing") -->
                          <!--         }} -->
                          <!--       </el-dropdown-item> -->
                          <!--     </template> -->
                          <!--     &lt;!&ndash; <el-dropdown-item v-if="filePermissionCon.deletebit == true && (scope.row.checkStatus === '0' || scope.row.checkStatus === null)" @click.native="handleDeleteFile(scope.row)">{{ $t('base.button.delete') }}</el-dropdown-item> &ndash;&gt; -->
                          <!--     &lt;!&ndash; &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45; &ndash;&gt; -->
                          <!--     <template v-if="filePermissionCon.editbit"> -->
                          <!--       <template -->
                          <!--         v-if="$modelFileSuffix3 -->
                          <!--           .concat($modelFileSuffix) -->
                          <!--           .indexOf(scope.row.fileSuffix.toLowerCase()) != -1 -->
                          <!--         " -->
                          <!--       > -->
                          <!--         <el-dropdown-item -->
                          <!--           divided -->
                          <!--           @click.native=" -->
                          <!--             reTranscoding(scope.row.iuid, undefined, scope.row) -->
                          <!--           " -->
                          <!--         > -->
                          <!--           {{ -->
                          <!--             $t("projects.transcoding.transcoding") -->
                          <!--           }} -->
                          <!--         </el-dropdown-item> -->
                          <!--       </template> -->
                          <!--     </template> -->

                          <!--     <el-dropdown-item -->
                          <!--       divided -->
                          <!--       @click.native=" -->
                          <!--         uploadJsonFile(scope.row) -->
                          <!--       " -->
                          <!--     > -->
                          <!--       上传视图文件 -->
                          <!--     </el-dropdown-item> -->
                          <!--   </el-dropdown-menu> -->
                          <!-- </el-dropdown> -->
                        </template>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('base.button.fileSize')"
                    align="center"
                    width="110"
                  >
                    <template slot-scope="{ row }">
                      <div style="padding-left: 6px">
                        {{ row.fileSize }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('base.button.createTime')"
                    prop="createTime"
                    sortable
                    time-range-boxable
                    align="center"
                    width="180"
                  >
                    <template slot-scope="{ row }">
                      <div style="padding-left: 6px">
                        {{ row.createTime }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('base.button.createPeople')"
                    align="center"
                    width="110"
                  >
                    <template slot-scope="{ row }">
                      <div style="padding-left: 6px">
                        {{ row.userName }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    :filter-check-box-data="$fileStatus"
                    :label="$t('base.button.fileStatus')"
                    width="150"
                  >
                    <template
                      v-if="scope.row.fileSuffix.toLowerCase() != ''"
                      slot-scope="scope"
                    >
                      <div class="flex jc-center">
                        <fileStatusComponends
                          style="margin-right: 5px"
                          :scope="scope"
                        />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="!isMyDocument"
                    align="center"
                    :filter-check-box-data="$fileStatus"
                    :label="$t('base.button.approvalProcess')"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <div class="flex jc-center">
                        <workflowStatusComponends
                          v-if="inWorkflow(scope.row)"
                          :scope="scope"
                          :workflows="workflowData"
                          :project-id="projectId"
                        />
                        <el-tag
                          v-else-if="scope.row.fileSuffix == '' && scope.row.ischeck == true
                          "
                          type="success"
                          size="small"
                          effect="plain"
                        >
                          审批中
                        </el-tag>
                      </div>
                    </template>
                  </el-table-column>
                <!-- <el-table-column prop="fileCheck" align="center" :filterCheckBoxData="$fileStatus" label="模型质量" width="120">
                    <template slot-scope="scope">
                      <div class="flex jc-center">
                        <el-button type="primary" size="mini" @click="showQuality(scope.row)">{{ $t('base.button.view') }}</el-button>
                      </div>
                    </template>
                  </el-table-column> -->
                </el-table>
              </el-row>
              <!--图览显示-->
              <el-row
                v-if="pictureMode"
                class="scrollContainer hide-scroll"
                style="margin-top: 10px"
              >
                <div
                  v-for="item in tableData"
                  :key="item.iuid"
                  class="thumb-box"
                >
                  <fileStatusComponends
                    class="thumb-tabs"
                    :scope="{ row: item }"
                  />
                  <div
                    style="
                      width: 100%;
                      height: 100%;
                      border-radius: 8px;
                      border: 1px solid #ebeef5;
                    "
                  >
                    <!--  @contextmenu.prevent="openMenuImage($event, item)" -->
                    <div
                      style="width: 100%; height: 100%; margin-bottom: 5px"
                      class="flex ai-center jc-center"
                    >
                      <el-image
                        :class="{
                          'bim-image': isBimImage(item),
                          'thumb-image': !isBimImage(item),
                        }"
                        :src="item.thumbnailPath"
                        fit="contain"
                        @click="linkToFilePage(item)"
                      >
                        <div
                          slot="error"
                          class="image-slot"
                        >
                          <img
                            style="width: 100%; height: 100%; border-radius: 8px"
                            :src="defaultProjectImage"
                            @click="linkToFilePage(item)"
                          >
                        </div>
                      </el-image>
                    </div>

                    <div style="width: 100%;display: flex;font-size: 14px;margin-bottom: 5px;text-align: center;overflow: hidden;">
                      <div style="width: 100%; align-items: center; overflow: hidden">
                        <span style="overflow: hidden">
                          {{ item.fileName }}
                        </span>
                        <el-tooltip
                          class="item"
                          effect="light"
                          :content="`该文件被${item.checkUserName}签出`"
                          placement="top-start"
                        >
                          <img
                            v-if="item.checkStatus === '1'"
                            src="@/assets/button/suo.svg"
                            alt=""
                            style="margin-left: 1px; width: 12px; height: 12px"
                          >
                        </el-tooltip>
                      </div>
                      <div class="vertical-button">
                        <!-- 浏览和编辑 -->

                        <el-tooltip
                          v-if="filePermissionCon.bimlookbit"
                          effect="light"
                          popper-class="tip-class"
                          content="模型查看"
                          placement="top"
                        >
                          <div class="one-button">
                            <i
                              class="el-icon-view shrink"
                              :style="{ color: isIModelFile(item) ? '#8f9ab4' : '#CCC', }"
                              style=" cursor: pointer; font-size: 20px; margin-top: 3px; display: block; "
                              @click=" isIModelFile(item) && showTransferView(appList.find((item) => item.type == 'bimwindows'), item)"
                            />
                          </div>
                        </el-tooltip>
                        <i
                          v-else
                          class="el-icon-view shrink"
                          style="
                            color: #ccc;
                            cursor: not-allowed;
                            font-size: 20px;
                            margin-top: 3px;
                            display: block;
                          "
                        />

                        <!-- 云编辑 -->
                        <template v-if="filePermissionCon.bimeditbit">
                          <el-tooltip
                            v-if="hasEditableButton(item)"
                            popper-class="tip-class"
                            effect="light"
                            content="模型编辑"
                            placement="top"
                          >
                            <el-dropdown
                              trigger="click"
                              placement="bottom-start"
                            >
                              <div class="one-button">
                                <i
                                  class="el-icon-model-edit shrink"
                                  style="cursor: pointer"
                                />
                              </div>
                              <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                  v-for="i in $appList.filter(
                                    (item) => item.isEdit == true
                                  )"
                                  v-if="$hasPermi(`projects:editing:${i.type}`)"
                                  :key="i.appName"
                                  @click.native="
                                    isIModelFile(item) && showTransferView(i, item)
                                  "
                                >
                                  <div class="flex ai-center jc-between">
                                    <div class="flex ai-center">
                                      <img
                                        style="width: 22px"
                                        :src="i.logo"
                                        alt=""
                                      >
                                      <span style="margin: 0 15px 0 5px">{{
                                        i.appName
                                      }}</span>
                                    </div>
                                  <!-- <div>{{ i.title }}</div> -->
                                  </div>
                                </el-dropdown-item>
                              </el-dropdown-menu>
                            </el-dropdown>
                          </el-tooltip>
                          <el-tooltip
                            v-else
                            disabled
                          >
                            <div class="one-button">
                              <i
                                class="el-icon-model-edit shrink"
                                style="opacity: 0.4; cursor: not-allowed"
                              />
                            </div>
                          </el-tooltip>
                        </template>
                        <!-- 导出 -->
                        <div
                          v-if="$hasPermi('projects:filefunction:derive') &&
                            isIModelFile(item) &&
                            item.actionType === '2'
                          "
                          class="one-button"
                        >
                          <el-dropdown
                            trigger="click"
                            placement="bottom"
                            size="small"
                            @command="handleExport(...arguments, item)"
                          >
                            <el-tooltip
                              popper-class="tip-class"
                              effect="light"
                              content="导出"
                              placement="top"
                            >
                              <img
                                src="../../../assets/fileExport.svg"
                                class="el-icon-tickets shrink"
                                style="width: 20px; cursor: pointer; margin: 4px 0 0 2px"
                              >
                            </el-tooltip>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item command="dgn">
                                dgn
                              </el-dropdown-item>
                              <template v-if="!$isSpace">
                                <el-dropdown-item command="obj">
                                  obj
                                </el-dropdown-item>
                                <el-dropdown-item command="gltf">
                                  gltf
                                </el-dropdown-item>
                                <el-dropdown-item command="ifc">
                                  ifc
                                </el-dropdown-item>
                                <el-dropdown-item command="datasmith">
                                  datasmith
                                </el-dropdown-item>
                              </template>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                        <!-- <div class="one-button">
                          <operateColCom :filePermissionCon="filePermissionCon" :row="item" />
                        </div> -->
                        <div
                          v-show="!isMyDocument && isIModelFile(item)"
                          class="one-button"
                        >
                          <template v-if="$hasPermi('projects:filefunction:checknot')">
                            <el-tooltip
                              v-if="item.checkStatus === '1' && item.checkUser === user.userID
                              "
                              popper-class="tip-class"
                              effect="light"
                              content="签入"
                              placement="top"
                            >
                              <i
                                class="el-icon-unlock"
                                style="
                                  cursor: pointer;
                                  color: #dedede;
                                  font-size: 20px;
                                  opacity: 0.8;
                                "
                                @click="showLockView(item, '0')"
                              />
                            </el-tooltip>
                            <el-tooltip
                              v-else-if="item.checkStatus === '1' && item.checkUser !== user.userID
                              "
                              disabled
                              popper-class="tip-class"
                              effect="light"
                              placement="top"
                            >
                              <i
                                class="el-icon-unlock"
                                style="font-size: 20px; color: #dedede; opacity: 0.4"
                              />
                            </el-tooltip>
                            <el-tooltip
                              v-if="item.checkStatus === '0' || item.checkStatus === null"
                              popper-class="tip-class"
                              effect="light"
                              content="签出"
                              placement="top"
                            >
                              <i
                                class="el-icon-lock"
                                style="
                                  cursor: pointer;
                                  color: #dedede;
                                  font-size: 20px;
                                  opacity: 0.8;
                                "
                                @click="showLockView(item, '1')"
                              />
                            </el-tooltip>
                          </template>
                        </div>

                        <div
                          v-show="item.fileSuffix.toLowerCase() != '' &&
                            filePermissionCon.setupbit == true &&
                            item.filePath != ''
                          "
                          class="one-button"
                        >
                          <el-tooltip
                            effect="light"
                            content="版本管理"
                            placement="top"
                            popper-class="tip-class"
                          >
                            <i
                              class="el-icon-version"
                              style="cursor: pointer"
                              @click="versionClick(item)"
                            />
                          </el-tooltip>
                        </div>
                        <div class="one-button">
                          <el-dropdown
                            trigger="click"
                            placement="bottom-start"
                          >
                            <i
                              class="el-icon-more"
                              style="font-size: 18px; vertical-align: middle"
                            />
                            <el-dropdown-menu
                              v-if="item.filePath != ''"
                              slot="dropdown"
                            >
                              <el-dropdown-item
                                v-if="filePermissionCon.editbit == true"
                                @click.native="copyTo('move', item)"
                              >
                                {{
                                  $t("projects.operation.move")
                                }}
                              </el-dropdown-item>
                              <el-dropdown-item
                                v-if="item.fileSuffix.toLowerCase() != '' &&
                                  filePermissionCon.downloadbit == true
                                "
                                @click.native="singleDownLoadFun(item)"
                              >
                                下载源文件
                              </el-dropdown-item>
                              <el-dropdown-item
                                v-if="filePermissionCon.editbit == true"
                                @click.native="copyToCurrentFolder(item)"
                              >
                                {{
                                  $t("projects.operation.copy")
                                }}
                              </el-dropdown-item>
                              <el-dropdown-item
                                v-if="filePermissionCon.editbit == true"
                                @click.native="copyTo('copy', item)"
                              >
                                {{
                                  $t("projects.operation.copyTo")
                                }}
                              </el-dropdown-item>
                              <el-dropdown-item
                                v-if="filePermissionCon.editbit == true"
                                @click.native="showfolderDialog('reset', item)"
                              >
                                {{ $t("projects.operation.rename")
                                }}
                              </el-dropdown-item>
                              <!-- <el-dropdown-item @click.native="permissionSet('', item)" v-if="item.fileSuffix.toLowerCase() == '' && item.authorizebit == true">权限设置</el-dropdown-item> -->
                              <template v-if="isIModelFile(item)">
                                <el-dropdown-item
                                  v-if="$hasPermi('projects:filefunction:display')"
                                  divided
                                  @click.native="viewBigScreen(item)"
                                >
                                  {{
                                    $t("projects.operation.bigScreen")
                                  }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                  v-if="$hasPermi('projects:filefunction:quality')"
                                  @click.native="showQuality(item)"
                                >
                                  {{
                                    $t("projects.operation.quality")
                                  }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                  v-if="$hasPermi('projects:filefunction:copypath') &&
                                    $modelFileSuffix3.concat(['.json']).indexOf(
                                      item.fileSuffix.toLowerCase()
                                    ) != -1
                                  "
                                  @click.native="copyAddress(item)"
                                >
                                  复制实景地址
                                </el-dropdown-item>
                                <el-dropdown-item
                                  v-if="$hasPermi('projects:filefunction:copypath') &&
                                    isIModelFile(item) &&
                                    user.isadministrator
                                  "
                                  @click.native="copyPath(item)"
                                >
                                  {{
                                    $t("projects.operation.copyPath")
                                  }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                  v-if="$hasPermi('projects:filefunction:associated')"
                                  @click.native="linkModel(item)"
                                >
                                  {{
                                    $t("projects.operation.linkDrawing")
                                  }}
                                </el-dropdown-item>
                                <el-dropdown-item
                                  v-if="$hasPermi('projects:filefunction:viewdrawings')"
                                  @click.native="viewLinkModel(item)"
                                >
                                  {{
                                    $t("projects.operation.viewDrawing")
                                  }}
                                </el-dropdown-item>
                              </template>
                              <!-- <el-dropdown-item v-if="filePermissionCon.deletebit == true && (item.checkStatus === '0' || item.checkStatus === null)" @click.native="handleDeleteFile(item)">{{ $t('base.button.delete') }}</el-dropdown-item> -->
                              <!-- ------------------------ -->
                              <template v-if="filePermissionCon.editbit">
                                <template
                                  v-if="$modelFileSuffix3
                                    .concat($modelFileSuffix)
                                    .indexOf(item.fileSuffix.toLowerCase()) != -1
                                  "
                                >
                                  <el-dropdown-item
                                    divided
                                    @click.native="
                                      reTranscoding(item.iuid, undefined, item)
                                    "
                                  >
                                    {{
                                      $t("projects.transcoding.transcoding")
                                    }}
                                  </el-dropdown-item>
                                </template>
                              </template>
                            </el-dropdown-menu>
                            <el-dropdown-menu
                              v-if="item.filePath == ''"
                              slot="dropdown"
                            >
                              <el-dropdown-item
                                v-if="item.fileSuffix.toLowerCase() != '' &&
                                  filePermissionCon.downloadbit == true
                                "
                                @click.native="downLoadOssFun(item)"
                              >
                                下载文件
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                      </div>
                    <!--el-tag type="edit" size="mini" effect="light" style="margin-top: 12px" v-if="data.bidSectionNumber">{{data.bidSectionNumber}}</el-tag-->
                    </div>
                  </div>
                </div>
              </el-row>
            </div>

            <div
              style="
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
              "
            >
              <div
                v-show="isBimWorks"
                style="flex-grow: 1; overflow: auto"
              >
                <el-table
                  class="bridge-table"
                  border
                  style="width: calc(100% - 40px); margin: 20px"
                  :data="copyTaskList"
                >
                  <el-table-column
                    show-overflow-tooltip
                    type="index"
                    align="center"
                    :label="$t('base.button.index')"
                    width="70px"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    prop="name"
                    align="center"
                    :label="$t('projects.label.name')"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    prop="briName"
                    align="center"
                    label="桥梁名称"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    prop="spanExpr"
                    align="center"
                    label="跨径"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="中心桩号"
                  >
                    <template #default="{ row }">
                      <span>{{ stationHandler(row.middleStation) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    prop="angle"
                    align="center"
                    label="斜交角度"
                  />
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="桥台类型"
                  >
                    <template #default="{ row }">
                      <span>{{ row.jsondata && row.jsondata.abutType }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="主梁类型"
                  >
                    <template #default="{ row }">
                      <span>{{ row.jsondata && row.jsondata.beamType }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="基础类型"
                  >
                    <template #default="{ row }">
                      <span>{{ row.jsondata && row.jsondata.footType }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="材料类型"
                  >
                    <template #default="{ row }">
                      <span>{{ row.jsondata && row.jsondata.materialType }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="桥墩类型"
                  >
                    <template #default="{ row }">
                      <span>{{ row.jsondata && row.jsondata.pierType }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="结构类型"
                  >
                    <template #default="{ row }">
                      <span>{{ row.jsondata && row.jsondata.structType }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="指派给"
                  >
                    <template slot-scope="{ row }">
                      <span>{{
                        peopleList.find((item) => item.userID === row.userID) &&
                          peopleList.find((item) => item.userID === row.userID).userName
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  style="
                    height: 320px;
                    display: flex;
                    align-items: center;
                    flex-shrink: 0;
                    padding: 0 20px;
                  "
                >
                  <canvas
                    class="canvas"
                    style="width: 100%; height: 100%"
                    @dblclick="onDoubleClick"
                    @mousemove="onMouseMove"
                    @mouseleave="onMouseLeave"
                    @mousedown="onMouseDown"
                    @mouseup="onMouseUp"
                    @wheel="onWheel"
                  />
                </div>
              </div>

              <pagination
                style="flex-shrink: 0"
                :page-total="total"
                :page-index="pageIndex"
                @handleCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"
              />
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container v-if="myDocumentKind == 0">
      <myCollection style="width: 100%" />
    </el-container>
    <el-container v-if="myDocumentKind == 1">
      <myShare style="width: 100%" />
    </el-container>
    <ul
      v-show="clickMenuvisibleImage"
      :style="{ left: left + 'px', top: top + 'px', position: 'fixed' }"
      class="contextmenu"
    >
      <!-- 浏览和编辑 -->
      <li
        v-if="$modelFileSuffix.indexOf(rightClickItem.fileSuffix) != -1 ||
          $ibimFileSuffix.indexOf(rightClickItem.fileSuffix) != -1
        "
        style="color: #8f9ab4"
        class="el-icon-view"
        @click="
          showTransferView(
            $appList.find((item) => item.type == 'bimwindows'),
            rightClickItem
          )
        "
      />
      <li
        v-if="$modelFileSuffix.indexOf(rightClickItem.fileSuffix) != -1 ||
          $ibimFileSuffix.indexOf(rightClickItem.fileSuffix) != -1
        "
        style="color: #8f9ab4"
        class="iconfont icon-zhongmingming"
        @click="
          showTransferView(
            $appList.find((item) => item.type == 'cscmodeler'),
            rightClickItem
          )
        "
      />
      <!-- 分享和收藏 -->
      <li>
        <operateColCom
          class="tableOpeColMargin"
          :row="rightClickItem"
        />
      </li>
      <!-- 压缩文件解压 -->
      <li
        v-if="rightClickItem.fileSuffix === '.zip' || rightClickItem.fileSuffix === '.rar'
        "
        style="color: #8f9ab4"
        class="el-icon-folder-opened"
        @click="decompression(rightClickItem)"
      />
      <!-- 重新转码 -->
      <li
        v-if="((rightClickItem.statusType === '3' || rightClickItem.statusType === '4') &&
          $modelFileSuffix.indexOf(rightClickItem.fileSuffix) != -1 &&
          rightClickItem.actionType === '2') ||
          ($reTransCodeVideo.indexOf(rightClickItem.fileSuffix) !== -1 &&
            rightClickItem.statusType !== '3')
        "
        style="color: #8f9ab4"
        class="el-icon-convert"
        @click="reTranscoding(rightClickItem.iuid, undefined, rightClickItem)"
      />
      <!-- 更多 -->
      <li>
        <el-dropdown>
          <i
            class="iconfont icon-more"
            style="color: #8f9ab4"
          />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="filePermissionCon.editbit == true"
              @click.native="moveCopy('move', rightClickItem)"
            >
              移动到
            </el-dropdown-item>
            <el-dropdown-item
              v-if="filePermissionCon.editbit == true"
              @click.native="moveCopy('copy', rightClickItem)"
            >
              {{
                $t("projects.operation.copyTo") }}
            </el-dropdown-item>
            <el-dropdown-item
              v-if="filePermissionCon.editbit == true"
              @click.native="showfolderDialog('reset', rightClickItem)"
            >
              {{ $t("projects.operation.rename")
              }}
            </el-dropdown-item>
            <el-dropdown-item
              v-if="rightClickItem.fileSuffix != '' && filePermissionCon.setupbit == true"
              style="text-align: center"
              @click.native="versionClick(rightClickItem)"
            >
              版本
            </el-dropdown-item>
            <!-- <el-dropdown-item @click.native="permissionSet('', rightClickItem)" v-if="rightClickItem.fileSuffix == '' && rightClickItem.authorizebit == true">权限设置</el-dropdown-item> -->
            <template
              v-if="rightClickItem.fileSuffix &&
                rightClickItem.fileSuffix.toLowerCase() === '.json'
              "
            >
              <el-dropdown-item @click.native="copyLink(rightClickItem)">
                复制链接
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <!-- 转码工具 -->
      <li
        v-if="$modelFileSuffix.indexOf(rightClickItem.fileSuffix) != -1 &&
          rightClickItem.actionType === '2' &&
          rightClickItem.fileSuffix == '.dgn'
        "
      >
        <el-dropdown @command="handleCommand($event, rightClickItem)">
          <i
            class="el-icon-convert"
            style="color: #8f9ab4"
          />
          <el-dropdown-menu
            v-if="$modelFileSuffix.indexOf(rightClickItem.fileSuffix) != -1 &&
              rightClickItem.actionType === '2' &&
              rightClickItem.fileSuffix == '.dgn'
            "
            slot="dropdown"
          >
            <el-dropdown-item
              v-for="(item, index) in Conversion"
              :key="index"
              :command="item.code + '/' + rightClickItem.iuid"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
      <!-- 文件签入签出 -->
      <li
        v-if="rightClickItem.checkStatus === '1' &&
          rightClickItem.checkUser === (user && user.userID)
        "
        style="color: #8f9ab4"
        class="el-icon-unlock"
        @click="showLockView(rightClickItem, '0')"
      />
      <li
        v-if="rightClickItem.checkStatus === '0' || rightClickItem.checkStatus === null"
        style="color: #8f9ab4"
        class="el-icon-lock"
        @click="showLockView(rightClickItem, '1')"
      />
    </ul>
    <ul
      v-show="clickMenuvisible"
      :style="{ left: left + 'px', top: top + 'px', position: 'fixed' }"
      class="contextmenu"
    >
      <li
        v-if="filePermissionCon.editbit"
        @click="handleLinkEdit(rightClickItem)"
      >
        {{ $t("base.button.edit") }}
      </li>
      <li
        v-if="filePermissionCon.deletebit"
        @click="handleOpeDelete(rightClickItem)"
      >
        {{ $t("base.button.delete") }}
      </li>
      <li
        v-if="filePermissionCon.editbit"
        @click="handleMoveUpDown('Above', rightClickItem)"
      >
        上移
      </li>
      <li
        v-if="filePermissionCon.editbit"
        @click="handleMoveUpDown('Below', rightClickItem)"
      >
        下移
      </li>
    <!-- <li v-if="rightClickItem.authorizebit" @click="permissionSet('leftFile', rightClickItem)">权限设置</li> -->
    </ul>
    <chunkUploader
      ref="chunkUploader"
      :folder-iuid="folderIuid"
      :project-left-menu-active-iuid="currentIuid"
      is-project
      @reloadData="loadData('clearSelect')"
    />
    <!-- 左侧文件夹删除 -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal="true"
      :visible.sync="folderDeleteDialogVisble"
      width="400px"
      style="text-align: center"
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <i
          class="el-icon-warning"
          style="color: #ff9900"
        />
        <span class="title-text">警告</span>
      </div>
      <div>你确定要删除此目录及其下的所有文件嘛?</div>
      <div>(此操作不可恢复)</div>
      <div
        slot="footer"
        class="dialog-footer"
        style="padding-top: 22px"
      >
        <el-button
          style="width: 80px; margin-left: 5px"
          @click="folderDeleteDialogVisble = false"
        >
          {{
            $t("base.button.cancel") }}
        </el-button>
        <el-button
          type="primary"
          style="width: 88px"
          @click="sureDeleteFolder"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 左侧文件夹新建/编辑 -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal="true"
      :title="addEditType === 'add' ? '新建分组' : '编辑分组'"
      :visible.sync="addEditDialogVisble"
      width="400px"
    >
      <el-form
        ref="form"
        :model="fileForm"
        label-width="80px"
      >
        <el-form-item class="left">
          <el-input
            v-model="fileForm.name"
            placeholder="请输入分组名称"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="margin-top: -10px"
      >
        <el-button
          size="small"
          style="width: 80px; margin-left: 5px"
          @click="addEditDialogVisble = false"
        >
          {{
            $t("base.button.cancel") }}
        </el-button>
        <el-button
          size="small"
          type="primary"
          style="width: 88px"
          @click="sureAddEditFolder"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :modal="true"
      :title="folderDialogOpeType === 'reset'
        ? '重命名'
        : folderDialogOpeType === 'add'
          ? '新建文件夹'
          : '新建文件'
      "
      :visible.sync="folderDialogVisble"
      width="400px"
    >
      <el-form
        ref="form"
        :model="folderForm"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="名称：">
          <el-input
            ref="folderNameInput"
            v-model="folderForm.name"
            @keyup.enter.native="onSubmitFolderInfo"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          style="width: 88px"
          @click="onSubmitFolderInfo"
        >
          确认
        </el-button>
        <el-button
          style="width: 80px; margin-left: 5px"
          @click="folderDialogVisble = false"
        >
          {{ $t("base.button.cancel")
          }}
        </el-button>
      </div>
    </el-dialog>
    <versionViewComponeds
      :center-dialog-visible.sync="versionDialogVisible"
      :row-data="versionData"
      :selected-data="selectArray"
      @queryADDVersion="queryADDVersionPost"
      @sureVersion="loadData"
    />
    <bidSectionViewComponeds
      :bid-dialog-visible.sync="bidSectionDialogVisible"
      :row-data="bidSectionData"
      @sureBidSection="loadData('', false)"
      @handleSetMainfile="handleSetMainfile"
    />
    <applyWorkflowViewComponeds
      :dialog-visible.sync="applyWorkflowDialogVisible"
      :row-data="tableSelection"
      :current-project="projectId"
      @refresh="loadData('clearSelect', false)"
      @reload="loadWorkflow"
    />
    <perssionComponends
      :bridge-master-folders="bridgeMasterFolders"
      :is-bridge-master="projectInfo.projectTypeName === '桥梁大师项目'"
      :permission-dialog-visble.sync="setDialogVisible"
      :file-data.sync="perrsionData"
      :file-i-u-i-d="viewFileIuID"
      :operation-type="fileOperationType"
      :inheritbit.sync="inheritbit"
      @onFolderSelectChange="onFolderSelectChange"
      @choseItem="filterData"
@surePermission="surePermissionPost"
    />
    <!-- 移动复制 -->
    <moveCopyComponends
      :move-copy-dialog-visble.sync="moveCopyDialogVisible"
      :move-copy-type="moveCopyType"
      :row-data="rowData"
      :is-resources="zskBoolean"
      @shiftData="shiftData"
    />
    <partOfDeleteSuccess
      :container-visible.sync="pdsVisible"
      :delete-filelist="deleteFilelist"
      :successcount="successcount"
      :failurecount="failurecount"
    />
    <delelteVersionFilesRemindDialog
      :dialog-visible-prop.sync="deleteVersionFilesDialogVisible"
      :version-files="deleteVersionFiles"
      @versionFilesCallBack="deleteVersionFilesCallBack"
    />

    <!-- 文件检查 -->
    <modelFileCheckDialog ref="modelFileCheckRef" />

    <el-dialog
      :close-on-click-modal="false"
      title="工程设置"
      :visible.sync="projectSettingDialog"
      width="500px"
    >
      <el-form label-width="120px">
        <el-form-item label="起点桩号：">
          <el-input
            v-model="projectSettingModel.starting"
            type="number"
            placeholder="请输入起点桩号"
          />
        </el-form-item>

        <el-form-item label="终点桩号：">
          <el-input
            v-model="projectSettingModel.destination"
            type="number"
            placeholder="请输入终点桩号"
          />
        </el-form-item>

        <el-form-item label="桩号前缀：">
          <el-input
            v-model="projectSettingModel.prefix"
            placeholder="请输入桩号前缀"
          />
        </el-form-item>

        <el-form-item label="荷载等级：">
          <el-select
            v-model="projectSettingModel.grade"
            placeholder="请选择荷载等级"
            style="width: 100%"
          >
            <el-option value="公路-Ⅰ级">
              公路-Ⅰ级
            </el-option>
            <el-option value="公路-Ⅱ级">
              公路-Ⅱ级
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公路技术等级：">
          <el-select
            v-model="projectSettingModel.technologygrade"
            placeholder="请选择公路技术等级"
            style="width: 100%"
          >
            <el-option value="高速公路120km/h">
              高速公路120km/h
            </el-option>
            <el-option value="高速公路100km/h">
              高速公路100km/h
            </el-option>
            <el-option value="高速公路80km/h">
              高速公路80km/h
            </el-option>
            <el-option value="一级公路100km/h">
              一级公路100km/h
            </el-option>
            <el-option value="一级公路80km/h">
              一级公路80km/h
            </el-option>
            <el-option value="一级公路60km/h">
              一级公路60km/h
            </el-option>
            <el-option value="二级公路80km/h">
              二级公路80km/h
            </el-option>
            <el-option value="二级公路60km/h">
              二级公路60km/h
            </el-option>
            <el-option value="三级公路40km/h">
              三级公路40km/h
            </el-option>
            <el-option value="三级公路30km/h">
              三级公路30km/h
            </el-option>
            <el-option value="四级公路30km/h">
              四级公路30km/h
            </el-option>
            <el-option value="四级公路20km/h">
              四级公路20km/h
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车道数：">
          <el-select
            v-model="projectSettingModel.laneamount"
            placeholder="请选择车道数"
            style="width: 100%"
          >
            <el-option :value="1">
              1
            </el-option>
            <el-option :value="2">
              2
            </el-option>
            <el-option :value="3">
              3
            </el-option>
            <el-option :value="4">
              4
            </el-option>
            <el-option :value="5">
              5
            </el-option>
            <el-option :value="6">
              6
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="项目净宽：">
          <el-input
            v-model="projectSettingModel.wide"
            type="number"
            placeholder="请输入项目净宽"
          />
        </el-form-item>

        <el-form-item>
          <el-radio-group v-model="projectSettingModel.issingle">
            <el-radio :label="0">
              单幅
            </el-radio>
            <el-radio :label="1">
              双幅
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div style="display: flex; justify-content: flex-end">
        <el-button @click="projectSettingDialog = false">
          {{
            $t("base.button.cancel")
          }}
        </el-button>
        <el-button
          type="primary"
          @click="projectSettingSubmit"
        >
          {{
            $t("base.button.confirm")
          }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="task-assignment-dialog"
      :close-on-click-modal="false"
      title="任务分配"
      :visible.sync="taskAllocationDialog"
      width="1450px"
    >
      <div class="content">
        <!--<div class="principal" style="display: flex; align-items: center">-->
        <!--  <span>项目负责人：</span>-->
        <!--  <el-select></el-select>-->
        <!--</div>-->

        <el-table :data="taskList">
          <el-table-column
            type="index"
            :label="$t('base.button.index')"
          />
          <el-table-column
            prop="name"
            align="center"
            :label="$t('projects.label.name')"
          />
          <el-table-column
            prop="briName"
            align="center"
            label="桥梁名称"
          />
          <el-table-column
            prop="spanExpr"
            align="center"
            label="跨径"
          />
          <el-table-column
            align="center"
            label="中心桩号"
          >
            <template #default="{ row }">
              <span>{{ stationHandler(row.middleStation) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="angle"
            align="center"
            label="斜交角度"
          />
          <el-table-column
            align="center"
            label="桥台类型"
          >
            <template #default="{ row }">
              <span>{{ row.jsondata && row.jsondata.abutType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="主梁类型"
          >
            <template #default="{ row }">
              <span>{{ row.jsondata && row.jsondata.beamType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="基础类型"
          >
            <template #default="{ row }">
              <span>{{ row.jsondata && row.jsondata.footType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="材料类型"
          >
            <template #default="{ row }">
              <span>{{ row.jsondata && row.jsondata.materialType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="桥墩类型"
          >
            <template #default="{ row }">
              <span>{{ row.jsondata && row.jsondata.pierType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="结构类型"
          >
            <template #default="{ row }">
              <span>{{ row.jsondata && row.jsondata.structType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="指派给"
          >
            <template slot-scope="{ row }">
              <el-select v-model="row.userID">
                <el-option
                  v-for="item of peopleList"
                  :key="item.userID"
                  :value="item.userID"
                  :label="item.userName"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>

      <!--<canvas class="canvas" style="width: 100%"></canvas>-->
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 15px">
        <el-button @click="taskAllocationDialog = false">
          {{ $t("base.button.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="taskAllocationSubmit"
        >
          {{ $t("base.button.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <downloadBtn
      ref="download"
      :rows="rowData"
      style="display: none"
      :full-path="getFolderFullPath"
      :download-dialog-visble="downloadDialogVisble"
      @clearSelect="clearSelect"
      @clearLoading="clearLoading"
    />

    <linkModelDialog
      v-if="linkModelDialog"
      :visible.sync="linkModelDialog"
      :table-selection="rowData"
      :project-id="projectId"
      :parent-expand="parentExpand"
      :current-iuid="currentIuid"
      :folder-lists="folderLists"
      :file-permission-con="filePermissionCon"
      :sidebar-menu-list.sync="sidebarMenuList"
      :tree-empty="treeEmpty"
:tree-open-nodes="treeOpenNodes"
    />

    <div
      v-if="showLinkModel"
      class="link-model-dialog"
      style="
        position: fixed;
        display: flex;
        align-items: center;
        z-index: 999;
        top: 49px;
        left: 281px;
        width: calc(100vw - 281px);
        height: calc(100vh - 49px);
      "
    >
      <iframe
        ref="imodelIframe1"
        style="width: 50%; height: 100%"
        :src="modelUrl(sourceFileRow)"
        frameborder="0"
        @load="sendFileData('imodelIframe1', sourceFileRow)"
      />
      <iframe
        ref="imodelIframe2"
        style="width: 50%; height: 100%"
        :src="modelUrl(dwgFileRow)"
        frameborder="0"
        @load="sendFileData('imodelIframe2', dwgFileRow)"
      />
    </div>

    <applyWorkflowShare
      v-if="applyWorkflowDialogVisible1"
      :dialog-visible.sync="applyWorkflowDialogVisible1"
      :row-data="currentRow"
      :isdownload="isdownload"
      :current-project="projectId"
    />

    <applyWorkflowShare2
      v-if="applyWorkflowDialogVisible2"
      :dialog-visible.sync="applyWorkflowDialogVisible2"
      :row-data="tableSelection"
      :isdownload="isdownload"
      :current-project="projectId"
    />
  </el-container>
</template>
<script>
import projectAllApi from "@/api/project/all/index";
import { mapGetters } from "vuex";
import perssionComponends from "@/components/permissionsSet";
import projectFileApi from "@/api/project/file";
import postApi from "@/api/document/indexApi.js";
import chunkUploader from "@/components/ChunkUploader/trigger"; //分片上传触发器
import fileStatusComponends from "@/components/FileStatus";
import workflowStatusComponends from "@/components/WorkflowStatus";
import fileIconComponends from "@/components/fileIcon";
import folderTree from "@/views/project/file/folderTree.vue";
import operateColCom from "@/components/operateColCom";
import pagination from "@/components/pagination/index";
import shareMutiple from "@/components/Share/shareBtn_mutiple";
import versionViewComponeds from "@/components/versionView";
import bidSectionViewComponeds from "@/components/bidSectionView";
import applyWorkflowViewComponeds from "@/components/applyWorkflowView.vue";
import downloadBtn from "@/components/PreViewAndlistComBtn/downloadButton";
import downloadBtnProject from "@/components/PreViewAndlistComBtn/downloadButtonProject";
import moveCopyComponends from "@/components/moveCopyCom";
import partOfDeleteSuccess from "@/components/partOfDeleteSuccess";
import delelteVersionFilesRemindDialog from "@/components/DeleteRemindAndImodelVersions/versionFiles";
import multiplePreViewBtn from "@/components/Button/multiplepreViewBtn";
import modelFileCheckDialog from "@/components/Dialog/modelFileCheckDialog";
import request from "@/utils/request";
import { closemodel, closemodelCallback } from "@/utils/CloseModel";
import { decrypt, encrypt } from "@/utils";
// import { toTree } from "@/utils/toTree";
import myCollection from "../Document/myCollection/index";
import myShare from "../Document/myShare/index";
import qs from "qs";
import {
  LineSegment3d,
  Point2d,
  Point3d,
  Vector2d,
  Vector3d,
} from "@itwin/core-geometry";
import linkModelDialog from "@/components/Dialog/LinkModelDialog.vue";
import applyWorkflowShare from "./applyWorkflowShare.vue";
import applyWorkflowShare2 from "./applyWorkflowShare2.vue";
import store from '@/store'

export default {
  components: {
    shareMutiple,
    chunkUploader,
    fileStatusComponends,
    workflowStatusComponends,
    fileIconComponends,
    folderTree,
    operateColCom,
    pagination,
    versionViewComponeds,
    bidSectionViewComponeds,
    applyWorkflowViewComponeds,
    downloadBtn,
    downloadBtnProject,
    perssionComponends,
    moveCopyComponends,
    partOfDeleteSuccess,
    delelteVersionFilesRemindDialog,
    multiplePreViewBtn,
    myCollection,
    myShare,
    modelFileCheckDialog,
    linkModelDialog,
    applyWorkflowShare,
    applyWorkflowShare2
  },
  computed: {
    ...mapGetters([
      "clientHeight",
      "showSearch",
      "signalRTableData",
      "user",
      "isCollapse",
      "clientWidth",
      "menus",
    ]),
    canApprove() {
      let flag = false;
      if (!this.isMyDocument && this.tableSelection.length > 0) {
        let imodelFiles = this.tableSelection.filter(
          (item) => this.$modelFileSuffix.concat(this.$ibimFileSuffix).includes(
            item.fileSuffix.toLowerCase()
          )
        )

        if (!imodelFiles.length) {
          return false
        }

        if (imodelFiles.every(item => (item.statusType === '3' || item.fileSuffix === '.bim'))) {
          flag = true
        } else {
          flag = true
        }
      }
      return flag;
    },
    deleteAble() {
      if (this.tableSelection.length < 1) {
        return false;
      } else {
        if (
          this.tableSelection.filter((item) => item.creatorID == this.user.userID)
            .length == this.tableSelection.length
        ) {
          return true;
        } else if (this.filePermissionCon.deletebit) {
          return true;
        } else {
          return false;
        }
      }
    },
    // 是否是在“文档资料”
    isMyDocument() {
      return this.$route.query.isDoc == "1";
    },
    isBimWorks() {
      let flag = false;
      // if (this.folderLists.length > 0) {
      //   if (
      //     this.projectInfo.projectTypeName === "桥梁大师项目" &&
      //     this.folderLists[0].name === "全桥布跨图"
      //   ) {
      //     flag = true;
      //     this.onVisibilitychange();
      //   }
      // }
      return flag
    },

    modelUrl() {
      return (row) =>
        process.env.VUE_APP_GisIframeOrigin +
        "/?" +
        encodeURIComponent(row.turnPath || row.filePath) +
        "?forViewBim";
    },
  },
  watch: {
    $route(to, from) {
      this.handleCreated();
    },
    folderIuid(val) {
      this.clearSelect();
    },
    signalRTableData() {
      this.loadData();
    },
    folderDialogVisble() {
      if (
        this.folderDialogVisble &&
        (this.folderDialogOpeType === "add" || this.folderDialogOpeType === "addFile")
      ) {
        this.$nextTick(() => {
          this.$refs["folderNameInput"].focus();
        });
      }
    },
    clickMenuvisible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    clickMenuvisibleImage(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenuImage);
      } else {
        document.body.removeEventListener("click", this.closeMenuImage);
      }
    },

    projectSettingDialog(value) {
      if (value) {
        let params = new FormData();
        params.set("Projectiuid", this.projectId);

        request.post("/api/Bridgeport/GetProjectsetup", params).then((res) => {
          if (res.code === 1) {
            if (!res.data.laneamount) {
              res.data.laneamount = undefined;
            }

            if (!res.data.iuid) {
              this.projectSettingModel = {
                starting: 0,
                destination: 1000000,
                prefix: undefined,
                grade: "公路-Ⅰ级",
                technologygrade: "高速公路100km/h",
                laneamount: 2,
                wide: 12,
                issingle: 1,
              };
            } else {
              this.projectSettingModel = res.data;
            }
          }
        });
      }
    },

    taskAllocationDialog(value) {
      if (value) {
        let params = new FormData();
        params.set("Projectiuid", this.projectId);

        request.post("/api/Bridgeport/GetSetQueryData", params).then((res) => {
          res.data.forEach((item) => {
            if (item.jsondata) {
              item.jsondata = JSON.parse(item.jsondata);
            }
          });

          this.taskList = res.data;
          this.copyTaskList = JSON.parse(JSON.stringify(res.data));
        });
      }
    },
  },
  data() {
    return {
      rowData: [],
      fileExportList: [],
      loadID: false,
      orderBy: "DESC",
      exportLoading: false,
      addFilePopVisible: false,
      uploadFilePopVisible: false,
      exportFilePopVisible: false,
      parentExpand: false,
      showCopyVisible: false,
      tableRow: "",
      treeEmpty: "数据加载中",
      clickMenuvisibleImage: false,
      defaultProjectImage: require("@/assets/projectDefaultImg.png"),
      hasBimImage: false,
      pictureMode: false,
      downloadDialogVisble: false,
      pdsVisible: false,
      deleteFilelist: [],
      successcount: 0,
      failurecount: 0,
      clickMenuvisible: false,
      top: 0,
      left: 0,
      rightClickItem: {
        isCreator: 0,
      },
      leftFileIUID: "",
      filePermissionCon: {},
      folderDeleteDialogVisble: false,
      addEditDialogVisble: false,
      addEditType: null,
      fileForm: {
        name: "",
        oldPlaceholder: "",
      },
      setDialogVisible: false,
      projectIsPictureMode: null,
      sourcePath: null,
      folderIuid: "",
      projectId: "",
      projectName: "",

      // 当前文件目录树node数据
      currentName: "",
      currentIuid: "",
      currentNode: {},
      treeInit: true,
      treeOpenNodes: [], //记录打开的节点

      folderLists: [],
      menuActiveName: null,
      menuClick: false,
      sidebarMenuList: null,
      tableData: [],
      tableSelection: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      uploadUrl: process.env.VUE_APP_BASE_API + "/api/ProjectManagement/FileuploadAdd",
      uploadLoading: false,
      folderDialogVisble: false,
      folderForm: {
        name: "",
        oldPlaceholder: "",
      },
      Conversion: [],
      locationRowIndex: null,
      elementNode: null,
      fileList: [],
      folderDialogOpeType: null,
      fileName: "",
      moveCopyType: null,
      treeIsvisible: null,
      data: [],
      sameFileData: [],
      defaultProps: {
        children: "children",
        label: "label",
        show: true,
      },
      isloading: false,
      reloadNameDialogVisible: false,
      moveCopyDialogVisible: false,
      sameFileDialogVisible: false,
      activityindex: 0,
      allRadio: "",
      radioSelectedId: "",
      numType: "",
      allData: [],
      folderDialogIndex: "",
      folderDialogAddType: "",
      leftFileMainIuid: "",
      slectedClick: "",
      uploadDialogVisible: false,
      versionDialogVisible: false,
      bidSectionDialogVisible: false,
      applyWorkflowDialogVisible: false,
      applyWorkflowDialogVisible1: false,
      applyWorkflowDialogVisible2: false,
      currentRow: [],
      isdownload: null,
      workflowForm: {
        workflowName: "",
        responseUsers: "",
        finishDate: null,
      },
      projectInfo: {
        projectTypeName: null,
        creatorName: "",
      },
      workflowData: [], // 项目所有的工作流程
      versionData: [],
      selectArray: [],
      bidSectionData: {},
      perrsionData: [],
      viewFileIuID: "",
      zskBoolean: false,
      fileOperationType: "",
      deleteVersionFiles: [],
      deleteVersionFilesDialogVisible: false,
      multiplePreViewVisible: false,
      searchRules: {
        fileName: "",
      },
      projectFileFilterCallBackRules: [],
      sortColumn: {
        prop: "createTime",
        order: "desc",
      },
      inheritbit: false,
      retryCount: 0,
      lastRetryTime: Date.now(),
      hoverBtn: undefined,
      baseUrl: process.env.VUE_APP_BASE_API,
      CheckStatusIuid: null,
      CheckStatus: null,
      documentRouteMap: [
        {
          id: 0,
          path: "/myCollection",
          name: "我的收藏",
          icon: "iconfont icon-quxiaoshoucang",
        },
        {
          id: 1,
          path: "/myShare",
          name: "我的分享",
          icon: "iconfont icon-share",
        },
      ],
      mainFileIuid: "",
      myDocumentKind: -1,
      projectSettingDialog: false,
      taskAllocationDialog: false,
      projectSettingModel: {
        starting: undefined,
        destination: undefined,
        prefix: undefined,
        grade: undefined,
        technologygrade: undefined,
        laneamount: undefined,
        wide: undefined,
        issingle: undefined,
      },
      taskList: [],
      copyTaskList: [],
      peopleList: [],
      bridgeMasterFolders: [],
      roadData: {},
      dlData: [],
      dmgData: {},
      zdmData: {},
      dmgPoints: [],
      zdmPoints: [],
      autoScale: true,
      scalex: 1,
      scaley: 1,
      inputScalex: 1,
      inputScaley: 1,
      cx: 1,
      cy: 1,
      minPt: [1e10, 1e10],
      maxPt: [-1e10, -1e10],
      allImages: [],
      m_zdms: [],
      downPt: Point2d.createZero(),
      linkModelDialog: false,
      showLinkModel: false,
      sourceFileRow: {},
      dwgFileRow: {},
      loading: null,
      loadModelNum: 0,
    };
  },
  created() {
    this.handleCreated();
    if (!this.isMyDocument) {
      this.loadWorkflow();
    }

    // if (this.projectInfo.projectTypeName === "桥梁大师项目") {
    //   let params = new FormData();
    //   params.set("Projectiuid", this.projectId);
    //   request.post("/api/Bridgeport/GetUsersData", params).then((res) => {
    //     this.peopleList = res.data;
    //   });
    // }
    // this.onVisibilitychange()

    this.$iframeListener((res) => {
      if (res.data.command === "loadedImodel") {
        this.loadModelNum += 1;

        if (this.loadModelNum % 2 === 0) {
          this.loading && this.loading.close();
        }
      }

      if (res.data.command === "ImodelClose") {
        this.showLinkModel = false;
      }

      if (res.data.command === "beforeImodelClose") {
        if (document.querySelector(".link-model-dialog")) {
          this.loading = this.$loading({
            target: document.querySelector(".link-model-dialog"),
            background: "#ffffff",
          });
        }
        if (this.$refs.imodelIframe2) {
          this.$iframePostMes(this.$refs.imodelIframe2.contentWindow, "ImodelClose", null);
        }
      }
    });
  },
  async mounted() {
    // document.addEventListener("visibilitychange", this.onVisibilitychange);

    //-------------------chunkUploader组件必须----------------------------------
    document.addEventListener("dragenter", this.changeUploadDialogVisible, false);
    document.addEventListener("dragleave", this.changeUploadDialogVisible, false);
    document.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    document.addEventListener("drop", this.changeUploadDialogVisible, false);
    //-------------------chunkUploader组件必须----------------------------------
  },
  destroyed() {
    // document.removeEventListener("visibilitychange", this.onVisibilitychange);

    //-------------------chunkUploader组件必须----------------------------------
    document.removeEventListener("dragenter", this.changeUploadDialogVisible);
    document.removeEventListener("dragleave", this.changeUploadDialogVisible);
    document.removeEventListener("drop", this.changeUploadDialogVisible);
    //-------------------chunkUploader组件必须----------------------------------
  },
  methods: {
    uploadJsonFile(item) {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.addEventListener('change', (e) => {
        let file = e.target.files[0]

        if (file.type !== 'application/json') {
          this.$message('请选择json文件进行上传')
          return
        }

        let filePath = item.filePath.split('/').slice(0, item.filePath.split('/').length - 1).join('/') + '/ESV'
        let fileName = item.filePath.split('/').at(-1).split('.')[0]

        let name = file.name.toLowerCase().replace(item.fileName.split('.')[0].toLowerCase(), fileName)

        let formData = new FormData();
        formData.append("File", file);
        formData.append("filePath", encrypt(filePath));
        formData.append("fileName", name);

        let loading = this.$loading({
          text: '正在上传...'
        })

        request.post('api/imodelproject/imodelfileAdd', formData).then((res) => {
          if (res.code === 1) {
            this.$message('上传成功')
          }
        }).finally(() => {
          loading.close()
        })
      })
      input.click()
    },

    hasPerm(item) { },

    initData() {
      this.pageIndex = 1;
      this.folderLists = [];
      this.currentIuid = this.$refs["folderTree"].rootNode.childNodes[0].data.iuid;
      this.currentName = this.$refs["folderTree"].rootNode.childNodes[0].data.fileName;
      this.folderIuid = "";
      this.loadData();
    },

    // 获取导出结果
    async getExportList(event, row) {
      // event为boolean true表示展开下拉
      if (event) {
        this.currentRow = [row];
        this.fileExportList = [];

        let formData = new FormData();
        formData.append("IUID", row.iuid);
        let res = await postApi.post("/api/imodel/GetFileexportData", formData);
        if (res.code == 1) {
          this.fileExportList = res.data;
          this.$forceUpdate();
        }
      }
    },
    handleDropDownload(el) {
      if (el) {
        this.downLoadOssFun(el);
      }
    },
    // 文件下载
    downLoadFun(row) {
      this.currentRow = [row]
      this.isdownload = '.zip'
      let formData = new FormData();
      formData.append("IUID", row.iuid);
      formData.append("downloadType", this.isdownload);

      request.post('api/ProjectFile/GetDownloadtype', formData).then((res) => {
        if (res.code === 1) {
          this.applyWorkflowDialogVisible1 = true
        } else if (res.code === 2) {
          row.downLoading = true
          this.rowData = [row];
          this.$nextTick(() => {
            this.$refs["download"].download();
          });
        } else {
          this.$message.error(res.msg);
        }
      })
    },

    singleDownLoadFun1() {
      this.tableSelection.forEach(row => {
        this.currentRow = [row]
        this.isdownload = '.'
        let formData = new FormData();
        formData.append("IUID", row.iuid);
        // formData.append("downloadType", this.isdownload);

        request.post('api/ProjectFile/GetDownloadtype', formData).then((res) => {
          if (res.code === 1) {
            this.applyWorkflowDialogVisible2 = true
          } else if (res.code === 2) {
            this.rowData = row;
            this.$nextTick(() => {
              this.$refs["download"].singleFileDownload();
            });
          } else {
            this.$message.error(res.msg);
          }
        })
      })
    },

    // 单文件下载
    singleDownLoadFun(row) {
      this.currentRow = [row]
      this.isdownload = '.'
      let formData = new FormData();
      formData.append("IUID", row.iuid);
      formData.append("downloadType", this.isdownload);

      request.post('api/ProjectFile/GetDownloadtype', formData).then((res) => {
        if (res.code === 1) {
          this.applyWorkflowDialogVisible1 = true
        } else if (res.code === 2) {
          this.rowData = row;
          this.$nextTick(() => {
            this.$refs["download"].singleFileDownload();
          });
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // bim文件下载
    downLoadBim(row) {
      this.currentRow = [row]
      this.isdownload = '.bim'
      let formData = new FormData();
      formData.append("IUID", row.iuid);
      formData.append("downloadType", this.isdownload);

      request.post('api/ProjectFile/GetDownloadtype', formData).then((res) => {
        if (res.code === 1) {
          this.applyWorkflowDialogVisible1 = true
        } else if (res.code === 2) {
          this.rowData = row;
          this.$nextTick(() => {
            this.$refs["download"].downLoadBim();
          });
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    // 导出文件下载
    async downLoadOssFun(row) {
      this.currentRow = [{ ...this.currentRow[0], iuid: row.iuid }]

      if (row.name.includes('dgn')) {
        this.isdownload = '.dgn'
      } else if (row.name.includes('obj')) {
        this.isdownload = '.obj'
      } else if (row.name.includes('gltf')) {
        this.isdownload = '.gltf'
      } else if (row.name.includes('ifc')) {
        this.isdownload = '.ifc'
      } else if (row.name.includes('datasmith')) {
        this.isdownload = '.datasmith'
      }

      let formData = new FormData();
      formData.append("IUID", row.iuid);
      formData.append("downloadType", this.isdownload);

      request.post('api/ProjectFile/GetDownloadtype', formData).then(async (res) => {
        if (res.code === 1) {
          this.applyWorkflowDialogVisible1 = true
        } else if (res.code === 2) {
          let res1 = await postApi.get("/api/Home/GetOssObsUrlData?IUID=" + row.iuid);
          if (res1.code == 1) {
            let url = new URL(res1.data)
            let fileName = url.searchParams.get('IUID') + '.7z'

            // 文件传输面板
            this.$store.dispatch("ChangeUploderVisible", "show");
            this.$store.commit("CHANGE_UPLOADERTAB_INDEX", 2);
            let downLoadData = {
              fileName: fileName,
              fileSize: '计算中',
              fullPath: res1.data,
              downloadTime: this.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
              progress: 0,
              fileSuffix: '.' + fileName.split('.')[fileName.split('.').length - 1],
            };
            this.$store.commit("UPDATEDOWNLOADFILEDATA_CLONE", downLoadData);

            request.get(res1.data, {
              responseType: "blob",
              onDownloadProgress: (e) => {
                downLoadData.fileSize = Math.round(e.total / 1024 / 1024) + 'M'

                let progress = e.loaded / e.total;
                downLoadData.progress = Math.round(progress * 100);
              }
            }).then(res3 => {
              if (res3.type === 'application/json') {
                let blob = new Blob([res3], { type: '' });
                let reader = new FileReader();

                reader.onloadend = (event) => {
                  let res = JSON.parse(event.target.result);
                  this.$message.error(res.msg);
                }

                reader.readAsText(blob);
              } else {
                let blob = new Blob([res3], { type: '' });
                let elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                let href = window.URL.createObjectURL(blob);
                elink.href = href;
                document.body.appendChild(elink);
                elink.click();
                document.body.removeChild(elink);
                window.URL.revokeObjectURL(href);
              }
            })
          }
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    renameAble(row) {
      return (
        this.filePermissionCon.editbit == true &&
        ((row.checkStatus === "1" && row.checkUser === (this.user && this.user.userID)) ||
          row.checkStatus === "0" ||
          row.checkStatus === null)
      );
    },
    isIModelFile(file) {
      return (
        this.$modelFileSuffix
          .concat(this.$ibimFileSuffix)
          .indexOf(file.fileSuffix.toLowerCase()) != -1
      );
    },
    copyPath(item) {
      let path = this.$turnEncryptParams(item.turnPath || item.filePath);
      let input = document.createElement("input");
      input.value = path;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },

    linkModel(row) {
      this.rowData = [row];
      this.linkModelDialog = true;
    },

    viewLinkModel(row) {
      this.sourceFileRow = { ...row };

      let formData = new FormData();
      formData.append("IUID", row.iuid);

      request.post("api/imodel/GetFileconsult", formData).then((res) => {
        if (res.code === 1) {
          let sonlist = res.data.sonlist;

          if (sonlist.length) {
            sonlist.forEach((item) => {
              item.filePath = decrypt(item.filePath || "");
              item.turnPath = decrypt(item.turnPath || "");
            });

            this.dwgFileRow = sonlist[0];
            this.showLinkModel = true;

            setTimeout(() => {
              this.loading = this.$loading({
                target: document.querySelector(".link-model-dialog"),
                background: "#ffffff",
              });
            }, 0);
          } else {
            this.$message.warning("该文件暂未关联dwg文件");
          }
        }
      });
    },

    sendFileData(imodelIframe, row) {
      this.$iframePostMes(this.$refs[imodelIframe].contentWindow, "CurrentFile", row);

      if (imodelIframe === "imodelIframe1") {
        this.$iframePostMes(this.$refs[imodelIframe].contentWindow, "comparisonData", {
          version: 1,
        });
      }

      if (imodelIframe === "imodelIframe2") {
        this.$iframePostMes(this.$refs[imodelIframe].contentWindow, "comparisonData", {
          version: 2,
        });
      }
    },

    async handleCreated() {
      this.projectId = this.$route.query.projectId;
      this.projectInfo = await this.$store.dispatch("queryRecentlyProject");
      this.querySelectConversion();
      this.projectIsPictureMode = this.$route.query.projectIsPictureMode;
      this.sourcePath = this.$route.query.path;
      this.projectName = this.$route.query.projectName;
      if (this.projectName == "文档资料") {
        var res = await projectAllApi.queryMyDocument();
        if (res.code == 1) {
          this.projectName = res.data[0].projectName;
          this.projectId = res.data[0].iuid;
          // this.sourcePath = res.data[0].projectPath;
          this.projectIsPictureMode = false;
          this.loadData("", false);
        }
      }
      if (this.$route.query.pageMode == "location") {
        var fileType = this.$route.query.fileType;
        var iuid = this.$route.query.iuid;
        var res = await postApi.get("/api/Drawing/LocationFileInfo", {
          fileType,
          iuid,
          pageSize: this.pageSize,
          orderBy: this.orderBy,
          orderField: "createTime",
        });
        this.cacheFileLocationModel = res.data;
        if (this.cacheFileLocationModel) {
          if (res.data.fileDeleted) {
            this.$warning("文件已删除，无法进行定位");
            this.$router.go(-1);
            return;
          } else {
            this.projectId = res.data.projectFilePosition.projectId;
            this.projectName = res.data.projectFilePosition.projectName;
            this.folderLists = res.data.folders.map((item) => {
              return {
                name: item.fileName,
                iuid: item.iuid,
              };
            });
            this.folderIuid = res.data.folderIuid;
            this.pageIndex = res.data.pageIndex;
            this.cacheLocationPageIndex = res.data.pageIndex;
            this.locationRowIndex = res.data.rowIndex;
          }
        }
      }
      this.loadID = true;
    },
    async loadSidebarMenuList(paylod) {
      if (!!this.projectId) {
        this.treeEmpty = "正在刷新";
        let res = paylod;
        if (res.data.length == 0) {
          this.treeEmpty = this.$t('base.button.noData');
        }
        if (this.treeInit && res.data) {
          this.currentNode = res.data[0];
          // if (this.projectInfo.projectTypeName === "桥梁大师项目") {
          //   let bridgeFolder = res.data.find((item) => item.fileName === "桥梁");
          //   this.currentName = bridgeFolder.fileName;
          //   this.currentIuid = bridgeFolder.iuid;
          //   this.treeOpenNodes = [bridgeFolder.iuid];
          //   this.treeInit = false;
          // } else {
          this.currentName = res.data[0].fileName;
          this.currentIuid = res.data[0].iuid;
          this.treeOpenNodes = [res.data[0].iuid];
          this.treeInit = false;
          // }
        }
        this.loadData("", false);
      }
    },
    clearSelect() {
      this.$refs["multipleTable"].clearSelection();
    },
    async loadData(clear, updateTree = true) {
      this.isloading = true;
      if (clear == "clearSelect" && this.pictureMode == false) {
        this.tableSelection = [];
        this.$refs["multipleTable"].clearSelection();
      }

      //iuid:文件夹的id
      var formData = new FormData();
      formData.append("IUID", this.folderIuid || "");
      formData.append("MainIUID", this.currentIuid || "");
      formData.append("page", this.pageIndex);
      formData.append("rows", this.pageSize);
      formData.append("FileName", this.searchRules.fileName);
      this.projectFileFilterCallBackRules.forEach((item) => {
        var stringFyValue = item.value;
        switch (item.key) {
          case "statusType":
            formData.append("FileType", stringFyValue.join(","));
            break;
          case "createTime":
            formData.append("Starttime", stringFyValue ? stringFyValue[0] : "");
            formData.append("Endtime", stringFyValue ? stringFyValue[1] : "");
            break;
        }
      });
      if (this.sortColumn) {
        formData.append("sortfield", this.sortColumn.prop);
        formData.append("Orderby", this.sortColumn.order);
      }
      var res = await projectFileApi.queryFileListByFileId(formData);
      res.data &&
        res.data.forEach((item) => {
          item.checkBoxChecked = false;
        });
      // filePath 和 turnPath 解码
      res.data &&
        res.data.forEach((item) => {
          item.downLoading = false;
          item.filePath = decrypt(item.filePath || "");
          item.turnPath = decrypt(item.turnPath || "");
          item.checkStatus = item.checkStatus ? item.checkStatus : "0";
        });
      if (res.data) {
        res.data.forEach((item) => (item.selected = false));
      }
      this.tableData = res.data;

      // if (
      //   this.projectInfo.projectTypeName === "桥梁大师项目" &&
      //   !this.bridgeMasterFolders.length
      // ) {
      //   this.bridgeMasterFolders = JSON.parse(JSON.stringify(this.tableData));
      // }

      for (var i = 0; i < this.tableData.length; i++) {
        // 得到所有保存的桌面视图作为缩略图

        this.tableData[i].thumbnailPath =
          this.baseUrl +
          "/api/home/GetimgFile?fileUrl=" +
          encodeURIComponent(this.tableData[i].thumbnailPath);
        if (this.isIModelFile(this.tableData[i])) {
          // this.getBimImage(this.tableData[i]);
        }
      }
      this.filePermissionCon = res.twodata;
      this.total = res.count;
      if (updateTree == true) {
        this.$refs["folderTree"].updateChild(this.currentNode);
      }
      this.isloading = false;
    },
    // onVisibilitychange() {
    //   if (
    //     this.folderLists.length > 0 &&
    //     this.projectInfo.projectTypeName === "桥梁大师项目" &&
    //     this.folderLists[0].name === "全桥布跨图"
    //   ) {
    //     this.getRoadData();
    //     // this.loadSidebarMenuList()
    //   }
    // },

    onMouseLeave() {
      this.drawBackground();
    },

    onMouseUp(event) {
      this.leftDown = false;
      const canvas = document.querySelector("canvas");
      const boundingRect = event.target.getBoundingClientRect();
      const canvasX = event.clientX - boundingRect.left;
      const canvasY = event.clientY - boundingRect.top;
      const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);
      // 设置canvas的真实宽高
      const pt1 = this.getTruePoint(this.downPt);
      const pt2 = this.getTruePoint(
        new Point2d(canvasX * pixelRatio, canvasY * pixelRatio)
      );
      if (pt1.isAlmostEqual(pt2)) {
        // 原地点击
        this.zoomState = false;
        document.querySelector("canvas").style.cursor = "crosshair";
        return;
      }
      if (this.zoomState) {
        // 缩放
        this.minPt[0] = Math.min(pt1.x, pt2.x);
        this.minPt[1] = Math.min(pt1.y, pt2.y);
        this.maxPt[0] = Math.max(pt1.x, pt2.x);
        this.maxPt[1] = Math.max(pt1.y, pt2.y);
        this.scalex = (canvas.width - 20) / (this.maxPt[0] - this.minPt[0]); // 1：适当缩小
        this.scaley = (canvas.height - 20) / (this.maxPt[1] - this.minPt[1]); // 1：适当缩小
        if (this.scalex < this.scaley / 5) this.scalex = this.scaley / 5; // 适当调整

        this.cx = 10 / this.scalex;
        this.cy = (canvas.height + 30) / this.scaley;
        this.zoomState = false;
      } else {
        // 平移
        document.querySelector("canvas").style.cursor = "crosshair";
        const dx = pt2.x - pt1.x;
        const dy = pt2.y - pt1.y;
        this.cx += dx;
        this.cy += -dy;
      }

      this.drawBackground();
    },

    onMouseDown(event) {
      event.preventDefault();

      const boundingRect = event.target.getBoundingClientRect();
      const canvasX = event.clientX - boundingRect.left;
      const canvasY = event.clientY - boundingRect.top;
      const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);
      this.downPt.x = canvasX * pixelRatio;
      this.downPt.y = canvasY * pixelRatio;

      // if((this.delBridge || this.delBridgeState) && this.currentBridge != -1) {
      //   this.deleteBridge();
      //   this.delBridge = false;
      //   this.delBridgeState = false;
      // }
      // else if((this.modBridge || this.modBridgeState) && this.currentBridge !== -1) {  // 有选中的桥梁则直接进入编辑
      //   const modifyBridge = async(station: string, name: string, angle: number, span: string, type: BridgeType) => {
      //     await this.modifyBridge(station, name, angle, span, type, false);
      //     this.modBridge = false;
      //     this.modBridgeState = false;
      //   }
      //   var i = this.currentBridge;
      //   ModalDialogManager.openDialog(<NewBridgeDialog modify={true} station={this.allBridges[i].station} name={this.allBridges[i].name} angle={this.allBridges[i].angle*180/Math.PI}
      //                                                  span={this.allBridges[i].span} type={this.allBridges[i].type} onResult={modifyBridge} />)
      // }
      // else if(this.newBridgeState || this.isSelectNewBridge(event)) {  // 选择了新建桥梁
      //   const station = (this.minPt[0] + this.downPt.x  / this.scalex) - this.cx;
      //
      //   const createNew = async(station: string, name: string, angle: number, span: string, type: BridgeType) => {
      //     await this.createNewBridge(station, name, angle, span, type);
      //     this.newBridgeState = false;
      //   }
      //   //${this.allBridges.length+1}#桥梁
      //   ModalDialogManager.openDialog(<NewBridgeDialog station={station.toFixed(3)} name={``} angle={90} span={"5x20"} type={this.currBridgeType} onResult={createNew} />)
      // }
      // else if(this.currentBridge !== -1) {
      //   const bridge = this.allBridges[this.currentBridge];
      //   BridgeFactory.hightLightBridge(bridge);
      // }
      // else  {
      //   this._htmlCanvas.style.cursor = "grab";
      //   this.leftDown = true;  // 平移开始
      // }

      document.querySelector("canvas").style.cursor = "grab";
      this.leftDown = true; // 平移开始
    },

    async onDoubleClick() {
      this.reset();
      await this.drawCanvas();
    },

    reset() {
      this.leftDown = false;
      this.zoomState = false;
      document.querySelector("canvas").style.cursor = "crosshair";
    },

    onMouseMove(event) {
      this.drawBackground();
      if (this.leftDown) {
        if (this.zoomState) this.drawZoomBox(event);
        else this.drawPanLine(event);
      }
      // else if(!this.zoomState) {
      //   this.currentBridge = this.bridgeSelected(event)   // 检查是否选中桥梁
      //   if(this.currentBridge === -1) this.drawPosition(event, ContentViewManager.isMouseDown);
      //   else {
      //     if(this.deleteSelected(event) !== 1)
      //       this.modifySelected(event);
      //   }
      // }
    },

    drawPanLine(event) {
      document.querySelector("canvas").style.cursor = "grabbing";
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.resetTransform();
        const boundingRect = event.target.getBoundingClientRect();
        const canvasX = event.clientX - boundingRect.left;
        const canvasY = event.clientY - boundingRect.top;
        const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);

        const pt1 = this.getTruePoint(this.downPt);
        const pt2 = this.getTruePoint(
          new Point2d(canvasX * pixelRatio, canvasY * pixelRatio)
        );
        const dx = pt2.x - pt1.x;
        const dy = pt2.y - pt1.y;
        const cx = this.cx;
        const cy = this.cy;
        this.cx += dx;
        this.cy += -dy;
        this.drawBackground();
        this.cx = cx;
        this.cy = cy;
      }
    },

    drawZoomBox(event) {
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.resetTransform();
        const boundingRect = event.target.getBoundingClientRect();
        const canvasX = event.clientX - boundingRect.left;
        const canvasY = event.clientY - boundingRect.top;
        const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "blue";
        ctx.moveTo(this.downPt.x, this.downPt.y);
        ctx.lineTo(canvasX * pixelRatio, this.downPt.y);
        ctx.lineTo(canvasX * pixelRatio, canvasY * pixelRatio);
        ctx.lineTo(this.downPt.x, canvasY * pixelRatio);
        ctx.lineTo(this.downPt.x, this.downPt.y);
        ctx.stroke();
      }
    },

    onWheel(event) {
      const canvas = document.querySelector("canvas");
      const boundingRect = event.target.getBoundingClientRect();
      const canvasX = event.clientX - boundingRect.left;
      const canvasY = event.clientY - boundingRect.top;
      const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);
      const center = this.getTruePoint(
        new Point2d(canvasX * pixelRatio, canvasY * pixelRatio)
      );
      const dis1 = center.distance(new Point2d(this.minPt[0], this.minPt[1]));
      const dis2 = center.distance(new Point2d(this.maxPt[0], this.maxPt[1]));
      const vec1 = Vector2d.createStartEnd(
        center,
        new Point2d(this.minPt[0], this.minPt[1])
      ).normalize();
      const vec2 = Vector2d.createStartEnd(
        center,
        new Point2d(this.maxPt[0], this.maxPt[1])
      ).normalize();
      if (!vec1 || !vec2) return;
      const pt1 = center.plusScaled(vec1, dis1 + dis1 * Math.sign(event.deltaY) * 0.1);
      const pt2 = center.plusScaled(vec2, dis2 + dis2 * Math.sign(event.deltaY) * 0.1);

      const dx = pt1.x - this.minPt[0];
      const dy = pt1.y - this.minPt[1];

      this.minPt[0] = pt1.x;
      this.minPt[1] = pt1.y;
      this.maxPt[0] = pt2.x;
      this.maxPt[1] = pt2.y;
      this.scalex = (canvas.width - 20) / (this.maxPt[0] - this.minPt[0]); // 1：适当缩小
      this.scaley = (canvas.height - 20) / (this.maxPt[1] - this.minPt[1]); // 1：适当缩小
      if (this.scalex < this.scaley / 5) this.scalex = this.scaley / 5; // 适当调整

      //   this.cx = 10 / this.scalex;
      //   this.cy = (canvas.height + 30) / this.scaley;
      this.cx += dx;
      this.cy += -dy;

      this.drawBackground();
    },

    drawBackground() {
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // clear the canvas
        ctx.resetTransform();
        const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);
        // 设置canvas的真实宽高
        canvas.width = pixelRatio * canvas.offsetWidth;
        canvas.height = pixelRatio * canvas.offsetHeight;
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.dmgPoints.length > 0)
          this.drawLineString(
            ctx,
            "blue",
            this.cx,
            this.cy,
            this.dmgPoints,
            this.scalex,
            this.scaley,
            this.minPt
          );
        if (this.zdmPoints.length > 0)
          this.drawLineString(
            ctx,
            "green",
            this.cx,
            this.cy,
            this.zdmPoints,
            this.scalex,
            this.scaley,
            this.minPt
          );
        this.drawZDMArc(ctx, "red");
      }
      this.drawBridges();
    },

    getTruePoint(pt) {
      return new Point2d(
        this.minPt[0] + pt.x / this.scalex - this.cx,
        this.minPt[1] - pt.y / this.scaley + this.cy
      );
    },
    async getRoadData() {
      if (!this.projectId) return;

      let params = new FormData();
      params.set("Projectiuid", this.projectId);

      await request.post("/api/Bridgeport/GetSetQueryData", params).then((res) => {
        res.data.forEach((item) => {
          if (item.jsondata) {
            item.jsondata = JSON.parse(item.jsondata);
          }
        });

        res.data.sort((x, y) => {
          return Number(x.middleStation) - Number(y.middleStation);
        });

        this.taskList = res.data;
        this.copyTaskList = JSON.parse(JSON.stringify(res.data));
      });

      request
        .post(
          "/api/Bridgeport/GetBridgeportData",
          qs.stringify({
            projectiuid: this.projectId,
          })
        )
        .then(async (res) => {
          if (res.data && res.data.jsondata) {
            this.roadData = JSON.parse(res.data.jsondata);

            this.dlData = this.roadData.dlData;
            this.dmgData = this.roadData.dmgData;
            this.zdmData = this.roadData.zdmData;

            await this.drawCanvas();
            // await this.getAllBridges();
            this.drawBridges();
          }
        });
    },
    drawBridges() {
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);
      ctx.font = "16px Arial";
      ctx.textAlign = "left";
      //    const imgPts: Point2d[] = [];
      //  var img = new Image();
      for (var i = 0; i < this.taskList.length; i++) {
        let jsondata = this.taskList[i].jsondata;

        // 画位置线
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        const station = this.station(this.taskList[i].middleStation);
        const ph = jsondata.ph;
        const dmg = jsondata.elevation;
        ctx.moveTo(station - this.minPt[0], -(ph - this.minPt[1]));
        ctx.lineTo(station - this.minPt[0], -(dmg - this.minPt[1]));
        ctx.stroke();
        const briData = this.getBridgeParam(
          this.taskList[i].middleStation,
          0,
          this.taskList[i].angle,
          this.taskList[i].spanExpr
        );
        this.drawBridgeSpan(ctx, briData);

        // 绘制向上的标注线
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        const pos = Math.max(ph - this.minPt[1], dmg - this.minPt[1]);
        const strStra = this.stationToString(station, 1);
        const len =
          Math.max(
            ctx.measureText(strStra).width,
            ctx.measureText(this.taskList[i].briName).width
          ) / this.scaley;
        ctx.moveTo(station - this.minPt[0], -pos);
        ctx.lineTo(station - this.minPt[0], -pos - len);
        ctx.stroke();
        jsondata.postion = this.getScreenPoint(
          new Point2d(station, pos + len + this.minPt[1])
        ); // 顶部标注点位置
        // 绘制桥梁标识文字
        ctx.save();
        ctx.resetTransform();
        ctx.beginPath();
        const markPt = this.getScreenPoint(new Point2d(station, pos + this.minPt[1]));
        ctx.translate(markPt.x, markPt.y);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "left";
        ctx.font = "16px Arial";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "blue";
        ctx.fillText(strStra, 2 * pixelRatio, 0);
        ctx.fillText(this.taskList[i].briName, 2 * pixelRatio, 15 * pixelRatio); // 桥名
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.resetTransform();
        const pt = new Point2d(markPt.x - 50, markPt.y - len * this.scaley - 100); // 图片左上角点
        const url = this.getBridgeImageUrl(jsondata.type);
        this.drawImage(ctx, url, pt);
        ctx.restore();
      }
    },
    drawImage(ctx, url, pt) {
      const img = this.getImage(url);
      if (img) {
        ctx.drawImage(img, pt.x, pt.y, 100, 100);
      } else {
        const newImg = new Image();
        newImg.src = url;
        this.allImages.push({ url, img: newImg });
        newImg.onload = function () {
          ctx.drawImage(newImg, pt.x, pt.y, 100, 100);
        };
      }
    },

    getImage(url) {
      const index = this.allImages.findIndex((item) => item.url === url);
      if (index !== -1) return this.allImages[index].img;
    },

    getBridgeImageUrl(type) {
      if (type === 0) return "/static/常规桥.svg";
      else if (type === 1) return "/static/连续梁桥.svg";
      else if (type === 2) return "/static/连续刚构.svg";
      else if (type === 3) return "/static/斜拉桥.svg";
      else if (type === 4) return "/static/悬索桥.svg";
      else if (type === 5) return "/static/拱桥.svg";
      return "";
    },

    getScreenPoint(pt) {
      return new Point2d(
        (pt.x + this.cx - this.minPt[0]) * this.scalex,
        (-pt.y + this.minPt[1] + this.cy) * this.scaley
      );
    },

    stationToString(zh, key = 1, prefix, noDL) {
      if (!this.dlData) return;

      var str;
      var str1;
      var str2;
      var sta = zh; // 实际桩号

      if (this.dlData.name !== "" && !noDL) {
        // 有断链文件
        const dlSta = this.toDLStation(sta); // sta变为断链桩号
        if (!dlSta) return sta.toString();
        sta = dlSta?.zh;
        var goZh = this.isComeDLStation(sta, dlSta.codeNo);
        if (goZh !== 0) {
          // 为断链处桩号
          str1 = this.stationToString(sta, 1, undefined, true); // 带公里桩, true:// 为防止FRmStationToString将桩号转换为断链桩号
          str2 = this.stationToString(goZh.goZh, 1, undefined, true); // 带公里桩
          if (key != 3) str = `${str1}=${str2}`;
          else str = `${"A" + dlSta.codeNo}${str1}=${"A" + dlSta.codeNo + 1}${str2}`;
        } else {
          var str1;
          if (key == 1 || key == 3) {
            str = this.stationToString(sta, 1, undefined, true); // 带公里桩
            if (key == 3) {
              str1 = `${"A" + dlSta.codeNo}${str}`;
            } else str1 = str;
            str = str1;
          } else {
            str = this.BStaString(sta, 0);
          }
        }
      } else {
        var perx = zh;

        //              FRmToDLStation(&perx);
        var persta = this.stationK(perx);
        if (key == 1 || (key == 2 && Math.abs(perx) < 0.001) || key == 3) {
          str = `K${persta.kSta}`;
          if (key == 2) return str; // 只要公里桩
        } else {
          // 不带公里桩
          str = "";
        }
        str2 = this.BStaString(perx, 0);
        str = str + str2;
        str = this.trimZero(str);
      }
      if (prefix) {
        // 加入桩号前缀
        return prefix + str;
      }
      return str;
    },

    BStaString(xx, key) {
      const zhEps = 3;
      var sta = xx;
      if (key) {
        // xx 为连续（实际）桩号
        const dlSta = this.toDLStation(sta);
        if (!dlSta) return xx.toString();
        sta = dlSta?.zh;
      }

      //_stprintf(fmt, _T("%%+0%d.%df"), m_zhEps + 1 + 4, m_zhEps);
      var x = sta;
      var km = this.stationK(x);
      var bm1 = Math.floor(km.bSta);
      var bm2 = km.bSta - bm1;
      const str = `+${this.fillZero(bm1, 3)}.${Math.round(bm2 * Math.pow(10, zhEps))}`;
      return this.trimZero(str);
    },

    fillZero(num, len) {
      let count = num.toString().length - len;
      if (count >= 0) return num.toString();
      let arr = new Array(-count + 1);
      return arr.join("0") + num.toString();
    },

    trimZero(str) {
      var s;

      var index = str.indexOf(".");
      if (index === -1) return str;
      if (str.charAt(index + 1) === "") str = str.substring(0, index);
      if (str === "-0") {
        // 避免出现"-0"
        str = "0";
        return str;
      }

      var index = str.indexOf(".");
      if (index === -1) return str;
      while (1) {
        var len = str.length;
        if (str.charAt(len - 1) != "0") break;
        str = str.substring(0, len - 1);
      }
      return str;
    },

    stationK(x) {
      var iii = Math.floor(x / 1000.0);
      x -= iii * 1000.0;
      if (Math.abs(x - 1000) < 0.00001) {
        iii++;
        x = 0;
      }
      return { bSta: x, kSta: iii };
    },

    isComeDLStation(zh, codeNo) {
      if (!this.dlData) return;

      if (codeNo < 0) return 0;
      if (this.dlData.comeZhs.length == 0) return 0;
      if (this.dlData.goZhs.length != this.dlData.comeZhs.length) return 0;
      if (codeNo == this.dlData.comeZhs.length - 1) return 0;
      if (Math.abs(zh - this.dlData.comeZhs[codeNo]) < 0.0000001) {
        const goZh = this.dlData.goZhs[codeNo + 1];
        return { goZh };
      }
      //      }
      return 0;
    },

    toDLStation(x) {
      var zh = x;
      var codeNo = 0;
      if (this.getDLStation(zh, codeNo) == 0) return;
      return { zh, codeNo };
    },

    getDLStation(zh, codeNo) {
      codeNo = 0;
      if (this.dlData.goZhs.length == 0) return 1;
      if (this.dlData.goZhs.length != this.dlData.comeZhs.length) return 0;
      let zh2;
      let zh1 = this.dlData.goZhs[0];
      let i = 0;
      while (1) {
        zh2 = zh1 + this.dlData.comeZhs[i] - this.dlData.goZhs[i];
        if (
          Math.abs(zh - zh1) < 0.000001 ||
          Math.abs(zh - zh2) < 0.000001 ||
          (zh >= zh1 && zh <= zh2) ||
          (i == this.dlData.comeZhs.length - 1 && zh >= zh1)
        ) {
          codeNo = i;
          zh = this.dlData.goZhs[i] + zh - zh1;
          return { zh, codeNo };
        }
        zh1 = zh2;
        i++;
        if (i == this.dlData.comeZhs.length) break;
      }
      codeNo = 0;
      return { zh, codeNo };
    },

    drawBridgeSpan(ctx, briData) {
      var sta = briData.startStation;
      const pts = [];
      for (var i = 0; i <= briData.spans.length; i++) {
        ctx.beginPath();
        const ph = this.getPH(sta);
        const dmg = this.getDMG(sta);
        pts.push(new Point2d(sta - this.minPt[0], -(parseFloat(ph) - this.minPt[1])));
        ctx.moveTo(sta - this.minPt[0], -(parseFloat(ph) - this.minPt[1]));
        ctx.lineTo(sta - this.minPt[0], -(parseFloat(dmg) - this.minPt[1]));
        if (i != briData.spans.length) sta += briData.spans[i];
        ctx.stroke();
      }
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.lineWidth = 2 / this.scaley;
      if (ctx.lineWidth < 0.1) ctx.lineWidth = 0.1;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    },

    getDMG(station) {
      if (this.dmgData && this.dmgData.allDatas) {
        const points = [];
        this.dmgData.allDatas.forEach((item) => {
          points.push(new Point3d(parseFloat(item.station), item.elevation, 0));
        });

        const ph = this.findLineStringHeight(points, station); // await DtaRpcInterface.getClient().findStaHeight(points, station);
        if (ph) return ph.toFixed(3);
      }
      return "N/A";
    },

    findLineStringHeight(points, x) {
      var ph = 0;

      var zh1 = points[0].x;
      var gc1 = points[0].y;
      var zh2;
      var gc2;

      if (Math.abs(x - zh1) < 0.001) {
        ph = gc1;
        return ph;
      }
      for (var i = 1; i < points.length; i++) {
        zh2 = points[i].x;
        gc2 = points[i].y;
        if (Math.abs(x - zh2) < 0.001) {
          ph = gc2;
          return ph;
        }
        if (x >= zh1 - 0.001 && x <= zh2 + 0.001) {
          ph = this.InsertY(zh1, gc1, zh2, gc2, x).y;
          return ph;
        }
        zh1 = zh2;
        gc1 = gc2;
      }
      return;
    },

    InsertY(x1, y1, x2, y2, x) {
      var xx;
      var yy;
      if (Math.abs(x2 - x1) < 0.001) yy = y1;
      else yy = y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
      xx = x;
      return { x: xx, y: yy };
    },

    getPH(station) {
      if (this.zdmData && this.zdmData.allDatas) {
        const points = [];
        this.zdmData.allDatas.forEach((item) => {
          points.push({ X: parseFloat(item.station), Y: item.ph, Z: item.R });
        });

        const ph = this.findStaHeight(points, station);
        if (ph) return ph.toFixed(3);
      }
      return "N/A";
    },

    findStaHeight(profilePts, station) {
      this.setProfile(profilePts);
      return this.findStaHeight1(station);
    },

    findStaHeight1(x) {
      class SRmZDMVertex {
        constructor() {
          this.p1 = 0;
          this.p2 = 0;
          this.R = 0;
          this.type = 0; // 0-R, 1-E, 2-T
          this.pt0 = new Point2d();
          this.pt1 = new Point2d();
          this.pt2 = new Point2d();
          this.pt3 = new Point2d();
          this.xyr = { x: 0, y: 0, r: 0, type: 0 };
        }
      }

      var ph = 0;
      var k1 = 0;
      var k2 = 0;
      var found = 0;
      var startZh = 0;
      for (var i = 0; i < this.m_zdms.length; i++) {
        if (this.m_zdms[i].se == 1) {
          if (found) {
            // 前一桩号应该是终点桩号
            k2 = i - 1;
            break;
          }
          k1 = i;
          k2 = -1;
          startZh = this.m_zdms[i].zdm.x;
        }
        if (found && this.m_zdms[i].se == 2) {
          k2 = i;
          break;
        }
        if (Math.abs(x - this.m_zdms[i].zdm.x) < 0.001) {
          found = 1;
          if (i == this.m_zdms.length - 1) {
            k2 = i;
            break;
          }
        } else if (i != 0 && x >= startZh && x <= this.m_zdms[i].zdm.x) {
          found = 1;
          if (i == this.m_zdms.length - 1) {
            k2 = i;
            break;
          }
        }
      }
      if (found == 0 || k2 <= k1) {
        // 未找到桩号所在的范围
        if (this.m_zdms.length > 1) ph = this.m_zdms[0].zdm.y;
        return ph;
      }
      var xyr1;
      var xyr2;
      var xyr3;
      var fzdm = new SRmZDMVertex();
      var prept = new Point2d();
      var k = 0;
      var retmode_zdm = true;
      xyr1 = this.m_zdms[k1].zdm;
      xyr2 = this.m_zdms[k1 + 1].zdm;
      prept.x = xyr1.x;
      prept.y = xyr1.y;
      if (k1 + 2 > k2) {
        // 仅一直线
        if (xyr1.r != 0 || xyr2.r != 0) {
          return;
        }
        fzdm.pt0.x = prept.x;
        fzdm.pt0.y = prept.y;
        fzdm.pt1.x = xyr2.x;
        fzdm.pt1.y = xyr2.y;
        fzdm.pt2.x = xyr2.x;
        fzdm.pt2.y = xyr2.y;
        fzdm.pt3.x = xyr2.x;
        fzdm.pt3.y = xyr2.y;
        fzdm.R = 0;
        fzdm.p1 = (xyr2.y - xyr1.y) / (xyr2.x - xyr1.x);
        fzdm.p2 = 0;
      } else {
        xyr3 = this.m_zdms[k1 + 2].zdm;
        retmode_zdm = this.getZDMVertex(xyr1, xyr2, xyr3, fzdm);
        if (!retmode_zdm) return;
      }
      (fzdm.pt0.x = prept.x), (fzdm.pt0.y = prept.y);
      if (Math.abs(x - fzdm.pt0.x) < 0.001) {
        ph = fzdm.pt0.y;
        return ph;
      } else if (x < fzdm.pt0.x - 0.001) {
        ph = fzdm.pt0.y;
        return ph;
      }
      k = k1 + 3;
      while (x > fzdm.pt3.x) {
        xyr1.x = xyr2.x;
        xyr1.y = xyr2.y;
        xyr1.r = xyr2.r;
        // xyr1 = xyr2;
        xyr2.x = fzdm.xyr.x;
        xyr2.y = fzdm.xyr.y;
        xyr2.r = fzdm.xyr.r;
        // xyr2 = fzdm.xyr;
        prept.x = fzdm.pt3.x;
        prept.y = fzdm.pt3.y;
        if (k > k2) {
          fzdm.pt0.x = prept.x;
          fzdm.pt0.y = prept.y;
          fzdm.pt1.x = xyr2.x;
          fzdm.pt1.y = xyr2.y;
          fzdm.pt2.x = xyr2.x;
          fzdm.pt2.y = xyr2.y;
          fzdm.pt3.x = xyr2.x;
          fzdm.pt3.y = xyr2.y;
          fzdm.R = 0;
          fzdm.p1 = fzdm.p2;
          fzdm.p2 = 0.0;
          break;
        } else {
          xyr3 = this.m_zdms[k++].zdm;
          retmode_zdm = this.getZDMVertex(xyr1, xyr2, xyr3, fzdm);
          if (!retmode_zdm) return 0;
          fzdm.pt0.x = prept.x;
          fzdm.pt0.y = prept.y;
        }
      }
      if (Math.abs(x - fzdm.pt3.x) < 0.001) {
        ph = fzdm.pt3.y;
        return ph;
      } else if (x > fzdm.pt3.x + 0.001) {
        ph = fzdm.pt3.y;
        return ph;
      }
      if (!(x < fzdm.pt0.x - 0.001) && !(x > fzdm.pt1.x)) {
        ph = fzdm.pt0.y + fzdm.p1 * (x - fzdm.pt0.x);
      } else if (x > fzdm.pt1.x && x < fzdm.pt2.x) {
        if (Math.abs(fzdm.R) < 0.001) ph = fzdm.pt0.y + fzdm.p1 * (x - fzdm.pt0.x);
        else
          ph =
            fzdm.pt0.y +
            fzdm.p1 * (x - fzdm.pt0.x) +
            (0.5 * ((x - fzdm.pt1.x) * (x - fzdm.pt1.x))) / fzdm.R;
      } else if (!(x < fzdm.pt2.x) && !(x > fzdm.pt3.x + 0.001)) {
        if (Math.abs(fzdm.R) < 0.001) ph = fzdm.pt2.y + fzdm.p2 * (x - fzdm.pt2.x);
        else
          ph =
            fzdm.pt2.y +
            fzdm.p2 * (x - fzdm.pt2.x) +
            (0.5 * ((x - fzdm.pt3.x) * (x - fzdm.pt3.x))) / fzdm.R;
      } else {
        ph = fzdm.pt3.y;
        return ph;
      }
      return ph;
    },

    getZDMVertex(xx1, xx2, xx3, ok) {
      var p1 = 0;
      var p2 = 0;
      if (Math.abs(xx2.x - xx1.x) < 0.001) {
        return false;
      }
      if (Math.abs(xx3.x - xx2.x) < 0.001) {
        return false;
      }
      p1 = (xx2.y - xx1.y) / (xx2.x - xx1.x);
      p2 = (xx3.y - xx2.y) / (xx3.x - xx2.x);
      const rte = this.GetRTE(xx1, xx2, xx3);
      if (!rte) return false;
      ok.xyr = xx3;
      ok.p1 = p1;
      ok.p2 = p2;
      ok.pt1.x = xx2.x - rte.TT;
      ok.pt1.y = xx2.y - p1 * rte.TT;
      ok.pt2.x = xx2.x;
      ok.pt2.y = xx2.y;
      ok.pt3.x = xx2.x + rte.TT;
      ok.pt3.y = xx2.y + p2 * rte.TT;
      if (p1 > p2) {
        // p2 - p1 < 0  凸
        ok.R = -1 * rte.RR;
      } else {
        // p2 - p1 > 0 凹
        ok.R = rte.RR;
      }
      return true;
    },

    GetRTE(xx1, xx2, xx3) {
      var p1 = 0;
      var p2 = 0;
      var RR = 0;
      var TT = 0;
      var EE = 0;
      RR = TT = EE = 0;
      if (Math.abs(xx2.x - xx1.x) < 0.001) return;
      if (Math.abs(xx3.x - xx2.x) < 0.001) return;
      p1 = (xx2.y - xx1.y) / (xx2.x - xx1.x); //前坡坡度
      p2 = (xx3.y - xx2.y) / (xx3.x - xx2.x); //后坡坡度
      if (Math.abs(p2 - p1) < 0.001) return 0;
      var value = Math.abs(xx2.r);
      switch (xx2.type) {
        case 1: //e:
          EE = value;
          RR = (8.0 * EE) / ((p2 - p1) * (p2 - p1));
          TT = 0.5 * RR * Math.abs(p2 - p1);
          break;
        case 0: //r:
          RR = value;
          TT = 0.5 * RR * Math.abs(p2 - p1);
          if (Math.abs(RR) < 0.001) return;
          EE = (0.5 * TT * TT) / RR;
          break;
        case 2: //t:
          TT = value;
          RR = TT / (0.5 * Math.abs(p2 - p1));
          if (Math.abs(RR) < 0.001) return;
          EE = (0.5 * TT * TT) / RR;
          break;
      }
      return { RR, TT, EE };
    },

    setProfile(profileData) {
      this.m_zdms.length = 0;
      this.getAllZDMs(profileData);
    },

    getAllZDMs(profileData) {
      class SRmZDM {
        constructor() {
          this.x = 0;
          this.y = 0;
          this.r = 0;
          this.type = 0; // 0-R, 1-E, 2-T
        }
      }

      profileData.forEach((data) => {
        var pZdm = { zdm: new SRmZDM(), se: 0 };
        pZdm.zdm.x = data.X;
        pZdm.zdm.y = data.Y;
        pZdm.zdm.r = data.Z;
        pZdm.zdm.type = 0; //TODO: ygp, 后续支持其他格式
        this.m_zdms.push(pZdm);
      });
      if (this.m_zdms.length >= 2) {
        this.m_zdms[0].se = 1;
        this.m_zdms[this.m_zdms.length - 1].se = 2;
      }
    },

    getBridgeParam(station, offset, angle, span) {
      var spans = [];
      spans = this.getSpans(2, span);
      var totalLen = 0;
      spans.forEach((span) => (totalLen += span));
      const centerSta = this.getRealStation(station) + offset;
      const startStation = centerSta - totalLen / 2;
      const endStation = centerSta + totalLen / 2;
      const data = {
        station: centerSta,
        spans,
        startStation,
        endStation,
        angle,
        totalLen,
      };
      return data;
    },

    getRealStation(station) {
      return this.toRealStationNumber(station);
    },

    toRealStationNumber(str) {
      var code = 0;
      if (this.isLetter(str.charAt(0))) {
        code = parseInt(str.charAt(0)) - parseInt("A");
        str = str.slice(1);
      }
      var zh = parseFloat(str);
      return this.toRealStation(code, zh);
    },

    isLetter(char) {
      return char.length === 1 && char.toLowerCase() !== char.toUpperCase();
    },

    toRealStation(codeNo, x) {
      var zh = x;
      if (this.getRealStation1(codeNo, zh) == 0) return;
      return zh;
    },

    getRealStation1(codeNo, zh) {
      if (!this.dlData) return;

      if (this.dlData.goZhs.length == 0 || codeNo < 0) return 1;
      if (this.dlData.goZhs.length != this.dlData.comeZhs.length) return 0;
      if (codeNo == 0 && this.dlData.goZhs.length && this.dlData.comeZhs.length) {
        // 为正常桩号或A段,直接返回
        if (!(zh >= this.dlData.goZhs[codeNo] && zh <= this.dlData.comeZhs[codeNo])) {
          //这种是负桩号
          zh = zh - this.dlData.goZhs[codeNo]; //朱旭加
          return zh;
        }
        return zh;
      }
      if (codeNo >= this.dlData.goZhs.length) return 0;
      if (
        !(
          zh >= this.dlData.goZhs[codeNo] - 0.001 &&
          zh <= this.dlData.comeZhs[codeNo] + 0.001
        ) &&
        !(
          codeNo == this.dlData.comeZhs.length - 1 &&
          zh >= this.dlData.goZhs[codeNo] - 0.001
        )
      ) {
        return; // 所给桩号不在所指定的区间内
      }

      let currZh = this.dlData.goZhs[0];
      for (var i = 0; i < codeNo; i++) {
        currZh += this.dlData.comeZhs[i] - this.dlData.goZhs[i];
      }
      zh = currZh + zh - this.dlData.goZhs[codeNo];
      return zh;
    },

    getSpans(type, param, length) {
      var spans = [];
      if (type === 0) {
        // 指定等分数
        const count = parseInt(param);
        for (var i = 0; i < count; i++) spans.push(length / count);
      } else if (type === 1) {
        // 等距。
        const dis = parseFloat(param);
        const count = Math.floor(length / dis);
        for (var i = 0; i < count; i++) spans.push(dis);
      } else {
        spans = this.getSpanFromExpress(param);
      }
      return spans;
    },

    getSpanFromExpress(exp) {
      const spans = [];
      const strs = exp.split("+");
      for (var i = 0; i < strs.length; i++) {
        var subStrs = strs[i].split("x");
        if (subStrs.length < 2) subStrs = strs[i].split("X");
        if (subStrs.length < 2) subStrs = strs[i].split("*");
        if (subStrs.length === 1) spans.push(parseFloat(subStrs[0]));
        else {
          for (var j = 0; j < parseInt(subStrs[0]); j++) {
            spans.push(parseFloat(subStrs[1]));
          }
        }
      }
      return spans;
    },

    async drawCanvas() {
      //event: React.MouseEvent<HTMLCanvasElement>, _isMouseDown: boolean) {
      this.leftDown = false;
      this.zoomState = false;
      const canvas = document.querySelector("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        //const boundingRect: DOMRect = (event.nativeEvent.target as any).getBoundingClientRect();
        //const canvasX = (event.clientX - boundingRect.left);
        //const canvasY = (event.clientY - boundingRect.top);
        // 获取到屏幕倒是是几倍屏。
        /* function getPixelRatio(context: CanvasRenderingContext2D) {
           var backingStore = context.backingStorePixelRatio ||
             context.webkitBackingStorePixelRatio ||
             context.mozBackingStorePixelRatio ||
             context.msBackingStorePixelRatio ||
             context.oBackingStorePixelRatio ||
             context.backingStorePixelRatio || 1;
           return (window.devicePixelRatio || 1) / backingStore;
         };*/

        const pixelRatio = window.devicePixelRatio; //getPixelRatio(ctx);
        // 设置canvas的真实宽高
        canvas.width = pixelRatio * canvas.offsetWidth;
        canvas.height = pixelRatio * canvas.offsetHeight;

        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const width = canvas.width;
        const height = canvas.height;
        this.minPt = [1e10, 1e10];
        this.maxPt = [-1e10, -1e10];
        // this.dmgData = await DataHelper.getDmg(this.currDMG);
        this.dmgPoints.length = 0;
        this.dmgData &&
          this.dmgData.allDatas.map((data) => {
            const pt = new Point2d(parseFloat(data.station), data.elevation);
            this.dmgPoints.push(pt);
            if (pt.x < this.minPt[0]) this.minPt[0] = pt.x;
            if (pt.y < this.minPt[1]) this.minPt[1] = pt.y;
            if (pt.x > this.maxPt[0]) this.maxPt[0] = pt.x;
            if (pt.y > this.maxPt[1]) this.maxPt[1] = pt.y;
          });
        if (this.autoScale) {
          this.scalex = (width - 20) / (this.maxPt[0] - this.minPt[0]); // 1：适当缩小
          this.scaley = (height - 20) / (this.maxPt[1] - this.minPt[1]); // 1：适当缩小
          if (this.scalex < this.scaley / 5) this.scalex = this.scaley / 5; // 适当调整
        } else {
          this.scalex = this.inputScalex;
          this.scaley = this.inputScaley;
          this.maxPt[0] = this.minPt[0] + (width - 20) / this.scalex;
          this.maxPt[1] = this.minPt[1] + (height - 20) / this.scaley;
        }
        this.cx = 10 / this.scalex;
        this.cy = (height + 30) / this.scaley;
        this.drawLineString(
          ctx,
          "blue",
          this.cx,
          this.cy,
          this.dmgPoints,
          this.scalex,
          this.scaley,
          this.minPt
        );

        // this.zdmData = await DataHelper.getZdm(this.currZDM);
        this.zdmPoints.length = 0;
        this.zdmData &&
          this.zdmData.allDatas.map((data) => {
            const pt = new Point2d(parseFloat(data.station), data.ph);
            this.zdmPoints.push(pt);
          });
        this.drawLineString(
          ctx,
          "green",
          this.cx,
          this.cy,
          this.zdmPoints,
          this.scalex,
          this.scaley,
          this.minPt
        );
        this.drawZDMArc(ctx, "red");
      }
    },

    drawLineString(ctx, color, cx, cy, pts, scalex, scaley, minPt) {
      if (!pts || !pts.length) return;

      ctx.resetTransform();
      ctx.scale(scalex, scaley);
      ctx.translate(cx, cy);

      ctx.lineWidth = 1 / this.scaley;
      if (ctx.lineWidth < 0.05) ctx.lineWidth = 0.05;
      ctx.beginPath();
      ctx.strokeStyle = color;

      ctx.moveTo(pts[0].x - minPt[0], -(pts[0].y - minPt[1]));
      for (var i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x - minPt[0], -(pts[i].y - minPt[1]));
      }
      ctx.stroke();
    },

    drawZDMArc(ctx, color) {
      if (
        !this.zdmData ||
        !this.zdmData.allDatas ||
        (this.zdmData.allDatas && this.zdmData.allDatas.length === 0)
      )
        return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5 / this.scaley;
      if (ctx.lineWidth < 0.05) ctx.lineWidth = 0.05;
      var pt1 = new Point3d(
        this.station(this.zdmData.allDatas[0].station),
        this.zdmData.allDatas[0].ph,
        0
      );
      for (var i = 1; i < this.zdmData.allDatas.length - 1; i++) {
        var pt2 = new Point3d(
          this.station(this.zdmData.allDatas[i].station),
          this.zdmData.allDatas[i].ph,
          0
        );
        var pt3 = new Point3d(
          this.station(this.zdmData.allDatas[i + 1].station),
          this.zdmData.allDatas[i + 1].ph,
          0
        );
        // const arcInfo = this.twoLineAddArc(pt1, pt2, pt2, pt3, this.zdmData.allDatas[i].R);
        const arcInfo = undefined;
        pt1 = pt2;
        // if(!arcInfo) continue;
        //    ctx.arc(arcInfo?.centerPt.x - this.minPt[0], -(arcInfo?.centerPt.y - this.minPt[1]), this.zdmData.allDatas[i].R, arcInfo.startAngle, arcInfo.endAngle, (arcInfo.angle.degrees > 0) ? false : true);
        ctx.beginPath();
        // const pts = this.getArcSeg(arcInfo?.arcStart, arcInfo?.arcEnd);
        // ctx.moveTo(pts[0].x - this.minPt[0], -(pts[0].y - this.minPt[1]));
        // for(var j = 1; j < pts.length; j ++) {
        //   ctx.lineTo(pts[j].x - this.minPt[0], -(pts[j].y - this.minPt[1]));
        // }
        ctx.stroke();
      }
    },

    getArcSeg(pt1, pt2) {
      const step = (pt2.x - pt1.x) / 5;
      const pts = [];
      pts.push(pt1);
      var sta = pt1.x + step;
      while (1) {
        if (step < 0.001 || sta >= pt2.x) {
          pts.push(pt2);
          break;
        }
        const ph = this.getPH(sta);
        if (ph !== "N/A") {
          pts.push(new Point3d(sta, parseFloat(ph), 0));
        }
        sta += step;
      }
      return pts;
    },

    station(sta) {
      return parseFloat(sta); // 后续要考虑断链
    },

    twoLineAddArc(pt1, pt2, pt3, pt4, r) {
      const vec1 = Vector3d.createStartEnd(pt1, pt2);
      vec1.normalizeInPlace();
      const vec2 = Vector3d.createStartEnd(pt3, pt4);
      vec2.normalizeInPlace();
      let centerPt;
      let arcStart;
      let arcEnd;

      const angle = vec1.angleToXY(vec2); //从-π到π
      let dir = -1;
      if (angle.degrees > 0) dir = 1;
      let npt1 = pt1.plusScaled(vec1.rotate90CCWXY(), r * dir);
      let npt2 = pt2.plusScaled(vec1.rotate90CCWXY(), r * dir);
      let npt3 = pt3.plusScaled(vec2.rotate90CCWXY(), r * dir);
      let npt4 = pt4.plusScaled(vec2.rotate90CCWXY(), r * dir);
      let line1 = LineSegment3d.create(npt1, npt2);
      let line2 = LineSegment3d.create(npt3, npt4);
      const colPts = CurveCurve.intersectionXYPairs(line1, true, line2, true);
      if (colPts.length <= 0) return;
      centerPt = colPts[0].detailA.point;
      line1 = LineSegment3d.create(pt1, pt2);
      line2 = LineSegment3d.create(pt3, pt4);
      const line1Pt = line1.closestPoint(centerPt, true);
      const line2Pt = line2.closestPoint(centerPt, true);
      arcStart = line1Pt.point;
      arcEnd = line2Pt.point;
      var startAngle = Vector3d.unitX().angleToXY(vec1).radians;
      var endAngle = Vector3d.unitX().angleToXY(vec2).radians;
      return { centerPt, arcStart, arcEnd, angle, startAngle, endAngle };
    },
    async getMainFile() {
      let res = await postApi.post(
        "/api/ProjectManagement/GetMasterfileData?IUID=" + this.projectId,
        null,
        null,
        false
      );
      if (res.code == 1) {
        this.mainFileIuid = res.data.iuid;
      } else if (res.code == -1) {
        this.mainFileIuid = false;
      }
    },
    stationHandler(station) {
      let num = Number(station);

      let preSuffix = "K";

      if (num !== num) {
        // preSuffix = station.slice(0, 1)
        num = Number(station.slice(1));
      }

      let str = num.toFixed(3);
      let arr = str.split(".");

      if (arr[1] && arr[1].length > 3) {
        str = String(num.toFixed(3));
      }

      const strArr = str.split(".");
      const item1 = strArr[0];
      const item2 = strArr[1] || "";

      if (Number(item1) < 1000) {
        return `${preSuffix}0+${str}`;
      } else {
        const start = item1.slice(0, -3);
        const end = item1.slice(-3);
        return `${preSuffix}${start}+${end}${item2 ? "." + item2 : ""}`;
      }
    },

    projectSetting() {
      this.projectSettingDialog = true;
    },

    taskAllocation() {
      this.taskAllocationDialog = true;
    },

    projectSettingSubmit() {
      request
        .post("/api/Bridgeport/Projectsetup", {
          ...this.projectSettingModel,
          starting: parseFloat(this.projectSettingModel.starting),
          destination: parseFloat(this.projectSettingModel.destination),
          wide: parseFloat(this.projectSettingModel.wide),
          mainIUID: this.projectId,
        })
        .then((res) => {
          if (res.code === 1) {
            this.$message.success("操作成功");

            this.projectSettingDialog = false;
          }
        });
    },

    async taskAllocationSubmit() {
      let formData = new FormData();
      formData.set("Projectiuid", this.projectId);
      let setting = await request.post("/api/Bridgeport/GetProjectsetup", formData);

      if (setting.code === 1 && setting.data.starting === null) {
        this.$message.error("您还没有完成工程设置，无法进行任务分配");
        return;
      }

      let params = this.taskList.map((item) => {
        return {
          MainIUID: item.iuid,
          UserID: item.userID,
        };
      });

      request.post("/api/Bridgeport/Setassignedit", params).then((res) => {
        if (res.code === 1) {
          this.$message.success("操作成功");

          this.taskAllocationDialog = false;

          let params1 = new FormData();
          params1.set("Projectiuid", this.projectId);

          request.post("/api/Bridgeport/GetSetQueryData", params1).then((res1) => {
            res1.data.forEach((item) => {
              if (item.jsondata) {
                item.jsondata = JSON.parse(item.jsondata);
              }
            });

            this.taskList = res1.data;
            this.copyTaskList = JSON.parse(JSON.stringify(res1.data));
          });
        }
      });
    },

    viewBigScreen(data) {
      let filePath = data.turnPath ? data.turnPath : data.filePath;
      let query = this.$turnEncryptParams(filePath);
      let routeUrl = this.$router.resolve({
        path: "/bigScreen",
        query: {
          filePath: process.env.VUE_APP_ViewOrigin + "/?" + query,
        },
      });
      window.open(routeUrl.href, "_blank");
    },

    viewBigScreenAndTable(data) {
      let filePath = data.turnPath ? data.turnPath : data.filePath;
      let query = "path=" + filePath + "&editable=0&selectFile=0"
      window.open(`http://123.57.64.121:83/bigScreenGis?gisUrl=${(process.env.CscOneAllOrigin + "?" + encrypt(encodeURIComponent(query)))}`);
    },

    isCheckUser(data) {
      return (
        (data.checkStatus === "1" && data.checkUser === this.user.userID) ||
        data.checkStatus === "0" ||
        data.checkStatus === null
      );
    },
    saveTreeOpenNodes(paylod) {
      this.treeOpenNodes.push(paylod.iuid);
    },
    removeTreeOpenNodes(paylod) {
      if (this.treeOpenNodes.length) {
        this.treeOpenNodes.some((item, i) => {
          if (item == paylod.iuid) {
            this.treeOpenNodes.splice(i, 1);
            if (paylod.children && paylod.children.length > 0) {
              paylod.children.forEach((i) => {
                this.removeTreeOpenNodes(i);
              });
            }
          }
        });
      }
    },
    copyAddress(item) {
      const copy = (data) => {
        let input = document.createElement("input");
        input.value = data;
        copyTextToClipboard(data)
        // document.body.appendChild(input);
        // input.select();
        // document.execCommand("copy");
        // document.body.removeChild(input);
        // this.$message.success("复制成功");
      }
      let _this = this
      async function copyTextToClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
          _this.$message.success("复制成功");
        } catch (err) {
          _this.$message.error('复制失败:', err);
        }
      }
      if (item.fileSuffix.toLowerCase() == '.json') {
        let data = location.origin + "/" + item.filePath.replace(/\\/g, '/')
        copy(data)
      } else {
        request
          .get("/api/ProjectManagement/livesceneaddresscopy", {
            params: {
              iuid: item.iuid,
            },
          })
          .then((res) => {
            if (!res.data.endsWith(".json")) {
              this.$message.warning("未生成地址，请重新转码后重试");
            } else {
              let data = location.origin + "/" + res.data.replace(/\\/g, '/');
              copy(data)
            }
          });
      }



    },
    getNodeListName(node) {
      if (node.level > 1) {
        this.folderLists.unshift({
          iuid: node.data.iuid,
          name: node.data.fileName,
        });
        this.getNodeListName(node.parent);
      } else if (node.level == 1) {
        this.currentName = node.data.fileName;
        this.currentIuid = node.data.iuid;
        return;
      }
    },
    openChildren(item, node, nodeDom) {
      this.currentNode = node;
      this.myDocumentKind = -1;
      if (!!node.data.fileSuffix) {
        return;
      }
      this.parentExpand = false;
      this.folderLists = [];

      if (node.level == 1) {
        this.currentName = item.fileName;
        this.currentIuid = item.iuid;
      } else if (node.level > 1) {
        this.getNodeListName(node);
      }
      this.folderIuid = node.level == 1 ? "" : item.iuid;
      this.pageIndex = 1;
      this.pageSize = 15;
      this.loadData("", false);
    },
    mouseenter(data) {
      this.$set(data, "show", true);
    },
    mouseleave(data) {
      this.$set(data, "show", false);
    },

    handleMyDocument(route) {
      this.myDocumentKind = route.id;
    },
    // 检查是否需要显示操作按钮
    hasOpertionButton(data) {
      if (
        data.show &&
        this.isIModelFile(data) &&
        ((data.checkStatus === "1" &&
          data.checkUser === (this.user && this.user.userID)) ||
          data.checkStatus === "0" ||
          data.checkStatus === null)
      )
        return true;
      if (
        data.show &&
        this.filePermissionCon.deletebit == true &&
        (data.checkStatus === "0" || data.checkStatus === null)
      )
        return true;
      return false;
    },
    // 检查是否需要可编辑、4D操作按钮
    hasEditableButton(data) {
      if (
        this.isIModelFile(data) &&
        ((data.checkStatus === "1" &&
          data.checkUser === (this.user && this.user.userID)) ||
          data.checkStatus === "0" ||
          data.checkStatus === null ||
          data.checkStatus === undefined)
      )
        return true;
      return false;
    },
    inWorkflow(row) {
      for (var i = 0; i < this.workflowData.length; i++) {
        if (!this.workflowData[i].relatedFiles) continue;
        if (this.workflowData[i].relatedFiles.includes(row.iuid)) {
          return true;
        }
      }
      return false;
    },
    showQuality(row) {
      // 质量检查弹窗开启
      this.$refs.modelFileCheckRef.showDialog(row);
    },
    tableRowClick(row) {
      this.tableData.forEach((item) => (item.selected = false));
      //表格点击当前行高亮（暂时不需要-20220927）
      // row.selected = true
      this.tableRow = row;
    },
    showLockView(row, type) {
      this.CheckStatusIuid = row.iuid;
      this.CheckStatus = type;
      this.showLockViewSave();
    },
    async showLockViewSave() {
      var formData = new FormData();
      formData.append("IUID", this.CheckStatusIuid);
      formData.append("CheckStatus", this.CheckStatus);
      var res = await projectFileApi.FileCheckStatusSave(formData);
      if (res.code == 1) {
        this.$message({
          message: this.CheckStatus == "1" ? "签出成功" : "签入成功",
          type: "success",
        });
        this.loadData("clearSelect");
        this.$forceUpdate();
      }
    },
    openMenuImage(e, item) {
      this.rightClickItem = item;
      this.top = e.clientY;
      this.left = e.clientX;
      this.clickMenuvisibleImage = true;
    },
    closeMenuImage() {
      this.clickMenuvisibleImage = false;
    },
    modeChange(mode) {
      this.tableSelection = [];
      this.pictureMode = mode;
    },
    filterChange(data) {
      var index = this.projectFileFilterCallBackRules.findIndex((item) => {
        return item.key == data.key;
      });
      if (index > -1) {
        this.projectFileFilterCallBackRules.splice(index, 1);
      }
      this.projectFileFilterCallBackRules.push(data);
      this.loadData();
    },

    tableRowClassName({ row, rowIndex }) {
      if (
        rowIndex === this.locationRowIndex - 1 &&
        this.pageIndex === this.cacheLocationPageIndex
      ) {
        return "success-row";
      }
      return "";
    },

    handleLefeMenu() {
      this.$store.dispatch("setLeftCollapse");
    },
    // 导出
    async handleExport(type, a, row) {
      console.log(type, a, row);
      this.exportLoading = true;
      this.exportFilePopVisible = false;

      // let row = this.tableSelection[0]
      let data = new FormData();
      data.append("type", type);
      data.append("IUID", row.iuid);
      let res;
      if (type === "dgn" || type === "ifc") {
        res = await postApi.post("/api/Bridgeport/GetAddDgnData", data);
      } else {
        res = await postApi.post("/api/imodel/ExportFile", data);
      }
      if (res.code == 1) {
        this.loadData("clearSelect", true);
        this.$success(res.msg);
      }
      this.exportLoading = false;
    },
    // 转码
    handleCommand(data, row) {
      if (data) {
        var list = data.split("/");
        this.reTranscoding(list[1], list[0], row);
      }
    },
    async reTranscoding(data, tool, row) {

      if (row.ischeck == true) {
        this.$warning("文件正在审批中！");
      } else {
        this.clearSelect()
        row.statusType = "-1";
        var res = await projectFileApi.reTranscoding([
          {
            iuid: data,
            tool: "",
          },
        ]);
        if (res.code == 1) {
          this.$success(res.msg);
        }
      }
    },
    // 移动复制
    moveCopy(type, row) {
      this.tableSelection = [];
      this.moveCopyDialogVisible = true;
      this.moveCopyType = type;
      this.tableSelection.push(row);
    },
    copyTo(type, data) {
      this.rowData = [data];
      this.moveCopyType = type;
      this.moveCopyDialogVisible = true;
    },
    async copyToCurrentFolder(row) {
      let formData = new FormData();
      formData.append("IUID", row.iuid);
      let res = await postApi.post("/api/ProjectFile/thisFilecopy", formData);
      if (res.code == 1) {
        this.$success(res.msg);
        this.loadData("clearSelect");
      }
    },
    paginationCurrentChange(val) {
      this.pageIndex = val;
      this.loadData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadData();
    },
    handleMainMenuClick() {
      // 主目录
      this.pageIndex = 1;
      this.folderIuid = "";
      this.folderLists = [];
      this.loadData();
    },
    prevFolder() {
      if (this.folderLists.length >= 1) {
        let idx = this.folderLists.length - 2;
        if (this.folderLists.length == 1) {
          this.handleMainMenuClick();
        } else {
          this.folderMenuClick(this.folderLists[idx], idx);
        }
      }
    },
    folderMenuClick(data, idx) {
      this.pageIndex = 1;
      this.folderIuid = data.iuid;
      this.folderLists = this.folderLists.slice(0, idx + 1);
      this.loadData();
    },
    getBimImage(item) {
      var _self = this;
      this.hasBimImage = false;
      var path = item.turnPath;
      if (path == "") path = item.filePath;
      var index = path.lastIndexOf("/Files");
      if (index != -1) path = path.substring(index + 1);
      index = path.lastIndexOf("/");
      if (index == -1) return;
      var jsonPath = path.substring(0, index + 1);
      var jsonName = path.substring(index); // 文件名
      index = jsonName.lastIndexOf(".bim");
      if (index == -1) return;
      jsonName = jsonName.substring(0, index);
      var fname = jsonPath + "SPV" + jsonName + "_desktop.json";
      $.ajax({
        type: "get",
        dataType: "json",
        url: `${_self.baseUrl}/${fname}`,
        //    async: false,
        success: function (result) {
          $.each(result, function (index, obj) {
            var images = JSON.parse(obj["_viewImage"]);
            item.thumbnailPath = images[0];
          });
        },
      });
    },
    isBimImage(item) {
      if (item.thumbnailPath.includes(this.baseUrl)) return false;
      return true;
    },
    linkToFilePage(row) {
      if (this.isloading == false) {
        this.parentExpand = true;
        if (row.fileSuffix.toLowerCase() == "") {
          // 打开文件夹
          if (row.lookbit == true) {
            this.pageIndex = 1;
            this.folderIuid = row.iuid;
            this.treeOpenNodes.push(row.iuid);
            this.folderLists.push({
              name: row.fileName,
              iuid: row.iuid,
            });
            this.loadData("", false);
          } else {
            this.$message({
              message: "您没有查看权限，请联系管理员开通此权限",
            });
          }
        }
      }
    },
    async showTransferView(item, row, mainfile) {
      let _this = this;
      const openApp = () => {
        _this.$openItwinApp(
          {
            appName: item.title,
            appType: item.type,
            appOrigin: item.origin,
            appImage: item.start,
            mainfile: mainfile,
          },
            row.iuid,
          true, row
        );
      };
      openApp();

      let projectInfo = await store.dispatch('queryRecentlyProject');

      // 模型文件查看日志
      let formData = new FormData();
      formData.append('Filename', row.fileName)
      formData.append('projectname', projectInfo.projectName)
      formData.append('logtype', 'ProjectFileviewing')

      request.post('api/Log/AddFileviewing', formData)
    },
    async querySelectConversion() {
      var res = await projectFileApi.querySelectConversion({});
      if (res.code) {
        this.Conversion = res.data;
      }
    },
    //-------------------chunkUploader组件必须----------------------------------
    changeUploadDialogVisible(event) {
      event.preventDefault();
      if (event.type === "dragenter") {
        this.elementNode = event.target;
        this.$chunkUploaderChangeVisible(this.$refs["chunkUploader"], true);
      } else if (event.type === "dragleave") {
        if (this.elementNode === event.target) {
          this.uploadDialogVisible = false;
          this.$chunkUploaderChangeVisible(this.$refs["chunkUploader"]);
        }
      } else if (event.type === "drop") {
        this.$chunkUploaderChangeVisible(this.$refs["chunkUploader"]);
        let items = event.dataTransfer.items;
        this.$refs["chunkUploader"].fileDrop(items, this.getFolderFullPath());
      }
    },
    //-------------------chunkUploader组件必须----------------------------------
    getFolderFullPath() {
      let folderFullPath = "";
      if (this.folderLists.length != 0) {
        this.folderLists.forEach((element) => {
          folderFullPath = folderFullPath + "/" + element.name;
        });
        folderFullPath = "项目" + "/" + this.currentName + folderFullPath;
        return folderFullPath;
      } else return "";
    },
    async fileFolderUpload(event) {
      var _self = this;
      this.$refs.chunkUploader.fileData = [];
      if (event.target.files.length > 1000) {
        this.$message.warning(
          "单次仅支持1000以内的文件上传，可以通过上传压缩包再线上解压的形式上传大批量文件。"
        );
        return;
      }
      for (var i = 0; i < event.target.files.length; i++) {
        let item = event.target.files[i];
        let arr;
        arr = item.name.substring(item.name.lastIndexOf("."));
        this.$refs.chunkUploader.fileData.push({
          folderIuid: _self.folderIuid,
          menuDefaultActive: _self.currentIuid,
          isProject: true,
          fileName: item.name,
          fileSuffix: arr,
          Operatingstate: 0,
          Operationmode: 0,
          sign: null, //作为标识传给后台，后台有用
          fullPath: _self.getFolderFullPath(),
          relativePath: item.webkitRelativePath,
          file: item,
          fileSize: _self.$getFileSize(item.size),
          lastModifiedData: _self.$dayjs(item.lastModifiedDate, "YYYY-MM-DD HH:mm:ss"),
          uploadTime: _self.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
        });
      }
      await this.$refs.chunkUploader.uploadDragFile();
      event = {};
    },
    submitFile(file) {
      var files = file.target.files;
      var _self = this;
      this.$refs.chunkUploader.fileData = [];
      var arr;
      for (var i = 0; i < files.length; i++) {
        arr = files[i].name.substring(files[i].name.lastIndexOf("."));
        this.$refs.chunkUploader.fileData.push({
          folderIuid: _self.folderIuid,
          menuDefaultActive: _self.currentIuid,
          isProject: true,
          fileName: files[i].name,
          relativePath: files[i].name,
          fullPath: _self.getFolderFullPath(),
          fileSuffix: arr,
          Operatingstate: 0,
          Operationmode: 0,
          sign: null, //作为标识传给后台，后台有用
          file: files[i],
          fileSize: _self.$getFileSize(files[i].size),
          lastModifiedData: _self.$dayjs(
            files[i].lastModifiedDate,
            "YYYY-MM-DD HH:mm:ss"
          ),
          uploadTime: _self.$dayjs(new Date(), "YYYY-MM-DD HH:mm:ss"),
          // speed: 0,
        });
      }
      this.$refs.chunkUploader.uploadDragFile();
      this.$refs.fileUploader.value = "";
    },
    handleSelect(key, keyPath) {
      this.locationRowIndex = null;
      this.currentIuid = key;
      this.folderLists = [];
      this.folderIuid = "";
      this.loadData("", false);
    },
    handleSelectionChange(val) {
      this.tableSelection = val;
      // console.log(this.tableSelection);
      var rule = false;
      if (this.tableSelection.length > 1) {
        for (let index = 0; index < this.tableSelection.length; index++) {
          const element = this.tableSelection[index];
          rule = this.$preViewLinkCheck(element);
          if (!rule) {
            this.multiplePreViewVisible = false;
            return;
          }
        }
      }
      this.multiplePreViewVisible = rule;
    },
    sortChange(column, prop, order) {
      this.locationRowIndex = null;
      if (column.order === null) {
        column.order = "ascending";
      }
      this.sortColumn = JSON.parse(JSON.stringify(column));
      this.sortColumn.order = this.sortColumn.order == "ascending" ? "asc" : "desc";
      this.orderBy = column.order == "ascending" ? "ASC" : "DESC";
      this.loadData("", false);
    },

    // 得到当前项目已发起的全部工作流
    async loadWorkflow() {
      this.workflowData = [];
      let data = new FormData();
      data.append("projectiuid", this.projectId);
      var res = await postApi.post("/api/projectworkflow/projectworkflowData", data);
      if (res.code == 1) {
        this.workflowData = res.data;
      }
    },
    showfolderDialog(type, row) {
      this.addFilePopVisible = false;
      this.folderDialogOpeType = type; // 'add' 'reset'
      if (this.folderDialogOpeType === "reset") {
        if (row.ischeck == true) {
          this.$warning("文件正在审批中！");
        } else {
          this.folderForm.name = row.fileName.substr(
            0,
            row.fileSuffix.toLowerCase().length > 0
              ? row.fileName.lastIndexOf(".")
              : row.fileName.length
          );
          this.folderForm.IUID = row.iuid;
          this.folderDialogVisble = true;
        }
      } else {
        this.folderForm.name = "";
        this.folderDialogVisble = true;
      }
    },
    addFolder(index, type, addType) {
      this.folderDialogIndex = index;
      this.folderDialogAddType = addType;
      if (index == 0) {
        if (
          this.formData.TargetIUID == "" &&
          (this.formData.Operationtype == "YD" || this.formData.Operationtype == "FZ")
        ) {
          this.$message({
            message: "请选择目标文件",
          });
        } else {
          this.folderDialogVisble = true;
        }
      } else {
        if (
          this.slectedClick != 1 &&
          (this.formData.Operationtype == "YD" || this.formData.Operationtype == "FZ")
        ) {
          this.$message({
            message: "请选择目标文件",
          });
        } else {
          this.folderDialogVisble = true;
        }
      }
    },
    async onSubmitFolderInfo(type) {
      if (!this.$fileNameCheck(this.folderForm.name)) {
        return;
      }
      if (this.folderDialogAddType == "treeAdd") {
        if (this.folderDialogIndex == 1) {
          var formData = new FormData();
          formData.append("IUID", this.formData.TargetIUID);
          formData.append("name", this.folderForm.name);
          var res = await postApi.post("/api/Drawing/DrawingFileAdd", formData);
          this.$message(res.msg);
          this.myTree(1);
          this.folderDialogVisble = false;
        } else {
          if (this.treeIsvisible != false) {
            var formData = new FormData();
            formData.append("name", this.folderForm.name);
            formData.append("MainIUID", this.leftFileIUID);
            formData.append("IUID", this.leftFileMainIuid);
            var res = await projectFileApi.addFolder(formData);
            this.$message(res.msg);
            this.projectTree(0);
            this.folderDialogVisble = false;
          } else {
            var formData = new FormData();
            formData.append("MainIUID", this.formData.TargetIUID);
            formData.append("Name", this.folderForm.name);
            var res = await postApi.post(
              "/api/ProjectManagement/ProjectFileAdd",
              formData
            );
            this.$message(res.msg);
            this.projectTree(0);
            this.folderDialogVisble = false;
          }
        }
      } else {
        var fileName = this.folderForm.name;
        if (this.folderForm.name == "") {
          this.folderDialogVisble = false;
          return false;
        }
        // if (this.folderForm.name.indexOf('.') == -1) {
        //   fileName = this.folderForm.name
        // } else {
        //   fileName = this.folderForm.name.slice(0, this.folderForm.name.indexOf('.'))
        // }
        if (this.folderDialogOpeType === "reset") {
          var formData = new FormData();
          formData.append("IUID", this.folderForm.IUID);
          formData.append("Name", fileName);
          var res = await projectFileApi.resetFileOrFolderName(formData);
          if (res.code === 1) {
            this.$operateSuccess();
            this.loadData();
            this.folderDialogVisble = false;
          }
        } else if (this.folderDialogOpeType === "add") {
          this.folderForm.MainIUID = this.currentIuid;
          this.folderForm.IUID = this.folderIuid;
          var formData = this.$objectToFormData(this.folderForm);
          var res = await projectFileApi.addFolder(formData);
          if (res.code === 1) {
            this.$addSuccess();
            this.loadData();
            this.folderDialogVisble = false;
          }
        } else {
          this.folderForm.MainIUID = this.currentIuid;
          this.folderForm.IUID = this.folderIuid;
          var formData = this.$objectToFormData(this.folderForm);
          var res = await projectFileApi.addFileFolder(formData);
          if (res.code === 1) {
            this.$addSuccess();
            this.loadData();
            this.folderDialogVisble = false;
          }
        }
      }
    },
    async deleteVersionFilesCallBack(data) {
      var masterFilesIUID = this.tableSelection.map((item) => {
        return item.iuid;
      });
      var res = await postApi.post("/api/ProjectManagement/ProjectFileDetailsDeleteNew", {
        FilesIUID: masterFilesIUID.join(","),
        versionFilesIUID: data.join(","),
      });
      if (res.code == 1) {
        this.$deleteSuccess();
      } else if (res.code == -2) {
        this.pdsVisible = true;
        this.deleteFilelist = res.data.deleteFilelist;
        this.successcount = res.data.successcount;
        this.failurecount = res.data.failurecount;
      }
      if (this.tableData.length == 1 && this.pageIndex > 1) {
        this.pageIndex = this.pageIndex - 1;
      }
      this.loadData();
      this.deleteLoading = false;
    },
    async handleDelete() {
      let arr = this.tableSelection.map((item) => item.ischeck);
      if (arr.indexOf(true) > -1) {
        if (arr.length == 1) {
          this.$warning("删除失败：所选文件已进入审批交付阶段！");
        } else {
          this.$warning("删除失败：部分文件已进入审批交付阶段！");
        }
      } else {
        this.deleteLoading = true;
        var versionFilesPostData = this.tableSelection.map((item) => {
          return item.iuid;
        });
        var versionFilesPostStr = versionFilesPostData.join(",");
        var versionFilesRes = await postApi.post(
          "/api/ProjectManagement/ProjectVersionFileData?IUID=" + versionFilesPostStr
        );
        if (versionFilesRes.code == 1 && versionFilesRes.data.length > 0) {
          this.deleteVersionFiles = versionFilesRes.data;
          this.deleteVersionFilesDialogVisible = true;
        } else {
          this.$confirm("确定要删除吗？").then(async () => {
            let postData = this.tableSelection.map((item) => {
              return {
                IUID: item.iuid,
              };
            });
            var res = await projectFileApi.deleteFile(postData);
            if (res.code === 1) {
              this.$deleteSuccess();
            } else if (res.code === -2) {
              this.pdsVisible = true;
              this.deleteFilelist = res.data.deleteFilelist;
              this.successcount = res.data.successcount;
              this.failurecount = res.data.failurecount;
            }
            if (this.tableData.length == 1 && this.pageIndex > 1) {
              this.pageIndex = this.pageIndex - 1;
            }
            this.loadData("clearSelect");
            this.deleteLoading = false;
          });
        }
      }
    },
    async handleDeleteFile(data) {
      if (data.ischeck == true) {
        this.$warning("文件正在审批中！");
      } else {
        this.deleteLoading = true;
        var tableSelection = [];
        tableSelection.push(data);
        var versionFilesPostData = tableSelection.map((item) => {
          return item.iuid;
        });
        var versionFilesPostStr = versionFilesPostData.join(",");
        var versionFilesRes = await postApi.post(
          "/api/ProjectManagement/ProjectVersionFileData?IUID=" + versionFilesPostStr
        );
        if (versionFilesRes.code == 1 && versionFilesRes.data.length > 0) {
          this.deleteVersionFiles = versionFilesRes.data;
          this.deleteVersionFilesDialogVisible = true;
        } else {
          this.$confirm("确定要删除吗？").then(async () => {
            let postData = tableSelection.map((item) => {
              return {
                IUID: item.iuid,
              };
            });
            var res = await projectFileApi.deleteFile(postData);
            if (res.code === 1) {
              this.$deleteSuccess();
            } else if (res.code === -120) {
              let filePath = encodeURIComponent(
                tableSelection[0].imodelDataClose.slice(0, -11)
              );
              await closemodel(
                process.env.VUE_APP_GisIframeOrigin + "/?" + filePath + "?closemodel",
                closemodelCallback
              );
            } else if (res.code === -2) {
              this.pdsVisible = true;
              this.deleteFilelist = res.data.deleteFilelist;
              this.successcount = res.data.successcount;
              this.failurecount = res.data.failurecount;
            }
            if (this.tableData.length == 1 && this.pageIndex > 1) {
              this.pageIndex = this.pageIndex - 1;
            }
            this.loadData();
            this.deleteLoading = false;
          });
        }
      }
    },
    versionClick(row) {
      this.selectArray = [];
      this.selectArray.push(row);
      this.versionDialogVisible = true;
      this.queryVersionData();
    },
    queryADDVersionPost() {
      this.queryVersionData();
    },
    async queryVersionData() {
      var formData = new FormData();
      formData.append("MainIUID", this.selectArray[0].iuid);
      formData.append("MainFileType", this.selectArray[0].fileType);
      var res = await projectFileApi.queryFileVersion(formData);
      this.versionData = res.data;
    },
    surePermissionPost(val) {
      this.loadData("clearSelect", false);
    },
    clearLoading() {
      this.tableData.forEach(item => {
        item.downLoading = false
      })
      this.$forceUpdate()
    },
    closeMenu() {
      this.clickMenuvisible = false;
    },
    openMenu(e, item, node) {
      // if (this.projectInfo.projectTypeName === "桥梁大师项目") {
      //   return;
      // }

      if (node.level == 1) {
        this.rightClickItem = item;
        this.top = e.clientY;
        this.left = e.clientX;
        if (item.mark == 1) {
          this.clickMenuvisible = true;
        } else {
          this.$message({
            message: "您没有编辑权限噢！",
            type: "warning",
          });
        }
      }
    },
    //左侧文件删除
    handleOpeDelete(val) {
      this.folderDeleteDialogVisble = true;
      this.leftFileIUID = val.iuid;
    },
    async sureDeleteFolder() {
      var formData = new FormData();
      formData.append("IUID", this.leftFileIUID);
      var res = await projectFileApi.leftDeleteFile(formData);
      if (res.code == 1) {
        this.folderDeleteDialogVisble = false;
        this.$deleteSuccess();
        if (this.leftFileIUID == this.currentIuid) {
          this.initData();
        }
        await this.$refs["folderTree"].updateRootChild();
        this.loadData();
      }
    },
    //新建分组
    addGrouping(type) {
      this.addEditType = type;
      this.fileForm.oldPlaceholder = "";
      this.fileForm.name = "";
      this.addEditDialogVisble = true;
    },
    //编辑分组
    handleLinkEdit(val) {
      this.addEditType = "edit";
      this.addEditDialogVisble = true;
      this.fileForm.name = val.fileName;
      this.leftFileIUID = val.iuid;
    },
    async sureAddEditFolder() {
      var formData = new FormData();
      if (this.addEditType != "add") {
        formData.append("IUID", this.leftFileIUID);
      }
      formData.append("MainIUID", this.projectId);
      formData.append("Name", this.fileForm.name);
      if (this.addEditType != "add") {
        var res = await projectFileApi.leftRenameFile(formData);
      } else {
        var res = await projectFileApi.leftAddFile(formData);
      }
      if (res.code == 1) {
        this.addEditDialogVisble = false;
        this.$message(res.msg);
        this.$refs["folderTree"].updateRootChild();
        // this.loadSidebarMenuList();
      }
    },
    //上移
    async handleMoveUpDown(data, val) {
      var formData = new FormData();
      formData.append("Sort", val.sort);
      formData.append("type", data);
      formData.append("IUID", val.iuid);
      formData.append("MainIUID", this.projectId);
      var res = await projectFileApi.leftSortFile(formData);
      if (res.code == 1) {
        this.$refs["folderTree"].updateRootChild();
      }
    },

    onFolderSelectChange($event) {
      this.rightClickItem.iuid = $event;
      this.permissionSet("", this.rightClickItem);
    },

    async permissionSet(type, val) {
      this.setDialogVisible = true;
      this.viewFileIuID = val.iuid;
      this.fileOperationType = type;
      if (type == "leftFile") {
        var url = "/api/FileAuthorize/GetProjectFileAuthorizeData?IUID=" + val.iuid;
      } else {
        var url = "/api/FileAuthorize/GetAuthorizeData?IUID=" + val.iuid;
      }
      var res = await postApi.post(url);
      this.perrsionData = res.data;
      this.inheritbit = res.twodata;
    },
    copyLink(row) {
      let downloadUrl = process.env.VUE_APP_BASE_API + "/" + row.filePath;
      let input = document.createElement("input");
      input.value = downloadUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },
    filterData(val) {
      this.perrsionData = this.perrsionData.filter((i) => !val.includes(i.userName));
    },
    async handleSetMainfile() {
      //设置为主文件（旧版功能）
      // if (
      //   this.$modelFileSuffix
      //     .concat(this.$ibimFileSuffix)
      //     .indexOf(this.tableSelection[0].fileSuffix) != -1
      // ) {
      //   var IUID = this.tableSelection[0].iuid;
      //   let url = "/api/ProjectManagement/GetMasterfile?IUID=" + IUID;
      //   var res = await postApi.post(url, "");
      //   if (res.code == 1) {
      //     this.$success(res.msg);
      //     this.loadData();
      //   }
      // } else {
      //   this.$warning("请选择模型文件为主文件");
      // }
      //标段设置弹框（新版-20220908）
      let postData = this.tableSelection
        .filter((item) => {
          return this.isIModelFile(item);
        })
        .map((item) => {
          return item.iuid;
          //return { IUID: item.iuid };
        });
      //var res = await projectFileApi.GetProjectBidSectionData(postData);
      var formData = new FormData();
      formData.append("MainIUID", this.projectId);
      formData.append("FileIUID", postData);
      var res = await projectFileApi.GetProjectBidSectionData(formData);
      this.bidSectionData = res;
      this.bidSectionDialogVisible = true;
    },
    handleApplyWorkflow() {
      let arr = this.tableSelection.map((item) => item.ischeck);
      // console.log(this.tableSelection);
      if (arr.indexOf(true) > -1) {
        this.$warning("发起流程失败：所选文件已有文件正在审批中！");
      } else {
        this.applyWorkflowDialogVisible = true;
      }
      // let approveCount = this.tableSelection.map()
    },
    shiftData() {
      this.loadData("clearSelect");
    },
    /**
     * 解压压缩文件
     */
    decompression(row) {
      const loading = this.$loading({
        text: "文件正在解压，请稍等...",
        lock: true,
        body: true,
      });
      request
        .get("/api/Home/Testingtemporary", {
          params: {
            IUID: row.iuid,
            filetype: "1",
          },
        })
        .then((res) => {
          // 正常
          if (res.code === 1) {
            this.decompressionHandler(row, res, true).then((data) => {
              if (data.code === 1) {
                this.$message.success("解压成功");
                this.loadData();
              }
            });
          } else if (res.code === -99) {
            // 文件被占用
            this.$message.error(res.msg);
          } else if (res.code === -88) {
            // 之前已解压，是否覆盖
            const h = this.$createElement;
            this.$msgbox({
              title: "提示",
              message: h("div", res.msg),
              showCancelButton: true,
              confirmButtonText: "覆盖",
              cancelButtonText: "不覆盖",
              beforeClose: (action, instance, done) => {
                if (action === "close") {
                  done();
                  return;
                }
                const loading = this.$loading({
                  text: "文件正在解压，请稍等...",
                  lock: true,
                  body: true,
                });
                const isCover = action === "confirm";
                this.decompressionHandler(row, res, isCover).then(() => {
                  loading.close();
                  this.$message.success("解压成功");
                  this.loadData();
                });
                done();
              },
            });
          }
          loading.close();
        });
    },
    decompressionHandler(row, res, isCover) {
      return request.get("/api/Home/decompressingfiles", {
        params: {
          IUID: row.iuid,
          filetype: "1",
          tempIUID: res.data.tempIUID,
          typebit: isCover,
        },
      });
    },
    goBack() {
      let rootPath = "/all";
      let sourcePath = !!this.sourcePath ? this.sourcePath : rootPath;
      let PictureMode = !!this.projectIsPictureMode ? this.projectIsPictureMode : true;
      let path = `${sourcePath}?projectIsPictureMode=${PictureMode}`;
      this.$router.replace(path);
    },
  },
};
</script>
<style>
.back .el-icon-top,
.back .el-icon-back {
  font-weight: 500;
}

img.opac {
  opacity: 0.5;
}

.el-popover {
  min-width: 100px;
}

.menu-title .el-button--text {
  padding: 0;
}

.menu-title .project-title {
  margin-left: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  letter-spacing: 0.5px;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
}

.el-submenu__title {
  display: none;
}

.same .el-dialog__footer {
  text-align: center;
}

.fileIconName {
  /* width: 100%; */
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  -webkit-line-clamp: 1;
}

/* .el-dropdown {
  margin-right: 10px;
} */
.left .el-form-item__content {
  margin-left: 0 !important;
}

.t-table .el-checkbox {
  margin-left: 0;
}

.t-table .el-tag {
  margin-bottom: 0;
}

.t-table .el-link--inner {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  -webkit-line-clamp: 1;
}

.t-table .t-table-header {
  background-color: #f2f3f4;
}

.t-table .t-table-header th,
.t-table .t-table-header tr {
  background-color: #f2f3f4;
}

.t-table .t-table-header th {
  border-right: 1px solid #ddd;
}

.t-table .el-table__body-wrapper td {
  border-right: none;
}
</style>
<style scoped lang="scss">
.back {
  cursor: pointer;
  margin-right: 15px;
  padding-right: 15px;
  border-right: 1px solid #dcdfe6;
  border-radius: 0;
}

.menu-list1 {
  width: 220px;
  background-color: #e5ebf6;
  transition: all 0.2s;

  &.collapse {
    width: 0;
  }
}

.scrollContainer {
  flex-grow: 1;
  margin-left: 20px;
}

.myShareBox {
  font-size: 14px;
  position: absolute;
  bottom: 54px;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid rgb(220, 223, 230);
}

.folderIcon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.projectName {
  // display: flex;
  margin-left: 10px;
  height: 32px;
  font-weight: 500;
}

.buttonStyle {
  color: #0d99ff;
  background: #eff3ff;
  border-color: #0d99ff;
}

.buttonStyle:hover {
  background: #0d99ff;
  color: white;
}

.file-menu {
  height: 100%;
  // padding-top: 15px;
  border-right: none;
}

.btn_box {
  padding-left: 20px;
}

.btn_box>* {
  margin-right: 10px;
}

.left_btn {
  position: relative;
  display: inline-block;
}

.drop_btn {
  font-size: 14px;
  padding-top: 3px;
  position: absolute;
  top: 35px;
  left: 0px;
  width: 110px;
  z-index: 99;
  background-color: white;
  box-shadow: 0 0 10px #ccc;
  border-radius: 3px;
}

.upload_btn {
  position: relative;
  display: inline-block;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  margin-right: 0px;
}

.t-table {
  ::v-deep .title {
    user-select: none;
  }
}

.table-box {
  .table {
    margin-bottom: 0;
    flex: 0 0 auto;

    ::v-deep .el-table {
      height: auto !important;
      position: relative;

      .el-table__body-wrapper {
        height: auto !important;
      }
    }
  }
}

.contextmenu {
  margin: 0;
  padding: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  /* box-shadow: 1px 2px 3px 1px rgba(0, 0, 0, 0.3); */
  box-shadow: 1px 2px 3px 2px rgba(0, 0, 0, 0.08);
}

.contextmenu li {
  margin: 0;
  cursor: pointer;
  width: 128px;
  height: 34px;
  line-height: 34px;
  padding-left: 20px;
}

.contextmenu li:hover {
  background: #ebeef5;
}

.uploadFile {
  margin-right: 0;

  ::v-deep .el-upload-list {
    display: none;
  }

  ::v-deep button {
    padding: 7px 15px;
  }
}

.el-menu-item {
  padding-left: 29px;
  height: 38px;
  line-height: 38px;
}

.topTitle {
  text-align: center;
  padding-bottom: 30px;
}

.bottomCon {
  background: #f7f7f7;
  color: #424e67;
  // padding: 0 15px 15px 15px;
  margin-bottom: 20px;
}

.existing {
  flex: 1;
  padding-top: 17px;
}

.existingTit {
  justify-content: space-around;
  color: rgba(64, 158, 255, 1);
  padding-bottom: 17px;
}

.fileInfo {
  padding-left: 33px;
  line-height: 33px;
  color: gray;
}

.active {
  background: rgba(228, 233, 240, 1) !important;
}

.bim-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.thumb-image {
  width: 60%;
  height: 80%;
}

.vertical-button {
  // flex-direction: column;
  display: none;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 5px;
  position: absolute;
  width: 100%;
  height: 32px;
  bottom: 4px;
  flex: none;
  order: 3;
  flex-grow: 0;
  z-index: 3;

  .one-button {
    display: flex;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0.7;
    width: 30px;
    height: 30px;
    margin-bottom: 2px;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
  }
}

.horizontal-button {
  display: flex;
  overflow: hidden;
  position: absolute;
  height: 40px;
  top: 0;
  right: 5px;
  // left: 110px;
  align-items: center;

  &.tree-btn {
    top: 40px;
  }

  .one-button {
    margin-top: 0;
    background: rgba(0, 0, 0, 0.8);
    opacity: 0.8;
    width: 32px;
    height: 32px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
  }
}
</style>

<style lang="scss">
.downLoadBtn1 {
  color: #8f9ab4;
  opacity: 0.4;
  font-size: 18px;
  vertical-align: middle;
}

.tableOpeColMargin {
  .icon-share {
    &:before {
      display: block;
    }
  }
}

.bridge-table {
  thead {
    color: rgb(35, 35, 35);
    font-family: 黑体;
    font-weight: 400;

    th {
      background-color: rgb(244, 244, 244) !important;
      padding: 0 !important;
    }
  }
}

.task-assignment-dialog {
  display: flex;
  align-items: center;
  justify-content: center;

  .el-dialog {
    margin-top: 0 !important;
  }

  .content {
    max-height: 70vh;
    overflow: auto;
  }
}
</style>
