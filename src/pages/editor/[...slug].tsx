import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Controls,
  Node,
  NodeTypes,
  OnConnectStart,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
} from 'reactflow';

import 'reactflow/dist/style.css';

import CommandsPanel from '../../components/CommandsPanel';
import DockerNode from '../../components/DockerNode';
import ExportPanel from '../../components/ExportPanel';
import ValidatorPanel from '../../components/ValidatorPanel';
import { loadTemplate } from '../../services/templateService';
import { useDockerStore } from '../../store/dockerStore';
import { DockerCommands } from '../../types/docker';
import { NodeData } from '../../types/docker';

const nodeTypes: NodeTypes = {
  dockerNode: DockerNode,
};

interface EditorProps {
  templateId?: string;
}

const nodeWidth = 250;
const nodeHeight = 150;
const nodeMargin = 50;

const FlowEditor: React.FC<EditorProps> = ({ templateId }) => {
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'validator'>('export');

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    resetFlow,
  } = useDockerStore();

  // 初始化编辑器，如果有模板ID则加载模板
  useEffect(() => {
    if (templateId) {
      try {
        const template = loadTemplate(templateId);
        resetFlow();

        // 设置模板中的节点和边
        template.nodes.forEach((node) => {
          addNode(node);
        });

        // 通过直接修改状态来添加边，因为我们需要一次性添加所有边
        useDockerStore.setState({
          edges: template.edges,
        });
      } catch (error) {
        console.error('加载模板失败:', error);
      }
    }
  }, [templateId, addNode, resetFlow]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // 检查是否有效的类型
      if (!type || !DockerCommands.find((cmd) => cmd.type === type)) {
        return;
      }

      const command = DockerCommands.find((cmd) => cmd.type === type);
      if (!command) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // 创建新节点
      const newNode: Node<NodeData> = {
        id: `${type.toLowerCase()}_${Date.now()}`,
        type: 'dockerNode',
        position,
        data: {
          label: command.label,
          command: command.type,
          arguments: command.defaultArguments || '',
          description: command.description,
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode],
  );

  const handleAddNode = useCallback(
    (type: string) => {
      const command = DockerCommands.find((cmd) => cmd.type === type);
      if (!command || !reactFlowInstance) return;

      // 计算新节点位置
      let newPosition = { x: 250, y: 100 };

      // 如果已有节点，则在最后一个节点下方添加新节点
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          newPosition = {
            x: lastNode.position.x,
            y: lastNode.position.y + nodeHeight + nodeMargin,
          };
        }
      }

      // 创建新节点
      const newNode: Node<NodeData> = {
        id: `${type.toLowerCase()}_${Date.now()}`,
        type: 'dockerNode',
        position: newPosition,
        data: {
          label: command.label,
          command: command.type,
          arguments: command.defaultArguments || '',
          description: command.description,
        },
      };

      addNode(newNode);

      // 如果有上一个节点，自动连接
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        if (lastNode) {
          const newEdge: Connection = {
            source: lastNode.id,
            target: newNode.id,
            sourceHandle: null,
            targetHandle: null,
          };
          onConnect(newEdge);
        }
      }
    },
    [nodes, addNode, onConnect, reactFlowInstance],
  );

  // 监听连接开始
  const onConnectStart: OnConnectStart = useCallback((event, params) => {
    if (params.nodeId) {
      connectingNodeId.current = params.nodeId;
    }
  }, []);

  // 监听连接结束
  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!connectingNodeId.current || !reactFlowInstance) return;

      const targetIsPane = (event.target as Element).classList.contains(
        'react-flow__pane',
      );
      if (targetIsPane) {
        // 连接到空白处时，可以创建新节点
        connectingNodeId.current = null;
      }
    },
    [reactFlowInstance],
  );

  return (
    <div className='h-screen flex flex-col'>
      <div className='flex-1 flex overflow-hidden'>
        {/* 左侧面板 */}
        <div className='w-64 bg-white border-r border-gray-200 overflow-auto flex-shrink-0'>
          <CommandsPanel onAddNode={handleAddNode} />
        </div>

        {/* 中间流程编辑区 */}
        <div className='flex-1' ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode='Delete'
            connectionMode={ConnectionMode.Loose}
          >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Panel position='top-right'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => resetFlow()}
                  className='px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium'
                >
                  清空
                </button>
                <Link
                  href='/'
                  className='px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium'
                >
                  返回
                </Link>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* 右侧导出和验证面板 */}
        <div className='w-80 bg-white border-l border-gray-200 overflow-auto flex-shrink-0 flex flex-col'>
          {/* 选项卡导航 */}
          <div className='flex border-b border-gray-200'>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'export'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('export')}
            >
              导出
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'validator'
                  ? 'text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('validator')}
            >
              智能验证
            </button>
          </div>

          {/* 面板内容 */}
          <div className='flex-1 overflow-hidden'>
            {activeTab === 'export' && <ExportPanel />}
            {activeTab === 'validator' && <ValidatorPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

const DockerEditor: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // 正确解析路由参数，确保支持/editor/template/[templateId]格式
  const templateId =
    Array.isArray(slug) && slug.length > 1 && slug[0] === 'template'
      ? slug[1]
      : undefined;

  return (
    <div>
      <Head>
        <title>Dockerfile蓝图 - 可视化编辑器</title>
        <meta
          name='description'
          content='使用Dockerfile蓝图可视化编辑和创建Docker配置文件'
        />
      </Head>

      <ReactFlowProvider>
        <FlowEditor templateId={templateId} />
      </ReactFlowProvider>
    </div>
  );
};

export default DockerEditor;
