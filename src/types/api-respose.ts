export type ApiResponse<T = {}> = {
    message: string;
    isSuccess: boolean;
    data?: T
}