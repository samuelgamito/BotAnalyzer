import { NextFunction, Request, Response } from 'express';
import { ErrorEnum } from '../../enums/ErrorEnum';
import { Logger } from '../../helpers/Logger';
import { ErrorResponse } from '../../models/responses/ErrorResponse';
import { ErrorType } from '../../models/responses/ErrorType';
import { DashboardService } from '../../services/DashboardService';

export class DashboardController{
    
    private LOGGER: Logger = new Logger("UploadController.ts");
    private service: DashboardService = new DashboardService();
    private errorsComponent: ErrorEnum = new ErrorEnum();
    
    public async getDashboard(request:Request, response:Response, next:NextFunction){

        this.LOGGER.info("Retriving a dashboard");
        
        try {
            response.status(200).send(await this.service.getDashboard(request));
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