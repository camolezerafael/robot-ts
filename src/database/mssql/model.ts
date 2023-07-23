export type entidade = {
    COD_MUNICIPIO: number,
    COD_ENTIDADE: number,
    NOM_ENTIDADE: string,
    COD_ENTIDADE_CONFIATTA: number,
    com_tipadm_cod: number,
    entidade_codigo_audesp: number,
    entidade_mun_codigo_audesp: number,
    entidade_robot_last_check: string,
    entidade_audesp_portal_email: string,
    entidade_audesp_portal_senha: string,
    entidade_com_revenda_cod: number | null
    entidade_pacotes: string[] | string | null
}

export type robo = {
    robo_tabent_municipio_cod: number,
    robo_tabent_entidade_cod: number,
    robo_exercicio: number,
    robo_mes: number,
    robo_pacote_tipo_sistema: number,
    robo_pacote_tipo_audesp: number,
    robo_pacote_tipo_upload: number,
    robo_pacote_nome: string,
    robo_nome_arquivo: string,
    robo_status_arquivo: number,
    robo_status: number,
    robo_datahora_criado?: string,
    robo_datahora_importado?: string
    robo_datahora_audesp_recebido?: string
}

export type upload = {
    TPO_PACOTE: number,
    STS_PROCESSO: number,
    ANO_EXERCICIO: number,
    MES_EXERCICIO: number
}
