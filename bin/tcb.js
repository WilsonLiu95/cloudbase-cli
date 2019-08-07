#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// 检查更新
const notifier = updateNotifier({
    pkg,
    // 检查更新间隔 1h
    updateCheckInterval: 1000 * 60 * 60
})
notifier.notify()

// 注册命令
require('../lib')

// 处理无效命令
program.action(cmd => {
    console.log(chalk.bold.red('Error: ') + `${cmd} 不是有效的命令`)
})

// 当没有输入任何命令时，显示帮助信息
if (process.argv.length < 3) {
    program.help()
}

program.parse(process.argv)

function errorHandler(err) {
    const stackIngoreErrors = ['TencentCloudSDKHttpException', 'TcbError']
    // 忽略自定义错误的错误栈
    if (err.stack && !stackIngoreErrors.includes(err.name)) {
        console.log(err.stack)
    }
    // 3 空格，兼容中文字符编码长度问题
    console.log(logSymbols.error + ' ' + chalk.red(err.message))
}

process.on('uncaughtException', errorHandler)
process.on('unhandledRejection', errorHandler)
