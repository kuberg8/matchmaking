<template>
  <div>
    <div class="model" ref="three" />
    <img :src="background" class="background" />
  </div>
</template>

<script>
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

export default {
  props: {
    background: {
      type: String,
      default: 'https://cdn.britannica.com/44/193844-050-11485B18/ball-net-basketball-game-arena.jpg'
    },
    modelPath: {
      type: String,
      default: './models/basketball/scene.gltf'
    },
    size: {
      type: Number,
      default: 35
    },
    distance: {
      type: Number,
      default: 3
    }
  },
  mounted() {
    const container = this.$refs.three

    //Scene
    const scene = new this.$three.Scene()
    // scene.background = new this.$three.Color('red')

    //Camera
    const camera = new this.$three.PerspectiveCamera(this.size, window.innerWidth / window.innerHeight, 0.1, 3000)
    camera.position.set(0, 0.5, 1)

    //render
    const renderer = new this.$three.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    let plain
    plain = new this.$three.Mesh(
      new this.$three.PlaneGeometry(1000, 1000),
      new this.$three.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true })
    )
    plain.reciveShadow = true
    plain.position.set(0, -1, 0)
    plain.rotateX(-Math.PI / 2)
    scene.add(plain)

    // Model
    const modelLh = new this.$three.Object3D()
    const loader = new GLTFLoader()
    loader.load(
      this.modelPath,
      (gltf) => {
        // modelLh.add(gltf.scene)
        // modelLh.position.set(0, 0, 0)
        // scene.add(modelLh)
        scene.add(gltf.scene)
      },
      function (error) {
        console.log('Error: ' + error)
      }
    )

    {
      const light = new this.$three.DirectionalLight(0xffffff, 1)
      light.position.set(-2, 0, 10)
      light.lookAt(0, -1, 0)
      scene.add(light)

      // Helper
      // const helper = new this.$three.DirectionalLightHelper(light, 5)
      // scene.add(helper)
    }

    {
      const light = new this.$three.DirectionalLight(0xffffff, 1)
      light.position.set(2, 0, 5)
      light.lookAt(0, 1, 0)
      scene.add(light)

      // Helper
      // const helper = new this.$three.DirectionalLightHelper(light, 5)
      // scene.add(helper)
    }

    RectAreaLightUniformsLib.init()
    {
      const rectLight = new this.$three.RectAreaLight(0xffffff, 1, 100, 100)
      rectLight.position.set(-10, 0, 0)
      rectLight.rotation.y = Math.PI + Math.PI / 4
      scene.add(rectLight)
    }

    {
      const rectLight = new this.$three.RectAreaLight(0x000, 1, 100, 100)
      rectLight.position.set(10, 0, 0)
      rectLight.rotation.y = Math.PI - Math.PI / 4
      scene.add(rectLight)
    }

    //OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = true
    controls.autoRotateSpeed = 5
    controls.enableDamping = true
    controls.enableDamping = true
    controls.minDistance = this.distance
    controls.maxDistance = 1

    //Resize
    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()

      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // Animate
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()
  }
}
</script>

<style>
.model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.background {
  display: flex;
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  filter: blur(8px);
  -webkit-filter: blur(8px);
  object-fit: cover;
  object-position: top left;
  transform: scale(1.1);
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
