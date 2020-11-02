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
import nltk as nltk
from nltk.corpus import wordnet as wn
import numpy as np
import pandas as pd

nltk.download('punkt')

class Similarity:
    def penn_to_wn(self, tag):
        """ Convert between a Penn Treebank tag to a simplified Wordnet tag """
        if tag.startswith('N'):
            return 'n'
    
        if tag.startswith('V'):
            return 'v'
    
        if tag.startswith('J'):
            return 'a'
    
        if tag.startswith('R'):
            return 'r'
    
        return None
 
    def tagged_to_synset(self, word, tag):
        wn_tag = self.penn_to_wn(tag)
        if wn_tag is None:
            return None
    
        try:
            return wn.synsets(word, wn_tag)[0]
        except:
            return None
    
    def sentence_similarity(self, sentence1, sentence2):
        if(isinstance(sentence1, float) or isinstance(sentence2, float)):
            return 0
        """ compute the sentence similarity using Wordnet """
        # Tokenize and tag
        sentence1 = pos_tag(word_tokenize(sentence1))
        sentence2 = pos_tag(word_tokenize(sentence2))
    
        # Get the synsets for the tagged words
        synsets1 = [self.tagged_to_synset(*tagged_word) for tagged_word in sentence1]
        synsets2 = [self.tagged_to_synset(*tagged_word) for tagged_word in sentence2]
    
        # Filter out the Nones
        synsets1 = [ss for ss in synsets1 if ss]
        synsets2 = [ss for ss in synsets2 if ss]
    
        score, count = 0.0, 0
    
        # For each word in the first sentence
        for synset in synsets1:
            # Get the similarity value of the most similar word in the other sentence
            
            best_score = max([(0.0 if synset.path_similarity(ss) is None else synset.path_similarity(ss) )for ss in synsets2], default=0)
    
            # Check that the similarity could have been computed
            if best_score is not None:
                score += best_score
                count += 1
    
        # Average the values
        if count == 0:
            return 0
        score /= count
        return score
    

    def symmetric_sentence_similarity(self, sentence1, sentence2):
        """ compute the symmetric sentence similarity using Wordnet """
        return (self.sentence_similarity(sentence1, sentence2) + self.sentence_similarity(sentence2, sentence1)) / 2 
