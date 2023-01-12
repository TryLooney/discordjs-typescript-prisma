import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  Partials,
} from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { RegisterCommandsOptions } from '../typings/client';
import { CommandType } from '../typings/Command';
import { Event } from './Event';
import { logger } from './Logger';

export class ExtendedClient extends Client {
  commands: Collection<string, CommandType> = new Collection();

  constructor() {
    super({
      intents: [
        'AutoModerationConfiguration',
        'AutoModerationExecution',
        'DirectMessageReactions',
        'DirectMessageTyping',
        'DirectMessages',
        'GuildBans',
        'GuildEmojisAndStickers',
        'GuildEmojisAndStickers',
        'GuildIntegrations',
        'GuildInvites',
        'GuildMembers',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'GuildMessages',
        'GuildPresences',
        'GuildScheduledEvents',
        'GuildVoiceStates',
        'GuildWebhooks',
        'Guilds',
        'MessageContent',
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }

  async start() {
    logger.init();
    this.registerModules();
    this.login(process.env.BOT_TOKEN);
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerCommands({ commands }: RegisterCommandsOptions) {
    this.application?.commands.set(commands);
    console.log('Registering global commands');
  }

  async registerModules() {
    // Commands
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const commandPath = join(__dirname, '..', 'commands');
    const commandFiles = readdirSync(commandPath).filter((file) =>
      file.endsWith('.ts')
    );

    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(
        commandPath + '\\' + filePath
      );
      if (!command.name) return;

      this.commands.set(command.name, command);
      slashCommands.push(command);
    });

    const commandSubPaths = readdirSync(commandPath).filter(
      (path) => !path.endsWith('.ts')
    );
    commandSubPaths.forEach(async (path) => {
      const commandPath = join(__dirname, '..', 'commands', path);
      const commandFiles = readdirSync(commandPath).filter((file) =>
        file.endsWith('.ts')
      );

      commandFiles.forEach(async (filePath) => {
        const command: CommandType = await this.importFile(
          commandPath + '\\' + filePath
        );
        if (!command.name) return;

        this.commands.set(command.name, command);
        slashCommands.push(command);
      });
    });

    this.on('ready', () => {
      this.registerCommands({
        commands: slashCommands,
      });
    });

    // Event
    const eventPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventPath).filter((file) =>
      file.endsWith('.ts')
    );
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(
        eventPath + '\\' + filePath
      );
      this.on(event.event, event.run);
    });

    const eventSubPaths = readdirSync(eventPath).filter(
      (path) => !path.endsWith('.ts')
    );
    eventSubPaths.forEach(async (path) => {
      const eventPath = join(__dirname, '..', 'events', path);
      const eventFiles = readdirSync(eventPath).filter((file) =>
        file.endsWith('.ts')
      );

      eventFiles.forEach(async (filePath) => {
        const event: Event<keyof ClientEvents> = await this.importFile(
          eventPath + '\\' + filePath
        );
        this.on(event.event, event.run);
      });
    });
  }
}
