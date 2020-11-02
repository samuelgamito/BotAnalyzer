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
from nltk import word_tokenize, pos_tag
from nltk.corpus import wordnet as wn
from os import path
import os as os
import numpy as np
import pandas as pd
from wordcloud import WordCloud
from nltk.corpus import stopwords
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
------------- Classe para criação da palavra de nuvens --------------
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
class Cloud:

    def __init__(self):
        if path.exists("clouds/") == False:
            os.mkdir("clouds")
    
    # Método privado para 
    def __get_colum(self, matrix, i):
        return [row[i] for row in matrix]

    # Método privado para gerar um array com as stop words além de 
    # incluir as palavras e pontuações indesejadas
    def __get_stop_words(self):
        stop_words          = set(stopwords.words('english')) 
        #Removendo pontuação
        stop_words.add("@")
        stop_words.add(".")
        stop_words.add(",")
        stop_words.add("-")
        stop_words.add("/")
        stop_words.add("//")
        stop_words.add(":")
        stop_words.add("=")
        stop_words.add("]")
        stop_words.add("[")
        stop_words.add("%")
        stop_words.add("(")
        stop_words.add(")")
        stop_words.add("{")
        stop_words.add("}")
        stop_words.add("?")
        stop_words.add("\'")
        stop_words.add("\"")
        stop_words.add("”")
        stop_words.add("’")
        stop_words.add(";")
        #Removendo letras , palavras e termo indesejados
        stop_words.add("x")
        stop_words.add("y")
        stop_words.add("n")
        stop_words.add("p")
        stop_words.add("TOB_STT")
        stop_words.add("iniciar")
        stop_words.add("conversa")
        stop_words.add("what")
        stop_words.add("What")
        stop_words.add("know")
        stop_words.add("lucas")
        stop_words.add("mistake")
        stop_words.add("give")
        stop_words.add("hi")
        stop_words.add("hello")
        stop_words.add("ok")
        stop_words.add("tell")
        stop_words.add("help")
        stop_words.add("like")
        stop_words.add("exaple")
        stop_words.add("another")
        stop_words.add("difference")
        stop_words.add("Leo")
        stop_words.add("yes")
        stop_words.add("name")
        stop_words.add("bye")
        stop_words.add("could")
        stop_words.add("thank")
        stop_words.add("answer")
        stop_words.add("wondering")
        stop_words.add("nop")
        stop_words.add("wanna")
        stop_words.add("please")
        stop_words.add("thanks")
        stop_words.add("respond")
        stop_words.add("say")
        stop_words.add("somthing")
        stop_words.add("fine")
        stop_words.add("forget")

        

        return stop_words


    
    def get_cloud(self, text):
        # Gera a nuvem de palavras e retorna um objeto contendo as informações dela
        return WordCloud(width=800, height=400, max_words=30, stopwords=self.__get_stop_words(), background_color="white").generate(text)