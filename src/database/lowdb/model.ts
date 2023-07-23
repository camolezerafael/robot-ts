import {confiattaAudesp} from '../../@shared/pacotes.js'

export type upload = {
    tipoPacote: number,
    tipoStatus: number,
    exercicio: number,
    mes: number
}

export type entidade = {
    id: string,
    municipio: number,
    entidade: number,
    nome: string,
    tipo?: number,
    tipo_adm?: number,
    audesp_municipio: number,
    audesp_entidade: number,
    audesp_email: string,
    audesp_senha: string,
    ultima_verificacao?: string,
    revenda: number | null,
    pacotes: confiattaAudesp[] | null
}

export type robo = {
    municipio: number,
    entidade: number,
    exercicio: number,
    mes: number,
    pacote_sistema: number,
    pacote_audesp: number,
    pacote_upload: number,
    pacote_nome: string,
    nome_arquivo: string,
    status_arquivo: number,
    status: number,
    datahora_criado?: string,
    datahora_importado?: string,
    datahora_audesp_recebido?: string,
}

export type log = {
    data: string,
    hora: string,
    descricao: string
}