<template>
  <div>
    <el-result icon="info" title="TCP Proxy" subTitle="Rome is not build in one day day！ Emm...">
      <template slot="extra">
        https://ihuanglei.org
        <el-divider></el-divider>
        <el-button type="text" @click="onToggleDevToolsClick">调试</el-button>
      </template>
    </el-result>
  </div>
</template>
<script>
export default {
  methods: {
    onToggleDevToolsClick() {
      window.$TPSDK && window.$TPSDK.toggleDevTools()
    }
  }
}
</script>