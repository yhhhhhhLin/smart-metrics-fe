import {defineStore} from 'pinia'
import {reactive} from "vue";
import {getUserInfo} from "../services/user/user.ts";

export const useUserInfoStore = defineStore('user', () => {
    const user = reactive({
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
        const response = await getUserInfo()
        if(response.code === 0){
            const userInfo = response.data
            user.userName = userInfo.userName
            user.gender = userInfo.gender
            user.userAvatar = userInfo.userAvatar
            user.userEmail = userInfo.userEmail
            user.userAccount = userInfo.userAccount

        }



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