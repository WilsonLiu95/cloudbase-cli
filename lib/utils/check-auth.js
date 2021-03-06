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
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const store_1 = require("./store");
const constant_1 = require("../constant");
function checkAndGetCredential() {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield auth_1.getCredentialData();
        if (!credential) {
            return null;
        }
        if (credential.secretId && credential.secretKey) {
            const { secretId, secretKey } = credential;
            yield auth_1.checkAuth({
                tmpSecretId: secretId,
                tmpSecretKey: secretKey
            });
            return {
                secretId,
                secretKey
            };
        }
        if (credential.refreshToken) {
            if (Date.now() < Number(credential.tmpExpired)) {
                const { tmpSecretId, tmpSecretKey, tmpToken } = credential;
                yield auth_1.checkAuth(credential);
                return {
                    secretId: tmpSecretId,
                    secretKey: tmpSecretKey,
                    token: tmpToken
                };
            }
            else if (Date.now() < Number(credential.expired)) {
                let refreshCredential = null;
                try {
                    refreshCredential = yield auth_1.refreshTmpToken(credential);
                }
                catch (e) {
                    if (e.code === 'AUTH_FAIL') {
                        return null;
                    }
                    else {
                        throw e;
                    }
                }
                yield store_1.authStore.set(constant_1.ConfigItems.credentail, refreshCredential || {});
                const { tmpSecretId, tmpSecretKey, tmpToken } = refreshCredential;
                yield auth_1.checkAuth(refreshCredential);
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
exports.checkAndGetCredential = checkAndGetCredential;
