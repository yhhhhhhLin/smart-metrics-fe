import {get, post} from "../../request";

// TODO: 先都不加api

export function getMetricDirTree() {
    return get<any[]>('/metric/metrics_dir/tree');
}
