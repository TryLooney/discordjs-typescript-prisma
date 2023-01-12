import { User } from 'discord.js';
import {
  appendFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  unlinkSync,
} from 'fs';
import { createGzip } from 'zlib';
import { CommandType } from '../typings/Command';

export enum LogType {
  Error = 1,
  Info = 2,
  Warn = 3,
}

const createLog = (
  loggerType: 'command' | 'client',
  type: LogType,
  content: any
) => {
  const date = new Date();
  const data = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [${loggerType.toUpperCase()}] [${LogType[
    type
  ].toUpperCase()}]: ${content}`;

  console.log(data);
  appendFileSync('logs/latest.log', `${data}\n`);
};

class Logger {
  public init() {
    if (!existsSync('logs/latest.log')) return;

    let number = 1;
    const date = new Date();

    while (
      existsSync(
        `logs/${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}-${number}.log.gz`
      )
    ) {
      number++;
    }

    const stream = createReadStream('logs/latest.log');
    stream
      .pipe(createGzip())
      .pipe(
        createWriteStream(
          `logs/${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}-${number}.log.gz`
        )
      )
      .on('finish', () => {
        unlinkSync('logs/latest.log');
      });
  }

  public command(type: LogType, options: { command: CommandType; user: User }) {
    createLog(
      'command',
      type,
      `${options.user.tag}(${options.user.id}) performed /${options.command.name}`
    );
  }

  public client(type: LogType, content: any) {
    createLog('client', type, content);
  }
}

export const logger = new Logger();
