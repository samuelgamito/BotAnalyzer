import { DashboardController } from "./controllers/v1/DashboardController";
import { UploadController } from "./controllers/v1/UploadController";
import { Logger } from "./helpers/Logger";
import { Route } from "./models/routes/Route";
import { RouterObject } from "./models/routes/RoutesObject";



const LOGGER:Logger = new Logger("route.ts")

const baseRoutes: RouterObject[] = [
    {
        Route: "/api/v1",
        Controller: UploadController,
        AditonalRoutes:[
            {
                Method: "post",
                Action: "uploadFile",
                Route: "upload"
            }            
        ]
    },
    {
        Route: "/api/v1",
        Controller: DashboardController,
        AditonalRoutes:[
            {
                Method: "get",
                Action: "getDashboard",
                Route: "dashboard/:id"
            }            
        ]
    }
]

let routes: Route[] = [];
baseRoutes.forEach(root => {
    if(root.AditonalRoutes != undefined){
        root.AditonalRoutes.forEach(route => {

            let uri:string = `${root.Route}/${route.Route}`
            
            LOGGER.debug(`Building path ${uri}`)
            route.Route = uri;
            route.Controller = root.Controller
            routes.push(route)  
        })
    }
})

export const RoutesApi = routes;