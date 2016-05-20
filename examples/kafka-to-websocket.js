import { kafka, websocket } from '../src/data-sources';

const cfg = {
  kafka: {
    topic: { topic: 'test', partition: 0 },
    host: '127.0.0.1',
    port: 2181,
    options: {}
  },
  ws: {
    url: 'ws://127.0.0.1:1337',
    send: {
      mask: true
    }
  }
};

kafka
  .consumer(cfg.kafka, [cfg.kafka.topic])
  .map((v) => v.value)
  .subscribe(websocket.producer(cfg.ws));
