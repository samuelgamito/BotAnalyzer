import { NextFunction, Request, Response } from 'express';
import { ErrorEnum } from '../../enums/ErrorEnum';
import { Logger } from '../../helpers/Logger';
import { ErrorResponse } from '../../models/responses/ErrorResponse';
import { ErrorType } from '../../models/responses/ErrorType';
import { UploadResponse } from '../../models/responses/UploadResponse';
import { UploadService } from '../../services/UploadService';

export class UploadController {

    private LOGGER: Logger = new Logger("UploadController.ts");
    private service: UploadService = new UploadService();
    private errorsComponent: ErrorEnum = new ErrorEnum();

    public async uploadFile(request:Request, response:Response, next:NextFunction){
        
        this.LOGGER.info("Receiving a new file to be processed");
        try {
            let bid = await this.service.saveFile(request);
            
            let uploadResponse: UploadResponse = {
                status: true,
                id: bid
            }

            response.status(200).send(uploadResponse);
        } catch (e) {
            console.log(e)
            let err: ErrorType = this.errorsComponent.getError(e.message, e.description);
            let errResponse: ErrorResponse = {
                message:err.message, 
                code: err.code
            }
            response.status(err.status).send(errResponse);
        }
    }
}