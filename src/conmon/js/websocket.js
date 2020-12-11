class webSocket {
  constructor() {
    this.signalr = window.signalR;
    this.connection = null;
  }

  connectWebSocket(url, callback, suc) {
    var that = this;
    this.connection = new this.signalr.HubConnectionBuilder()
      //.withUrl("http://172.16.19.108:16681/alarmHub?access_token=" + this.access_token, signalR.HttpTransportType.WebSocket)
      //.withUrl("http://localhost:16681/alarmHub?access_token=" + this.access_token, signalR.HttpTransportType.WebSocket)
      .withUrl(
        process.env.VUE_APP_SOCKETURL + url + '?access_token=' + sessionStorage.token,
        this.signalr.HttpTransportType.WebSocket,
      )
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          return 180 * 1000; 
        }
      })
      .configureLogging(this.signalr.LogLevel.Debug)
      .build();
    this.connection.start().then(
      () => {
        // console.log('success');
        if (suc) {
          suc(true);
        }
      },
      (err) => {
        // console.log('fail');
        setTimeout(() => {
          that.connectWebSocket(url, callback);
        }, 10000);
      },
    );
    this.connection.on('ReceiveMessage', (key, data) => {
      callback(key, data);
    });
    this.connection.onclose(function(err) {
      if (err) {
        // console.log(err);
        setTimeout(() => {
          that.connectWebSocket(url, callback);
        }, 10000);
      }
    });
  }
   // 发送心跳，以维护socket一直保持连接
   heartbeat() {
    this.connection
      .invoke("ReceiveMessage", sessionStorage.token, "Heartbeat")
      .catch(function(err) {
        return console.error(err.toString());
      });
  }
}
export default {
  webSocket: webSocket,
};
