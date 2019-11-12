import fs from 'fs'
import path from 'path'
import unzipper from 'unzipper'
import { CloudApiService, fetchStream, delSync, checkPathExist } from '../utils'

interface IFunctionCodeOptions {
    envId: string
    destPath: string
    functionName: string
    codeSecret?: string
    unzip?: boolean
}

const scfService = new CloudApiService('scf', '2018-04-16')

// 下载函数代码
export async function downloadFunctionCode(options: IFunctionCodeOptions) {
    const { destPath, envId, functionName, codeSecret, unzip = false } = options

    // 检验路径是否存在
    checkPathExist(destPath, true)

    return new Promise(async resolve => {
        // 获取下载链接
        const { Url } = await scfService.request('GetFunctionAddress', {
            FunctionName: functionName,
            Namespace: envId,
            CodeSecret: codeSecret
        })

        // 下载文件
        const res = await fetchStream(Url)
        const zipPath = path.join(destPath, `${functionName}.zip`)
        const dest = fs.createWriteStream(zipPath)
        res.body.pipe(dest)

        // 可选不解压 ZIP 文件
        if (!unzip) {
            resolve()
            return
        }

        // 解压文件
        res.body.on('end', () => {
            const unzipStream = unzipper.Extract({
                path: destPath
            })
            fs.createReadStream(zipPath).pipe(unzipStream)
            unzipStream.on('close', () => {
                // 删除 ZIP 文件
                delSync([zipPath])
                resolve()
            })
        })
    })
}