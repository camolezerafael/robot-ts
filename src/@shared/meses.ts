export const meses = {
    'Janeiro': 1,
    'Fevereiro': 2,
    'Março': 3,
    'Abril': 4,
    'Maio': 5,
    'Junho': 6,
    'Julho': 7,
    'Agosto': 8,
    'Setembro': 9,
    'Outubro': 10,
    'Novembro': 11,
    'Dezembro': 12,
}

export function mesesToId(mes:any):number{
    // @ts-ignore
    return meses[mes] || 0
}

export function idToMeses(id:number):string{
    return Object.entries(meses).filter(el => el[1] === id)[0][0]
}