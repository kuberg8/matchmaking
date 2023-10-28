import getAvatar from '../utils/getAvatar'
const yandex_url = 'https://login.yandex.ru/info'

export const state = () => ({
  isAuth: false,
  provider: null,
  userData: null
})

export const getters = {
  userAvatar({ userData, provider }) {
    switch (provider) {
      case 'ya':
        return getAvatar(userData?.default_avatar_id, 'islands-middle')
      case 'vk':
        return userData?.avatar
      default:
        return ''
    }
  },
  getUserDisplayName({ userData }) {
    return userData?.display_name || `${userData?.first_name} ${userData?.last_name}`.trim()
  },
  getUserPhone({ userData }) {
    return userData?.default_phone?.number || userData?.phone
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
      dispatch('setUserData', { data, provider: 'ya' })
    } catch (e) {
      dispatch('logout')
      console.error(e)
    }
  },
  setUserData({ commit }, { data, provider }) {
    localStorage.setItem('provider', provider)
    if (provider === 'vk') {
      localStorage.setItem('user_data', JSON.stringify(data))
    }
    commit('SET_PROVIDER', provider)
    commit('SET_USER_DATA', data)
    commit('SET_IS_AUTH', true)
  },
  logout({ commit }) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('provider')
    commit('SET_IS_AUTH', false)
    commit('SET_USER_DATA', null)
  }
}
