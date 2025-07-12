import { Layer } from 'effect';
import { Database } from './Database';
import { Auth } from './Auth';

export const ServiceLayerLive = Layer.mergeAll(Auth.Live, Database.Live);
