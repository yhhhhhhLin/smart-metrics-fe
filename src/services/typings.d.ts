declare namespace API {

    type BaseResponse<T> = {
        code: number,
        data: T,
        message: string
    }

    type UserInfo = {
        userName: string
        userAccount: string
        userAvatar: string
        userEmail: string
        gender: number
    }

    type UserRegisterForm = {
        username: string
        userAccount: string
        password: string
        checkPassword: string
        registerType: string
        email: string
        code: string
    }

    type UserLoginForm = {
        userAccount: string
        password: string
        code: string
    }


    type DatasourceAdd = {
        dscId?: number
        datasourceTypeCode: number | null
        datasourceName?: string
        datasourceDesc?: string
        url: string
        username: string
        password: string
    }
}


