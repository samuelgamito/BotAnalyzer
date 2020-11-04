import { Db, MongoClient } from 'mongodb';
import { Conversation } from '../models/database/Converstion';

export class MongoRepository{

    private mongoUrl = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/'
    private mongoClient: Promise<MongoClient>;

    private DATABASE:string = "bot_analyzer";
    private COLLECTION_REGISTERS:string = "registros";
    private COLLECTION_STATISTIC:string = "statistic";

    constructor(){

        this.mongoClient = MongoClient.connect(this.mongoUrl, { useNewUrlParser: true })
        
    }

    public async insertConversation(payload: Conversation[]){

        var conn:MongoClient = await this.mongoClient;
        
        var db:Db = conn.db(this.DATABASE);
        
        return db.collection(this.COLLECTION_REGISTERS).insertMany(payload);
    }

    public async getConversationByConvo(id:string){
        
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        var aggregateStages = [
            {
                $match : {
                    group : id
                }
            },
            {
                $group: { 
                    _id   : '$convo_id',
                    count : {$sum : 1} ,
                    conversa : {
                        $push : {
                            pergunta : '$input',
                            resposta : '$response',
                            horario  : {$toDate : '$timestamp'}
                        }
                    }                                   
                }
            }            
        ]

        return db.collection(this.COLLECTION_REGISTERS).aggregate(aggregateStages).toArray();
    }

    public async getConversationGroupByWeekDays(id:string){
        
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        var aggregateStages = [
            {
                $match : {
                    group : id
                }
            },
            {
                $project : {
                    toGroup : {$dayOfWeek : {$toDate : '$timestamp'}}
                }
            },
            {
                $group : {
                    _id : '$toGroup',
                    count : {$sum : 1}
                }
            },
            {
                $sort : {
                    _id : 1
                }
            }         
        ]

        return db.collection(this.COLLECTION_REGISTERS).aggregate(aggregateStages).toArray();
    }

    public async getConversationGroupByHour(id:string){
        
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        var aggregateStages = [
            {
                $match : {
                    group : id
                }
            },
            {
                $project : {
                    toGroup : {$hour : {$toDate : '$timestamp'}}
                }
            },
            {
                $group : {
                    _id : '$toGroup',
                    count : {$sum : 1}
                }
            },
            {
                $sort : {
                    _id : 1
                }
            }       
        ]

        return db.collection(this.COLLECTION_REGISTERS).aggregate(aggregateStages).toArray();
    }

    public async getConversationGroupByMonth(id:string){
        
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        var aggregateStages = [
            {
                $match : {
                    group : id
                }
            },
            {
                $project : {
                    toGroup : {$month : {$toDate : '$timestamp'}}
                }
            },
            {
                $group : {
                    _id : '$toGroup',
                    count : {$sum : 1}
                }
            },
            {
                $sort : {
                    _id : 1
                }
            }      
        ]

        return db.collection(this.COLLECTION_REGISTERS).aggregate(aggregateStages).toArray();
    }

    public async findConversationById(id:string, projection: any = {}){
        
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        return db.collection(this.COLLECTION_REGISTERS).find({group:id}).project(projection).toArray();
    }

    public async findStatisticById(id:string, projection: any = {}){
        
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        return db.collection(this.COLLECTION_STATISTIC).findOne({_id:id});
    }

    public async insertStatisticById(obj:any, id:string){
        
        obj["_id"] = id;
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        return db.collection(this.COLLECTION_STATISTIC).insertOne(obj);
    }

    public async countById(id:string){
        
        var conn:MongoClient = await this.mongoClient;
        var db:Db = conn.db(this.DATABASE);
        
        return db.collection(this.COLLECTION_REGISTERS).find({group:id}).count();
    }

}