export type WebSocketEventHandler<T> = (data: IWebSocketRequest<T>) => boolean | void;
export interface IWebSocketRequest<T = any> {
    Event: string;
    Body?: T;
}
export interface IWebSocketError {
    code: number;
    message: string;
    details?: any;
}
export declare enum IWebSocketErrorCode {
    INVALID_MESSAGE = 1001,
    CONNECTION_FAILED = 1002,
    UNEXPECTED_CLOSE = 1003,
    UNKNOWN = 1999
}
export declare class WebSocketService {
    private static instance;
    private socket;
    private reconnectTimeout;
    private url;
    private listeners;
    static getInstance(): WebSocketService;
    connect(): void;
    disconnect(): void;
    send<T = any>(event: string, body?: T): void;
    on<T = any>(event: string, handler: WebSocketEventHandler<T>): void;
    off<T = any>(event: string, handler: WebSocketEventHandler<T>): void;
    protected handleError(error: IWebSocketError): void;
    protected getConnectionUrl(): string;
    protected getReconnectionDelay(): number;
    protected webSocketErrorCallback(error: IWebSocketError): void;
}
export declare const webSocketService: WebSocketService;
