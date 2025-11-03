import axios from 'axios';
export class BaseHttpService {
    constructor(mediators) {
        this.axios = axios;
        this.mediators = mediators;
    }
    post(route, body, progressEventCallback, config) {
        const c = config ?? this.mediators().config();
        return axios.post(this.route(route), body, {
            ...c,
            onUploadProgress: progressEventCallback
        })
            .then((response) => {
            return response.data;
        })
            .catch((error) => {
            throw this.mediators().catch(error);
        });
    }
    patch(route, body, config) {
        const c = config ?? this.mediators().config();
        return axios.patch(this.route(route), body, c)
            .then((response) => {
            return response.data;
        })
            .catch((error) => {
            throw this.mediators().catch(error);
        });
    }
    get(route, config) {
        const c = config ?? this.mediators().config();
        return axios.get(this.route(route), c)
            .then((response) => {
            return response.data;
        })
            .catch((error) => {
            throw this.mediators().catch(error);
        });
    }
    put(route, body, config) {
        const c = config ?? this.mediators().config();
        return axios.put(this.route(route), body, c)
            .then((response) => {
            return response.data;
        })
            .catch((error) => {
            throw this.mediators().catch(error);
        });
    }
    delete(route, config) {
        const c = config ?? this.mediators().config();
        const result = axios.delete(this.route(route), c)
            .then((response) => {
            return response.data;
        })
            .catch((error) => {
            throw this.mediators().catch(error);
        });
        return result;
    }
    route(route) {
        const result = `${route.api}${route.href}${this.urlParams(route.params)}`;
        return result;
    }
    urlParams(params) {
        if (params) {
            const keys = Object.keys(params);
            if (keys.length > 0) {
                const stringParams = keys.map(e => {
                    if ((typeof params[e] == "string" && params[e] != null && params[e]?.trim() != "")) {
                        if (Array.isArray(params[e])) {
                            params[e].forEach(i => {
                                e + "=" + i;
                            });
                        }
                        else {
                            return e + "=" + params[e];
                        }
                    }
                    else {
                        if (Array.isArray(params[e])) {
                            params[e].forEach(i => {
                                e + "=" + i;
                            });
                        }
                        else {
                            return e + "=" + params[e];
                        }
                    }
                });
                return "?" + stringParams.filter(e => e != null).join("&");
            }
        }
        return "";
    }
}
