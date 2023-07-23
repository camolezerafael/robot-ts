import Database from './database.js'
import {logConfig} from './config.js'
import {log} from "./model.js";

export default class Queries {
    public db: Database

    constructor() {
        this.db = new Database(logConfig);
    }

    static async connect() {
        try {
            const query = new Queries()
            await query.db.connect().catch(e => {
                console.log('Erro a conectar Log LOWDB: ', e)
            })
        } catch (error) {
            console.error(error)
        }
    }

    async insertAtividade(atividade: log) {
        await this.db.insert('atividades', atividade)
    }

    async getAllAtividades() {
        return this.db.getAll('atividades')
    }
}