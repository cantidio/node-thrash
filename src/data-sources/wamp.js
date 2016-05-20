import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Connection } from 'autobahn';

function parseConfig(config) {
  return {
    url: config.url,
    realm: config.realm,
    topic: config.topic
  };
}

function onConnectionClose(subject) {
  return (reason, details) => {
    switch (reason) {
      case 'closed':
        subject.onCompleted();
        break;
      case 'unreachable':
      case 'unsupported':
        subject.onError(details);
        break;
      default:
        return false;
    }
    return true;
  };
}

function connect(cfg) {
  const subject = new BehaviorSubject(null);
  const conn = new Connection(cfg);
  conn.onopen = (session) => subject.next(session);
  conn.onclose = onConnectionClose(subject);
  conn.open();
  return {
    close: () => conn.close(),
    session: subject
  };
}

function consumer(config) {
  const cfg = parseConfig(config);
  const conn = connect(cfg);

  return Observable.create(async (observer) => {
    conn.session
      .filter((session) => session && session.isOpen)
      .subscribe({
        next: (session) => {
          session.subscribe(cfg.topic, (data) => observer.next(data));
        }
      });
    return () => conn.close();
  });
}

function producer(config) {
  const cfg = parseConfig(config);
  const conn = connect(cfg);

  return {
    next: async (msg) => {
      const data = Array.isArray(msg) ? msg : [msg];
      await conn.session
        .filter((session) => session && session.isOpen)
        .take(1)
        .subscribe({
          next: (session) => session.publish(cfg.topic, data)
        });
    },
    error: () => {},
    complete: () => conn.close()
  };
}

module.exports = {
  consumer,
  producer
};
