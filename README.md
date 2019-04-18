# Cloudbase命令行工具

## 安装

```bash
npm install -g @cloudbase/cli
```

## 使用方法
```bash
tcb -h
```
```
Usage: tcb [options] [command]

Options:
  -V, --version            output the version number
  -h, --help               output usage information

Commands:
  deploy [options] [name]  执行完整的发布
  login                    登录腾讯云账号
  logout                   登出腾讯云账号
  build [name]             构建
  upload [name]            上传
  reload [name]            热重载
  start [name]             启动
  show <name>              查看状态
```

### 构建

```
tcb build
```

### 发布
```
tcb deploy
```

## tcb.json

cli的配置文件

示例：

```json
{
    "common": {
        "server": {
            "host": "1.2.3.4",
            "username": "root",
            "port": 22,
            "password": "xxxxxxxxxx"
        }
    },
    "deploys": [
        {
            "name": "app",
            "type": "node",
            "path": "./server"
        }
    ]
}
```

### common

包含服务器等通用信息

```js
{
    "common": {
        "server": {
            "host": "1.2.3.4",
            "username": "root",
            "port": 22,
            "password": "xxxxxxxxxx"
        }
    }
    // ...
}
```

#### common.server

云主机信息

##### common.server.host

云主机 host

##### common.server.username

云主机用户名，默认为 `root`

##### common.server.port

云主机ssh端口号，默认为 `22`

##### common.server.password

云主机密码

------

### deploys

数组，包含项目的发布配置

示例：

```js
{
    "deploys": [
        // 云函数示例
        {
            "name": "add",
            "type": "function",
            "path": "./",
            "envId": "test-e48fe1"
        },

        // Node服务示例
        {
            "name": "app",
            "type": "node",
            "path": "./server"
        },

        // Vemo项目示例
        {
            name: 'my-vemo',
            type: 'node',
            path: './vemo-server'
        }
    ]
}
```