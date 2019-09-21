const   fs              = require('fs'),
        mongo_cliente   = require('mongodb').MongoClient,
        express         = require('express'),
        bodyParser      = require('body-parser'),
        formidable      = require('formidable'),
        cors            = require('cors'),
        spawn           = require('await-spawn');


/**
 *  Define os nomes dos meses, dias da semana e horario
 */

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const dias_da_semana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
const horario = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 17, 18, 19, 20, 21, 22, 23];


const app = express(); //Constante para criação da aplicação
const mongo_url = "mongodb://localhost:27017/"; //constante para conexâo com o banco


const corsOptions = {
    origin: '*'
}


//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/** Função para geração de um id randomico 
 * @param None
 * @returns Id único
 */
function custom_uid() {
        return Math.random().toString(36).substr(2, 32);
};

/** Função para converter um vetor em um array associativo, a chave index 
 *  do vetor será a posição do valor no array
 * 
 * @param {Vetor com o campo _id } vetor 
 */
function convert_id_to_index(vetor){
    var indexado = {};
    var index ;

    vetor.forEach(v =>{ //Percorre o vetor
        index           = v._id;//Encontra o index de cada elemento do vetor
        delete v._id;    
        indexado[index] =  v;   //Cria o array associativo
    })
    return indexado;
}


/**
 * 
 * @param {Id do upload dos logs(elemento group no banco)} uid 
 */
async function estatisticas(uid){
    var temp_name = "temp_"+uid+".tmp";  //Cria nome temporário para alocar o arquivo com os logs
    var client = await mongo_cliente.connect(mongo_url, { useNewUrlParser: true }); //Cria a conexao com o banco
    var db     = client.db("bot_analyzer"); //Abre o banco de dados

    //Cria o vetor que armazenara e retornara as análises 
    var dashboard = {
        totalDePerguntas: 0,
        totalDePerguntasNaoRespondidas: 0,
        numeroDeUtilizacoes: 0,
        nuvemDePalavra : {},
        perguntasReicidentes : {},
        perguntasMaisFrequentes : {},
        utilizacaoFerramenta : {
            mes:{
                label : meses,
                valor : []
            },
            diaDeSemana: {
                label : dias_da_semana,
                valor : []
            },
            horario: {
                label : horario,
                valor : [],
            }
        }, 
        logConversa : {}
    }
    var total_de_registros = await db.collection('registros').find({group:uid}).toArray();
    if(total_de_registros < 1)
        return [false];


    /*
    * Bloco para fazer as buscos no banco de dados
    */
    // 
    //Recupera as conversar agrupando pelas conversas 
    var conversa_by_convo = await db.collection('registros').aggregate([
        {
            $match : {
                group : uid
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
        },
        
    ]).toArray();
    //Recupera as conversas agrupando pelos dias da semana
    var group_by_day_week = await db.collection('registros').aggregate([
        {
            $match : {
                group : uid
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
    ]).toArray();
    //Recupera as conversas agrupando pelas horas
    var group_by_hour     = await db.collection('registros').aggregate([
        {
            $match : {
                group : uid
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
    ]).toArray();
    //Recupera as conversas agrupando pelos meses
    var group_by_month    = await db.collection('registros').aggregate([
        {
            $match : {
                group : uid
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
    ]).toArray();
    //Recupera todas as conversas sem agrupamento 
    var conversation      = await db.collection('registros').aggregate([
        {
            $match : {group:uid}
        }, 
        {
            $project:{
                pergunta : '$input',
                resposta : '$response'
            }
        }
        
    ]).toArray();
    
    //Escrevendo a conversa em um arquivo para passar para o processamento
    fs.writeFileSync('uploads/'+temp_name, JSON.stringify(conversation));



    /*
    *   Os próximos três loops convertem os registros dos meses, dias da semana e horas
    *   em re
    */    
    group_by_day_week = convert_id_to_index(group_by_day_week);
    for(i = 1; i <= 7; ++i)
        dashboard.utilizacaoFerramenta.diaDeSemana.valor[i-1] =  group_by_day_week[i] == undefined ? 0 : group_by_day_week[i].count
    group_by_hour     = convert_id_to_index(group_by_hour);

    for(i = 0; i <= 23; ++i)
        dashboard.utilizacaoFerramenta.horario.valor[i] =  group_by_hour[i] == undefined ? 0 : group_by_hour[i].count

    group_by_month    = convert_id_to_index(group_by_month);
    for(i = 1; i <= 12; ++i)
        dashboard.utilizacaoFerramenta.mes.valor[i-1] =  group_by_month[i] == undefined ? 0 : group_by_month[i].count

    dashboard.logConversa         = convert_id_to_index(conversa_by_convo);
    dashboard.numeroDeUtilizacoes = conversa_by_convo.length;
    dashboard.totalDePerguntas    = total_de_registros.length;


    var [estatisticas, cloud] = await Promise.all([
        //Chama o módulo do python para efetuar a análise dos logs
        spawn('python3',["modulos/estatistica.py", "uploads/"+temp_name]),
        //Chama o módulo do python para efetuar a nuvem de palavras
        spawn('python3',["modulos/cloud.py", "uploads/"+temp_name])
    ])

    //Converte o retorno em um vetor
    estatisticas     = estatisticas.toString();
    estatisticas     = JSON.parse(estatisticas);

    dashboard.totalDePerguntasNaoRespondidas = estatisticas.total;
    dashboard.perguntasMaisFrequentes        = estatisticas.top;
    dashboard.nuvemDePalavras                = cloud.toString();

   
    return [true, dashboard];
}

app.use(bodyParser.json()); // Suporte a encoded json body
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Api para enviar os registros ao dashboard, recebe como parametro 
 * o id do grupo do log
 */
app.get('/dashboard/:id', cors(corsOptions), function(req, res, next){
    var id = req.params.id;

    console.info(`[DASHBOARD] Dashboard ID : ${id}`)
    //Chama a função para calcular as estatísticas 
    estatisticas(id)
    .then(success => {
        if(success[0]){ //Caso tudo de certo
            res.send({
                "status": true,
                "dashboard" : success[1]
            });
        }else{
            res.send({
                "status": false,
                "menssagem" : 'Nenhum registro encontrado'
            });
        }
    })
    .catch(error => {
        console.error(error.stack)
        res.send({
            erro: '505'
        });
    });
})

/**
 *  Api para receber o logs e repassa-los para o banco de dados
 */
app.post('/upload',function(req, res, next){
    var form = new formidable.IncomingForm();
    var bid  = custom_uid();
    var path = `${__dirname}/uploads/${bid}.json` //Nome para upload do arquivo
    form.keepExtensions = true;         //mantem a extensão do arquivo

    form.parse(req);

    //Função para receber o arquivo do formulario
    form.on('fileBegin', function (name, file){
        file.path = path;
    });

    form.on('file', function (name, file){
        console.info(`[UPLOAD] Recendo arquivo ${file.name}(${file.type})`)
        var file_type = JSON.stringify(file.type)


        //Verifica o tipo do arquivo
        if(!file_type.includes("octet-stream") && !file_type.includes("json")){
            console.error(`[UPLOAD] Formato inválido - Nome: ${file.name}`)
            res.send({
                "status": false,
                "info"  : "Formato de arquivo inválido."
            });
            res.status(505)
        }else{
            
            console.info(`[UPLOAD] Salvando arquivo para o servidor ${bid}.json`)
            // Abre o arquivo
            var content_log = fs.readFileSync(`./uploads/${bid}.json`),
                json_log    = JSON.parse(content_log);

            //Insere o grupo em todos os registros
            json_log.forEach(function(val, index){
                json_log[index].group = bid
            })

            //Envia o arquivo JSON para o banco de dados
            console.info(`[UPLOAD] Enviando arquivo para o banco de dados group: ${bid}`)
            mongo_cliente.connect(mongo_url,  { useNewUrlParser: true } , function(err, db) {
                if (err) throw err;


                var dbo = db.db('bot_analyzer');

                dbo.collection('registros').insertMany(json_log, function(err, bd){
                    if (err) {
                        res.send({
                            "status": false,
                            "info" : err
                        });
                        throw err;
                    }else{
                        res.send({
                            "status": true,
                            "id" : bid
                        });
                        res.status(200); 
                    }                    
                });

                db.close();
            });

        }
    });

     
})


// Função para lançar o serviço
var server = app.listen(3030, function() {
    console.log(`Serviço rodando na porta ${server.address().port}` );
});