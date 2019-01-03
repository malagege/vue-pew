<template>
  <div id="app">
    <the-header></the-header>
    <div class="container">
      <div class="wrap">
        <div>
          <table class="pew">
            <tr v-for="row in Array.from(table.keys())" :key="row">
              <!--Array.from(table[row].keys()) 改成table[row].length-->
              <td
                :style="{background: table[row][col].color}"
                v-for="col in Array.from(table[row].keys())"
                :key="col"
                :row="row"
                :col="col"
                @click="tdChgColor($event)"
              >{{ table[row][col].index }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="control">
        <div class="group_wrap" v-for="(obj,index) in groups" :key="index">
          <label>
            <input type="radio" v-model="now_selected" :value="index">
            <input type="color" v-model="obj.color">
            <label-input v-model="obj.name"></label-input>
            <button @click="removeGroup(index)">刪除</button>
          </label>
        </div>
        <div class="group_wrap text-center" @click="newGroup">➕ 新增群組</div>
        <div class="group_wrap text-center" @click="randGroup">🔱 隨機分組排序</div>
      </div>
    </div>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import LabelInput from "./components/LabelInput.vue";

export default {
  name: "app",
  components: {
    TheHeader,
    LabelInput
  },
  data() {
    return {
      now_selected: null,
      groups: [
        {
          name: "Group1",
          color: "#aefeed",
          metas: [
            {
              row: 1,
              col: 1
            },
            {
              row: 2,
              col: 2
            }
          ]
        },
        {
          name: "Group2",
          color: "#cfacfc",
          metas: [
            {
              row: 3,
              col: 3
            }
          ]
        },
        {
          name: "Group3",
          color: "#caecbc",
          metas: []
        }
      ],
      totalRows: 10,
      totalCols: 10
    };
  },
  methods: {
    getRandomColor() {
      var letters = "ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
      }
      return color;
    },
    newGroup() {
      this.groups.push({
        name: "New Group",
        color: this.getRandomColor(),
        metas: []
      });
    },
    randGroup() {
      this.groups.forEach((group, index) => {
        // console.log("shuffle", this.shuffle(group.metas));
        // this.$set(this.groups[index], "metas", this.shuffle(group.metas));
        // group.metas.sort(v => 0.5 - Math.random());
        this.groups[index].metas.splice(this.shuffle(group.metas).length, 0);
        console.log("group", group);
      });
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    removeGroup(index) {
      this.groups.splice(index, 1);
    },
    tdChgColor($event) {
      if (this.now_selected != null) {
        // 檢查td是否有顏色
        console.log("target", $event.currentTarget);
        let row = $event.currentTarget.getAttribute("row");
        let col = $event.currentTarget.getAttribute("col");
        console.log(row + " this.table[row]:" + this.table[row]);
        if (this.table[row][col].color != "none") {
          // 相同顏色取消color
          if (this.table[row][col].group == this.now_selected) {
            this.groups[this.now_selected].metas.splice(
              this.groups[this.now_selected].metas.findIndex(
                (obj, index) => index + 1 == this.table[row][col].index
              ),
              1
            );
            return false; // 不做填色處理
          } else {
            //移除不同顏色
            this.groups[this.table[row][col].group].metas.splice(
              this.groups[this.table[row][col].group].metas.findIndex(
                (obj, index) => index + 1 == this.table[row][col].index
              ),
              1
            );
          }
        }

        this.groups[this.now_selected].metas.splice(
          this.groups[this.now_selected].metas.length,
          0,
          {
            row: $event.currentTarget.getAttribute("row"),
            col: $event.currentTarget.getAttribute("col")
          }
        );
      } else {
        alert("請選擇顏色!!");
      }
    },
    log(l) {
      console.log(l);
    }
  },
  computed: {
    table() {
      console.log("this.groups", this.groups);
      let arr = Array.apply(null, Array(this.totalRows));
      //只能用在null上面....
      arr.forEach(
        (obj, index) => (arr[index] = Array.apply(null, Array(this.totalCols)))
      );
      //color沒定義的時候，render table時候null會發生錯誤
      arr.forEach((row, index1) => {
        row.forEach((col, index2) => (arr[index1][index2] = { color: "none" }));
      });
      console.log("arr", arr);
      this.groups.forEach((group, i) => {
        console.log("group.meta", group.metas);
        group.metas.forEach(
          (meta, index) =>
            (arr[meta.row][meta.col] = {
              color: group.color,
              index: index + 1,
              group: i
            })
        );
      });
      return arr;
    }
  }
};
</script>

<style>
html,
body {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1000px;
  width: 80%;
  margin: 0px auto;
}

.container {
  display: flex;
  margin-top: 10px;
}

.wrap {
  border: 1px solid black;
  display: inline-grid;
  width: 600px;
  height: 400px;
  overflow: auto;
}
.wrap > div {
  margin: auto;
  padding: 10px;
}

.pew {
  border: 1px solid black;
  /* border-collapse: collapse; */
  width: max-content;
  margin: auto;
}

.pew td {
  border: 1px solid black;
  width: 30px;
  height: 30px;
  text-align: center;
}

.group_wrap {
  padding: 5px 2px;
  padding: 1px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 1px;
}

.group_wrap:hover {
  background: #e1e1e1;
}

.control {
  background: #f5f5f5;
}

.text-center {
  text-align: center;
  height: 25px;
}
</style>
