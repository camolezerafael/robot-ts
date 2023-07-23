import {entidade, robo} from '../mssql/model.js'
import {entidade as entidadeLow, upload as uploadLow} from '../lowdb/model.js'
import {result} from '../../browser/result.js'
import {confiattaAudesp, findPacoteByName} from '../../@shared/pacotes.js'
import {mesesToId} from '../../@shared/meses.js'
import {dateToDb} from '../../@shared/misc.js'

export default class ToMssql {
    protected entidade
    protected pacotes

    constructor(entidade: entidadeLow, pacotes: uploadLow) {
        this.entidade = entidade
        this.pacotes = pacotes
    }

    parse(): entidade {
        return this.parseEntidade()
    }

    parseEntidade(): entidade {
        return {
            COD_MUNICIPIO: this.entidade.municipio,
            COD_ENTIDADE: this.entidade.entidade,
            NOM_ENTIDADE: this.entidade.nome,
            COD_ENTIDADE_CONFIATTA: this.entidade.tipo ?? 0,
            com_tipadm_cod: this.entidade.tipo_adm ?? 0,
            entidade_mun_codigo_audesp: this.entidade.audesp_municipio,
            entidade_codigo_audesp: this.entidade.audesp_entidade,
            entidade_audesp_portal_email: this.entidade.audesp_email,
            entidade_audesp_portal_senha: this.entidade.audesp_senha,
            entidade_robot_last_check: this.entidade.ultima_verificacao ?? '',
            entidade_com_revenda_cod: this.entidade.revenda,
            entidade_pacotes: this.parsePacotes(),
        }
    }

    parsePacotes(): string|null {
        return JSON.stringify(this.pacotes)
    }


    static parseRoboFromResult(result: result, entidade:entidadeLow|null):robo|null {
        if(result && result.statusDownload && entidade !== null){
            const pacote = findPacoteByName(result.tipo) as confiattaAudesp

            return {
                robo_tabent_municipio_cod: entidade.municipio,
                robo_tabent_entidade_cod: entidade.entidade,
                robo_exercicio: result.exercicio,
                robo_mes: mesesToId(result.mes) as number,
                robo_pacote_tipo_sistema: pacote.idPacote,
                robo_pacote_tipo_audesp: pacote.idAudesp,
                robo_pacote_tipo_upload: pacote.tpPacote,
                robo_pacote_nome: result.tipo,
                robo_nome_arquivo: result.documento + '.xml',
                robo_status_arquivo: result.statusAudesp.includes('armazenado') ? 1 : 0,
                robo_status: 0,
                robo_datahora_audesp_recebido: dateToDb(result.recebido)
            }
        }
        return null
    }
}