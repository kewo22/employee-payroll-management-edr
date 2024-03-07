import { ApiResponse } from "@/types/api-respose";
import { cn } from "./utils";

export const StringToDate = (date: string) => {
    const splitted = date.split('-')
    const d = splitted[2].length === 1 ? `0${splitted[2]}` : splitted[2]
    const m = splitted[1].length === 1 ? `0${splitted[1]}` : splitted[1]
    const y = splitted[0];
    const dateStr = `${y}-${m}-${d}`
    return new Date(dateStr)
}

export const DateToShadInputString = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth().toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth();
    const d = date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    return `${y}-${m}-${d}`
}

export const Fetcher = (url: string) => fetch(url).then((res) => res.json());

export const ToAed = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
});

export const ShowToast = (toast: any, title: string, message: string, type: 'success' | 'fail') => {
    toast({
        className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-green-500 text-white"
        ),
        title: title,
        description: message,
        variant: type === "success" ? "default" : "destructive",
    });
}