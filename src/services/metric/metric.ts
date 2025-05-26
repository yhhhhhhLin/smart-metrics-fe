import {get, post} from "../../request";

// TODO: 先都不加api

export function getMetricDirTree() {
    return get<any[]>('/metric/metrics_dir/tree');
}

export function addMetricDir(info: API.AddOrUpdateMetricsDirDto) {
    return post<boolean>('/metric/metrics_dir/add', info);
}

export function updateMetricDir(info: API.AddOrUpdateMetricsDirDto) {
    return post<boolean>('/metric/metrics_dir/update', info);
}

export function delMetricDir(id: number) {
    return get<boolean>('/metric/metrics_dir/del/'+id);
}

export function addDimension(info: API.DimAddOrUpdateDto){
    return post<boolean>('/metric/dim/add', info)
}

export function pageDimensions(info: API.PageDimDto){
    return post<API.Page<API.DimensionVO>>('/metric/dim/page',info)
}

export function listDimensions(info: API.PageDimDto){
    return post<API.DimensionVO[]>('/metric/dim/list',info)
}

export function listISP(){
    return get<API.StatisticalPeriod[]>('/metric/sp/list')
}

export function tryCalculate(info){
    return post<API.NormalTryCalculateVO>('/metric/tryCalculate',info)
}

export function preview(info){
    return post<API.NormalPreviewVO>('/metric/preview',info)
}

export function addNormalMetric(info){
    return post<boolean>('/metric/addMetrics',info)
}

export function pageMetric(info: API.PageMetricDto){
    return post<API.Page<API.IndexMetricVO>>('/metric/page',info)
}

export function getMetricDimFields(info: any){
    return get('/metric/getMetricDimFields?id='+info)
}

export function metricPredict(info){
    return post('/metric/analyse/metricPredict',info)
}

export function getFieldValue(info){
    return post('/metric/analyse/getFieldValue',info)
}


export function taskList(){
    return get('/metric/analyse/taskList')
}

// 指标权限管理相关接口
export function getMetricPermissions() {
    return get('/metric/permission/list')
}

export function addMetricPermission(data: {
    metricId: number;
    permissions: string[];
    users: number[];
}) {
    return post('/metric/permission/add', data)
}

export function updateMetricPermission(data: {
    id: number;
    metricId: number;
    permissions: string[];
    users: number[];
}) {
    return post('/metric/permission/update', data)
}

export function deleteMetricPermission(id: number) {
    return post('/metric/permission/delete', { id })
}

export function getMetricList() {
    return get('/metric/list')
}

export function getUserList() {
    return get('/user/list')
}





