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




