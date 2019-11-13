<template>
  <div class="app-home-page">
    <div class="flex-center header">
      <router-link to="/about">goTo关于</router-link>
    </div>
    <div class="joke-item-cont" ref="cont">
      <p class="item" v-for="item in jokeList" :key="item.id">
        {{item.text}}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator'  
@Component
export default class Home extends Vue {
  
  jokeList: object[] = [];
  page: number = 1;
  maxtime: String = '';
  timer: null = null;
  $axios:any

  created() {
    this.getJokeList();
  }

  mounted() {
    addEventListener('scroll',this.loadMore,false); 
  }

  loadMore(this: any){
    if(this.timer){
      clearTimeout(this.timer); 
    }
    this.timer = setTimeout(()=>{
      const dom = this.$refs['cont'].getBoundingClientRect();
      if(-dom.top + 1000  > dom.height){
        this.page++;
        this.getJokeList();
      }
    },200);
  }

  getJokeList(){    
    this.$axios.get(`/apis/api/api_open.php?a=list&c=data&type=29&page=${this.page}&maxtime=${this.maxtime}`).then(res=>{
      if(res && res.data){
        this.maxtime = res.data.info.maxtime;
        this.jokeList = [...this.jokeList,...res.data.list];
      }
    });
  }

  destroyed(){
    removeEventListener('scroll',this.loadMore,false); 
  }
}
</script>

<style lang="scss">
.app-home-page{
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #fbfbfb;
  padding-top: 12vw;
  .header{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 12vw;
    background-color: #fff;
  }
}
.joke-item-cont{
  padding: 5vw;
  padding-top: 0;
  background-color: #fbfbfb;
  .item{
    margin: 6vw 0;
    line-height: 1.5;
    font-size: 5.5vw;
    background-color: #eaeaea;
    box-shadow: 2vw 2vw 2vw #ccc;
    border: 1px solid #ddd;
    padding: 2vw;
    box-sizing: border-box;
    text-align: justify;
    text-indent: 2em;
    border-radius: 1vw;
  }
}
</style>