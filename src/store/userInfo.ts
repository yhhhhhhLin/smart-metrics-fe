import {defineStore} from 'pinia'
import {reactive} from "vue";

export const useUserInfoStore = defineStore('user', () => {
    const user = reactive({
        'id': '',
        'userName': '',
        'userAccount': '',
        'userAvatar': '',
        'userEmail': '',
        'gender': 0,
    })

    const updateUserInfo = async () => {
        clearUserInfo()
        await storeGetUserInfo()
    }

    const storeGetUserInfo = async () => {
        if (user.id) {
            return
        }

        // 发送请求获取用户信息



    }

    function clearUserInfo() {
        user.id = ''
        user.userName = ''
        user.userAccount = ''
        user.userAvatar = ''
        user.userEmail = ''
        user.gender = 0
    }


    return {user, storeGetUserInfo, clearUserInfo, updateUserInfo}
})