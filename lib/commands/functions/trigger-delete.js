"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const error_1 = require("../../error");
const function_1 = require("../../function");
async function triggerDelete(ctx, triggerName) {
    const { name, envId, functions } = ctx;
    let isBtachDeleteTriggers;
    let isBatchDeleteFunctionTriggers = false;
    if (!name) {
        const answer = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '无云函数名称，是否需要删除配置文件中的【全部云函数】的全部触发器？',
            default: false
        });
        if (answer.isBatch) {
            const { reConfirm } = await inquirer_1.default.prompt({
                type: 'confirm',
                name: 'reConfirm',
                message: '确定要删除配置文件中的【全部云函数】的全部触发器？',
                default: false
            });
            isBtachDeleteTriggers = reConfirm;
        }
        if (!isBtachDeleteTriggers) {
            throw new error_1.CloudBaseError('请指定云函数名称以及触发器名称！');
        }
    }
    if (isBtachDeleteTriggers) {
        return await function_1.batchDeleteTriggers({
            envId,
            functions,
        });
    }
    if (!triggerName && name) {
        const { isBatch } = await inquirer_1.default.prompt({
            type: 'confirm',
            name: 'isBatch',
            message: '没有指定触发器名称，是否需要此云函数的全部触发器？',
            default: false
        });
        isBatchDeleteFunctionTriggers = isBatch;
        if (!isBatchDeleteFunctionTriggers) {
            throw new error_1.CloudBaseError('请指定云函数名称以及触发器名称！');
        }
    }
    if (isBatchDeleteFunctionTriggers) {
        const func = functions.find(item => item.name === name);
        return await function_1.batchDeleteTriggers({
            envId,
            functions: [func],
        });
    }
    if (!triggerName) {
        throw new error_1.CloudBaseError('触发器名称不能为空');
    }
    function_1.deleteFunctionTrigger({
        envId,
        functionName: name,
        triggerName,
    });
}
exports.triggerDelete = triggerDelete;