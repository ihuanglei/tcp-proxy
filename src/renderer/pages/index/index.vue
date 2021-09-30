<template>
  <div class="index">
    <div class="index-btns">
      <el-button icon="el-icon-plus" ref="" @click="onAddClick">添加</el-button>
    </div>
    <el-table :data="data" stripe style="width: 100%">
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="localPort" label="本地端口号" width="180"> </el-table-column>
      <el-table-column prop="remoteHost" label="远程地址" width="180"> </el-table-column>
      <el-table-column prop="remotePort" label="远程端口号" width="180"> </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" size="small" slot="reference" @click="onEditClick(scope.$index, scope.row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="onDelClick(scope.$index)">
            <el-button icon="el-icon-delete" size="small" slot="reference">删除</el-button>
          </el-popconfirm>
          <el-button :type="scope.row.running ? 'success' : ''" :loading="scope.row.loading" :icon="scope.row.running ? 'el-icon-video-pause' : 'el-icon-video-play'" size="small" slot="reference" @click="onRunClick(scope.$index)">{{ scope.row.running ? '运行中' : '运行' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加代理" :visible.sync="show" width="50%" center @close="onEditFormClose" :close-on-click-modal="false">
      <el-form ref="editForm" :model="detail" label-width="120px" status-icon :show-message="false">
        <el-form-item label="名称" prop="name" :rules="[{ required: true }]">
          <el-input v-model="detail.name"></el-input>
        </el-form-item>
        <el-form-item label="本地端口号" prop="localPort" :rules="[{ required: true }]">
          <el-input v-model="detail.localPort"></el-input>
        </el-form-item>
        <el-form-item label="远程地址" prop="remoteHost" :rules="[{ required: true }]">
          <el-input v-model="detail.remoteHost"></el-input>
        </el-form-item>
        <el-form-item label="远程端口号" prop="remotePort" :rules="[{ required: true }]">
          <el-input v-model="detail.remotePort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="show = false">取消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="onSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const KEY = 'pt_data'
export default {
  data() {
    return {
      show: false,
      idx: undefined,
      detail: {
        name: '',
        localPort: '',
        remoteHost: '',
        remotePort: '',
        running: false,
        loading: false
      },
      data: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    async load() {
      this.data = (window.$TPSDK && (await window.$TPSDK.load(KEY))) || []
    },
    reset() {
      this.detail = {
        name: '',
        localPort: '',
        remoteHost: '',
        remotePort: ''
      }
    },
    onEditFormClose() {
      this.reset()
      this.$refs['editForm'].clearValidate()
      this.$refs['editForm'].resetFields()
    },
    onAddClick() {
      this.show = true
    },
    onEditClick(idx, row) {
      this.idx = idx
      Object.assign(this.detail, row)
      this.show = true
    },
    onDelClick(idx) {
      this.data.splice(idx, 1)
      window.$TPSDK && window.$TPSDK.save(KEY, this.data)
    },
    onRunClick(idx) {
      let d = Object.assign({}, this.data[idx])
      d.loading = true
      d.running = d.running || false
      this.data.splice(idx, 1, d)
      this.$nextTick(() => {
        if (window.$TPSDK) {
          let callback = (code, err) => {
            let d = Object.assign({}, this.data[idx])
            if (code === 500) {
              this.$message.error(err)
            } else if (code === 200) {
              d.running = true
            } else if (code === 300) {
              d.running = false
            }
            d.loading = false
            this.data.splice(idx, 1, d)
            console.log(code, err)
          }

          if (d.running === false) {
            window.$TPSDK.createProxy(d, callback)
          } else {
            window.$TPSDK.closeProxy(d.localPort)
          }
        }
      })
    },
    onSubmit() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          if (this.idx !== undefined) {
            let d = Object.assign({}, this.detail)
            this.data.splice(this.idx, 1, d)
          } else {
            this.data.push(Object.assign({}, this.detail))
          }
          this.idx = undefined
          this.show = false
          window.$TPSDK && window.$TPSDK.save(KEY, this.data)
        }
      })
    }
  }
}
</script>
<style scoped>
.index-btns {
  padding: 10px;
}
</style>