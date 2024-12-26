import {post} from "../../request";

// TODO: 先都不加api

export function testConnect(info: API.DatasourceAdd) {
    return post<boolean>('/dsc/dsc/test', info);

}

export function addDatasource(info: API.DatasourceAdd) {
    return post<boolean>('/dsc/dsc/add', info);
}

export function pageDataSource(pageInfo: API.DatasourcePage) {
    return post<API.Page<API.DscInfoVO>>('/dsc/dsc/page', pageInfo);
}

export function listDataSource(pageInfo: API.DatasourcePage) {
    return post<API.DscInfoVO[]>('/dsc/dsc/list', pageInfo);
}

/**
 * 分页获取数据源告警规则
 * @param pageInfo
 */
export function pageDataSourceAlertRule(pageInfo: API.Page<API.AlertRulePage>) {
    return post<API.Page<API.DscAlertRuleVO>>('/dsc/alert/page', pageInfo);
}

export function addAlertRule(addAlertRuleInfo: API.AlertRuleAddOrUpdateDto){
    return post<boolean>("/dsc/alert/add", addAlertRuleInfo);
}

export function updateAlertRuleStatus(info: API.IdAndStatusDto){
    return post<boolean>("/dsc/alert/status", info);
}
