<template>
  <v-app class="app__background">
    <Header />

    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DefaultLayout',
  mounted() {
    const token = localStorage.getItem('asset_token')
    if (token) {
      this.getUserData(token)
    }
  },
  methods: {
    ...mapActions('user', ['getUserData'])
  }
}
</script>

<style lang="scss" scoped>
.app__background {
  background-color: #272727;
}
</style>
