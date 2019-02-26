<template>
  <v-app>
    <v-content class="back">
      <v-container  fluid>
        <transition name="slide-fade">
          <router-view/>
        </transition>
      </v-container>
    </v-content>

  </v-app>

</template>

<script>
  import "babel-polyfill"

  export default {
    name: 'App',
    data(){
      return {
        message:"Hello Ben.."
      }
    }
  }
</script>

<style>
  html {
    font-size: 16px;
    overflow-y: auto;
    
  }
  input {
    font-size: 16px;
  }
  .back {
    background-image: url("./assets/images/BackGround1s.png");
    background-size: cover;
  /* background-image: url('../../../assets/images/BackGround1.png');*/
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active{
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-active {
    transform: translateX(-430px);
    opacity: 0;
  }

</style>
