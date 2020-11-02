import axios from 'axios';
import btoa from 'btoa';
import { Logger } from "../helpers/Logger";

export class NlpRepository{

    
    private LOGGER: Logger = new Logger("UploadService.ts");
    private nlpBackendUrl = process.env.NLP_BACKEND_URL || 'http://localhost:5000';

    public async getWordCloud(body:any){
        try {
            let response = await axios.post(`${this.nlpBackendUrl}/cloud`, body, { responseType: 'arraybuffer' });
            let image = btoa(
            new Uint8Array(response.data)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return `${image}`;
        } catch (e) {
            this.LOGGER.info("Error during get word cloud");
            this.LOGGER.error(e.message);
        }
    }

    public async getStatistics(body:any){
        try {
            let response = await axios.post(`${this.nlpBackendUrl}/statistic`, body);
            return response.data;
        } catch (e) {
            this.LOGGER.info("Error during get word cloud");
            this.LOGGER.error(e.message);
        }
    }
}