<template>
  <el-dialog append-to-body width="500px" :title="auditInfo.title" :close-on-click-modal="false" :visible="visible" @update:visible="$emit('update:visible', $event)">
    <el-form label-width="70px" label-position="right">
      <el-form-item style="align-items: center;" v-if="loaded" v-for="(item,nodeIdx) in auditInfo.nodeData" :key='nodeIdx' :label="item.name+':'" :required="item.name!='抄送人'&&status!='detail'">
        <div class="flex">
          <div style="flex-grow: 1;display: flex;align-items: center;">
            <div style="margin-left: 10px;color:#999" v-if="item.selectUsers.length==0">请选择{{item.name}}</div>
            <div v-else style="display: flex;align-items: center;">
              <el-tag  v-for="(tag,userIdx) in item.selectUsers" :key="tag.name" size="small" style="margin: 0 4px;" :type="item.isEdit?'info':''" :closable="!item.isEdit" @close="deleteThis(nodeIdx,tag.ryid,userIdx)">{{tag.name}}</el-tag>
            </div>
          </div>
          <!-- <el-input disabled :placeholder="`请选择${item.name}`" style="margin-left: 20px;width:280px" v-model="item.selectUsers" /> -->
          <el-button :disabled="item.isEdit" type="text" style="margin-left: 10px;" @click="selectPeople(item.userData)">{{status=='create'?'选择':'修改'}}</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div style="text-align: right">
          <el-button size="small" :loading="loading" type="primary" @click="submit">{{ $t('base.button.confirm') }}</el-button>
          <el-button size="small" @click="$emit('update:visible', false)">{{ $t('base.button.cancel') }}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog class="select-proofread-dialog" append-to-body v-dialogDrag :title="$t('base.button.pleaseSelect')" :close-on-click-modal="false" width="700px" :visible.sync="selectProofreadDialog" @close="closeSelectDialog">
      <div class="content">
        <div class="left">
          <div class="title">请选择</div>
          <div class="select-box">
            <el-select filterable multiple placeholder="搜索" v-model="proofreadCopy">
              <el-option v-for="item in peopleList" :key="item.ryid" :label="item.name" :value="item.ryid" />
            </el-select>
          </div>
        </div>
        <div class="right">
          <el-checkbox-group v-model="proofreadCopy" style="display: flex; flex-direction: column; padding: 0 20px">
            <el-checkbox v-for="item of peopleList" :key="item.ryid" :label="item.ryid">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectProofreadDialog = false" size="small">{{ $t('base.button.cancel') }}</el-button>
        <el-button type="primary" size="small" @click="selectProofreadDialog = false">{{ $t('base.button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
  import request from '../../utils/request'
  import postApi from "@/api/document/indexApi.js";
  export default {
    name: 'modelAuditDialog',
    props: {
      status: {
        type: String,
      },
      visible: {
        type: Boolean,
        required: true
      },
      getData:{
        type: Function
      },
      tableSelection: {
        type: Array,
        default: () => ([])
      },
      major: {
        type: String
      }
    },
    data() {
      return {
        loaded: false,
        auditInfo: {
          nodeData: []
        },
        loading: false,
        selectProofreadDialog: false,
        proofreadCopy: [],
        peopleList: []
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      //
      async initData() {
        let iuids = this.tableSelection.map(item => item.iuid)
        if (this.status == 'create') {
          // 发起阶段
          await request.post('/api/Verify/GetpullData', {
            zyiuid: this.major,
            filelist: iuids
          }).then(res => {
            this.loaded = true
            res.data.nodeData.forEach(item => item.selectUsers = '')
            this.auditInfo = res.data
          })
        } else if (this.status == 'detail') {
          // 修改审批人阶段
          let form = new FormData()
          form.append('iuid', this.tableSelection[0].iuid)
          let res = await postApi.post('/api/Verify/GetFilestepuserData', form)
          res.data.nodeData.forEach(item => item.selectUsers = item.userData.filter(item1 => item1.ismark).map(item => item))
          this.auditInfo = res.data
          this.$forceUpdate()
          this.loaded = true
        }
      },
      deleteThis(nodeIdx, ryid, userIdx) {
        this.auditInfo.nodeData[nodeIdx].userData.filter(item => item.ryid == ryid)[0].ismark = false
        this.auditInfo.nodeData[nodeIdx].selectUsers.splice(userIdx, 1)
      },
      // 选择人员
      selectPeople(userData) {
        this.peopleList = userData
        this.proofreadCopy = this.peopleList.filter(item => item.ismark).map(item => item.ryid)
        this.selectProofreadDialog = true
      },
      // 关闭选择人员弹窗
      closeSelectDialog() {
        this.peopleList.forEach(item => {
          item.ismark = this.proofreadCopy.includes(item.ryid);
        })
        this.auditInfo.nodeData.forEach(item => {
          item.selectUsers = item.userData.filter(item1 => item1.ismark).map(item => item)
          // .join(',')
        })
      },
      // 提交
      async submit() {
        // if(process.env.NODE_ENV === "development"){
          // let baseUrl = 'http://59.110.13.103:3018/#'
          // this.auditInfo.Url = baseUrl+this.$route.fullPath
        // }else{
          this.auditInfo.Url = location.href.slice(0,location.href.indexOf('?'))
        // }
        for (let i = 0; i < this.auditInfo.nodeData.length; i++) {
          let userData = this.auditInfo.nodeData[i].userData
          if (!userData.some(item => item.ismark)&&this.auditInfo.nodeData[i].name!='抄送人') {
            this.$message.warning('请选择必选项')
            return
          }
        }
        this.loading = true
        let params = JSON.parse(JSON.stringify(this.auditInfo))
        params.nodeData.forEach(item => item.selectUsers = undefined)
        if (this.status == 'create') {
          request.post('/api/Verify/AddFileWorkflow', params).then(res => {
            if (res.code === 1) {
              this.$message.success('审批已提交')
              this.$emit('getData')
              this.$emit('update:visible', false)
            }
          }).finally(() => {
            this.loading = false
          })
        } else if (this.status == 'detail') {
          let data = {
            iuid: this.tableSelection[0].iuid,
            nodeData: this.auditInfo.nodeData
          }
          request.post('/api/Verify/GetFilestepuserEdit', data).then(res => {
            if (res.code === 1) {
              this.$message.success('审批人修改成功')
              this.$emit('update:visible', false)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      },
    }
  }
</script>
<style lang="scss">
  .select-proofread-dialog {
    .el-dialog__body {
      height: 50vh;
      overflow: hidden;
    }

    .content {
      display: flex;
      height: 100%;
      overflow: hidden;

      >.left {
        width: 50%;
        margin-left: 5px;
        padding-right: 5px;
        border-right: 1px solid #dddddd;

        >.title {
          color: #666666;
          margin-bottom: 10px;
        }

        >.select-box {
          >.el-select {
            width: 100%;

            .el-input__inner {
              border: none;
              border-bottom: 1px solid #DCDFE6;
              border-radius: 0;
            }
          }
        }
      }

      >.right {
        flex-grow: 1;
        overflow: auto;
      }
    }
  }
</style>
