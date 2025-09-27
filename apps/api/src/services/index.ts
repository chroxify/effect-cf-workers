import { Layer } from 'effect';
import { Gateway } from './ai/Gateway';
import { Auth } from './core/Auth';
import { Database } from './core/Database';

export const ServiceLayerLive = Layer.mergeAll(Auth.Live, Database.Live, Gateway.Live);
