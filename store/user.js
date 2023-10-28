const yandex_url = 'https://login.yandex.ru/info'

export const state = () => ({
  isAuth: false,
  provider: 'ya',
  userData: null
})

export const getters = {
  getUserAvatarId({ userData }) {
    return userData?.default_avatar_id
  },
  getUserDisplayName({ userData }) {
    return userData?.display_name
  },
  getUserPhone({ userData }) {
    return userData?.default_phone?.number
  }
}

export const mutations = {
  SET_USER_DATA(state, userData) {
    state.userData = userData
  },
  SET_IS_AUTH(state, isAuth) {
    state.isAuth = isAuth
  },
  SET_PROVIDER(state, provider) {
    state.provider = provider
  }
}

export const actions = {
  async getUserData({ commit, dispatch }, token) {
    try {
      const data = await this.$axios.$get(`${yandex_url}?format=json&jwt_secret=${process.env.JWT_SECRET}`, {
        headers: {
          Authorization: 'OAuth ' + token
        }
      })
      localStorage.setItem('access_token', token)
      commit('SET_USER_DATA', data)
      commit('SET_IS_AUTH', true)
    } catch (e) {
      dispatch('logout')
      console.error(e)
    }
  },
  logout({ commit }) {
    localStorage.removeItem('access_token')
    commit('SET_IS_AUTH', false)
    commit('SET_USER_DATA', null)
  }
}
