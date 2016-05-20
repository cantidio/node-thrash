[![NPM](https://nodei.co/npm/thrash.png)](https://nodei.co/npm/thrash/)

[![Build Status](https://travis-ci.org/cantidio/node-thrash.svg?branch=master)](https://travis-ci.org/cantidio/node-thrash)
[![Code Climate](https://codeclimate.com/github/cantidio/node-thrash/badges/gpa.svg)](https://codeclimate.com/github/cantidio/node-thrash)
[![Test Coverage](https://codeclimate.com/github/cantidio/node-thrash/badges/coverage.svg)](https://codeclimate.com/github/cantidio/node-thrash/coverage)
[![Dependencies](https://david-dm.org/cantidio/node-thrash.svg)](https://david-dm.org/cantidio/node-thrash)
[![devDependencies Status](https://david-dm.org/cantidio/node-thrash/dev-status.svg)](https://david-dm.org/cantidio/node-thrash#info=devDependencies)

# Thrash
> Framework for data pipeline and streaming in Javascript

> WIP  this is not ready to be used.

## Install
```
  npm install --save thrash
```
## Usage

### API Usage

Using the high level Framework with async data pipeline and dependencies tracking
```js
  import Thrash, {kafka, winston} from 'thrash';
  const cfg = { ... };

  Thrash.init({
    receiver: {
      input: kafka.consumer(cfg, cfg.topics)
      process: (obs) => obs.map((v) => JSON.parse(v.value)).share()
    },
    stat: {
      input: ['receiver'],
      process: (obs) => obs
        .bufferTime(1000)
        .map((values) => `${values.length}/s`)
        .subscribe()
    },
    log: {
      input: ['receiver'],
      process: (obs) =>
        obs.subscribe({
          next: (msg) => console.log('received', msg)
        })
    }
  });
```

Using the data-sources directly
```js
  import { kafka, websocket } from 'thrash';

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
    .bufferCount(1024)
    .subscribe(websocket.producer(cfg.ws));
```
