import { ToolUtilization } from "./ToolUtilization";

export interface DashboardResponse{
    
    totalDePerguntas?: number,
    totalDePerguntasNaoRespondidas?: number,
    numeroDeUtilizacoes?: number,
    utilizacaoFerramenta: ToolUtilization,
    nuvemDePalavras?: any,
    perguntasReicidentes?: any,
    perguntasMaisFrequentes?: any,
    logConversa?:any
}