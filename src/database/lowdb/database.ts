import {join} from 'node:path'
import {lowDbConfig} from './config.js'

import {Low, LowSync} from 'lowdb'
import {JSONFile, JSONFileSync} from 'lowdb/node'
import {entidade, log} from './model.js'
import fs from 'fs'
import {result} from '../../browser/result.js'

export default class LowDatabase {
    private readonly config: lowDbConfig
    private readonly dbPath: string
    private readonly dbFile: string
    public pool: any

    constructor(config: lowDbConfig) {
        this.config = config
        this.dbPath = this.config.dbPath
        this.dbFile = this.config.dbFile
        this.pool = null
        this.checkRequirements()
    }

    checkRequirements() {
        try {
            console.log('[LOWDB] Checando Requisitos...')
            if (!fs.existsSync(this.dbPath)) {
                fs.mkdirSync(this.dbPath, {recursive: true})

                const file = join(this.dbPath, this.dbFile)

                if (!fs.existsSync(file)) {
                    fs.writeFileSync(file, JSON.stringify(this.config.dbInit))
                }
            }
            console.log('[LOWDB] Requisitos Checados')
        } catch (e) {
            console.error('[LOWDB] Erro ao criar caminho e/ou arquivo(s): ', e)
        }
    }

    async connect(init: boolean = true) {
        console.log('[LOWDB] Iniciando Conexão...')
        const adapter = new JSONFile(join(this.dbPath, this.dbFile))
        this.pool = new Low(adapter)
        if (init) {
            await this.initializeDatabase()
        }
        await this.readDatabase()
        console.log('[LOWDB] Conexão Iniciada')
    }

    async initializeDatabase() {
        console.log('[LOWDB] Inicializando DB...')
        this.pool.data = this.config.dbInit
        await this.pool.write()
        await this.readDatabase()
        console.log('[LOWDB] DB Inicializado')
    }

    async readDatabase() {
        console.log('[LOWDB] Lendo DB...')
        await this.pool.read()
            .then(() => {
                console.log('[LOWDB] DB Carregado')
            })
            .catch((e: any) => {
                console.error('[LOWDB] Erro ao carregar DB: ', e)
            })
    }

    async getAll(entity: string) {
        console.log('[LOWDB] Requisitando todos os dados')
        return await this.pool.data?.[entity]
    }

    async insert(entity: string, data: entidade | log | result) {
        console.log('[LOWDB] Inserindo Dados...')
        await this.pool.data?.[entity].push(data)
        await this.pool.write()
        await this.readDatabase()
        console.log('[LOWDB] Dados Inseridos')
    }

    async insertMany(entity: string, data: entidade[] | log[] | result[]) {
        for (const row of data) {
            await this.insert(entity, row)
        }
    }

}