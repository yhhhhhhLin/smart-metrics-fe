import { get, post } from "../../request";

// 添加新消息
export function addNotify(info: API.AddNotifyDto) {
    return post<boolean>('/user/notify/add', info);
}

// 获取消息列表
export function listNotifies(type: number) {
    return get<API.NotifyVO[]>(`/user/notify/list?type=${type}`);
} 