export var IWebSocketErrorCode;
(function (IWebSocketErrorCode) {
    IWebSocketErrorCode[IWebSocketErrorCode["INVALID_MESSAGE"] = 1001] = "INVALID_MESSAGE";
    IWebSocketErrorCode[IWebSocketErrorCode["CONNECTION_FAILED"] = 1002] = "CONNECTION_FAILED";
    IWebSocketErrorCode[IWebSocketErrorCode["UNEXPECTED_CLOSE"] = 1003] = "UNEXPECTED_CLOSE";
    IWebSocketErrorCode[IWebSocketErrorCode["UNKNOWN"] = 1999] = "UNKNOWN";
})(IWebSocketErrorCode || (IWebSocketErrorCode = {}));
export class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new WebSocketService();
        return this.instance;
    }
    connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING))
            return;
        try {
            this.socket = new WebSocket(this.getConnectionUrl());
            this.socket.onopen = () => {
                console.log('WebSocket connected at ' + this.getConnectionUrl());
            };
            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const handlers = this.listeners.get(data.Event);
                    if (handlers === undefined) {
                        return;
                    }
                    for (let index = 0; index < handlers.length; index++) {
                        console.log('WebSocket event received: ' + data.Event);
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
                    });
                }
            };
            this.socket.onerror = (err) => {
                this.handleError({
                    code: IWebSocketErrorCode.CONNECTION_FAILED,
                    message: 'WebSocket connection error.',
                    details: err
                });
            };
            this.socket.onclose = () => {
                this.handleError({
                    code: IWebSocketErrorCode.UNEXPECTED_CLOSE,
                    message: 'WebSocket connection closed unexpectedly. Retrying in 5 seconds...'
                });
                this.reconnectTimeout = setTimeout(() => this.connect(), this.getReconnectionDelay());
            };
        }
        catch (err) {
            this.handleError({
                code: IWebSocketErrorCode.CONNECTION_FAILED,
                message: 'Failed to establish WebSocket connection.',
                details: err
            });
        }
    }
    disconnect() {
        if (this.socket) {
            this.socket.onclose = null;
            this.socket.close();
            clearTimeout(this.reconnectTimeout);
            this.socket = null;
            console.log('WebSocket disconnected.');
        }
    }
    send(event, body) {
        const message = JSON.stringify({ Event: event, Body: body });
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        }
        else {
            this.handleError({
                code: IWebSocketErrorCode.CONNECTION_FAILED,
                message: 'WebSocket is not connected. Unable to send message.'
            });
        }
    }
    on(event, handler) {
        const existing = this.listeners.get(event) || [];
        existing.push(handler);
        this.listeners.set(event, existing);
    }
    off(event, handler) {
        const existing = this.listeners.get(event);
        if (existing)
            this.listeners.set(event, existing.filter(h => h !== handler));
    }
    handleError(error) {
        console.error(`[IWebSocketError ${error.code}]: ${error.message}`, error.details ?? '');
        this.webSocketErrorCallback(error);
    }
    getConnectionUrl() {
        return "http://localhost:8081/ws/";
    }
    getReconnectionDelay() {
        return 5000;
    }
    webSocketErrorCallback(error) { }
}
export const webSocketService = new WebSocketService();
