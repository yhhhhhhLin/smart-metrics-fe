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

    type whereCondition = {
        operator: string
        valueType: string
        value: string
    }

    type SearchTablesDto = {
        dscId: number
        dbName: string
        // 模糊查询table名
        tableName: string
    }

    type DbTableVO = {
        dbName: string
        tableName: string
    }

    type SearchColumnsDto = {
        dscId: number
        dbName: string
        tableName: string
        // 用来字段模糊查询用
        columnName: string
    }

    type DBTableColumnVO = {
        dscId : number
        dbName : string
        tableName: string
        columnName: string
        dataType: string
        columnType: string
        isNullable: boolean
        defaultValue: string
        columnComment: string

    }

    type SearchCondition = {
        operator: string
        valueType: string
        value: any
    }

    type SimpleSearchDto = {
        dscId: number
        dbName: string
        tableName: string
        selectColumns: string[]
        computedExpressions: string[]
        whereConditions
        groupByColumns
        orderBy
        pageNum: number
        pageSize: number
    }

    type AdvancedSearchDto = {
        dscId: number
        dbName: string
        mainTableName: string
        mainTableAlias: string
        selectColumns: string[]
        computedExpressions: string[]
        whereConditions
        joinConditions: API.JoinCondition
        groupByColumns
        orderBy
        pageNum: number
        pageSize: number
    }

    type DBSearchResultVO = {
        dscId: number
        dbName: string
        tableName: string
        columnNames: string[]
        data: Map<string, string>[]
        totalCount: number
        success: boolean
        errorMessage: string
    }

    type JoinCondition = {
        joinTableDB: string;
        joinTable: string;
        joinTableAlias: string;
        joinType: string;
        onCondition: string;
    }

    type DatabaseVO = {
        dscId: number
        dbName: string
    }

    type SearchDatabasesDto = {
        dscId: number
        dbName: string
    }

    type ExecuteSqlDto = {
        dscId: number
        sql: string
    }

    type AddOrUpdateMetricsDirDto = {
        id: number
        parentId: number
        name: string
    }

    type DimAddOrUpdateDto = {
        id?: number
        name: string
        code: string
        description?: string
        dscId: number
        databaseName: string
        tableName: string
        dimAttributes: DimAttrAddDto[]
    }

    type DimAttrAddDto = {
        id: number
        attributeName: string
        attributeCode: string
        attributeDesc?: string
        columnName: string
        dataType: string
    }

    type PageDimDto = {
        dimObjectName: string
        dimAttrName: string
        pageSize: number
        currentPage: number
    }

    type DimensionAttrVO = {
        dimensionAttributeName: string
        dimensionAttributeId: string
        dimensionAttributeDesc?: string
        tableField: string
        updatedTime: string
        attrId: number
    }

    type DimensionVO = {
        id: number
        dimensionObjectName: string
        dimensionObjectId: string
        dimensionObjectDesc?: string
        dimAttrNum: number
        dimensionAttr: DimensionAttrVO[]
        updatedTime: string
    }

    type BizLimitDto = {
        name: string
        desc: string
        columnName: string
        operator: string
        value: string

    }

    type StatisticalPeriod = {
        id: number
        name: string
        description: string
        statCycle?: string
        createdTime: Date
    }

    type NormalTryCalculateVO = {
        status: number
        createTableSql: string
        // TODO
        tableStructure: any[]
    }

}


