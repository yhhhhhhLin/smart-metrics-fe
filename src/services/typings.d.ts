declare namespace API {

    type BaseResponse<T> = {
        code: number,
        data: T,
        message: string
    }

    type Page<T> = {
        records: T[]
        total: number
        size: number
        current: number
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

    type DatasourcePage = {
        dscName: string | null
        dscTypeCode: number | null
        dscDesc: string | null
        dscStatus: number | null
        pageSize: number
        currentPage: number
    }

    type DscInfoVO = {
        id: number
        dscName: string
        dscType: number
        url: string
        username: string
        databaseName: string
        connectionParams: string
        dscStatus: number
        dscDesc: string
        createdUserId: number
        createdUserName: string
        updatedBy: number
        updatedUserName: string
        createdTime: Date
        updatedTime: Date

    }

    type DscAlertRuleVO = {
        id: number
        dscId: number
        dscName: string
        ruleName: string
        ruleType: number
        isEnabled: number
        notifyChannel: number
        notifyRecipients: number
        notifyRecipientName: string
        notifyRecipientsType: number
        createdUserId: number
        createdUserName: number
        updatedUserId: string
        updatedUserName: string
        createdTime: Date
        updatedTime: Date
    }

    type AlertRulePage = {
        alertRuleName: string | null
        pageSize: number
        currentPage: number
    }

    type AlertRuleAddOrUpdateDto = {
        ruleName: string | null
        dscId: number | undefined
        // 告警通知方式
        notifyChannel: number | undefined
        // 告警规则类型 1：每日首次发现连接失败 2：每次发现连接失败
        ruleType: number | undefined
        notifyRecipientsType: number | undefined
        notifyRecipients: number | undefined
    }

    type IdAndStatusDto = {
        id: number
        status: number
    }

    type projectAddDto = {
        projectName: string | undefined
        projectNameEn: string | undefined
        projectDesc: string | undefined
        dscId: number | undefined
    }

    type ProjectPageDto = {
        projectName: string | null
        projectNameEn: string | null
        pageSize: number
        currentPage: number

    }

    type DscProjectVO = {
        id: number
        dscId: number
        createUserId:number
        createdUserName:number
        projectName: string
        projectNameEn: string
        projectDesc: string
        databaseName: string
        isTop: number
        createdTime: Dateo
        updatedTime: Date
    }


}


