export const StringToDate = (date: string) => {
    const splitted = date.split('-')
    const d = splitted[2].length === 1 ? `0${splitted[2]}` : splitted[2]
    const m = splitted[1].length === 1 ? `0${splitted[1]}` : splitted[1]
    const y = splitted[0];
    const dateStr = `${y}-${m}-${d}`
    return new Date(dateStr)
}

export const DateToShadInputString = (date: Date) => {
    debugger
    const y = date.getFullYear();
    const m = date.getMonth().toString().length === 1 ? `0${date.getMonth()+1}` : date.getMonth();
    const d = date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    return `${y}-${m}-${d}`
}

export const Fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ToAed = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
});
