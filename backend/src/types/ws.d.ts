declare module 'ws' {
  import { IncomingMessage, Server } from 'http';

  export type Data = string | ArrayBuffer | ArrayBufferView | Buffer;

  export class WebSocket {
    static OPEN: number;
    readonly readyState: number;
    send(data: Data): void;
    close(code?: number, reason?: string): void;
    on(event: 'message', listener: (message: Data) => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'open', listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export interface ServerOptions {
    server?: Server;
    port?: number;
    path?: string;
  }

  export class WebSocketServer {
    constructor(options: ServerOptions);
    on(event: 'connection', listener: (ws: WebSocket, request: IncomingMessage) => void): this;
  }
}
