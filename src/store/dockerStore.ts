import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
} from 'reactflow';
import { create } from 'zustand';

import { NodeData } from '../types/docker';

interface DockerState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  fileName: string;
  setFileName: (fileName: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<NodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  getDockerfileContent: () => string;
  resetFlow: () => void;
}

const initialNodes: Node<NodeData>[] = [];
const initialEdges: Edge[] = [];

export const useDockerStore = create<DockerState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  fileName: 'Dockerfile',

  setFileName: (fileName: string) => {
    set({ fileName });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          animated: true,
        },
        get().edges,
      ),
    });
  },

  addNode: (node: Node<NodeData>) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNodeData: (nodeId: string, data: Partial<NodeData>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      }),
    });
  },

  getDockerfileContent: () => {
    // 使用拓扑排序获取正确的指令顺序
    const nodeMap = new Map<string, Node<NodeData>>();
    const inDegree = new Map<string, number>();
    const queue: string[] = [];
    const result: Node<NodeData>[] = [];

    // 初始化
    get().nodes.forEach((node) => {
      nodeMap.set(node.id, node);
      inDegree.set(node.id, 0);
    });

    // 计算入度
    get().edges.forEach((edge) => {
      if (edge.source && edge.target) {
        const target = edge.target;
        inDegree.set(target, (inDegree.get(target) || 0) + 1);
      }
    });

    // 将入度为0的节点加入队列
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    // BFS拓扑排序
    while (queue.length) {
      const currentId = queue.shift()!;
      const currentNode = nodeMap.get(currentId);

      if (currentNode) {
        result.push(currentNode);

        // 更新相邻节点的入度
        get().edges.forEach((edge) => {
          if (edge.source === currentId) {
            const targetId = edge.target;
            const newDegree = (inDegree.get(targetId) || 0) - 1;
            inDegree.set(targetId, newDegree);

            if (newDegree === 0) {
              queue.push(targetId);
            }
          }
        });
      }
    }

    // 如果无法形成有效的拓扑排序（存在循环依赖），则按照创建顺序排序
    if (result.length !== get().nodes.length) {
      result.length = 0;
      result.push(...get().nodes);
    }

    // 生成Dockerfile内容
    return result
      .map((node) => {
        if (node.data.command && node.data.arguments) {
          return `${node.data.command} ${node.data.arguments}`;
        }
        return '';
      })
      .filter((line) => line !== '')
      .join('\n');
  },

  resetFlow: () => {
    set({
      nodes: [],
      edges: [],
      fileName: 'Dockerfile',
    });
  },
}));
