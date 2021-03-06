import { CloudBaseError } from './error'

/* eslint-disable */
declare global {
    namespace NodeJS {
        interface Process {
            IS_DEBUG: boolean
            CLI_VERSION: string
        }
    }
}
/* eslint-enable */

export type TExportFunctionVoid = () => Promise<void | CloudBaseError>

export interface PermanentCredential {
    secretId?: string
    secretKey?: string
}

export interface TmpCredential {
    tmpSecretId?: string
    tmpSecretKey?: string
    tmpToken?: string
    tmpExpired?: string
    expired?: string
    authTime?: string
    refreshToken?: string
    uin?: string
    hash?: string
}

export type Credential = TmpCredential & PermanentCredential

export interface AuthSecret {
    secretId: string
    secretKey: string
    token?: string
}

export interface SSH {
    host: string
    port: string
    username: string
    password: string
}

export interface IConfig {
    credential?: Credential
    ssh?: SSH
}

export interface ICloudBaseConfig {
    envId: string
    functionRoot?: string
    functions?: ICloudFunction[]
    servers?: ServerConfig[]
}

export interface IGetCredential {
    secretId?: string
    secretKey?: string
    token: string
}

export enum ServerLanguageType {
    node = 'node'
}

export interface ServerConfig {
    type: ServerLanguageType.node
    name: string
    path: string
}

/**
 * 函数
 */
export interface IFunctionPackResult {
    success: boolean
    assets: string[]
    vemo?: boolean
}

export interface IFunctionVPC {
    subnetId: string
    vpcId: string
}

export interface ICloudFunctionConfig {
    timeout?: number
    envVariables?: Record<string, string | number | boolean>
    runtime?: string
    vpc?: IFunctionVPC
    installDependency?: boolean
    l5?: boolean
}

export interface ICloudFunctionTrigger {
    name: string
    type: string
    config: string
}

export interface ICloudFunction {
    name: string
    config?: ICloudFunctionConfig
    triggers?: ICloudFunctionTrigger[]
    params?: Record<string, string>
    handler?: string
    ignore?: string | string[]
    timeout?: number
    envVariables?: Record<string, string | number | boolean>
    runtime?: string
    vpc?: IFunctionVPC
    l5?: boolean
    installDependency?: boolean
}

export interface ICreateFunctionOptions {
    // 函数配置信息
    func?: ICloudFunction
    functions?: ICloudFunction[]
    functionRootPath?: string
    envId: string
    force?: boolean
    base64Code?: string
    log?: boolean
    codeSecret?: string
}

export interface IListFunctionOptions {
    limit?: number
    offset?: number
    envId: string
}

export interface IFunctionLogOptions {
    functionName: string
    envId: string
    offset?: number
    limit?: number
    order?: string
    orderBy?: string
    startTime?: string
    endTime?: string
    functionRequestI?: string
}

export interface IUpdateFunctionConfigOptions {
    functionName: string
    config: ICloudFunctionConfig
    envId: string
}

export interface InvokeFunctionOptions {
    functionName: string
    params?: Record<string, any>
    envId: string
}

export interface IFunctionBatchOptions {
    functions: ICloudFunction[]
    envId: string
    log?: boolean
}

export interface IFunctionTriggerOptions {
    functionName: string
    triggers?: ICloudFunctionTrigger[]
    triggerName?: string
    envId: string
}

export interface ILoginOptions {
    key?: boolean
    secretId?: string
    secretKey?: string
    // 修改浏览器登录打开的链接
    getAuthUrl?: (url: string) => string
}

export interface GatewayContext {
    // 环境 id
    envId: string
    // 整体配置
    config: ICloudBaseConfig
}

export interface ICreateFunctionGatewayOptions {
    envId: string
    path: string
    name: string
}

export interface IQueryGatewayOptions {
    envId: string
    domain?: string
    path?: string
    gatewayId?: string
    name?: string
}

export interface IDeleteGatewayOptions {
    envId: string
    path?: string
    gatewayId?: string
    name?: string
}

export interface IBindGatewayDomainOptions {
    envId: string
    domain: string
}

export interface IQueryGatewayDomainOptions {
    envId: string
    domain?: string
}

export interface IUnbindGatewayDomainOptions {
    envId: string
    domain: string
}
