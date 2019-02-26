<template>
  <v-list dense color="secondary">

      <v-list-tile @click="">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <router-link :to="{name:'EpisodeSummary'}">
            <v-list-tile-title>患者概況</v-list-tile-title>
          </router-link>
        </v-list-tile-content>
      </v-list-tile>

    <v-list-tile @click="">
      <v-list-tile-action>
        <v-icon>assignment</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <router-link :to="{name:'FormViewer2'}">
          <v-list-tile-title>護理表單</v-list-tile-title>
        </router-link>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile @click="">
      <v-list-tile-action>
        <v-icon>timeline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <router-link :to="{name:'TPRRecord'}">
          <v-list-tile-title>生命徵象</v-list-tile-title>
        </router-link>
        <!--<v-list-tile-title>生命徵像</v-list-tile-title>-->
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile @click="">
      <v-list-tile-action>
        <v-icon>dns</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>護理記錄</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile @click="">
      <v-list-tile-action>
        <v-icon>description</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>護理計劃</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile @click="">
      <v-list-tile-action>
        <v-icon>contact_mail</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>檢驗報告</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile @click="">
      <v-list-tile-action>
        <v-icon>class</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>病人宣教</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile @click="">
      <v-list-tile-action>
        <v-icon>question_answer</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>問卷調查</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>

  </v-list>
</template>

<script>
    export default {
        name: "Aside"
    }
</script>

<style scoped>
  * {
    font-size: 1.1rem;
  }
</style>
