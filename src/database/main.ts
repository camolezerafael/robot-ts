import Mssql from './mssql/queries.js'
import Lowdb from './lowdb/queries.js'
import {entidade} from './mssql/model.js'
import {entidade as entidadeLow} from './lowdb/model.js'
import {confiattaAudesp, findPacotesByIdPacote} from '../@shared/pacotes.js'
import ToLowdb from './integration/toLowdb.js'
import ToMssql from './integration/toMssql.js'
import {result} from '../browser/result.js'

export default class Database {
    private static argumentos = {}

    static async getEntidades(argumentos:any): Promise<entidadeLow[]> {
        return new Promise(async (resolve: any, reject: any) => {
            const pstdb = await Mssql.openDb()
            const lowdb = await Lowdb.connect() || null
            this.argumentos = argumentos

            if (lowdb) {
                console.log('[DATABASE]: Conectado')

                console.log('[DATABASE]: Consultando Entidades PST')
                const entidades = await pstdb.queryEntidades(this.argumentos) || []
                console.log('[DATABASE]: PARSE Entidades LOW')
                const data: entidadeLow[] = await this.parseEntidades(entidades, pstdb)

                console.log('[DATABASE]: Inserindo Entidades LOW')
                await lowdb.insertEntidades(data)
                console.log('[DATABASE]: Fechando Conexão PST')
                await pstdb.closeDb()

                console.log('[DATABASE]: Requisitando Todas Entidades LOW')
                resolve(await lowdb.getAllEntidades())
            } else {
                console.log('[DATABASE]: ERRO')
                reject(lowdb)
            }
        })
    }

    static async saveResults(results: result[]) {
        return new Promise(async (resolve: any, reject: any) => {
            const lowdb = await Lowdb.connect(false) || null

            if (lowdb) {
                await lowdb.insertResults(results)
                resolve()
            } else {
                reject(null)
            }
        })
    }

    static async savePstRobo() {
        return new Promise(async (resolve: any, reject: any) => {
            const pstdb = await Mssql.openDb()
            const lowdb = await Lowdb.connect(false) || null

            if (lowdb) {
                const results = await lowdb.getAllResults()

                for (const result of results) {
                    const entidade = await lowdb.getEntidade(result.municipio, result.entidade)

                    await pstdb.updateDateEntidade(result.municipio, result.entidade)

                    await pstdb.insertRobo(ToMssql.parseRoboFromResult(result, entidade))
                }
                await pstdb.closeDb()
                resolve(true)
            } else {
                await pstdb.closeDb()
                reject(false)
            }
        })
    }

    static async parseEntidades(entidades: entidade[], pstdb: Mssql): Promise<entidadeLow[]> {
        return new Promise(async (resolve: any) => {

            const data = await Promise.all(entidades.map(async (entidade) => {
                return await this.parsePacotes(entidade, pstdb)
            }))
            resolve(data)
        })
    }

    static async parsePacotes(entidade: entidade, pstdb: Mssql): Promise<entidadeLow> {
        return new Promise(async (resolve: any) => {
            entidade.entidade_pacotes = entidade.entidade_pacotes ? JSON.parse(entidade.entidade_pacotes as string) : []
            const basePacotes: confiattaAudesp[][] = await this.parseBasePacotes(pstdb, entidade)

            const parse = new ToLowdb(entidade, basePacotes)

            resolve(parse.parse())
        })
    }

    static async parseBasePacotes(pstdb: Mssql, entidade: entidade): Promise<confiattaAudesp[][]> {
        return new Promise(async (resolve: any) => {
            if (entidade.entidade_pacotes && Array.isArray(entidade.entidade_pacotes)) {

                let pacotes: confiattaAudesp[][] = await Promise.all(entidade.entidade_pacotes.map(async (pacoteEntidade: string) => {
                    if (parseInt(pacoteEntidade)) {
                        let pacotesS = findPacotesByIdPacote(parseInt(pacoteEntidade))

                        return await Promise.all(pacotesS.map(async (pacote) => {
                            if (pacote.idPacote > 0 && pacote.tpPacote > 0) {
                                pacote.importacao = await pstdb
                                    .queryRobo(
                                        entidade.COD_MUNICIPIO,
                                        entidade.COD_ENTIDADE,
                                        pacote.idAudesp,
                                        this.argumentos
                                    )

                                return pacote
                            }
                        })) as confiattaAudesp[]
                    }
                })) as confiattaAudesp[][]

                resolve(pacotes)
            }

            resolve([])
        })
    }

}


