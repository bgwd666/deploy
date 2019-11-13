<template>
<div>
  <router-view></router-view>
  <h1>hello {{msg}}</h1>
</div>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator'
  @Component
  export default class App extends Vue {
    msg:string = 'webpack456'
  }
</script>

