import { Observable } from 'rxjs/Rx';
import { wamp } from '../src/data-sources';
import winston from 'winston';

const buffer = 5;
const cfg = {
  url: 'ws://localhost:1337',
  realm: '*',
  topic: 'test'
};
const printStat = (v) => winston.info(`sent: ${v.length / buffer}/s`);

Observable
  .interval(1, () => `msg; ${Date.now()}`)
  .do(wamp.producer(cfg))
  .bufferTime(buffer * 1000)
  .do(printStat)
  .subscribe();
