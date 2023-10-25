<template>
  <div>
    <Three
      v-for="(scren, i) in screns"
      v-show="i === screnIndex"
      :key="i"
      :modelPath="scren.path"
      :size="scren.size"
      :background="scren.background"
    />

    <div class="controls">
      <v-btn elevation="2">Создать</v-btn>
      <v-btn elevation="2">Найти</v-btn>
    </div>

    <v-btn class="arrow__left" @click="switchScren(false)" width="65" height="65">
      <v-icon size="42">
        mdi-arrow-left
      </v-icon>
    </v-btn>
    <v-btn class="arrow__right" @click="switchScren" width="65" height="65">
      <v-icon size="42">
        mdi-arrow-right
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      screnIndex: 0,
      screns: [
        {
          path: './models/basketball/scene.gltf',
          size: 75,
          background: 'https://cdn.britannica.com/44/193844-050-11485B18/ball-net-basketball-game-arena.jpg'
        },
        {
          path: './models/volleyball/scene.gltf',
          size: 95,
          background: 'https://c1.wallpaperflare.com/preview/788/874/537/network-beach-volleyball-volleyball-sand.jpg',
          dark: true
        },
        {
          path: './models/football/scene.gltf',
          size: 10,
          background: 'https://images.mlssoccer.com/image/private/t_q-best/mls-lafc-prd/k9b0dhvmfqbaqkwl8nvi.jpg'
        }
      ],

      showForm: false,
      showTable: false
    }
  },
  computed: {
    currentScreen() {
      return this.screns[this.screnIndex]
    }
  },
  mounted() {
    window.addEventListener('keydown', ({ key }) => {
      if (!this.showForm && !this.showTable) {
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

.yandex__avatar {
  background: linear-gradient(90deg, #ff5c4d, #eb469f 30%, #8341ef 75%, #3f68f9);
  padding: 2px;

  &-img {
    border: 2px solid #fff;
    max-width: calc(100% - 2px);
    max-height: calc(100% - 2px);
  }
}
</style>
