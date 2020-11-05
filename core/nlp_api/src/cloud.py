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

from Cloud import Cloud

import pandas as pd
import numpy as np
import sys
import json
import os


def cloud_service(data_path):

    #Carrega a classe 
    cloud = Cloud()
    base_dir = os.path.dirname(os.path.realpath(__file__))
    #Load vectoro to data frame pandas
    data_frame =  pd.DataFrame.from_dict(data_path)

    column_questions = data_frame['response']
    
    #Gera um número aleatório para atribuir ao nome da nuvem
    name = np.random.randint(1000, 999999)
    file_path = '%s/clouds/%d.png'%(base_dir,name)
    #Recebe a nuvem de plavras
    word_cloud = cloud.get_cloud(column_questions.str.cat(sep=' '))
    #Salva a nuvem em um arquivo para ser acessada posteriormente 
    word_cloud.to_file(file_path)

    #Imprime o nome na tela para o retorno
    return file_path