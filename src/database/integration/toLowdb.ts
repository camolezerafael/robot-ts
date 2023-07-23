import {entidade, robo} from '../mssql/model.js'
import {entidade as entidadeLow, robo as roboLow} from '../lowdb/model.js'
import {confiattaAudesp} from '../../@shared/pacotes.js'

export default class ToLowdb {
    protected entidade
    protected pacotes

    constructor(entidade: entidade, pacotes: confiattaAudesp[][] = []) {
        this.entidade = entidade
        this.pacotes = pacotes
    }

    parse(): entidadeLow {
        return this.parseEntidade()
    }

    parseEntidade(): entidadeLow {
        return {
            id: this.entidade.COD_MUNICIPIO + '/' + this.entidade.COD_ENTIDADE,
            municipio: this.entidade.COD_MUNICIPIO,
            entidade: this.entidade.COD_ENTIDADE,
            nome: this.entidade.NOM_ENTIDADE,
            tipo: this.entidade.COD_ENTIDADE_CONFIATTA,
            tipo_adm: this.entidade.com_tipadm_cod,
            audesp_municipio: this.entidade.entidade_mun_codigo_audesp,
            audesp_entidade: this.entidade.entidade_codigo_audesp,
            audesp_email: this.entidade.entidade_audesp_portal_email,
            audesp_senha: this.entidade.entidade_audesp_portal_senha,
            ultima_verificacao: this.entidade.entidade_robot_last_check,
            revenda: this.entidade.entidade_com_revenda_cod,
            pacotes: this.parsePacotes(),
        }
    }

    parsePacotes(): confiattaAudesp[] {
        let pacotesAudesp: confiattaAudesp[] = []

        if (this.pacotes) {
            pacotesAudesp = this.pacotes.map((pacoteAudesp) => {
                const pacotinho = pacoteAudesp.map((pacote) => {

                    if (Array.isArray(pacote.importacao) && pacote.importacao.length > 0) {
                        if (pacote.importacao.length === 1) {
                            pacote.importacao = this.parseRobo(pacote.importacao[0] as robo)
                        } else {
                            pacote.importacao = pacote.importacao.map((importacao) => {
                                return this.parseRobo(importacao as robo)
                            }) as roboLow[]
                        }
                    } else {
                        pacote.importacao = this.parseRobo(pacote.importacao as robo)
                    }

                    return pacote
                })

                if (Array.isArray(pacotinho) && pacotinho.length === 1) {
                    return pacotinho[0]
                }

                return pacotinho
            }) as confiattaAudesp[]
        }
        return pacotesAudesp || []
    }

    parseRobo(robo: robo): roboLow | null {
        if (robo && !Array.isArray(robo)) {
            return {
                municipio: robo.robo_tabent_municipio_cod,
                entidade: robo.robo_tabent_entidade_cod,
                exercicio: robo.robo_exercicio,
                mes: robo.robo_mes,
                pacote_sistema: robo.robo_pacote_tipo_sistema,
                pacote_audesp: robo.robo_pacote_tipo_audesp,
                pacote_upload: robo.robo_pacote_tipo_upload,
                pacote_nome: robo.robo_pacote_nome,
                nome_arquivo: robo.robo_nome_arquivo,
                status_arquivo: robo.robo_status_arquivo,
                status: robo.robo_status,
                datahora_criado: robo.robo_datahora_criado,
                datahora_importado: robo.robo_datahora_importado,
            }
        }

        return null
    }


}