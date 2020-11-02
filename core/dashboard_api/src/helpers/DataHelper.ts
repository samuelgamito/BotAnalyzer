import { GraphResponse } from "../models/responses/v1/GraphReponse";

export class DataHelper{
    public customUid(): string{
        return Math.random().toString(36).substr(2, 32);
    };

    public convertIdToIndex(vetor: any){
        var indexado = {};
        var index:string ;

        vetor.forEach(v =>{ 
            index           = v._id;
            delete v._id;    
            indexado[index] =  v;
        })
        return indexado;
    }

    public convertToGraphResponseV1(obj:any[],label:any[], start:number, end:number, minus:number = 0): GraphResponse{

        var graph: GraphResponse = {
            label:label,
            valor:[]
        };

        for(var i = start; i<=end; i++){
            graph.valor[i-minus] =  obj[i] == undefined ? 0 : obj[i].count
        }


        return graph;
    }
}