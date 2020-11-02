export interface Route{
    Method: string;
    Route?: string;
    Controller?: any;
    Action: string;
    Overload?:boolean;
}