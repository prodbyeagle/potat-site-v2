import { default as eventBus } from '../assets/eventBus';
export class StatsSocket {
  private static instance: StatsSocket
  private socket: WebSocket | null = null;
  
  private constructor(private readonly url: string) {
    this.connect();
  }

  public static new(uri: string): StatsSocket {
    return this.instance ?? (this.instance = new this(uri))
  }

  private connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener('open', () => console.log('Connected to stats server'));

    this.socket.addEventListener('message', (data: MessageEvent) => {
      try {
        const msg = JSON.parse(data.data)
        eventBus.$emit('update', { data: msg.data, topic: msg.topic.split('/')[1] });
      } catch {
        return;
      }
    });

    this.socket.addEventListener('close', () => {
      console.log('Disconnected from stats server');
      this.reconnect();
    });
  }

  private reconnect() { setTimeout(this.connect.bind(this), 2500); }
}

