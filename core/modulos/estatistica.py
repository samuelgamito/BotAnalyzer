from Similarity import Similarity

import pandas as pd
import numpy as np
import sys
import json


if __name__ == "__main__":
    sys.stderr.close() #Close error output
    #Init classes
    sim = Similarity()

    if(not sys.argv[1] or sys.argv[1] == ""):
        print("erro")


    #Load path from arg
    data_path = sys.argv[1]
    #Load vectoro to data frame pandas
    data_frame =  pd.read_json(data_path, orient='records')



    #Loop para filtrar as perguntas não respondidas 
    nao_respondidas = []
    #Padrão de resposta esperada
    i_dont_know = 'I don\'t know how to respond this'
    for index, row in data_frame.iterrows():
        val = sim.symmetric_sentence_similarity(i_dont_know, row.resposta)
        if(val > 0.88):
            nao_respondidas.append([row.pergunta, 1 ])

    total_nao_respondidas = len(nao_respondidas)

    # considerei uma ativação de 0.55 assim consideramos os mesmos temas
    i = 0
    for ask in nao_respondidas:
        j = 0
        for ask1 in nao_respondidas:
            val = sim.symmetric_sentence_similarity(ask[0], ask1[0])
            if(val > 0.55): #similar remove e soma na primeira
                if(i != j):
                    del nao_respondidas[j]
                    deletado = True
                else:
                    deletado = False
                    j += 1
                ask[1] += 1
        if not deletado:
            i += 1

    #Convert Array to Numpy Array
    np_nao_respondidas = np.array(nao_respondidas)
    #Sort Numpy Array 
    np_nao_respondidas.sort(axis=0,kind='heapsort')
    #Cut in 10 first
    top_10 = np_nao_respondidas.tolist()[-10:]

    response = {"total": total_nao_respondidas, "top": top_10}
    print(json.dumps(response))
    pass