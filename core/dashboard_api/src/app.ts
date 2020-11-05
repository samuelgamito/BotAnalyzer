/**
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
 */
/**
 * @author Samuel de Oliveira Gamito.
 * @since  2019.09.21
 */

import * as bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import * as core from "express-serve-static-core";
import { Logger } from './helpers/Logger';
import { Route } from './models/routes/Route';
import { RoutesApi } from './routes';

class App{
  private httpServer:core.Express; 
  private LOGGER: Logger = new Logger("app.ts");

  constructor() {
    this.httpServer = express()

    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer.use(bodyParser.json());
    

    //this.httpServer.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));    
    this.build();
  }

  public Start = (port: number) => {
    return new Promise((resolve, reject) => {

      this.httpServer.listen(
        port,
        () => {
          resolve(port)
        })
        .on('error', (err: object) => reject(err));
    })
  }

  private build = ()=>{

    this.httpServer.use(bodyParser.json());
    this.httpServer.use(bodyParser.urlencoded({ extended: true }));
    
    this.httpServer.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  

    this.httpServer.get('/', function(req: Request, res: Response) {
        res.send('Hello World!');
    });
    
    
    RoutesApi.forEach((route: Route) => {
        const middlewares: any[] = [];
    
        (this.httpServer as any)[route.Method](route.Route, middlewares, (req: Request, res: Response, next: Function) => {
          const result = new (route.Controller as any)()[route.Action](req, res, next);
          if (result instanceof Promise) {
            result.then(result => (result !== null && result !== undefined ? res.send(result) : undefined));
          }
        });
    })
  }

  
  
}

export default App;