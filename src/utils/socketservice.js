import io from 'socket.io-client';

class WSService {
  initializeSocket = async (SOCKET_URL, authParams) => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: authParams,
        query: {room: 'commonRoom'},
      });

      console.log('initialize socket ', this.socket);

      this.socket.on('connect', data => {
        console.log('=== socket connected ===');
      });

      this.socket.on('disconnect', data => {
        console.log('=== socket disconnected ===');
      });

      this.socket.on('error', data => {
        console.log('=== socket error ===', data);
      });
    } catch (error) {
      console.log('socket is not initialized', error);
    }
  };

  disconnectSocket = () => {
    if (this.socket) {
      this.socket.disconnect();
      console.log('socket disconnected');
    }
  };

  emit(event, data = {}) {
    this.socket.emit(event, data);
  }

  on(event, cb) {
    this.socket.on(event, cb);
  }

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const socketService = new WSService();

export default socketService;
