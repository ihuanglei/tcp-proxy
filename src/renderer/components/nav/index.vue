<template>
  <div class="menu">
    <el-menu router mode="horizontal" background-color="#ab0808" text-color="#fff" active-text-color="#fff">
      <el-menu-item index="1" :route="{ path: '/' }">首页</el-menu-item>
      <el-menu-item index="2" :route="{ path: '/log' }">日志</el-menu-item>
      <el-menu-item index="3" :route="{ path: '/about' }">关于我</el-menu-item>
    </el-menu>
    <div class="btns">
      <el-button type="danger" icon="el-icon-minus" circle size="small" @click="onMinimizeClick"></el-button>
      <el-button type="danger" icon="el-icon-close" circle size="small" @click="onCloseClick"></el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    onMinimizeClick() {
      window.$TPSDK && window.$TPSDK.minimize()
    },
    onCloseClick() {
      this.$confirm('您确定要退出?', '系统', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.$TPSDK && window.$TPSDK.close()
        })
        .catch(() => {})
    }
  }
}
</script>
<style scoped>
.menu {
  -webkit-app-region: drag;
  position: relative;
}
.menu /deep/ .el-menu-item {
  -webkit-app-region: no-drag;
}
.btns {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1000;
  top: 16px;
  right: 20px;
  -webkit-app-region: no-drag;
}

.menu .btns /deep/ .el-button {
  width: 24px;
  height: 24px;
  line-height: 24px;
  padding: 0;
}
.menu .btns /deep/ .el-icon-close {
  font-size: 14px;
}
</style>