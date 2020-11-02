import { Request } from "express";
import { IncomingForm } from 'formidable';
import * as fs from 'fs';
import { Constants } from "../constants/Constants";
import { GlobalException } from "../exceptions/GlobalException";
import { DataHelper } from "../helpers/DataHelper";
import { Logger } from "../helpers/Logger";
import { Conversation } from "../models/database/Converstion";
import { MongoRepository } from "../repositories/MongoRepository";

export class UploadService{

    private LOGGER: Logger = new Logger("UploadService.ts");
    private dataHelper:DataHelper = new DataHelper();
    private mongoRepository: MongoRepository = new MongoRepository();
    
    constructor(){
        if(!fs.existsSync(Constants.UPLOAD_PATH)){
            fs.mkdirSync(Constants.UPLOAD_PATH)
        }
    }
    private async uploadForm(request:Request, path:string, bid:string){
        return new Promise((resolve, reject) =>{
            let form = new IncomingForm();

            form.keepExtensions = true;
            form.parse(request);
    
            form.on('fileBegin', (name, file)=>{
                file.path = path;
            })
            .on('file', function (name, file){
                
                var fileType = JSON.stringify(file.type)
        
                if(!fileType.includes("octet-stream") && !fileType.includes("json")){
                    reject(new GlobalException("1", fileType))
                    return;
                }else{
                    resolve(bid)
                }
            });
        })
    }
    private async saveOnDatabase(path:string, bid:string){

        var contentLog = fs.readFileSync(path);
        var jsonLog: Conversation[] = <Conversation[]>JSON.parse(contentLog.toString());

        jsonLog.forEach(function(val, index){
            jsonLog[index].group = bid
        })
        
        await this.mongoRepository.insertConversation(jsonLog);
    }

    public async saveFile(request:Request): Promise<any>{

        var bid  = this.dataHelper.customUid();
        var path = `${Constants.UPLOAD_PATH}/${bid}.json`
    
        var formResult = await this.uploadForm(request, path, bid);
        
        await this.saveOnDatabase(path,bid);

        return formResult;
    }
}   