export function debug(obj: any) {
    console.log(obj)
    throw new Error('[FIM DEBUG]')
}

export function sleep(s:number) {
    return new Promise(res => setTimeout(res, s * 1000));
}

export function dateToDb(date:string):string{
    let datetime = date.split(' ')

    let dateOutput = datetime[0].split('/')


    return [dateOutput[2], dateOutput[1], dateOutput[0]].join('-') + 'T' + datetime[1] + '.000Z'
}