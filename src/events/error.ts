import { Event } from '../structures/Event';
import { logger, LogType } from '../structures/Logger';

process.on('uncaughtException', (error) => {
  logger.client(LogType.Error, error);
});

export default new Event('error', (error) => {
  console.log('aaaaaaaaa');
});
