import { Observable } from 'rxjs/Rx';
import { kafka } from '../src/data-sources';

const kafkaCfg = {
  host: '127.0.0.1',
  port: 2181,
  options: {}
};

const producer = kafka.producer(kafkaCfg, {
  topic: 'test',
  partition: 0
});

setTimeout(() => {
  Observable
    .interval(10, (v) => `message-now:${v}`)
    .subscribe(producer);
}, 100);
