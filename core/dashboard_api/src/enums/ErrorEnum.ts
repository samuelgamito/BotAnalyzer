import { ErrorType } from "../models/responses/ErrorType";

export class ErrorEnum{

    private errors: ErrorType[] = [
        {
            code:0,
            status:500,
            message: "Internal Server Error."
        },
        {
            code:1,
            status:415,
            message: "Media type {0} not suported."
        },
        {
            code:2,
            status:404,
            message: "Dashboard {0} not found."
        }
    ]

    private buildString(message:string , ...args:string[]):string {

        if(args == undefined){
            return;
        }

        let temp = message;

        for (var i = 0; i < args.length; i++) {
            temp = temp.replace(`{${i}}`, args[i]);
        }

        return temp;
    }
    
    public getError(errorCode:string, ...description:string[]): ErrorType{

        var errorNumber:number = parseInt(errorCode)
        let err = this.errors[0];

        if(this.errors[errorNumber] != undefined){
            err = this.errors[errorNumber];
        }

        err.message = this.buildString(err.message, ...description);

        return err;
    }
}