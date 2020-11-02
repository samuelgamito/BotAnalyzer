export class GlobalException{
    
    public message:string;
    public description:string[]    

    constructor (message: string, ...description: string[]) {
        this.message = message;
        this.description = description;
    }
}