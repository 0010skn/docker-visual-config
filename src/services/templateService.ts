import { Edge, Node } from 'reactflow';

import { NodeData } from '../types/docker';
import { DockerCommands } from '../types/docker';

export interface DockerTemplate {
  id: string;
  name: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

// 找到命令类型对应的命令数据
const findCommandByType = (type: string) => {
  return DockerCommands.find((cmd) => cmd.type === type);
};

// 创建新的Docker节点
const createDockerNode = (
  id: string,
  type: string,
  position: { x: number; y: number },
): Node<NodeData> => {
  const command = findCommandByType(type);
  if (!command) {
    throw new Error(`未找到类型为 ${type} 的命令`);
  }

  return {
    id,
    type: 'dockerNode',
    position,
    data: {
      label: command.label,
      command: command.type,
      arguments: command.defaultArguments || '',
      description: command.description,
    },
  };
};

// Node.js应用模板
const createNodeTemplate = (): DockerTemplate => {
  const nodes: Node<NodeData>[] = [
    createDockerNode('1', 'FROM', { x: 250, y: 50 }),
    createDockerNode('2', 'WORKDIR', { x: 250, y: 150 }),
    createDockerNode('3', 'COPY', { x: 250, y: 250 }),
    createDockerNode('4', 'RUN', { x: 250, y: 350 }),
    createDockerNode('5', 'COPY', { x: 250, y: 450 }),
    createDockerNode('6', 'EXPOSE', { x: 250, y: 550 }),
    createDockerNode('7', 'CMD', { x: 250, y: 650 }),
  ];

  // 更新节点数据
  if (nodes[0]?.data) nodes[0].data.arguments = 'node:14-alpine';
  if (nodes[1]?.data) nodes[1].data.arguments = '/app';
  if (nodes[2]?.data) nodes[2].data.arguments = 'package*.json ./';
  if (nodes[3]?.data) nodes[3].data.arguments = 'npm install';
  if (nodes[4]?.data) nodes[4].data.arguments = '. .';
  if (nodes[5]?.data) nodes[5].data.arguments = '3000';
  if (nodes[6]?.data) nodes[6].data.arguments = '["node", "server.js"]';

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
    { id: 'e5-6', source: '5', target: '6', animated: true },
    { id: 'e6-7', source: '6', target: '7', animated: true },
  ];

  return { id: 'node', name: 'Node.js应用', nodes, edges };
};

// Python应用模板
const createPythonTemplate = (): DockerTemplate => {
  const nodes: Node<NodeData>[] = [
    createDockerNode('1', 'FROM', { x: 250, y: 50 }),
    createDockerNode('2', 'WORKDIR', { x: 250, y: 150 }),
    createDockerNode('3', 'COPY', { x: 250, y: 250 }),
    createDockerNode('4', 'RUN', { x: 250, y: 350 }),
    createDockerNode('5', 'COPY', { x: 250, y: 450 }),
    createDockerNode('6', 'EXPOSE', { x: 250, y: 550 }),
    createDockerNode('7', 'CMD', { x: 250, y: 650 }),
  ];

  // 更新节点数据
  if (nodes[0]?.data) nodes[0].data.arguments = 'python:3.9-slim';
  if (nodes[1]?.data) nodes[1].data.arguments = '/app';
  if (nodes[2]?.data) nodes[2].data.arguments = 'requirements.txt .';
  if (nodes[3]?.data)
    nodes[3].data.arguments = 'pip install --no-cache-dir -r requirements.txt';
  if (nodes[4]?.data) nodes[4].data.arguments = '. .';
  if (nodes[5]?.data) nodes[5].data.arguments = '5000';
  if (nodes[6]?.data) nodes[6].data.arguments = '["python", "app.py"]';

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
    { id: 'e5-6', source: '5', target: '6', animated: true },
    { id: 'e6-7', source: '6', target: '7', animated: true },
  ];

  return { id: 'python', name: 'Python应用', nodes, edges };
};

// Go应用模板
const createGolangTemplate = (): DockerTemplate => {
  const nodes: Node<NodeData>[] = [
    createDockerNode('1', 'FROM', { x: 250, y: 50 }),
    createDockerNode('2', 'WORKDIR', { x: 250, y: 150 }),
    createDockerNode('3', 'COPY', { x: 250, y: 250 }),
    createDockerNode('4', 'RUN', { x: 250, y: 350 }),
    createDockerNode('5', 'FROM', { x: 250, y: 450 }),
    createDockerNode('6', 'WORKDIR', { x: 250, y: 550 }),
    createDockerNode('7', 'COPY', { x: 250, y: 650 }),
    createDockerNode('8', 'EXPOSE', { x: 250, y: 750 }),
    createDockerNode('9', 'CMD', { x: 250, y: 850 }),
  ];

  // 更新节点数据
  if (nodes[0]?.data) nodes[0].data.arguments = 'golang:1.16-alpine AS build';
  if (nodes[1]?.data) nodes[1].data.arguments = '/app';
  if (nodes[2]?.data) nodes[2].data.arguments = '. .';
  if (nodes[3]?.data) nodes[3].data.arguments = 'go build -o main .';
  if (nodes[4]?.data) nodes[4].data.arguments = 'alpine:latest';
  if (nodes[5]?.data) nodes[5].data.arguments = '/app';
  if (nodes[6]?.data) nodes[6].data.arguments = '--from=build /app/main .';
  if (nodes[7]?.data) nodes[7].data.arguments = '8080';
  if (nodes[8]?.data) nodes[8].data.arguments = '["./main"]';

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
    { id: 'e5-6', source: '5', target: '6', animated: true },
    { id: 'e6-7', source: '6', target: '7', animated: true },
    { id: 'e7-8', source: '7', target: '8', animated: true },
    { id: 'e8-9', source: '8', target: '9', animated: true },
  ];

  return { id: 'golang', name: 'Go应用', nodes, edges };
};

// Java应用模板
const createJavaTemplate = (): DockerTemplate => {
  const nodes: Node<NodeData>[] = [
    createDockerNode('1', 'FROM', { x: 250, y: 50 }),
    createDockerNode('2', 'WORKDIR', { x: 250, y: 150 }),
    createDockerNode('3', 'COPY', { x: 250, y: 250 }),
    createDockerNode('4', 'RUN', { x: 250, y: 350 }),
    createDockerNode('5', 'EXPOSE', { x: 250, y: 450 }),
    createDockerNode('6', 'ENTRYPOINT', { x: 250, y: 550 }),
  ];

  // 更新节点数据
  if (nodes[0]?.data) nodes[0].data.arguments = 'openjdk:11-jre-slim';
  if (nodes[1]?.data) nodes[1].data.arguments = '/app';
  if (nodes[2]?.data) nodes[2].data.arguments = 'target/*.jar app.jar';
  if (nodes[3]?.data) nodes[3].data.arguments = "sh -c 'touch /app/app.jar'";
  if (nodes[4]?.data) nodes[4].data.arguments = '8080';
  if (nodes[5]?.data) nodes[5].data.arguments = '["java", "-jar", "app.jar"]';

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
    { id: 'e5-6', source: '5', target: '6', animated: true },
  ];

  return { id: 'java', name: 'Java Spring Boot', nodes, edges };
};

// Nginx静态网站模板
const createNginxTemplate = (): DockerTemplate => {
  const nodes: Node<NodeData>[] = [
    createDockerNode('1', 'FROM', { x: 250, y: 50 }),
    createDockerNode('2', 'COPY', { x: 250, y: 150 }),
    createDockerNode('3', 'EXPOSE', { x: 250, y: 250 }),
    createDockerNode('4', 'CMD', { x: 250, y: 350 }),
  ];

  // 更新节点数据
  if (nodes[0]?.data) nodes[0].data.arguments = 'nginx:alpine';
  if (nodes[1]?.data) nodes[1].data.arguments = './dist /usr/share/nginx/html';
  if (nodes[2]?.data) nodes[2].data.arguments = '80';
  if (nodes[3]?.data)
    nodes[3].data.arguments = '["nginx", "-g", "daemon off;"]';

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
  ];

  return { id: 'nginx', name: 'Nginx静态网站', nodes, edges };
};

// 多阶段构建模板
const createMultiStageTemplate = (): DockerTemplate => {
  const nodes: Node<NodeData>[] = [
    createDockerNode('1', 'FROM', { x: 250, y: 50 }),
    createDockerNode('2', 'WORKDIR', { x: 250, y: 150 }),
    createDockerNode('3', 'COPY', { x: 250, y: 250 }),
    createDockerNode('4', 'RUN', { x: 250, y: 350 }),
    createDockerNode('5', 'COPY', { x: 250, y: 450 }),
    createDockerNode('6', 'RUN', { x: 250, y: 550 }),
    createDockerNode('7', 'FROM', { x: 250, y: 650 }),
    createDockerNode('8', 'WORKDIR', { x: 250, y: 750 }),
    createDockerNode('9', 'COPY', { x: 250, y: 850 }),
    createDockerNode('10', 'EXPOSE', { x: 250, y: 950 }),
    createDockerNode('11', 'CMD', { x: 250, y: 1050 }),
  ];

  // 更新节点数据
  if (nodes[0]?.data) nodes[0].data.arguments = 'node:14-alpine AS build';
  if (nodes[1]?.data) nodes[1].data.arguments = '/app';
  if (nodes[2]?.data) nodes[2].data.arguments = 'package*.json ./';
  if (nodes[3]?.data) nodes[3].data.arguments = 'npm install';
  if (nodes[4]?.data) nodes[4].data.arguments = '. .';
  if (nodes[5]?.data) nodes[5].data.arguments = 'npm run build';
  if (nodes[6]?.data) nodes[6].data.arguments = 'nginx:alpine';
  if (nodes[7]?.data) nodes[7].data.arguments = '/usr/share/nginx/html';
  if (nodes[8]?.data) nodes[8].data.arguments = '--from=build /app/build .';
  if (nodes[9]?.data) nodes[9].data.arguments = '80';
  if (nodes[10]?.data)
    nodes[10].data.arguments = '["nginx", "-g", "daemon off;"]';

  const edges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
    { id: 'e5-6', source: '5', target: '6', animated: true },
    { id: 'e6-7', source: '6', target: '7', animated: true },
    { id: 'e7-8', source: '7', target: '8', animated: true },
    { id: 'e8-9', source: '8', target: '9', animated: true },
    { id: 'e9-10', source: '9', target: '10', animated: true },
    { id: 'e10-11', source: '10', target: '11', animated: true },
  ];

  return { id: 'multi-stage', name: '多阶段构建示例', nodes, edges };
};

// 加载模板
export const loadTemplate = (templateId: string): DockerTemplate => {
  switch (templateId) {
    case 'node':
      return createNodeTemplate();
    case 'python':
      return createPythonTemplate();
    case 'golang':
      return createGolangTemplate();
    case 'java':
      return createJavaTemplate();
    case 'nginx':
      return createNginxTemplate();
    case 'multi-stage':
      return createMultiStageTemplate();
    default:
      throw new Error(`未知的模板ID: ${templateId}`);
  }
};
