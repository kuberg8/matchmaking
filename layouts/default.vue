<template>
  <v-app class="app__background">
    <header class="header">
      <h1 class="header__logo">
        <v-icon size="42">mdi-basketball</v-icon>
        MATCHMAKING
      </h1>

      <v-btn @click="showLogin = true" text class="header__login">
        <v-avatar v-if="false" class="yandex__avatar">
          <v-img class="yandex__avatar-img" src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"></v-img>
        </v-avatar>
        <v-avatar v-else>
          <v-icon size="38">mdi-account-circle</v-icon>
        </v-avatar>
      </v-btn>
    </header>
    <v-main>
      <Nuxt />
    </v-main>

    <LoginForm v-model="showLogin" />
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      showLogin: false
    }
  },
  mounted() {
    // yanedx
    YaSendSuggestToken(`${process.env.REDIRECT_URI}`)
  }
}
</script>

<style lang="scss" scoped>
.app__background {
  background-color: #272727;
}

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

  &__login {
    min-width: 55px !important;
    width: 55px;
    height: 55px !important;
    border-radius: 12px;
  }
}
</style>
