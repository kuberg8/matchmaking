import cookie from 'cookie'

export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    if (req.headers.cookie) {
      const { access_token, silent_token, provider, uuid } = cookie.parse(req.headers.cookie)

      if ((access_token || silent_token) && provider) {
        switch (provider) {
          case 'ya':
            await dispatch('user/getYandexUserData', access_token)
            break
          case 'vk':
            await dispatch('user/getVkUserData', { access_token, silent_token, uuid })
            break
        }
      }
    }
  }
}
