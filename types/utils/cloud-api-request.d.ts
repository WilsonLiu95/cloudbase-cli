export declare class CloudApiService {
    service: string;
    version: string;
    url: string;
    action: string;
    method: 'POST' | 'GET';
    secretId: string;
    secretKey: string;
    token: string;
    timeout: number;
    data: Record<string, any>;
    payload: Record<string, any>;
    baseParams: Record<string, any>;
    constructor(service: string, version: string, baseParams?: Record<string, any>);
    getUrl(): any;
    request(action: string, data?: Record<string, any>, method?: 'POST' | 'GET'): Promise<any>;
    requestWithSign(): Promise<any>;
    getRequestSign(timestamp: number): string;
}