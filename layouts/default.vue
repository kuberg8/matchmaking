<template>
  <v-app>
    <header class="header">
      <h1 class="header__logo">
        <v-icon size="42">mdi-basketball</v-icon>
        MATCHMAKING
      </h1>

      <v-avatar class="yandex__avatar">
        <!-- <v-icon>mdi-account-circle</v-icon> -->
        <v-img class="yandex__avatar-img" src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"></v-img>
      </v-avatar>
    </header>
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  position: fixed;
  z-index: 2;
  top: 0;
  padding: 0 10vw;
  backdrop-filter: blur(20px);

  &__logo {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }
}
</style>
