import { Credential, AuthSecret, ILoginOptions } from '../types';
export declare function refreshTmpToken(metaData: Credential & {
    isLogout?: boolean;
}): Promise<Credential>;
export declare function getCredentialData(): Promise<Credential>;
export declare function getCredentialWithoutCheck(): Promise<AuthSecret>;
export declare function checkAuth(credential: Credential): Promise<any>;
export declare function getAuthTokenFromWeb(options: ILoginOptions): Promise<Credential>;
