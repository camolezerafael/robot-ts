import Database from './database.js'
import {msSqlConfig} from './config.js'
import {entidade, robo, upload} from './model.js'

export default class Queries {
    private db: Database

    constructor() {
        this.db = new Database(msSqlConfig)
    }

    static async openDb(): Promise<Queries> {
        const query = new Queries()
        try {
            await query.db.connect()
            return query
        } catch (error) {
            console.error('[MSSQL] Ocorreu um erro na operação anterior: ', error)
            await query.closeDb()
            return query
        }
    }

    async closeDb() {
        console.log('[MSSQL] Fechando Conexão...')
        await this.db.close()
    }


    async queryEntidades(argumentos:any): Promise<entidade[]> {
        let where = ''

        if(argumentos.municipio){
            where += ' AND COD_MUNICIPIO = ' + argumentos.municipio
        }

        if(argumentos.entidade){
            where += ' AND COD_ENTIDADE = ' + argumentos.entidade
        }

        console.log('[MSSQL] Consultando Entidades...')
        const sql = `
            SELECT COD_MUNICIPIO,
                   COD_ENTIDADE,
                   NOM_ENTIDADE,
                   COD_ENTIDADE_CONFIATTA,
                   com_tipadm_cod,
                   entidade_codigo_audesp,
                   entidade_mun_codigo_audesp,
                   entidade_robot_last_check,
                   entidade_audesp_portal_email,
                   entidade_audesp_portal_senha,
                   entidade_com_revenda_cod,
                   entidade_pacotes

            FROM dbo.TAB_ENTIDADE

            WHERE entidade_robot = 1
              AND entidade_codigo_audesp > 0
              AND entidade_mun_codigo_audesp > 0
              AND LEN(entidade_audesp_portal_email) > 0
              AND LEN(entidade_audesp_portal_senha) > 0
              AND DATEADD(day, 1, entidade_data_expiracao) >= GETDATE()
              AND LEN(entidade_pacotes) > 2

              ${where}
            
            ORDER BY entidade_audesp_portal_email`

        return await this.db.query(sql) as entidade[]
    }

    async queryEntidadeUpload(municipio: number, entidade: number, pacotes: number): Promise<upload[]> {
        console.log('[MSSQL] Consultando Pacotes da Entidade...')
        const sql = `
            SELECT TPO_PACOTE,
                   STS_PROCESSO,
                   MAX(ANO_EXERCICIO) ANO_EXERCICIO,
                   MAX(MES_EXERCICIO) MES_EXERCICIO

            FROM dbo.TAB_UPLOAD_ARQUIVO

            WHERE COD_MUNICIPIO = ${municipio}
              AND COD_ENTIDADE = ${entidade}
              AND TPO_PACOTE IN (${pacotes})

            GROUP BY STS_PROCESSO, TPO_PACOTE`

        return await this.db.query(sql) as upload[]
    }

    async queryRobo(municipio: number, entidade: number, pacoteTipoAudesp: number, argumentos:any): Promise<robo[]> {
        let where = ''

        if(argumentos.ano){
            where += ' AND robo_exercicio >= ' + argumentos.ano
        }

        console.log('[MSSQL] Consultando Pacotes Importados...')
        const sql = `
            SELECT robo_tabent_municipio_cod,
                   robo_tabent_entidade_cod,
                   robo_exercicio,
                   robo_mes,
                   robo_pacote_tipo_sistema,
                   robo_pacote_tipo_audesp,
                   robo_pacote_nome,
                   robo_nome_arquivo,
                   robo_status,
                   robo_datahora_criado,
                   robo_datahora_importado,
                   robo_status_arquivo,
                   robo_pacote_tipo_upload

            FROM dbo.robo r

            WHERE robo_tabent_municipio_cod = ${municipio}
                AND robo_tabent_entidade_cod = ${entidade}
                AND robo_pacote_tipo_audesp = ${pacoteTipoAudesp}
                AND (
                    robo_status_arquivo = 1
                    OR (
                        robo_status_arquivo = 0
                        AND NOT EXISTS (
                            SELECT
                                1
                            FROM
                                dbo.robo rr
                            WHERE
                                rr.robo_tabent_municipio_cod = r.robo_tabent_municipio_cod
                                AND rr.robo_tabent_entidade_cod = r.robo_tabent_entidade_cod
                                AND rr.robo_exercicio = r.robo_exercicio
                                AND rr.robo_mes = r.robo_mes
                                AND rr.robo_pacote_nome = r.robo_pacote_nome
                                AND rr.robo_status_arquivo = 1
                            )
                        )
                        AND NOT EXISTS (
                            SELECT
                                1
                            FROM
                                dbo.robo rrr
                            WHERE
                                rrr.robo_tabent_municipio_cod = r.robo_tabent_municipio_cod
                              AND rrr.robo_tabent_entidade_cod = r.robo_tabent_entidade_cod
                              AND rrr.robo_exercicio = r.robo_exercicio
                              AND rrr.robo_mes = r.robo_mes
                              AND rrr.robo_pacote_nome = r.robo_pacote_nome
                              AND rrr.robo_status_arquivo = 0
                        )
                    )
            
                ${where}
                
        `

        return await this.db.query(sql) as robo[]
    }

    async insertRobo(data: robo | null) {
        console.log('[MSSQL] Inserindo dados na tabela ROBO...')
        if (data) {
            const sql = `
                INSERT INTO dbo.robo (robo_tabent_municipio_cod,
                                      robo_tabent_entidade_cod,
                                      robo_exercicio,
                                      robo_mes,
                                      robo_pacote_tipo_sistema,
                                      robo_pacote_tipo_audesp,
                                      robo_pacote_nome,
                                      robo_status,
                                      robo_nome_arquivo,
                                      robo_status_arquivo,
                                      robo_pacote_tipo_upload,
                                      robo_datahora_audesp_recebido)
                VALUES (${data.robo_tabent_municipio_cod},
                        ${data.robo_tabent_entidade_cod},
                        ${data.robo_exercicio},
                        ${data.robo_mes},
                        ${data.robo_pacote_tipo_sistema},
                        ${data.robo_pacote_tipo_audesp},
                        '${data.robo_pacote_nome}',
                        ${data.robo_status},
                        '${data.robo_nome_arquivo}',
                        ${data.robo_status_arquivo},
                        ${data.robo_pacote_tipo_upload},
                        CAST(N'${data.robo_datahora_audesp_recebido}' AS DATETIME))
            `
            return await this.db.execute(sql)
        }
    }

    async updateDateEntidade(municipio: number, entidade: number) {
        console.log('[MSSQL] Salvando Data Entidade...')
        const sql = `
            UPDATE
                dbo.TAB_ENTIDADE

            SET entidade_robot_last_check = GETDATE()

            WHERE COD_MUNICIPIO = ${municipio}
              AND COD_ENTIDADE = ${entidade}
        `

        return await this.db.execute(sql)
    }
}


