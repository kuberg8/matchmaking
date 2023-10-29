import Cookies from 'js-cookie'
import FormData from 'form-data'
import getAvatar from '../utils/getAvatar'

export const state = () => ({
  isAuth: false,
  provider: null,
  userData: null,
  accessToken: null
})

export const getters = {
  userAvatar({ userData, provider }) {
    switch (provider) {
      case 'ya':
        return getAvatar(userData?.default_avatar_id, 'islands-middle')
      case 'vk':
        return userData?.avatar || userData?.photo_200
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
  },
  SET_ACCESS_TOKEN(state, accessToken) {
    state.accessToken = accessToken
  }
}

export const actions = {
  async getYandexUserData({ dispatch }, token) {
    try {
      const data = await this.$axios.$get(
        `https://login.yandex.ru/info?format=json&jwt_secret=${process.env.JWT_SECRET}`,
        {
          headers: {
            Authorization: 'OAuth ' + token
          }
        }
      )

      dispatch('setUserData', { data, access_token: token, provider: 'ya' })
    } catch (e) {
      dispatch('logout')
      console.error(e)
    }
  },
  async getVkUserData({ dispatch }, { silent_token, access_token, uuid }) {
    try {
      const vk_url = 'https://api.vk.com/method'
      const v = '5.154'
      let accessToken = access_token

      console.log('getVkUserData-access', !!accessToken)
      if (!accessToken) {
        const res = await fetch(`${vk_url}/auth.exchangeSilentAuthToken`, {
          method: 'POST',
          body: new URLSearchParams({
            v,
            token: silent_token,
            access_token: `${process.env.VK_SERVER_KEY}`,
            uuid
          })
        })
        const { response } = await res.json()
        accessToken = response?.access_token
        console.log('getVkUserData-response', response)
      }

      const form = new FormData()
      form.append('access_token', accessToken)
      form.append('v', v)

      const userInfoRes = await fetch(`${vk_url}/account.getProfileInfo`, {
        method: 'POST',
        body: form
      })
      const { response: data } = await userInfoRes.json()
      await dispatch('setUserData', { data, access_token: accessToken, provider: 'vk' })
    } catch (e) {
      dispatch('logout')
      console.error(e)
    }
  },
  setUserData({ commit, dispatch }, { data, provider, access_token, silent_token, uuid }) {
    access_token && Cookies.set('access_token', access_token)
    provider && Cookies.set('provider', provider)
    silent_token && Cookies.set('silent_token', silent_token)
    uuid && Cookies.set('uuid', uuid)

    if (data) {
      commit('SET_ACCESS_TOKEN', access_token)
      commit('SET_PROVIDER', provider)
      commit('SET_USER_DATA', data)
      commit('SET_IS_AUTH', true)
    } else {
      dispatch('logout')
    }
  },
  logout({ commit }) {
    Cookies.remove('access_token')
    Cookies.remove('silent_token')
    Cookies.remove('provider')
    Cookies.remove('uuid')

    commit('SET_IS_AUTH', false)
    commit('SET_PROVIDER', null)
    commit('SET_ACCESS_TOKEN', null)
    commit('SET_USER_DATA', null)
  }
}
