import { websocket } from '../src/data-sources';
import winston from 'winston';

const cfg = {
  url: 'ws://127.0.0.1:1337',
  send: {
    mask: true
  }
};

const cons = websocket.serverConsumer(cfg);

cons
  .bufferTime(1000)
  .do((values) => winston.info(`${values.length}/s`))
  .subscribe();
