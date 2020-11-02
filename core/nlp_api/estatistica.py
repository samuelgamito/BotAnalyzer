"""
This file is part of BotAnalyzer.

    BotAnalyzer is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    BotAnalyzer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with BotAnalyzer.  If not, see <https://www.gnu.org/licenses/>
"""
__author__     = "Samuel de Oliveira Gamito"
__credits__    = ["Samuel de Oliveira Gamito"]
__license__    = "GPL"
__maintainer__ = "Samuel de Oliveira Gamito"
__email__      = "samuelgamito96@gmail.com"
__status__     = "Production"
from Similarity import Similarity

import pandas as pd
import numpy as np
import sys
import json


def create_statistic(data_path):
    #Init classes
    sim = Similarity()

    #Load vectoro to data frame pandas
    data_frame =  pd.DataFrame.from_dict(data_path)



    #Loop para filtrar as perguntas não respondidas 
    nao_respondidas = []
    #Padrão de resposta esperada
    i_dont_know = 'I don\'t know how to respond this'
    for index, row in data_frame.iterrows():
        val = sim.symmetric_sentence_similarity(i_dont_know, row.response)
        if(val > 0.88):
            nao_respondidas.append([row.input, 1 ])

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
    np_nao_respondidas = np.array(nao_respondidas, dtype="O")
    #Sort Numpy Array 
    np_nao_respondidas.sort(axis=0,kind='heapsort')
    #Cut in 10 first
    top_10 = np_nao_respondidas.tolist()[-10:][::-1]

    response = {"total": total_nao_respondidas, "top": top_10}
    return response