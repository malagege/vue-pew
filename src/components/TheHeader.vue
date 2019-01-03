<template>
  <header>
    <h1>Vue-pew</h1>
  </header>
</template>

<script>
export default {
  name: "TheHeader",
  data() {
    return {};
  }
};
</script>

<style scoped>
header {
  position: relative;
  height: 100px;
}
header h1 {
  background: #f5f5f5;
  position: fixed;
  margin: 0px;
  height: 100px;
  left: 0px;
  right: 0px;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: calc(-500px + 100vw / 2);
  padding-right: 30px;
  box-sizing: border-box;
}
</style>
