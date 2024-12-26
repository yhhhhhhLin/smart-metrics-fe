// code对应value映射关系
export const alertRuleTypeMap:Record<number, string> = {
    1: '每日首次发现连接失败',
    2: '每次发现连接失败'
};

export const statusMap:Record<number, string> = {
    0: '不可用',
    1: '可用'
}

export const notifyChannelMap:Record<number, string> = {
    1: '短信',
    2: '邮箱'
}
