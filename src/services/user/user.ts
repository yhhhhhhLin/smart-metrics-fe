import {get} from "../../request";

export function getUserInfo() {
    return get<API.UserInfo>('/main/user/get/login')
}
