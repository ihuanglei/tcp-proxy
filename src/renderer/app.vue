<template>
  <div>
    <Nav />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
import Nav from '@/components/nav'
export default {
  components: {
    Nav
  }
}
</script>
<style>
html,
body,
#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

</style>