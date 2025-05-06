import { Edge, Node } from 'reactflow';

import { NodeData } from '../types/docker';
import { DockerCommands } from '../types/docker';

// 定义解析结果类型
export interface ParseResult {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

/**
 * 解析Dockerfile文本，转换为节点和边
 * @param dockerfile Dockerfile文本内容
 * @returns 解析结果，包含节点和边
 */
export function parseDockerfile(dockerfile: string): ParseResult {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  // 分割Dockerfile内容为行
  const lines = dockerfile
    .split('\n')
    .filter((line) => line && line.trim() && !line.trim().startsWith('#'));

  // 定义初始节点位置
  const startX = 250;
  const startY = 100;
  const nodeHeight = 150;
  const nodeMargin = 50;

  // 解析每一行并创建节点
  let prevNodeId: string | null = null;

  // 合并多行命令
  const processedLines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < lines.length; i++) {
    const lineContent = lines[i]?.trim() || '';

    // 处理行尾的续行符 \
    if (lineContent && lineContent.endsWith('\\')) {
      currentLine += lineContent.slice(0, -1) + ' ';
      continue;
    } else if (currentLine && lineContent) {
      const completeLine = currentLine + lineContent;
      currentLine = '';
      if (completeLine) {
        processedLines.push(completeLine);
      }
    } else if (lineContent) {
      processedLines.push(lineContent);
    }
  }

  // 如果最后一行有未完成的命令
  if (currentLine) {
    processedLines.push(currentLine);
  }

  // 解析每一条处理后的命令
  processedLines.forEach((line, index) => {
    // 寻找第一个空格，区分指令和参数
    const firstSpaceIndex = line.indexOf(' ');
    if (firstSpaceIndex === -1) return;

    const instruction = line.substring(0, firstSpaceIndex).toUpperCase();
    let args = line.substring(firstSpaceIndex + 1).trim();

    // 检查是否是多阶段构建的FROM指令
    let isMultiStage = false;
    if (instruction === 'FROM' && args.includes(' AS ')) {
      isMultiStage = true;
    }

    // 查找对应的Docker命令
    const commandType = findDockerCommandType(instruction);
    if (!commandType) return;

    // 创建节点ID
    const nodeId = `${instruction.toLowerCase()}_${Date.now()}_${index}`;

    // 创建新节点
    let command;
    if (isMultiStage) {
      command = DockerCommands.find((cmd) => cmd.id === 'multi_stage');
    } else {
      command = DockerCommands.find((cmd) => cmd.type === commandType);
    }

    if (!command) return;

    const newNode: Node<NodeData> = {
      id: nodeId,
      type: 'dockerNode',
      position: {
        x: startX,
        y: startY + index * (nodeHeight + nodeMargin),
      },
      data: {
        label: command.label,
        command: command.type,
        arguments: args,
        description: command.description,
        isAdvanced: command.isAdvanced,
      },
    };

    nodes.push(newNode);

    // 创建与前一个节点的连接
    if (prevNodeId) {
      const edge: Edge = {
        id: `e${prevNodeId}-${nodeId}`,
        source: prevNodeId,
        target: nodeId,
        animated: true,
      };

      edges.push(edge);
    }

    prevNodeId = nodeId;
  });

  return { nodes, edges };
}

/**
 * 查找Docker命令类型
 * @param instruction Dockerfile指令
 * @returns 对应的Docker命令类型
 */
function findDockerCommandType(instruction: string): string | null {
  const commandMap: Record<string, string> = {
    FROM: 'FROM',
    RUN: 'RUN',
    CMD: 'CMD',
    LABEL: 'LABEL',
    MAINTAINER: 'LABEL', // 将旧的MAINTAINER映射为LABEL
    EXPOSE: 'EXPOSE',
    ENV: 'ENV',
    ADD: 'ADD',
    COPY: 'COPY',
    ENTRYPOINT: 'ENTRYPOINT',
    VOLUME: 'VOLUME',
    USER: 'USER',
    WORKDIR: 'WORKDIR',
    ARG: 'ARG',
    ONBUILD: 'ONBUILD',
    STOPSIGNAL: 'STOPSIGNAL',
    HEALTHCHECK: 'HEALTHCHECK',
    SHELL: 'SHELL',
  };

  return commandMap[instruction] || null;
}
