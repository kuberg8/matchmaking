<template>
  <div>
    <div class="scren__wrapper">
      <Three
        v-for="(scren, i) in screns"
        v-show="i === screnIndex"
        :key="i"
        :modelPath="scren.path"
        :size="scren.size"
        :background="scren.background"
      />
    </div>
    <button class="switch" @click="switchScren">Switch</button>
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
          background: 'https://c1.wallpaperflare.com/preview/788/874/537/network-beach-volleyball-volleyball-sand.jpg'
        },
        {
          path: './models/football/scene.gltf',
          size: 10,
          background: 'https://images.mlssoccer.com/image/private/t_q-best/mls-lafc-prd/k9b0dhvmfqbaqkwl8nvi.jpg'
        }
      ]
    }
  },
  computed: {
    currentScreen() {
      return this.screns[this.screnIndex]
    }
  },
  methods: {
    switchScren() {
      if (this.screnIndex < this.screns.length - 1) {
        this.screnIndex++
      } else {
        this.screnIndex = 0
      }
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  color: #fff;
}

.switch {
  position: fixed;
  top: 10vw;
  left: 10vw;
  z-index: 2;
}
</style>
