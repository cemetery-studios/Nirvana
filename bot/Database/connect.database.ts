import mongoose from 'mongoose';
import config from '../config.json' with { type: 'json' };
import { Bot } from '../Clients/Bot.client.js';

export default class Connect {
    private client: Bot;
    private config: any;

    constructor(client: Bot) {
        this.client = client;
        this.config = config;
    }

    connect() {
        mongoose.connect(this.config.mongo_uri, {
            socketTimeoutMS: 1000,
            maxPoolSize: 100
        });

        const db = mongoose.connection as mongoose.Connection; // Explicitly cast to Connection

        db.on("connecting", async (): Promise<void> => {
            await this.client.logger.warn('DATABASE', 'DataBase connecting');
        });

        db.on("reconnected", async (): Promise<void> => {
            await this.client.logger.warn('DATABASE', 'DataBase reconnected');
        });

        db.once("open", async (): Promise<void> => {
            await this.client.logger.log('DATABASE', 'Successfully Connected To DataBase');
        });

        db.on("disconnected", async (): Promise<void> => {
            await this.client.logger.log('DATABASE', 'DataBase disconnected');
        });

        db.on("error", async (err): Promise<void> => {
            await this.client.logger.error('DATABASE', err);
        });
    }
}
