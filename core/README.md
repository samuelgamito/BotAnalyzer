# BotAnalizer - API

# Getting Started

## Prerequisites
- Python 3
- Node.js
- Numpy
- Pandas
- NLTK
- WordCloud
- Git
- NPM
- Pip

## Installing
Download and install pip
```
> wget https://bootstrap.pypa.io/get-pip.py
> python3 get-pip.py
```
Install python dependences 
```
> sudo python3 -m pip install numpy
> sudo python3 -m pip install pandas
> sudo python3 -m pip install nltk
> sudo python3 -m pip install wordcloud
```
Configure NLTK
```
> python3 -m nltk.downloader all 
```
Download and install Node.Js
-  [Download](https://nodejs.org/en/download/)
# Deployment

Deploy on foreground:
```
> npm run start
```
Deploy on background:
    
In this mode the output will be redirect to output.log .
```
> npm run server
```
Running with forever :
Inside misc folder, have a file named deploy.json

```
> cd ../misc
> forever start
``` 

# Built With
- [NodeJs](https://nodejs.org/en/) - JavaScript framework used to create a web service
- [NLTK](https://www.nltk.org/) - Pytohn library to process natural language
- [Pandas](http://www.padas.org.uk/) - Pytohn library used for data manipulation
- [NumPy](https://numpy.org/) - Python library to manipulate arrays
- [WordCloud](https://github.com/amueller/word_cloud) - Python library to crate word cloud

# Contributing


# Versioning



# Authors
- **Samuel de Oliveira Gamito** - 

  See also the list of contributors who participated in this project

# License 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>

# Acknowledgments

