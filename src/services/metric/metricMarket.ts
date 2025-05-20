import {post} from "../../request";

export function query(info){
    return post('/metric/market/query',info)
}
