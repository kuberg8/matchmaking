<template>
  <v-app class="app__background">
    <Header />

    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>

<style lang="scss" scoped>
.app__background {
  background-color: #272727;
}
</style>
