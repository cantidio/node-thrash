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

// const config = {
//   input: {
//     type: 'kafka',
//     topics: ['test-1', 'test-2'],
//   },
//   output: {
//     type: 'observable'
//   }
// };
//
// const engine = new Thrash(config);
// engine.start().subscribe();
//

// const consumer = kafka
//   .consumer(kafkaCfg, [{ topic: 'test', partition: 0 }])
//   .map((v) => JSON.parse(v.value))
//   .share();
//
// consumer
//   .filter((v)=> v.type !== 'stat')
//   .bufferTime(1000)
//   .map((values) => {
//     return JSON.stringify({
//       type: 'stat',
//       avg: `${values.length}/s`, rt: Date.now(),
//     });
//   })
//   .bufferCount(5)
//   .subscribe(kafka.producer(kafkaCfg, {
//     topic: 'test',
//     partition: 0,
//   }));
//
// consumer
//   .filter((v)=> v.type === 'stat')
//   .subscribe({
//     next: (msg) => console.log('received', JSON.stringify(msg, null, 2)),
//   });

// const statMap = (values) => JSON.stringify({ type: 'stat', avg: `${values.length}/s`, rt: Date.now() });
// const TOPIC = { topic: 'test', partition: 0 };
// const recv = (obs) => obs.map((v) => JSON.parse(v.value)).share();
// const stat = (obs) => obs
//   .filter((v)=> v.type !== 'stat')
//   .bufferTime(1000)
//   .map(statMap)
//   .bufferCount(5)
//   .subscribe(kafka.producer(kafkaCfg, TOPIC));
//
// const log = (obs) => obs
//   .filter((v)=> v.type === 'stat')
//   .subscribe({
//     next: (msg) => console.log('received', JSON.stringify(msg,null,2))
//   });
//
// Thrash.init({
//   receiver: {
//     input: kafka.consumer(kafkaCfg, [TOPIC])
//     process: recv
//   },
//   stat: {
//     input: ['receiver'],
//     process: stat
//   },
//   log: {
//     input: ['receiver'],
//     process: log
//   }
// });

//
//
// KafkaProvider(['topic-src-1','topic-src-2'])
//   .filter((msg) => msg.data !== undefined)
//   .map((v)=> value.data)
//   .subscribe(KafkaConsumer)
//
//
// Kafka(['topic-src'])
//   .map((v)=> value.data)
//   .each(Kafka(['topic-dst']))
//   .subscribe({
//     end: () => {
//
//     }
//   });
//
//
//   //providers
//   //consumers
