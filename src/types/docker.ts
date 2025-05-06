export interface NodeData {
  label: string;
  command: string;
  arguments: string;
  description: string;
  isAdvanced?: boolean;
}

export interface DockerCommand {
  id: string;
  type: string;
  label: string;
  description: string;
  defaultArguments?: string;
  examples?: string[];
  documentation?: string;
  isAdvanced?: boolean;
}

export const DockerCommands: DockerCommand[] = [
  {
    id: 'from',
    type: 'FROM',
    label: 'FROM',
    description: '设置基础镜像',
    defaultArguments: 'node:14-alpine',
    examples: ['FROM ubuntu:20.04', 'FROM node:14-alpine'],
    documentation: '指定构建镜像的基础镜像，必须是Dockerfile中的第一条指令',
  },
  {
    id: 'run',
    type: 'RUN',
    label: 'RUN',
    description: '执行命令',
    defaultArguments: 'apt-get update && apt-get install -y curl',
    examples: ['RUN apt-get update', 'RUN npm install'],
    documentation: '在当前镜像的基础上执行命令，通常用于安装软件包',
  },
  {
    id: 'copy',
    type: 'COPY',
    label: 'COPY',
    description: '复制文件',
    defaultArguments: '. /app',
    examples: ['COPY . /app', 'COPY package.json /app/'],
    documentation: '将文件从构建上下文复制到镜像中',
  },
  {
    id: 'add',
    type: 'ADD',
    label: 'ADD',
    description: '添加文件',
    defaultArguments: '. /app',
    examples: ['ADD . /app', 'ADD package.json /app/'],
    documentation: '类似COPY，但支持URL和自动解压tar文件',
  },
  {
    id: 'workdir',
    type: 'WORKDIR',
    label: 'WORKDIR',
    description: '设置工作目录',
    defaultArguments: '/app',
    examples: ['WORKDIR /app', 'WORKDIR /var/www/html'],
    documentation: '设置后续指令的工作目录',
  },
  {
    id: 'env',
    type: 'ENV',
    label: 'ENV',
    description: '设置环境变量',
    defaultArguments: 'NODE_ENV=production',
    examples: ['ENV NODE_ENV=production', 'ENV PORT=3000'],
    documentation: '设置环境变量，这些变量在构建过程和容器运行时都可用',
  },
  {
    id: 'expose',
    type: 'EXPOSE',
    label: 'EXPOSE',
    description: '暴露端口',
    defaultArguments: '3000',
    examples: ['EXPOSE 80', 'EXPOSE 3000'],
    documentation: '声明容器运行时监听的端口',
  },
  {
    id: 'cmd',
    type: 'CMD',
    label: 'CMD',
    description: '设置默认命令',
    defaultArguments: '["node", "server.js"]',
    examples: ['CMD ["node", "server.js"]', 'CMD ["npm", "start"]'],
    documentation: '容器启动时执行的默认命令，可被docker run命令行参数覆盖',
  },
  {
    id: 'entrypoint',
    type: 'ENTRYPOINT',
    label: 'ENTRYPOINT',
    description: '设置入口点',
    defaultArguments: '["node", "server.js"]',
    examples: [
      'ENTRYPOINT ["node", "server.js"]',
      'ENTRYPOINT ["npm", "start"]',
    ],
    documentation: '容器启动时执行的命令，不会被docker run命令行参数覆盖',
  },
  {
    id: 'volume',
    type: 'VOLUME',
    label: 'VOLUME',
    description: '创建挂载点',
    defaultArguments: '/data',
    examples: ['VOLUME /data', 'VOLUME ["/data", "/app/logs"]'],
    documentation: '创建挂载点，允许从本地主机或其他容器挂载外部卷',
  },
  {
    id: 'user',
    type: 'USER',
    label: 'USER',
    description: '设置用户',
    defaultArguments: 'node',
    examples: ['USER node', 'USER www-data'],
    documentation: '设置后续命令的执行用户和用户组',
  },
  {
    id: 'label',
    type: 'LABEL',
    label: 'LABEL',
    description: '添加元数据',
    defaultArguments: 'version="1.0" maintainer="name@example.com"',
    examples: ['LABEL version="1.0"', 'LABEL maintainer="name@example.com"'],
    documentation: '为镜像添加元数据，键值对形式',
  },
  {
    id: 'arg',
    type: 'ARG',
    label: 'ARG',
    description: '定义构建参数',
    defaultArguments: 'NODE_VERSION=14',
    examples: ['ARG NODE_VERSION=14', 'ARG PORT=3000'],
    documentation: '定义构建时的变量，可通过--build-arg传入',
  },
  {
    id: 'healthcheck',
    type: 'HEALTHCHECK',
    label: 'HEALTHCHECK',
    description: '健康检查',
    defaultArguments:
      '--interval=5m --timeout=3s CMD curl -f http://localhost/ || exit 1',
    examples: [
      'HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost/ || exit 1',
    ],
    documentation: '指定容器如何进行健康检查',
  },
  {
    id: 'multi_stage',
    type: 'FROM',
    label: 'FROM (多阶段)',
    description: '多阶段构建，优化镜像大小',
    defaultArguments: 'node:14-alpine AS build-stage',
    examples: [
      'FROM node:14-alpine AS build-stage',
      'FROM nginx:alpine AS production-stage',
    ],
    documentation: '创建多阶段构建的阶段，可以在后续阶段中引用前面阶段的文件',
    isAdvanced: true,
  },
  {
    id: 'copy_from',
    type: 'COPY',
    label: 'COPY --from',
    description: '从其他阶段复制文件',
    defaultArguments: '--from=build-stage /app/dist /usr/share/nginx/html',
    examples: ['COPY --from=build-stage /app/dist /usr/share/nginx/html'],
    documentation: '从多阶段构建的其他阶段复制文件到当前阶段',
    isAdvanced: true,
  },
  {
    id: 'shell',
    type: 'SHELL',
    label: 'SHELL',
    description: '设置默认shell',
    defaultArguments: '["powershell", "-command"]',
    examples: ['SHELL ["powershell", "-command"]', 'SHELL ["/bin/bash", "-c"]'],
    documentation: '设置RUN, CMD, ENTRYPOINT指令的默认shell',
    isAdvanced: true,
  },
  {
    id: 'stopsignal',
    type: 'STOPSIGNAL',
    label: 'STOPSIGNAL',
    description: '设置停止信号',
    defaultArguments: 'SIGTERM',
    examples: ['STOPSIGNAL SIGTERM', 'STOPSIGNAL 9'],
    documentation: '设置发送给容器的系统调用信号以退出',
    isAdvanced: true,
  },
  {
    id: 'onbuild',
    type: 'ONBUILD',
    label: 'ONBUILD',
    description: '触发指令',
    defaultArguments: 'RUN npm install',
    examples: ['ONBUILD RUN npm install', 'ONBUILD COPY . /app'],
    documentation: '当镜像被作为基础镜像时，在下游Dockerfile中执行的指令',
    isAdvanced: true,
  },
  {
    id: 'healthcheck_disable',
    type: 'HEALTHCHECK',
    label: 'HEALTHCHECK NONE',
    description: '禁用健康检查',
    defaultArguments: 'NONE',
    examples: ['HEALTHCHECK NONE'],
    documentation: '禁用从基础镜像继承的健康检查',
    isAdvanced: true,
  },
  {
    id: 'volume_from',
    type: 'VOLUME',
    label: 'VOLUME (多容器)',
    description: '配置共享卷',
    defaultArguments: '["/shared-data"]',
    examples: ['VOLUME ["/shared-data", "/config"]'],
    documentation: '创建可在多个容器间共享的持久化卷',
    isAdvanced: true,
  },
  {
    id: 'copy_chown',
    type: 'COPY',
    label: 'COPY --chown',
    description: '复制并设置权限',
    defaultArguments: '--chown=node:node . /app',
    examples: ['COPY --chown=node:node . /app'],
    documentation: '复制文件到容器中并设置文件的用户和组',
    isAdvanced: true,
  },
];
