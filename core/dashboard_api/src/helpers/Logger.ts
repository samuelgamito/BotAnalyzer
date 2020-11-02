export class Logger {

    private pattern:String = "[{0}][{1}] Message: {2}";
    private defaultPath:String;

    
    constructor(defaultPath: String){
        this.defaultPath = defaultPath;
    }

    private buildString(...args:String[]):String {

        let temp = this.pattern;

        for (var i = 0; i < arguments.length; i++) {
            temp = temp.replace(`{${i}}`, arguments[i]);
        }

        return temp;
    }

    public debug(message: String){

        let d = new Date();

        console.debug(this.buildString(d.toISOString(), this.defaultPath, message));
    }

    public info(message: String){

        let d = new Date();

        console.info(this.buildString(d.toISOString(), this.defaultPath, message));
    }
    public warn(message: String){

        let d = new Date();

        console.warn(this.buildString(d.toISOString(), this.defaultPath, message));
    }

    public error(message: String){

        let d = new Date();

        console.error(this.buildString(d.toISOString(), this.defaultPath, message));
    }



    
}
