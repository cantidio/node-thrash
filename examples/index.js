import meow from 'meow';
import winston from 'winston';

const examples = [
  'kafka-consumer',
  'kafka-producer',
  'wamp-consumer',
  'wamp-producer',
  'websocket-consumer',
  'websocket-producer',
  'websocket-server-consumer',
  'websocket-server-producer',
  // LINKS
  'kafka-to-websocket'
];

function mountEx(ident) {
  return examples.reduce((a, b) => `${a}${ident}${b}\n`, '\n');
}

const cli = meow(`
  Usage
    $ npm start [example]

    Examples: ${mountEx('      ')}
`);

if (cli.input.length !== 1 || !examples.find((e) => e === cli.input[0])) {
  winston.error(`
    Your selected example: "${cli.input[0]}" is not valid.
    You should select a valid example: ${mountEx('      ')}`
  );
  process.exit(0);
}

winston.info(`Running: ${cli.input[0]}`);

require(`./${cli.input[0]}`);
