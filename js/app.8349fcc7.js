(function(e){function t(t){for(var o,s,l=t[0],u=t[1],i=t[2],p=0,f=[];p<l.length;p++)s=l[p],n[s]&&f.push(n[s][0]),n[s]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);c&&c(t);while(f.length)f.shift()();return a.push.apply(a,i||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],o=!0,l=1;l<r.length;l++){var u=r[l];0!==n[u]&&(o=!1)}o&&(a.splice(t--,1),e=s(s.s=r[0]))}return e}var o={},n={app:0},a=[];function s(t){if(o[t])return o[t].exports;var r=o[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=o,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(r,o,function(t){return e[t]}.bind(null,o));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],u=l.push.bind(l);l.push=t,l=l.slice();for(var i=0;i<l.length;i++)t(l[i]);var c=u;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"034f":function(e,t,r){"use strict";var o=r("64a9"),n=r.n(o);n.a},"159b":function(e,t,r){"use strict";var o=r("1c91"),n=r.n(o);n.a},"1c91":function(e,t,r){},"56d7":function(e,t,r){"use strict";r.r(t);var o=r("2b0e"),n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("the-header"),r("div",{staticClass:"container"},[r("div",{staticClass:"wrap"},[r("div",[r("table",{staticClass:"pew"},e._l(Array.from(e.table.keys()),function(t){return r("tr",{key:t},e._l(Array.from(e.table[t].keys()),function(o){return r("td",{key:o,style:{background:e.table[t][o].color},attrs:{row:t,col:o},on:{click:function(t){e.tdChgColor(t)}}},[e._v(e._s(e.table[t][o].index))])}),0)}),0)])]),r("div",{staticClass:"control"},[e._l(e.groups,function(t,o){return r("div",{key:o,staticClass:"group_wrap"},[r("label",[r("input",{directives:[{name:"model",rawName:"v-model",value:e.now_selected,expression:"now_selected"}],attrs:{type:"radio"},domProps:{value:o,checked:e._q(e.now_selected,o)},on:{change:function(t){e.now_selected=o}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:t.color,expression:"obj.color"}],attrs:{type:"color"},domProps:{value:t.color},on:{input:function(r){r.target.composing||e.$set(t,"color",r.target.value)}}}),r("label-input",{model:{value:t.name,callback:function(r){e.$set(t,"name",r)},expression:"obj.name"}}),r("button",{on:{click:function(t){e.removeGroup(o)}}},[e._v("刪除")])],1)])}),r("div",{staticClass:"group_wrap text-center",on:{click:e.newGroup}},[e._v("➕ 新增群組")]),r("div",{staticClass:"group_wrap text-center",on:{click:e.randGroup}},[e._v("🔱 隨機分組排序")])],2)])],1)},a=[],s=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},l=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("header",[r("h1",[e._v("Vue-pew")])])}],u={name:"TheHeader",data(){return{}}},i=u,c=(r("e2c1"),r("2877")),p=Object(c["a"])(i,s,l,!1,null,"59ef054c",null);p.options.__file="TheHeader.vue";var f=p.exports,d=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"label_input"},[e.is_edit?r("input",{attrs:{type:"text"},domProps:{value:e.value},on:{input:function(t){e.chgText(t.target.value)},keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key,"Enter"))return null;e.is_edit=!1}}}):r("span",{on:{dblclick:function(t){e.is_edit=!0}}},[e._v(e._s(e.value))])])},h=[],g={props:{value:String},data(){return{is_edit:!1}},methods:{chgText(e){this.$emit("input",e)}}},m=g,v=(r("159b"),Object(c["a"])(m,d,h,!1,null,"140beeb9",null));v.options.__file="LabelInput.vue";var _=v.exports,b={name:"app",components:{TheHeader:f,LabelInput:_},data(){return{now_selected:null,groups:[{name:"Group1",color:"#aefeed",metas:[{row:1,col:1},{row:2,col:2}]},{name:"Group2",color:"#cfacfc",metas:[{row:3,col:3}]},{name:"Group3",color:"#caecbc",metas:[]}],totalRows:10,totalCols:10}},methods:{getRandomColor(){for(var e="ABCDEF",t="#",r=0;r<6;r++)t+=e[Math.floor(6*Math.random())];return t},newGroup(){this.groups.push({name:"New Group",color:this.getRandomColor(),metas:[]})},randGroup(){this.groups.forEach((e,t)=>{this.groups[t].metas.splice(this.shuffle(e.metas).length,0),console.log("group",e)})},shuffle(e){for(let t=e.length-1;t>0;t--){const r=Math.floor(Math.random()*(t+1));[e[t],e[r]]=[e[r],e[t]]}return e},removeGroup(e){this.groups.splice(e,1)},tdChgColor(e){if(null!=this.now_selected){console.log("target",e.currentTarget);let t=e.currentTarget.getAttribute("row"),r=e.currentTarget.getAttribute("col");if(console.log(t+" this.table[row]:"+this.table[t]),"none"!=this.table[t][r].color){if(this.table[t][r].group==this.now_selected)return this.groups[this.now_selected].metas.splice(this.groups[this.now_selected].metas.findIndex((e,o)=>o+1==this.table[t][r].index),1),!1;this.groups[this.table[t][r].group].metas.splice(this.groups[this.table[t][r].group].metas.findIndex((e,o)=>o+1==this.table[t][r].index),1)}this.groups[this.now_selected].metas.splice(this.groups[this.now_selected].metas.length,0,{row:e.currentTarget.getAttribute("row"),col:e.currentTarget.getAttribute("col")})}else alert("請選擇顏色!!")},log(e){console.log(e)}},computed:{table(){console.log("this.groups",this.groups);let e=Array.apply(null,Array(this.totalRows));return e.forEach((t,r)=>e[r]=Array.apply(null,Array(this.totalCols))),e.forEach((t,r)=>{t.forEach((t,o)=>e[r][o]={color:"none"})}),console.log("arr",e),this.groups.forEach((t,r)=>{console.log("group.meta",t.metas),t.metas.forEach((o,n)=>e[o.row][o.col]={color:t.color,index:n+1,group:r})}),e}}},y=b,w=(r("034f"),Object(c["a"])(y,n,a,!1,null,null,null));w.options.__file="App.vue";var k=w.exports;o["a"].config.productionTip=!1,new o["a"]({render:function(e){return e(k)}}).$mount("#app")},"5c57":function(e,t,r){},"64a9":function(e,t,r){},e2c1:function(e,t,r){"use strict";var o=r("5c57"),n=r.n(o);n.a}});
//# sourceMappingURL=app.8349fcc7.js.map