import { Route } from './Route'

export interface RouterObject{
    Route?: String;
    Controller?: any;    
    Action?: String;
    AditonalRoutes?: Route[];
}