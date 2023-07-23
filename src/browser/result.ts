export type result = {
    documento: number,
    tipo: string,
    recebido: string,
    entidade: number,
    municipio: number,
    mes: string,
    exercicio: number,
    statusAudesp: string,
    statusDownload?:boolean,
    toDownload?:boolean
}