<template>
  <div id="app">
    <div class="wrap">
      <!-- <div style="margin:auto"> -->
        <table class="pew">
          <tr v-for="i in 2" :key="i">
            <td v-for="i in 100" :key="i"></td>
          </tr>
        </table>
        <!-- </div> -->
      </div>
    </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
html,body{
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wrap{
  border: 1px solid black;
  display: inline-grid;
  /* align-items: unsafe center;
  justify-content: unsafe center; */
  width:800px;
  height: 400px;
  overflow: auto;
}


.pew{
  border: 1px solid black;
  border-collapse: collapse;
  width: max-content;
  margin: auto;
}

.pew td{
  border: 1px solid black;
  width:30px;
  height: 30px;
}
</style>
