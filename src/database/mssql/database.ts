import sql, {config} from 'mssql'

export default class MssqlDatabase {
    public pool: any
    private config: config

    constructor(config: config) {
        this.config = config
        this.pool = null
    }

    async connect() {
        console.log('[MSSQL] Conectando...')

        await sql.connect(this.config)
            .then((obj) => {
                this.pool = obj
                console.log('[MSSQL] Conectado')
            })
            .catch(e => {
                console.error('[MSSQL] ***Erro ao conectar ***')
            })
    }

    async close() {
        console.log('[MSSQL] Fechando Conexão...')
        await this.pool?.close()
        console.log('[MSSQL] Conexão Fechada')
    }

    async query(sqlString: string) {
        return new Promise(async (resolve) => {
            console.log('[MSSQL] Fazendo Consulta...')
            const res = await this.pool?.request().query(sqlString)
            console.log('[MSSQL] Consulta Realizada')
            resolve(res.recordset)
        })
    }

    async execute(sqlString: string) {
        console.log('[MSSQL] Executando Consulta...')
        await this.pool?.request().query(sqlString)
        console.log('[MSSQL] Consulta Executada')
    }
}