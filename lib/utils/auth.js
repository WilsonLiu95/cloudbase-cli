"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const query_string_1 = __importDefault(require("query-string"));
const open_1 = __importDefault(require("open"));
const tools_1 = require("./tools");
const store_1 = require("./store");
const http_request_1 = require("./http-request");
const output_1 = require("./output");
const cloud_api_request_1 = require("./cloud-api-request");
const platform_1 = require("./platform");
const logger_1 = __importDefault(require("../logger"));
const constant_1 = require("../constant");
const error_1 = require("../error");
const logger = new logger_1.default('Auth');
const tcbService = new cloud_api_request_1.CloudApiService('tcb');
const CliAuthBaseUrl = 'https://console.cloud.tencent.com/tcb/auth';
const refreshTokenUrl = 'https://iaas.cloud.tencent.com/tcb_refresh';
function refreshTmpToken(metaData) {
    return __awaiter(this, void 0, void 0, function* () {
        const mac = yield platform_1.getMacAddress();
        const hash = tools_1.md5(mac);
        metaData.hash = hash;
        const res = yield http_request_1.fetch(refreshTokenUrl, {
            method: 'POST',
            body: JSON.stringify(metaData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.code !== 0) {
            throw new error_1.CloudBaseError(res.message, {
                code: res.code
            });
        }
        const { data: credential } = res;
        return credential;
    });
}
exports.refreshTmpToken = refreshTmpToken;
function getCredentialData() {
    return __awaiter(this, void 0, void 0, function* () {
        return store_1.authStore.get(constant_1.ConfigItems.credentail);
    });
}
exports.getCredentialData = getCredentialData;
function getCredentialWithoutCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield getCredentialData();
        if (!credential) {
            return null;
        }
        if (credential.secretId && credential.secretKey) {
            const { secretId, secretKey } = credential;
            return {
                secretId,
                secretKey
            };
        }
        if (credential.refreshToken) {
            if (Date.now() < Number(credential.tmpExpired)) {
                const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
                return {
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken
                };
            }
            else if (Date.now() < Number(credential.expired)) {
                const refreshCredential = yield refreshTmpToken(credential);
                yield store_1.authStore.set(constant_1.ConfigItems.credentail, refreshCredential);
                const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential;
                return {
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken
                };
            }
        }
        return null;
    });
}
exports.getCredentialWithoutCheck = getCredentialWithoutCheck;
function createLocalServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = http_1.default.createServer();
        const port = yield platform_1.getPort();
        return new Promise((resolve, reject) => {
            server.listen(port, () => {
                resolve({
                    port,
                    server
                });
            });
        });
    });
}
function respondWithFile(req, res, statusCode, filename) {
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(path_1.default.join(__dirname, '../../templates', filename), function (err, response) {
            if (err) {
                return reject(err);
            }
            res.writeHead(statusCode, {
                'Content-Length': response.length,
                'Content-Type': 'text/html'
            });
            res.end(response);
            req.socket.destroy();
            return resolve();
        });
    });
}
function checkAuth(credential) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
        tcbService.setCredential(tmpSecretId, tmpSecretKey, tmpToken);
        return tcbService.request('DescribeEnvs');
    });
}
exports.checkAuth = checkAuth;
function getAuthTokenFromWeb(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { getAuthUrl } = options;
        const loading = output_1.loadingFactory();
        loading.start('正在打开腾讯云获取授权');
        try {
            const { server, port } = yield createLocalServer();
            const mac = yield platform_1.getMacAddress();
            const os = platform_1.getOSInfo();
            const hash = tools_1.md5(mac);
            if (!mac) {
                throw new error_1.CloudBaseError('获取 Mac 地址失败，无法登录！');
            }
            let cliAuthUrl = `${CliAuthBaseUrl}?port=${port}&hash=${hash}&mac=${mac}&os=${os}`;
            if (getAuthUrl) {
                try {
                    cliAuthUrl = getAuthUrl(`${CliAuthBaseUrl}?port=${port}&hash=${hash}&mac=${mac}&os=${os}`);
                }
                catch (error) {
                }
            }
            yield open_1.default(cliAuthUrl);
            loading.succeed('已打开云开发 CLI 授权页面，请在云开发 CLI 授权页面同意授权');
            return new Promise(resolve => {
                server.on('request', (req, res) => {
                    var _a, _b;
                    const { url } = req;
                    const { query } = query_string_1.default.parseUrl(url);
                    if ((_a = query) === null || _a === void 0 ? void 0 : _a.html) {
                        return checkAuth(query)
                            .then(() => {
                            return respondWithFile(req, res, 200, 'html/loginSuccess.html');
                        })
                            .then(() => {
                            server.close();
                            resolve(query);
                        })
                            .catch(e => {
                            server.close();
                            return respondWithFile(req, res, 502, 'html/loginFail.html');
                        });
                    }
                    res.writeHead(200, {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': '*',
                        'Access-Control-Allow-Headers': '*',
                        'Content-Type': 'text/plain',
                        Connection: 'close'
                    });
                    res.end();
                    if ((_b = query) === null || _b === void 0 ? void 0 : _b.tmpToken) {
                        server.close();
                    }
                    resolve(query);
                });
            });
        }
        catch (err) {
            logger.error(err.message);
            loading.fail('获取授权失败！');
            throw err;
        }
    });
}
exports.getAuthTokenFromWeb = getAuthTokenFromWeb;
