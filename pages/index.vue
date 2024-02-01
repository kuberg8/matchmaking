<template>
  <div v-if="typeof screenIndex === 'number'">
    <Three
      v-for="(screen, i) in screens"
      v-show="i === screenIndex"
      :key="i"
      :modelPath="screen.path"
      :size="screen.size"
      :background="screen.background"
    />

    <div v-if="!dialog" class="controls">
      <v-btn to="create">Создать</v-btn>
      <v-btn to="search">Найти</v-btn>
    </div>

    <v-btn v-if="!dialog" class="arrow__left" @click="switchScreen(false)" width="65" height="65">
      <v-icon size="42"> mdi-arrow-left </v-icon>
    </v-btn>
    <v-btn v-if="!dialog" class="arrow__right" @click="switchScreen" width="65" height="65">
      <v-icon size="42"> mdi-arrow-right </v-icon>
    </v-btn>

    <v-dialog v-model="dialog" persistent :width="dialogWidth">
      <v-card class="main__dialog">
        <nuxt-child :screen="currentScreen" @close="close" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const dialogPages = ['index-Create', 'index-Search', 'index-Account', 'index-match-id']
const models = [
  {
    id: 1,
    type: 'basketball',
    path: '/models/basketball/scene.gltf',
    size: 75,
    background: 'https://cdn.britannica.com/44/193844-050-11485B18/ball-net-basketball-game-arena.jpg'
  },
  {
    id: 2,
    type: 'soccer',
    path: '/models/football/scene.gltf',
    size: 10,
    background: 'https://images.mlssoccer.com/image/private/t_q-best/mls-lafc-prd/k9b0dhvmfqbaqkwl8nvi.jpg'
  },
  {
    id: 3,
    type: 'volleyball',
    path: '/models/volleyball/scene.gltf',
    size: 95,
    background: 'https://c1.wallpaperflare.com/preview/788/874/537/network-beach-volleyball-volleyball-sand.jpg'
  }
]

export default {
  name: 'IndexPage',
  data() {
    return {
      dialog: dialogPages.includes(this.$route.name),
      screenIndex: null,
      screens: models
    }
  },
  provide() {
    return {
      setScreen: this.setScreen
    }
  },
  computed: {
    currentScreen() {
      return this.screens[this.screenIndex]
    },
    dialogWidth() {
      switch (this.$route.name) {
        case 'index-Create':
          return '900'
        case 'index-match-id':
          return '530'
        default:
          return '1024'
      }
    }
  },
  mounted() {
    this.screenIndex = JSON.parse(localStorage.getItem('screenIndex')) || 0

    window.addEventListener('keydown', ({ key }) => {
      if (!this.dialog) {
        switch (key) {
          case 'ArrowRight':
            this.switchScreen()
            break
          case 'ArrowLeft':
            this.switchScreen(false)
        }
      }
    })
  },
  methods: {
    switchScreen(next = true) {
      if (next) {
        if (this.screenIndex < this.screens.length - 1) {
          this.screenIndex++
        } else {
          this.screenIndex = 0
        }
      } else {
        if (this.screenIndex === 0) {
          this.screenIndex = this.screens.length - 1
        } else {
          this.screenIndex--
        }
      }

      localStorage.setItem('screenIndex', this.screenIndex)
    },
    setScreen(screenId) {
      const screenIndex = this.screens.findIndex(({ id }) => id === screenId)

      if (screenIndex !== -1) {
        this.screenIndex = screenIndex
        localStorage.setItem('screenIndex', this.screenIndex)
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.$router.push('/')
      }, 100)
    }
  },
  watch: {
    '$route.name'(name) {
      this.dialog = dialogPages.includes(name)
    }
  }
}
</script>

<style lang="scss">
.controls {
  display: flex;
  justify-content: center;
  column-gap: 20px;
  position: fixed;
  bottom: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 2;
}

.arrow__left,
.arrow__right {
  position: fixed;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 2;
  border-radius: 50%;
}

.arrow__left {
  left: 10vw;
}
.arrow__right {
  right: 10vw;
}

.main__dialog {
  background-color: rgba(0, 0, 0, 0.5) !important;

  &-head {
    display: flex;
    justify-content: space-between;
  }

  &-title {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }

  &-close {
    border-radius: 50%;
    min-width: 30px !important;
    width: 30px !important;
    max-height: 30px;
  }
}
</style>
