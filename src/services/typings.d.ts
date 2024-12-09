declare namespace API {

    type BaseResponse<T> = {
        code: number,
        data: T,
        message: string
    }

    type UserInfo = {
        id: string
        userName: string
        userAccount: string
        userAvatar: string
        userEmail: string
        gender: number
    }
}