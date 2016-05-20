import { Client, Consumer, Producer } from 'kafka-node';
import { Observable } from 'rxjs/Rx';

function parseConfig(config) {
  return {
    zookeeper: `${config.host}:${config.port}`,
    options: config.options || {}
  };
}

function kafkaConsumer(config, topics) {
  const cfg = parseConfig(config);
  return Observable.create((observer) => {
    const client = new Client(cfg.zookeeper);
    const consumer = new Consumer(client, topics, cfg.options);

    consumer.on('message', (msg) => observer.next(msg));
    consumer.on('error', (err) => observer.error(err));

    return () => consumer.close();
  });
}

function kafkaProducer(config, topic) {
  const cfg = parseConfig(config);
  const client = new Client(cfg.zookeeper);
  const producer = new Producer(client);

  return {
    next: (data) => producer.send([{
      topic: topic.topic,
      partition: topic.partition,
      messages: data
    }], () => {}),
    error: () => {},
    complete: () => producer.close()
  };
}

module.exports = {
  consumer: kafkaConsumer,
  producer: kafkaProducer
};
