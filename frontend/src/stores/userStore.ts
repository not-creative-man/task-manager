import { defineStore } from 'pinia'
import router from '@/router'

export const useUserData = defineStore('userData', {
  state: () => {
    return {
      userId: < number | undefined > undefined,
    };
  },

  actions: {
    setUserId (userId: number) {
      this.userId = userId;
    },
    getUserId (): number | undefined {
      return this.userId;
    },
    async logOut () {
      if (this.userId === undefined) {
        await router.push("/");
      }
    }
  }
})