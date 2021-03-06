import { CloudBaseError } from '../../error'
import { deleteGateway } from '../../gateway'
import { loadingFactory } from '../../utils'
import { ICommandContext } from '../command'

export async function deleteService(ctx: ICommandContext) {
    const { envId, options } = ctx

    const { servicePath, serviceId, name } = options
    if (!servicePath && !serviceId && !name) {
        throw new CloudBaseError('请指定需要删除的 HTTP Service 的信息，如 Path、Id 或云函数名称')
    }

    const loading = loadingFactory()
    loading.start('HTTP Service 删除中...')

    try {
        await deleteGateway({
            envId,
            name,
            path: servicePath,
            gatewayId: serviceId
        })
        loading.succeed('HTTP Service 删除成功！')
    } catch (e) {
        loading.stop()
        throw e
    }
}
