<template>
  <div>
    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <h1>
          {{ city }}
        </h1>
        <b class="text-h5 text-end">
          <div>
            {{ date }}
          </div>
          <div v-if="time">{{ time.substring(0, 5) }}</div>
        </b>
      </div>

      <div class="d-flex align-center">
        <v-icon size="18" color="error" class="me-2">mdi-alert</v-icon>
        Extreme Weather Alert
      </div>
    </v-card-text>

    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h2" cols="6"> 64&deg;F </v-col>

        <v-col cols="6" class="text-right">
          <v-icon color="error" size="88"> mdi-weather-hurricane </v-icon>
        </v-col>
      </v-row>
    </v-card-text>

    <div class="d-flex py-3 justify-space-between">
      <v-list-item density="compact">
        <v-icon class="mr-2"> mdi-weather-windy </v-icon>
        <v-list-item-subtitle>123 km/h</v-list-item-subtitle>
      </v-list-item>

      <v-list-item density="compact">
        <v-icon class="mr-2">mdi-weather-pouring</v-icon>
        <v-list-item-subtitle>48%</v-list-item-subtitle>
      </v-list-item>

      <v-list-item density="compact">
        <v-icon class="mr-2">mdi-account-group</v-icon>
        <v-list-item-subtitle>{{ users?.length || 0 }}</v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-card-text class="d-inline-flex text-truncate align-center">
      <v-icon size="30" class="me-3">mdi-map-marker</v-icon>
      <h1 class="d-inline-block text-truncate">{{ place }}</h1>
    </v-card-text>

    <v-expand-transition>
      <div v-if="expand">
        <v-list class="bg-transparent">
          <v-list-item v-for="(user, i) in users" two-line :key="i" class="d-flex align-center justify-space-between">
            <div>
              <div>
                {{ user.displayName }}
              </div>
              <small>
                {{ user.phone }}
              </small>
            </div>

            <v-avatar v-if="user.avatarUrl">
              <v-img :src="user.avatarUrl" :alt="user.displayName"></v-img>
            </v-avatar>
            <v-icon v-else>mdi-account</v-icon>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <div class="d-flex justify-space-between">
        <v-btn v-if="users.length" @click="expand = !expand" class="me-2">
          {{ !expand ? 'Показать участников' : 'Свернуть участников' }}
        </v-btn>
  
        <!-- <v-btn color="primary">
          Участвовать
        </v-btn> -->
        <div class="d-flex">
          <v-btn color="primary" class="me-2"> Изменить </v-btn>
          <v-btn color="error" @click="confirm = true"> Удалить игру </v-btn>
        </div>
      </div>
    </v-card-actions>

    <v-dialog v-model="confirm" width="350">
      <v-card class="pt-3">
        <v-card-text> <h1>Удалить игру?</h1> </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :loading="deleteLoading" color="error" @click="deleteMatch">Удалить</v-btn>
          <v-btn @click="confirm = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    try {
      const data = await $axios.$get(`events/${params.id}`)
      return data
    } catch (e) {
      console.error(e)
    }
  },
  mounted() {
    this.eventType?.id && this.setScreen(this.eventType.id)
  },
  inject: ['setScreen'],

  data() {
    return {
      expand: false,
      confirm: false,
      deleteLoading: false
    }
  },
  methods: {
    async deleteMatch() {
      try {
        this.deleteLoading = true
        await this.$axios.delete(`events/${this.id}`)
        this.$router.push('/')
      } catch (e) {
        console.error(e)
      } finally {
        this.deleteLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
.v-list-item::after {
  display: none;
}
</style>
