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

export function addAlertRule(addAlertRuleInfo: API.AlertRuleAddOrUpdateDto) {
    return post<boolean>("/dsc/alert/add", addAlertRuleInfo);
}

export function updateAlertRuleStatus(info: API.IdAndStatusDto) {
    return post<boolean>("/dsc/alert/status", info);
}

export function addDscProject(info: API.projectAddDto) {
    return post<boolean>("/dsc/project/add", info);
}

export function pageProject(info: API.ProjectPageDto) {
    return post<API.Page<API.DscProjectVO>>("/dsc/project/page", info)
}

export function updateProjectIsTopStatus(info: API.IdAndStatusDto) {
    return post<boolean>("/dsc/project/top", info)
}

export function dbs(info: API.SearchDatabasesDto){
    return post<API.DatabaseVO[]>('/dsc/db/dbs', info);

}

export function tables(info: API.SearchTablesDto){
    return post<API.DbTableVO[]>('/dsc/db/tables', info);
}

export function columns(info: API.SearchColumnsDto){
    return post<API.DBTableColumnVO[]>('/dsc/db/columns', info);
}

export function simpleSearch(info: API.SimpleSearchDto){
    return post<API.DBSearchResultVO>('/dsc/db/simpleSearch', info);
}
