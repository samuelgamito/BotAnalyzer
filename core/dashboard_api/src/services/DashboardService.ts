import { Request } from "express";
import * as fs from 'fs';
import { Constants } from "../constants/Constants";
import { GlobalException } from "../exceptions/GlobalException";
import { DataHelper } from "../helpers/DataHelper";
import { Logger } from "../helpers/Logger";
import { DashboardResponse } from "../models/responses/v1/DashboardResponse";
import { ToolUtilization } from "../models/responses/v1/ToolUtilization";
import { MongoRepository } from "../repositories/MongoRepository";
import { NlpRepository } from "../repositories/NlpRepository";

export class DashboardService{

    private LOGGER: Logger = new Logger("DashboardService.ts");
    private dataHelper:DataHelper = new DataHelper();
    private mongoRepository: MongoRepository = new MongoRepository();
    private nlpRepository: NlpRepository = new NlpRepository();
    
    private month = ['Janeiro', 'Fevereiro', 'Março', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    private weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    private hour = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 17, 18, 19, 20, 21, 22, 23];
    
    public constructor(){
        if(!fs.existsSync(Constants.UPLOAD_PATH)){
            fs.mkdirSync(Constants.UPLOAD_PATH)
        }

        if(!fs.existsSync(Constants.WORD_CLOUD_IMAGES_PATH)){
            fs.mkdirSync(Constants.WORD_CLOUD_IMAGES_PATH)
        }
    }

    public async getDashboard(request:Request){
        
        var id = request.params.id;
        var response:DashboardResponse;
        var toolUtilization:ToolUtilization;
        var wordCloudPath = `temp_${id}.png`;
        
        var totalOfConversations = await this.mongoRepository.countById(id);
        if(totalOfConversations == undefined || totalOfConversations == 0){
            throw new GlobalException("2", id);
        }
        var [conversationByConvo, groupByWeekDay, groupByHour, groupByMonth, conversation] = await Promise.all([
            this.mongoRepository.getConversationByConvo(id),
            this.mongoRepository.getConversationGroupByWeekDays(id),
            this.mongoRepository.getConversationGroupByHour(id),
            this.mongoRepository.getConversationGroupByMonth(id),
            this.mongoRepository.findById(id, {input:1, response:1})
        ])
        
        let tempGroupByWeekDay:any = this.dataHelper.convertIdToIndex(groupByWeekDay);
        let tempGroupByHour:any = this.dataHelper.convertIdToIndex(groupByHour);
        let tempGroupByMonth:any = this.dataHelper.convertIdToIndex(groupByMonth);
        let tempConverstionByConv:any = this.dataHelper.convertIdToIndex(conversationByConvo);

        toolUtilization = {
            diaDeSemana:this.dataHelper.convertToGraphResponseV1(tempGroupByWeekDay, this.weekDays, 1,7,1),
            horario:this.dataHelper.convertToGraphResponseV1(tempGroupByHour, this.hour, 0,23),
            mes:this.dataHelper.convertToGraphResponseV1(tempGroupByMonth, this.month, 1,12,1)
        };
        
        let statisticsPrimise = this.nlpRepository.getStatistics(conversation);
        let imageWordCloud = await this.nlpRepository.getWordCloud(conversation);
        
        fs.writeFileSync(`${Constants.WORD_CLOUD_IMAGES_PATH}/${wordCloudPath}`, imageWordCloud, 'base64');


        let estatisticas = await statisticsPrimise;    
    
        response = {
            utilizacaoFerramenta:toolUtilization,
            logConversa:tempConverstionByConv,
            numeroDeUtilizacoes:conversationByConvo.length,
            totalDePerguntas:totalOfConversations,
            totalDePerguntasNaoRespondidas:estatisticas.total,
            perguntasMaisFrequentes:estatisticas.top,
            nuvemDePalavras: wordCloudPath
        };

        return response
    }
}