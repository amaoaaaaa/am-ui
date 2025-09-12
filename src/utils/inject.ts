import { InjectionKey } from 'vue';
import { AmConfig } from './config-store';

export const AM_CONFIG_KEY: InjectionKey<AmConfig> = Symbol('AM_CONFIG_KEY');
