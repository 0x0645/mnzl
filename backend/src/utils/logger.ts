import pino from 'pino';
import dayjs from 'dayjs';
import config from 'config';

const level = config.get<string>('logLevel');

const log = pino({
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export default log;
