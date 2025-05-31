import {get, post} from "../../request";

// TODO: 先都不加api
export function getEmailMsg(email: string) {
    return get<boolean>('/user/getMsg',{email});

}

export function userRegister(registerForm:API.UserRegisterForm){
    return post<boolean>('/user/register',registerForm);
}

export function userLogin(loginForm:API.UserLoginForm){
    return post<string>('/user/login',loginForm);
}

export function getUserInfo() {
    return get<API.UserInfo>('/user/info')
}

export function listUserIdAndNameMap(username: string){
    return get<Map<number,string>>('/user/usernames',{username});
}

export function updatePassword(passwordForm: API.UpdatePasswordForm) {
    return post<boolean>('/user/updatePassword', passwordForm);
}

export function updateUserInfo(userInfo: API.UserInfo) {
    return post<boolean>('/user/updateInfo', userInfo);
}
