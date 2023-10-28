export const state = () => ({})

export const getters = {}

export const mutations = {
  SET_USER_DATA(state, userData) {
    state.userData = userData
  }
}

export const actions = {
  async getUserInfo({ commit }, token) {
    const { data } = await this.$axios.$get(
      `https://login.yandex.ru/info?format=json&jwt_secret=${process.env.JWT_SECRET}`,
      {
        headers: {
          Authorization: 'OAuth ' + token
        }
      }
    )
    console.log(data)
    commit('SET_USER_DATA', data)
  }
}
