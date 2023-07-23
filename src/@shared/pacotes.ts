import {robo} from '../database/mssql/model.js'
import {robo as roboLow} from '../database/lowdb/model.js'

export type confiattaAudesp = {
    idPacote: number,
    idAudesp: number,
    nome: string,
    tpPacote: number,
    maxMes?:number,
    importacao?:robo | robo[] | roboLow | roboLow[] | null
}

export const pacotes: Array<confiattaAudesp> = [
    {idPacote: 1, idAudesp: 7, nome: 'CADASTROS-CONTABEIS', tpPacote:3, maxMes:12},
    {idPacote: 2, idAudesp: 8, nome: 'BALANCETE-ISOLADO-CONTA-CONTABIL', tpPacote:1, maxMes:12},
    {idPacote: 2, idAudesp: 9, nome: 'BALANCETE-ISOLADO-CONTA-CORRENTE', tpPacote:2, maxMes:12},
    {idPacote: 3, idAudesp: 10, nome: 'BALANCETE-CONJUNTO-CONTA-CONTABIL', tpPacote:1, maxMes:12},
    {idPacote: 3, idAudesp: 11, nome: 'BALANCETE-CONJUNTO-CONTA-CORRENTE', tpPacote:2, maxMes:12},
    {idPacote: 8, idAudesp: 2001, nome: 'BALANCETE-ISOLADO-ENCERRAMENTO-13-CONTA-CONTABIL', tpPacote:1, maxMes:13},
    {idPacote: 8, idAudesp: 2002, nome: 'BALANCETE-ISOLADO-ENCERRAMENTO-13-CONTA-CORRENTE', tpPacote:2, maxMes:13},
    {idPacote: 9, idAudesp: 2005, nome: 'BALANCETE-CONJUNTO-ENCERRAMENTO-13-CONTA-CONTABIL', tpPacote:1, maxMes:13},
    {idPacote: 9, idAudesp: 2006, nome: 'BALANCETE-CONJUNTO-ENCERRAMENTO-13-CONTA-CORRENTE', tpPacote:2, maxMes:13},
    {idPacote: 10, idAudesp: 2003, nome: 'BALANCETE-ISOLADO-ENCERRAMENTO-14-CONTA-CONTABIL', tpPacote:1, maxMes:14},
    {idPacote: 10, idAudesp: 2004, nome: 'BALANCETE-ISOLADO-ENCERRAMENTO-14-CONTA-CORRENTE', tpPacote:2, maxMes:14},
    {idPacote: 11, idAudesp: 2007, nome: 'BALANCETE-CONJUNTO-ENCERRAMENTO-14-CONTA-CONTABIL', tpPacote:1, maxMes:14},
    {idPacote: 11, idAudesp: 2008, nome: 'BALANCETE-CONJUNTO-ENCERRAMENTO-14-CONTA-CORRENTE', tpPacote:2, maxMes:14},
    {idPacote: 16, idAudesp: 1106, nome: 'Conciliações Bancárias', tpPacote:16},
    {idPacote: 29, idAudesp: 610, nome: 'PLAN-CADASTRO', tpPacote:29, maxMes:12},
    {idPacote: 30, idAudesp: 640, nome: 'PLAN-PPA-INICIAL', tpPacote:30, maxMes:12},
    {idPacote: 31, idAudesp: 645, nome: 'PLAN-PPA-ATUALIZADO', tpPacote:31, maxMes:12},
    {idPacote: 32, idAudesp: 620, nome: 'PLAN-LDO-INICIAL', tpPacote:32, maxMes:12},
    {idPacote: 33, idAudesp: 625, nome: 'PLAN-LDO-ATUALIZADA', tpPacote:33, maxMes:12},
    {idPacote: 34, idAudesp: 635, nome: 'PLAN-LOA-ATUALIZADA', tpPacote:34, maxMes:12},
    {idPacote: 35, idAudesp: 630, nome: 'PLAN-LOA-INICIAL', tpPacote:35, maxMes:12},
    {idPacote: 38, idAudesp: 2019, nome: 'PLAN-CADASTRO-ODS', tpPacote:38, maxMes:12},
    {idPacote: 36, idAudesp: 0, nome: 'MSC-AGREGADA', tpPacote:36, maxMes:12},
    {idPacote: 37, idAudesp: 0, nome: 'MSC-INDIVIDUAL', tpPacote:37, maxMes:12},

    {idPacote: 12, idAudesp: 1110, nome: 'Dados de Balanços Isolados', tpPacote:0},
    {idPacote: 13, idAudesp: 1310, nome: 'Dados de Balanços Conjuntos', tpPacote:0},
    {idPacote: 14, idAudesp: 102, nome: 'SIAP', tpPacote:0},
    {idPacote: 15, idAudesp: 106, nome: 'Cadastro Eletrônico de Obras em Execução', tpPacote:0},
    {idPacote: 17, idAudesp: 1103, nome: 'Mapa de Precatórios', tpPacote:0},
    {idPacote: 19, idAudesp: 1102, nome: 'Relação de Contratos de Concessão e Permissão de Serviço Público', tpPacote:0},
    {idPacote: 24, idAudesp: 1109, nome: 'Remuneração de Agentes Políticos', tpPacote:0},
    {idPacote: 25, idAudesp: 101, nome: 'LEI-ADIANTAMENTO', tpPacote:0},

    {idPacote: 0, idAudesp: 68, nome: 'ATA-AUDIENCIA-ACOES-SAUDE', tpPacote:0},
    {idPacote: 0, idAudesp: 56, nome: 'ATA-AUDIENCIA-AVALIAÇÃO-CUMPRIMENTO-METAS', tpPacote:0},
    {idPacote: 0, idAudesp: 61, nome: 'ATA-REUNIÃO-CONSELHO-FUNDEF', tpPacote:0},
    {idPacote: 0, idAudesp: 1094, nome: 'Ato de fixação da remuneração de agentes políticos', tpPacote:0},
    {idPacote: 0, idAudesp: 1107, nome: 'Atualização do Cadastro Geral de Entidades', tpPacote:0},
    {idPacote: 0, idAudesp: 1207, nome: 'Atualização do Cadastro Geral de Entidades - Mensal', tpPacote:0},
    {idPacote: 0, idAudesp: 33, nome: 'BALANCETE-CONJUNTO-ENCERRAMENTO-FINAL-CONTA-CONTABIL', tpPacote:0},
    {idPacote: 0, idAudesp: 39, nome: 'BALANCETE-CONJUNTO-ENCERRAMENTO-FINAL-CONTA-CORRENTE', tpPacote:0},
    {idPacote: 0, idAudesp: 12, nome: 'BALANCETE-CONSOLIDADO-CONTA-CONTABIL', tpPacote:0},
    {idPacote: 0, idAudesp: 13, nome: 'BALANCETE-CONSOLIDADO-CONTA-CORRENTE', tpPacote:0},
    {idPacote: 0, idAudesp: 2009, nome: 'BALANCETE-CONSOLIDADO-ENCERRAMENTO-13-CONTA-CONTABIL', tpPacote:0},
    {idPacote: 0, idAudesp: 2010, nome: 'BALANCETE-CONSOLIDADO-ENCERRAMENTO-13-CONTA-CORRENTE', tpPacote:0},
    {idPacote: 0, idAudesp: 2011, nome: 'BALANCETE-CONSOLIDADO-ENCERRAMENTO-14-CONTA-CONTABIL', tpPacote:0},
    {idPacote: 0, idAudesp: 2012, nome: 'BALANCETE-CONSOLIDADO-ENCERRAMENTO-14-CONTA-CORRENTE', tpPacote:0},
    {idPacote: 0, idAudesp: 34, nome: 'BALANCETE-CONSOLIDADO-ENCERRAMENTO-FINAL-CONTA-CONTABIL', tpPacote:0},
    {idPacote: 0, idAudesp: 40, nome: 'BALANCETE-CONSOLIDADO-ENCERRAMENTO-FINAL-CONTA-CORRENTE', tpPacote:0},
    {idPacote: 0, idAudesp: 32, nome: 'BALANCETE-ISOLADO-ENCERRAMENTO-FINAL-CONTA-CONTABIL', tpPacote:0},
    {idPacote: 0, idAudesp: 38, nome: 'BALANCETE-ISOLADO-ENCERRAMENTO-FINAL-CONTA-CORRENTE', tpPacote:0},
    {idPacote: 0, idAudesp: 2017, nome: 'Cadastro de Fundos de Investimento', tpPacote:0},
    {idPacote: 0, idAudesp: 2049, nome: 'Cadastro de Parcelamentos com RPPS', tpPacote:0},
    {idPacote: 0, idAudesp: 103, nome: 'Cadastro Eletrônico de Obras em Execução - 2012', tpPacote:0},
    {idPacote: 0, idAudesp: 0, nome: 'CADASTRO-PLANEJAMENTO', tpPacote:0},
    {idPacote: 0, idAudesp: 200, nome: 'CADASTRO-PLANEJAMENTO-ATUALIZADO-2010', tpPacote:0},
    {idPacote: 0, idAudesp: 1206, nome: 'Complemento de Conciliações Bancárias', tpPacote:0},
    {idPacote: 0, idAudesp: 1201, nome: 'Complemento de Relatório de Atividades', tpPacote:0},
    {idPacote: 0, idAudesp: 1209, nome: 'Complemento de Remuneração de Agentes Políticos', tpPacote:0},
    {idPacote: 0, idAudesp: 1105, nome: 'Concessão de Reajuste de Agentes Políticos', tpPacote:0},
    {idPacote: 0, idAudesp: 1125, nome: 'Conciliações Bancárias Mensais', tpPacote:0},
    {idPacote: 0, idAudesp: 64, nome: 'DECRETO-REGULAMENTAÇÃO-FUNDO-SAÚDE', tpPacote:0},
    {idPacote: 0, idAudesp: 2048, nome: 'Demonstrativo da Rentabilidade e Evolução dos Investimentos', tpPacote:0},
    {idPacote: 0, idAudesp: 2047, nome: 'Demonstrativo de Receitas Previdenciárias', tpPacote:0},
    {idPacote: 0, idAudesp: 22, nome: 'ESTATUTO-REGIMENTO-REGULAMENTAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 1104, nome: 'Fixação da Remuneração de Agentes Políticos', tpPacote:0},
    {idPacote: 0, idAudesp: 2018, nome: 'Fundos de Investimento', tpPacote:0},
    {idPacote: 0, idAudesp: 53, nome: 'LDO-ALTERACAO-ATA-AUDIENCIA-APROVAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 52, nome: 'LDO-ALTERACAO-ATA-AUDIENCIA-ELABORACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 5, nome: 'LDO-ATUALIZACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 205, nome: 'LDO-ATUALIZADA-2010', tpPacote:0},
    {idPacote: 0, idAudesp: 2, nome: 'LDO-INICIAL', tpPacote:0},
    {idPacote: 0, idAudesp: 47, nome: 'LDO-INICIAL-ATA-AUDIENCIA-APROVAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 46, nome: 'LDO-INICIAL-ATA-AUDIENCIA-ELABORACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 18, nome: 'LDO-LEI-ATUALIZACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 15, nome: 'LDO-LEI-INICIAL', tpPacote:0},
    {idPacote: 0, idAudesp: 59, nome: 'LEI-CRIAÇÃO-CONSELHO-EDUCAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 65, nome: 'LEI-CRIAÇÃO-CONSELHO-SAÚDE', tpPacote:0},
    {idPacote: 0, idAudesp: 63, nome: 'LEI-CRIAÇÃO-FUNDO-SAUDE', tpPacote:0},
    {idPacote: 0, idAudesp: 21, nome: 'LEI-CRIAÇÃO-INSTITUIÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 20, nome: 'LEI-ORGANICA', tpPacote:0},
    {idPacote: 0, idAudesp: 55, nome: 'LOA-ALTERACAO-ATA-AUDIENCIA-APROVAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 54, nome: 'LOA-ALTERACAO-ATA-AUDIENCIA-ELABORACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 6, nome: 'LOA-ATUALIZACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 206, nome: 'LOA-ATUALIZADA-2010', tpPacote:0},
    {idPacote: 0, idAudesp: 3, nome: 'LOA-INICIAL', tpPacote:0},
    {idPacote: 0, idAudesp: 49, nome: 'LOA-INICIAL-ATA-AUDIENCIA-APROVAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 48, nome: 'LOA-INICIAL-ATA-AUDIENCIA-ELABORACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 19, nome: 'LOA-LEI-ATUALIZACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 16, nome: 'LOA-LEI-INICIAL', tpPacote:0},
    {idPacote: 0, idAudesp: 58, nome: 'NORMA-INSTITUIÇÃO-CONSELHO-FUNDEF-FUNDEB', tpPacote:0},
    {idPacote: 0, idAudesp: 20500, nome: 'Parcelamentos com RPPS', tpPacote:0},
    {idPacote: 0, idAudesp: 62, nome: 'PARECER-CONSELHO-FUNDEB', tpPacote:0},
    {idPacote: 0, idAudesp: 67, nome: 'PARECER-CONSELHO-SAUDE', tpPacote:0},
    {idPacote: 0, idAudesp: 28, nome: 'PECAS-PLANEJAMENTO', tpPacote:0},
    {idPacote: 0, idAudesp: 57, nome: 'PLANO-CARREIRA-MAGISTÉRIO', tpPacote:0},
    {idPacote: 0, idAudesp: 69, nome: 'PLANO-MUNICIPAL-AÇÕES ANUAIS-SAUDE', tpPacote:0},
    {idPacote: 0, idAudesp: 51, nome: 'PPA-ALTERACAO-ATA-AUDIENCIA-APROVAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 50, nome: 'PPA-ALTERACAO-ATA-AUDIENCIA-ELABORACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 4, nome: 'PPA-ATUALIZACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 204, nome: 'PPA-ATUALIZADO-2010', tpPacote:0},
    {idPacote: 0, idAudesp: 1, nome: 'PPA-INICIAL', tpPacote:0},
    {idPacote: 0, idAudesp: 45, nome: 'PPA-INICIAL-ATA-AUDIENCIA-APROVAÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 44, nome: 'PPA-INICIAL-ATA-AUDIENCIA-ELABORACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 17, nome: 'PPA-LEI-ATUALIZACAO', tpPacote:0},
    {idPacote: 0, idAudesp: 14, nome: 'PPA-LEI-INICIAL', tpPacote:0},
    {idPacote: 0, idAudesp: 85, nome: 'Publ. Aplic. na Manut. e Desenv. do Ensino', tpPacote:0},
    {idPacote: 0, idAudesp: 86, nome: 'Publ. do Demonst. de Receitas e Despesas com Manutenção e Desenvolvimento do Ensino (Anexo 8 RREO)', tpPacote:0},
    {idPacote: 0, idAudesp: 87, nome: 'Publ. do Demonstrativo das Receitas e Despesas com Ações e Serviços Públicos  de Saúde', tpPacote:0},
    {idPacote: 0, idAudesp: 82, nome: 'Publ. Remuneração Cargos e Empregos Públicos', tpPacote:0},
    {idPacote: 0, idAudesp: 80, nome: 'Publ. RGF - Executivo', tpPacote:0},
    {idPacote: 0, idAudesp: 81, nome: 'Publ. RGF - Legislativo', tpPacote:0},
    {idPacote: 0, idAudesp: 79, nome: 'Publ. RREO - Aplic. Recursos de Alienação de Ativos', tpPacote:0},
    {idPacote: 0, idAudesp: 70, nome: 'Publ. RREO - Balanço Orçamentário', tpPacote:0},
    {idPacote: 0, idAudesp: 72, nome: 'Publ. RREO - Dem. Apuração RCL', tpPacote:0},
    {idPacote: 0, idAudesp: 71, nome: 'Publ. RREO - Dem. Função / Subfunção', tpPacote:0},
    {idPacote: 0, idAudesp: 73, nome: 'Publ. RREO - Dem. Receitas e Despesas Previdenciárias', tpPacote:0},
    {idPacote: 0, idAudesp: 77, nome: 'Publ. RREO - Oper. Crédito X Desp. Capital', tpPacote:0},
    {idPacote: 0, idAudesp: 78, nome: 'Publ. RREO - Projeção Atuarial do RPPS', tpPacote:0},
    {idPacote: 0, idAudesp: 76, nome: 'Publ. RREO - Restos a Pagar', tpPacote:0},
    {idPacote: 0, idAudesp: 74, nome: 'Publ. RREO - Resultado Nominal', tpPacote:0},
    {idPacote: 0, idAudesp: 75, nome: 'Publ. RREO - Resultado Primário', tpPacote:0},
    {idPacote: 0, idAudesp: 1124, nome: 'Questionário de Contratos de Programa', tpPacote:0},
    {idPacote: 0, idAudesp: 1123, nome: 'Questionário de Serviços de Saneamento Básico', tpPacote:0},
    {idPacote: 0, idAudesp: 1136, nome: 'Questionário sobre Quadro de Pessoal (a partir de 2016)', tpPacote:0},
    {idPacote: 0, idAudesp: 1135, nome: 'Questionário sobre Quadro de Pessoal e Transporte (somente 2015)', tpPacote:0},
    {idPacote: 0, idAudesp: 111, nome: 'Recibo de Prestação de Contas', tpPacote:0},
    {idPacote: 0, idAudesp: 66, nome: 'REGIMENTO-INTERNO-CONSELHO-SAÚDE', tpPacote:0},
    {idPacote: 0, idAudesp: 30, nome: 'RELATÓRIO DE ALERTA', tpPacote:0},
    {idPacote: 0, idAudesp: 301, nome: 'RELATÓRIO DE ALERTA - SUBSTITUÍDO', tpPacote:0},
    {idPacote: 0, idAudesp: 1101, nome: 'Relatório de Atividades', tpPacote:0},
    {idPacote: 0, idAudesp: 31, nome: 'RELATÓRIO DE INCONSISTÊNCIA', tpPacote:0},
    {idPacote: 0, idAudesp: 29, nome: 'RELATÓRIO DE INSTRUÇÃO', tpPacote:0},
    {idPacote: 0, idAudesp: 302, nome: 'RELATÓRIO DE INSTRUÇÃO - SUBSTITUÍDO', tpPacote:0},
    {idPacote: 0, idAudesp: 104, nome: 'SisCAA', tpPacote:0},
    {idPacote: 0, idAudesp: 105, nome: 'SisRTS', tpPacote:0},
    {idPacote: 0, idAudesp: 25, nome: 'TABELASAUXILIARES', tpPacote:0},
    {idPacote: 0, idAudesp: 60, nome: 'TERMO-CONVENIO-MUNICIPALIZAÇÃO-ENSINO', tpPacote:0},
    {idPacote: 0, idAudesp: 26, nome: 'TIPOSGENERICOS', tpPacote:0},
]

export function findPacoteByName(name:string):confiattaAudesp|false{
    for(const p of pacotes){
        if(p.nome.includes(name)){
            return p
        }
    }
    return false
}

export function findPacotesByIdEmpresa(id:number):Array<confiattaAudesp>{
    const result = []

    for(const p of pacotes){
        if(p.idPacote === id){
            result.push(p)
        }
    }
    return result
}

export function findPacotesByIdPacote(id:number):Array<confiattaAudesp>{
    const result = []

    for(const p of pacotes){
        if(p.idPacote === id){
            result.push(p)
        }
    }
    return result
}

export function findPacotesByTpPacote(id:number):Array<confiattaAudesp>{
    const result = []

    for(const p of pacotes){
        if(p.tpPacote === id){
            result.push(p)
        }
    }
    return result
}

