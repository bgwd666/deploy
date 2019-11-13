<template>
  <div class="app-about-page">
    <div class="flex-center header">
      <router-link to="/home">goTo主页</router-link>
    </div>
    <img width="100%" src="../assets/img/about.jpg" alt="">
    <div class="about-us">
      <h3 class="title">TypeScript 增加了代码的可读性和可维护性</h3>
      <p class="article">
        类型系统实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用了
        可以在编译阶段就发现大部分错误，这总比在运行时候出错好
        增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等
      </p>
      <h3  class="title">TypeScript 非常包容</h3>
      <img width="100%" :src="img" alt="">
      <p class="article">
        TypeScript 是 JavaScript 的超集，.js 文件可以直接重命名为 .ts 即可
        即使不显式的定义类型，也能够自动做出类型推论
        可以定义从简单到复杂的几乎一切类型
        即使 TypeScript 编译报错，也可以生成 JavaScript 文件
        兼容第三方库，即使第三方库不是用 TypeScript 写的，也可以编写单独的类型文件供 TypeScript 读取
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator'
@Component
export default class About extends Vue {
  img: string =  require('../assets/img/about.jpg')
 
}
</script>

<style lang="scss">
.app-about-page{
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 12vw;
  .header{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 12vw;
    background-color: #fff;
  }
  .about-us{
    padding: 0 5vw;
    margin-top: 5vw;
    background-color: #fbfbfb;
    .title{
      font-size: 8vw;
      font-weight: bold;
      margin: 4vw 0;
    }
    .article{
      color: #555;
      line-height: 1.5;
    }
  }
}
</style>
