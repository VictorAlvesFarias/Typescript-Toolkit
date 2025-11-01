import { Axios, AxiosProgressEvent, AxiosRequestConfig } from 'axios';
export interface IBaseHttpQueryFilters {
    page?: number;
    quantityItemsPage?: number;
    searchTerm?: string;
}
export interface IBaseHttpResponseApi<T> {
    errors: any;
    sucess: boolean;
    pages: number;
    currentPage: number;
    data: T;
}
export interface IBaseHttpServiceMediator {
    config: () => AxiosRequestConfig;
    then<T>(res: T): void;
    catch: (error: any) => any;
}
export interface IRoute {
    api: string;
    href: string;
    params?: any;
}
export declare abstract class BaseHttpService {
    protected axios: Axios;
    protected mediators: () => IBaseHttpServiceMediator;
    constructor(mediators: () => IBaseHttpServiceMediator);
    protected post<T>(route: IRoute, body: any, progressEventCallback?: ((progressEvent: AxiosProgressEvent) => void), config?: AxiosRequestConfig): Promise<T>;
    protected patch<T>(route: IRoute, body: any, config?: AxiosRequestConfig): Promise<T>;
    protected get<T>(route: IRoute, config?: AxiosRequestConfig): Promise<T>;
    protected put<T>(route: IRoute, body: any, config?: AxiosRequestConfig): Promise<T>;
    protected delete<T>(route: IRoute, config?: AxiosRequestConfig): Promise<T>;
    private route;
    protected urlParams(params: any): string;
}
