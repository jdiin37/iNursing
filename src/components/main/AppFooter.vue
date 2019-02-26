<template>
  <v-footer color="primary" class="foot" app>
    <span class="white--text"> www.Hismax.com.tw 07-3366224</span>
    <v-spacer></v-spacer>
    <span class="white--text"> {{loginUser.empName}} 登入時間 : {{loginUser.loginDateTime}}</span>
  </v-footer>
</template>

<script>
    export default {
      name: "Footer",
      data() {
        return {}
      },
      computed: {
        loginUser() {
          return this.$store.state.loginUser;
        }
      },
      methods: {
        logOut: function(){
          this.$emit('Logout','');
        }
      }
    }
</script>

<style scoped>
  .foot {
    padding: 10px;
  }
</style>
