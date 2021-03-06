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
const utils_1 = require("../utils");
const constant_1 = require("../constant");
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        const credentail = yield utils_1.getCredentialData();
        try {
            if (credentail.refreshToken) {
                yield utils_1.refreshTmpToken(Object.assign(Object.assign({}, credentail), { isLogout: true }));
            }
            yield utils_1.authStore.delete(constant_1.ConfigItems.credentail);
            yield utils_1.authStore.delete(constant_1.ConfigItems.ssh);
        }
        catch (e) {
            yield utils_1.authStore.delete(constant_1.ConfigItems.credentail);
            yield utils_1.authStore.delete(constant_1.ConfigItems.ssh);
        }
    });
}
exports.logout = logout;
