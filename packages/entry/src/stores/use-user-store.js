import { defineStore } from 'pinia'
import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { KEY } from '@/config'
// import { TOKEN_EXPIRE_TIME } from "@/config";
storage.addPlugin(expirePlugin)

export const useUserStore = defineStore('user', {
  state: () => ({
    token: storage.get(KEY.TOKEN_KEY) ? storage.get(KEY.TOKEN_KEY) : '*',
    role: {
      permissionIds: []
    }
  }),
  getters: {
    hasRole: (state) => {
      return !!state?.role?.permissionIds?.length
    }
  },
  actions: {
    // async login() {
    //   storage.set(KEY.TOKEN_KEY, res, new Date().getTime() + TOKEN_EXPIRE_TIME * 1000);
    // },
    async getInfo() {
      return []
    },
    async logout() {}
  }
})
