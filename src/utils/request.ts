import Cookies from "js-cookie"

export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

export default class Request {
  static get(url: string, options: Record<string, any> = {}) {
    return Request.request(url, options)
  }

  static post(url: string, data: Record<string, any>, options: Record<string, any> = {}) {
    return Request.request(url, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
    })
  }

  static patch(url: string, data: Record<string, any>, options: Record<string, any> = {}) {
    return Request.request(url, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
    })
  }

  static put(url: string, data: Record<string, any>, options: Record<string, any> = {}) {
    return Request.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
    })
  }

  static delete(url: string, options: Record<string, any> = {}) {
    return Request.request(url, {
      method: "DELETE",
      ...options,
    })
  }

  static getJson(url: string, options: Record<string, any> = {}) {
    return Request.get(url, options).then((res) => res.json())
  }

  static postJson(url: string, data: Record<string, any>, options: Record<string, any> = {}) {
    return Request.post(url, data, options).then((res) => res.json())
  }

  static patchJson(url:string, data: Record<string, any>, options: Record<string, any> = {}) {
    return Request.patch(url, data, options).then((res) => res.json())
  }

  static putJson(url:string, data: Record<string, any>, options: Record<string, any> = {}) {
    return Request.put(url, data, options).then((res) => res.json())
  }

  static deleteJson(url: string, options: Record<string, any> = {}) {
    return Request.delete(url, options).then((res) => res.json())
  }

  static request(url: string, options: Record<string, any> = {}) {
    const token = Cookies.get("auth.token")

    options.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

    return new Promise<any>((resolve, reject) => {
      return fetch(`${API_DOMAIN}/api/${url}`, options)
        .then((response: any) => {
          if (response.status === 204) {
            return response.text().then((result: any) => {
              resolve(result)
            })
          }

          if (response.status >= 200 && response.status <= 300) {
            resolve(response)
          }

          if (response.status === 401) {
            response.json().then((result: any) => {
              Cookies.remove("auth.token")
              console.error("请登录")
              setTimeout(() => {
                window.location.href = "/auth/login"
              }, 1000)
              reject(result)
            })
          }

          if (response.status > 401) {
            response.json().then((result: any) => {
              console.error(result.message)
              reject(result)
            })
          }
        })
        .catch((error) => {
          console.error(error)
          console.error("网络错误")
          reject({ result: "网络错误", status: 500 })
        })
    })
  }
}
