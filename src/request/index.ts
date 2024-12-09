import instance from "./instance.ts";

export async function get<T>(url: string, params?: any): Promise<API.BaseResponse<T>> {
    return (await instance.get(url, {params})).data
}

export async function post<T>(url: string, data?: any,params?: any): Promise<API.BaseResponse<T>> {
    const resp = await instance.post(url, data, {params})
    return resp.data
}