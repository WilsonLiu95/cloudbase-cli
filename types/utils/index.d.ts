import { SSH } from '../types';
export { printHorizontalTable } from './cli-table';
export * from './uuid';
export * from './qcloud-request';
export * from './http-request';
export * from './output';
export * from './function-packer';
export * from './store';
export * from './cloudbase-config';
export * from './auth';
export * from './check-auth';
export * from './os-release';
export * from './time';
export * from './cloud-api-request';
export * from './fs';
export * from './proxy';
export * from './object';
export * from './config';
export declare function zipDir(dirPath: any, outputPath: any, ignore?: string | string[]): Promise<unknown>;
export declare function askForInput(question: any): Promise<string>;
export declare function getSSHConfig(): SSH;
export declare function getSSH(): Promise<SSH>;
