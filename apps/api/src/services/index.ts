import { Layer } from 'effect';
import { Auth } from './Auth';
import { Database } from './Database';
import { Gateway } from './Gateway';

export const ServiceLayerLive = Layer.mergeAll(Auth.Live, Database.Live, Gateway.Live);
