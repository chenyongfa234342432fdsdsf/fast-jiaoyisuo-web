# ytt

- ytt ： Yapi to Typescript
- 此插件以命令 + 配置文件的形式，将Yapi上面的API模型，自动抓取到本地，输出为TS type 文件。
- [nbit-ytt](https://gitlab.admin-devops.com/FE/toolbox/tree/master/packages/ytt) 是原 [ytt](https://fjc0k.github.io/yapi-to-typescript/handbook/) 基于业务需求的定制版
    

## 使用步骤
- 安装开发环境依赖

```bash
# pnpm
p i -D @nbit-ytt

# npm 
npm install -D @nbit-ytt
```

- ytt 配置文件
  - [配置官方文档](https://fjc0k.github.io/yapi-to-typescript/handbook/)

- `package.json` 配置
```json
  "scripts": {
    // 配置文件路径， 比如 scripts/ytt/ytt.config.ts
    "ytt": "nbit-ytt --config scripts/ytt/ytt.config.ts"
  }
```
- `p ytt` 自动生成Api Typescript
