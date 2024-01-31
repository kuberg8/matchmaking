<template>
  <div v-if="typeof screnIndex === 'number'">
    <Three
      v-for="(scren, i) in screns"
      v-show="i === screnIndex"
      :key="i"
      :modelPath="scren.path"
      :size="scren.size"
      :background="scren.background"
    />

    <div v-if="!dialog" class="controls">
      <v-btn to="create">Создать</v-btn>
      <v-btn to="search">Найти</v-btn>
    </div>

    <v-btn v-if="!dialog" class="arrow__left" @click="switchScren(false)" width="65" height="65">
      <v-icon size="42"> mdi-arrow-left </v-icon>
    </v-btn>
    <v-btn v-if="!dialog" class="arrow__right" @click="switchScren" width="65" height="65">
      <v-icon size="42"> mdi-arrow-right </v-icon>
    </v-btn>

    <v-dialog v-model="dialog" persistent :width="dialogWidth">
      <v-card class="main__dialog">
        <nuxt-child :type="currentScreen.type" @close="close" keep-alive />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const dialogPages = ['index-Create', 'index-Search', 'index-Account']
const models = [
  {
    type: 'basketball',
    path: './models/basketball/scene.gltf',
    size: 75,
    background: 'https://cdn.britannica.com/44/193844-050-11485B18/ball-net-basketball-game-arena.jpg'
  },
  {
    type: 'volleyball',
    path: './models/volleyball/scene.gltf',
    size: 95,
    background: 'https://c1.wallpaperflare.com/preview/788/874/537/network-beach-volleyball-volleyball-sand.jpg'
  },
  {
    type: 'soccer',
    path: './models/football/scene.gltf',
    size: 10,
    background: 'https://images.mlssoccer.com/image/private/t_q-best/mls-lafc-prd/k9b0dhvmfqbaqkwl8nvi.jpg'
  }
]

export default {
  name: 'IndexPage',
  data() {
    return {
      dialog: dialogPages.includes(this.$route.name),
      screnIndex: null,
      screns: models
    }
  },
  computed: {
    currentScreen() {
      return this.screns[this.screnIndex]
    },
    dialogWidth() {
      switch (this.$route.name) {
        case 'index-Create':
          return '900'
        default:
          return '1024'
      }
    }
  },
  mounted() {
    this.screnIndex = JSON.parse(localStorage.getItem('screnIndex')) || 0

    window.addEventListener('keydown', ({ key }) => {
      if (!this.dialog) {
        switch (key) {
          case 'ArrowRight':
            this.switchScren()
            break
          case 'ArrowLeft':
            this.switchScren(false)
        }
      }
    })
  },
  methods: {
    switchScren(next = true) {
      if (next) {
        if (this.screnIndex < this.screns.length - 1) {
          this.screnIndex++
        } else {
          this.screnIndex = 0
        }
      } else {
        if (this.screnIndex === 0) {
          this.screnIndex = this.screns.length - 1
        } else {
          this.screnIndex--
        }
      }

      localStorage.setItem('screnIndex', this.screnIndex)
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
