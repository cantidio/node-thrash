import { websocket } from '../src/data-sources';

let count = 0;
const cfg = {
  url: 'ws://127.0.0.1:1337',
  send: {
    mask: true
  }
};

const prod = websocket.producer(cfg);
setInterval(() => {
  prod.next(`${count++}`);
}, 0);
