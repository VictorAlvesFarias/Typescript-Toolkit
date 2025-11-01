import axios, { Axios, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface IBaseHttpQueryFilters {
    page?: number
    quantityItemsPage?: number
    searchTerm?: string
}


export interface IBaseHttpResponseApi<T> {
    errors: any
    sucess: boolean
    pages: number
    currentPage: number
    data: T
}

export interface IBaseHttpServiceMediator {
    config: () => AxiosRequestConfig
    then<T>(res: T): void
    catch: (error: any) => any
}

export interface IRoute {
    api: string
    href: string
    params?: any
}

export abstract class BaseHttpService {
    protected axios: Axios
    protected mediators: () => IBaseHttpServiceMediator

    constructor(mediators: () => IBaseHttpServiceMediator) {
        this.axios = axios
        this.mediators = mediators
    }

    protected post<T>(
        route: IRoute,
        body: any,
        progressEventCallback?: ((progressEvent: AxiosProgressEvent) => void),
        config?: AxiosRequestConfig
    ) {
        const c = config ?? this.mediators().config();

        return axios.post(this.route(route),
            body,
            {
                ...c,
                onUploadProgress: progressEventCallback
            }
        )
            .then((response: AxiosResponse<T, any>) => {
                this.mediators().then<T>(response.data)

                return response.data
            })
            .catch((error) => {
                throw this.mediators().catch(error)
            })
    }

    protected patch<T>(
        route: IRoute,
        body: any,
        config?: AxiosRequestConfig
    ) {
        const c = config ?? this.mediators().config();

        return axios.patch(this.route(route), body, c)
            .then((response: AxiosResponse<T, any>) => {
                this.mediators().then<T>(response.data)

                return response.data
            })
            .catch((error) => {
                throw this.mediators().catch(error)
            })
    }

    protected get<T>(
        route: IRoute,
        config?: AxiosRequestConfig
    ) {
        const c = config ?? this.mediators().config();

        return axios.get(this.route(route), c)
            .then((response: AxiosResponse<T, any>) => {
                this.mediators().then<T>(response.data)

                return response.data
            })
            .catch((error) => {
                throw this.mediators().catch(error)
            })
    }

    protected put<T>(
        route: IRoute,
        body: any,
        config?: AxiosRequestConfig
    ) {
        const c = config ?? this.mediators().config();

        return axios.put(this.route(route), body, c)
            .then((response: AxiosResponse<T, any>) => {
                this.mediators().then<T>(response.data)

                return response.data
            })
            .catch((error) => {
                throw this.mediators().catch(error)
            })
    }

    protected delete<T>(
        route: IRoute,
        config?: AxiosRequestConfig
    ) {
        const c = config ?? this.mediators().config();

        const result = axios.delete(this.route(route), c)
            .then((response: AxiosResponse<T, any>) => {
                this.mediators().then<T>(response.data)

                return response.data
            })
            .catch((error) => {
                throw this.mediators().catch(error)
            })

        return result
    }

    private route(
        route: IRoute
    ) {
        const result = `${route.api}${route.href}${this.urlParams(route.params)}`

        return result
    }

    protected urlParams(params: any) {
        if (params) {
            const keys = Object.keys(params)
            if (keys.length > 0) {
                const stringParams = keys.map(e => {
                    if ((typeof params[e] == "string" && params[e] != null && params[e]?.trim() != "")) {
                        if (Array.isArray(params[e])) {
                            params[e].forEach(i => {
                                e + "=" + i
                            });
                        }
                        else {
                            return e + "=" + params[e]
                        }
                    }
                    else {
                        if (Array.isArray(params[e])) {
                            params[e].forEach(i => {
                                e + "=" + i
                            });
                        }
                        else {
                            return e + "=" + params[e]
                        }
                    }
                });

                return "?" + stringParams.filter(e => e != null).join("&")
            }
        }

        return ""
    }
}