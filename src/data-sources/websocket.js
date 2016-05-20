import { Observable } from 'rxjs/Rx';
import WebSocket, { Server } from 'ws';

function parseConfig(config) {
  return {
    ssl: config.ssl,
    url: `${config.url}:${config.port}`,
    port: config.port,
    send: {
      binary: config.binary,
      mask: config.mask
    }
  };
}

function serverConsumer(config) {
  const cfg = parseConfig(config);
  // TODO expand more options
  const server = new Server({ port: cfg.port });

  return Observable.create((observer) => {
    server.on('connection', (ws) => {
      ws.on('message', (data) => observer.next(data));
      ws.on('error', (err) => observer.error(err));
      ws.on('close', () => observer.complete());
    });

    return () => server.close();
  });
}

function consumer(config) {
  const cfg = parseConfig(config);
  const ws = new WebSocket(cfg.url, undefined, cfg.ssl);

  return Observable.create((observer) => {
    ws.on('message', (data, flags) => observer.next(data, flags));
    ws.on('error', (err) => observer.error(err));
    ws.on('close', () => observer.complete());

    return () => ws.close();
  });
}

function sendBuffer(ws, cfg) {
  const buf = [];
  let func = (data) => buf.push(data);

  // TODO replace with BehaviorSubject
  ws.on('open', () => {
    func = (data) => ws.send(data, cfg.send);
    buf.forEach((msg) => func(msg));
  });

  return (data) => func(data);
}

function producer(config) {
  const cfg = parseConfig(config);
  const ws = new WebSocket(cfg.url, undefined, cfg.ssl);

  return {
    next: sendBuffer(ws, cfg),
    error: () => {},
    complete: () => ws.close()
  };
}

module.exports = {
  serverConsumer,
  // serverProducer,
  consumer,
  producer
};
