import Database from './database.js'
import {robotConfig} from './config.js'
import {entidade, robo} from './model.js'
import {result} from '../../browser/result.js'

export default class Queries {
    public db: Database

    constructor() {
        this.db = new Database(robotConfig)
    }

    static async connect(init:boolean = true) {
        try {
            const query = new Queries()
            await query.db.connect(init).catch(e => {
                console.error('[LOWDB] Erro a conectar DB ROBOT : ', e)
            })
            return query
        } catch (error) {
            console.error(error)
        }
    }

    async insertEntidade(entidade: entidade) {
        console.log('[LOWDB] Inserindo Entidade...')
        await this.db.insert('entidades', entidade)
        console.log('[LOWDB] Entidade Inserida')
    }

    async insertEntidades(entidades: entidade[]) {
        console.log('[LOWDB] Inserindo Entidades...')
        await this.db.insertMany('entidades', entidades)
        console.log('[LOWDB] Entidades Inseridas')
    }

    async getAllEntidades(): Promise<entidade[]> {
        console.log('[LOWDB] Requisitando Todas Entidades...')
        return await this.db.getAll('entidades')
    }

    async getEntidade(municipio: number, entidade: number) :Promise<entidade|null>{
        console.log('[LOWDB] Requisitando Entidade...')
        const entidades = await this.db.getAll('entidades')

        for(const ent of entidades) {
            if(ent.audesp_municipio === municipio && ent.audesp_entidade === entidade){
                return ent
            }
        }
        return null
    }

    async insertResult(result: result) {
        console.log('[LOWDB] Inserindo Resultado...')
        await this.db.insert('results', result)
        console.log('[LOWDB] Resultado Inserido')
    }

    async insertResults(results: result[]) {
        console.log('[LOWDB] Inserindo Resultados...')
        await this.db.insertMany('results', results)
        console.log('[LOWDB] Resultados Inseridos')
    }

    async getAllResults(): Promise<result[]> {
        console.log('[LOWDB] Requisitando Todos Resultados...')
        return await this.db.getAll('results')
    }
}
