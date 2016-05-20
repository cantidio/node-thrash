import winston from 'winston';
import { wamp } from '../src/data-sources';

const cfg = {
  url: 'ws://localhost:1337',
  realm: '*',
  topic: 'test'
};
const buffer = 5;
const printStat = (v) => winston.info(`recv: ${v.length / buffer}/s`);

wamp
  .consumer(cfg)
  .bufferTime(buffer * 1000)
  .do(printStat)
  .subscribe();
