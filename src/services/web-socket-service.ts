export type WebSocketEventHandler<T> = (data: IWebSocketRequest<T>) => boolean | void

export interface IWebSocketRequest<T = any> {
    Event: string
    Body?: T
}

export interface IWebSocketError {
    code: number
    message: string
    details?: any
}

export enum IWebSocketErrorCode {
    INVALID_MESSAGE = 1001,
    CONNECTION_FAILED = 1002,
    UNEXPECTED_CLOSE = 1003,
    UNKNOWN = 1999
}

export class WebSocketService {
    private static instance: WebSocketService
    private socket: WebSocket | null = null
    private reconnectTimeout: any
    private url: string = ""
    private listeners: Map<string, WebSocketEventHandler<any>[]> = new Map()

    public static getInstance(): WebSocketService {
        if (!this.instance) this.instance = new WebSocketService()
        return this.instance
    }

    public connect(): void {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) return

        try {
            this.url = this.getConnectionUrl()

            if (!this.url?.trim()) {
                console.error(`WebSocket connection URL is invalid.`)
                this.reconnectTimeout = setTimeout(() => this.connect(), this.getReconnectionDelay())
                return
            }

            this.socket = new WebSocket(this.url)

            this.socket.onopen = () => {
                console.log('WebSocket connected at ' + this.url)
            }

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    const handlers = this.listeners.get(data.Event)

                    if (handlers === undefined) {
                        return;
                    }

                    for (let index = 0; index < handlers.length; index++) {
                        const element = handlers[index];
                        const result = element(data);

                        if (result === false) {
                            break;
                        }
                    }

                }
                catch (err) {
                    this.handleError({
                        code: IWebSocketErrorCode.INVALID_MESSAGE,
                        message: 'Failed to parse incoming WebSocket message.',
                        details: err
                    })
                }
            }

            this.socket.onerror = (err) => {
                this.handleError({
                    code: IWebSocketErrorCode.CONNECTION_FAILED,
                    message: 'WebSocket connection error.',
                    details: err
                })
            }

            this.socket.onclose = () => {
                this.handleError({
                    code: IWebSocketErrorCode.UNEXPECTED_CLOSE,
                    message: 'WebSocket connection closed unexpectedly. Retrying in 5 seconds...'
                })

                this.reconnectTimeout = setTimeout(() => this.connect(), this.getReconnectionDelay())
            }
        } catch (err) {
            this.handleError({
                code: IWebSocketErrorCode.CONNECTION_FAILED,
                message: 'Failed to establish WebSocket connection.',
                details: err
            })
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.onclose = null
            this.socket.close()
            clearTimeout(this.reconnectTimeout)
            this.socket = null
            console.log('WebSocket disconnected.')
        }
    }

    public send<T = any>(event: string, body?: T): void {
        const message = JSON.stringify({ Event: event, Body: body })
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message)
        } else {
            this.handleError({
                code: IWebSocketErrorCode.CONNECTION_FAILED,
                message: 'WebSocket is not connected. Unable to send message.'
            })
        }
    }

    public on<T = any>(event: string, handler: WebSocketEventHandler<T>): void {
        const existing = this.listeners.get(event) || []
        existing.push(handler as WebSocketEventHandler<any>)
        this.listeners.set(event, existing)
    }

    public off<T = any>(event: string, handler: WebSocketEventHandler<T>): void {
        const existing = this.listeners.get(event)
        if (existing) {
            const filtered = existing.filter(h => h !== handler)
            if (filtered.length === 0) {
                this.listeners.delete(event)
            } else {
                this.listeners.set(event, filtered)
            }
        }
    }

    protected handleError(error: IWebSocketError): void {
        console.error(`[IWebSocketError ${error.code}]: ${error.message}`, error.details ?? '')
        this.webSocketErrorCallback(error)
    }

    protected getConnectionUrl(): string {
        return "http://localhost:8081/ws/"
    }

    protected getReconnectionDelay(): number {
        return 5000
    }

    protected webSocketErrorCallback(error: IWebSocketError): void { }
}

export const webSocketService = new WebSocketService()
