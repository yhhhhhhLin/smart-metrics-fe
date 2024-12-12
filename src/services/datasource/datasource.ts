import {get, post} from "../../request";

// TODO: 先都不加api

export function testConnect(info: API.DatasourceAdd) {
    return post<boolean>('/dsc/dsc/test', info);

}

export function addDatasource(info: API.DatasourceAdd) {
    return post<boolean>('/dsc/dsc/add', info);
}
