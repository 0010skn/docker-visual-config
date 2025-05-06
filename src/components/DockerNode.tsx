import React, { ChangeEvent, FC, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

import { useDockerStore } from '../store/dockerStore';
import { NodeData } from '../types/docker';

// 高级功能图标
const AdvancedIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
    className='w-4 h-4 text-yellow-500'
  >
    <path
      fillRule='evenodd'
      d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'
      clipRule='evenodd'
    />
  </svg>
);

const DockerNode: FC<NodeProps<NodeData>> = ({ id, data }) => {
  const updateNodeData = useDockerStore((state) => state.updateNodeData);
  const [showDetails, setShowDetails] = useState(false);

  const handleArgumentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { arguments: e.target.value });
  };

  // 确定节点样式基于是否为高级节点
  const nodeStyles = data.isAdvanced
    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-yellow-300 p-3 rounded-md shadow-md w-64'
    : 'bg-white border-2 border-gray-200 p-3 rounded-md shadow-md w-64';

  return (
    <div className={nodeStyles}>
      <Handle type='target' position={Position.Top} className='!bg-blue-500' />

      <div className='flex flex-col'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <div className='font-bold text-blue-600'>{data.label}</div>
            {data.isAdvanced && (
              <div className='ml-1' title='高级功能'>
                <span className='px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded'>
                  Pro
                </span>
              </div>
            )}
          </div>
          <div
            className={`text-xs px-2 py-1 rounded ${
              data.isAdvanced ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
            }`}
          >
            {data.command}
          </div>
        </div>

        <div className='text-sm text-gray-600 mb-2'>{data.description}</div>

        <div className='mt-2'>
          <label className='block text-xs text-gray-500 mb-1'>参数:</label>
          <input
            value={data.arguments}
            onChange={handleArgumentsChange}
            className={`w-full px-2 py-1 border rounded text-sm ${
              data.isAdvanced
                ? 'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>

        <div className='mt-3 flex justify-between items-center'>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-xs hover:underline ${
              data.isAdvanced
                ? 'text-yellow-600 hover:text-yellow-800'
                : 'text-blue-500 hover:text-blue-700'
            }`}
          >
            {showDetails ? '隐藏详情' : '查看详情'}
          </button>
          <div className='text-xs text-gray-400'>ID: {id.substring(0, 5)}</div>
        </div>

        {showDetails && (
          <div
            className={`mt-2 p-2 rounded text-xs text-gray-600 ${
              data.isAdvanced ? 'bg-yellow-50' : 'bg-gray-50'
            }`}
          >
            <div className='mb-1'>
              <span className='font-semibold'>完整命令:</span> {data.command}{' '}
              {data.arguments}
            </div>
            {data.isAdvanced && (
              <div className='mt-1 p-1 bg-yellow-100 rounded text-yellow-800 text-xs'>
                <span className='font-bold'>高级功能</span>:
                此节点提供了Docker的高级特性，适用于构建优化和复杂场景
              </div>
            )}
          </div>
        )}
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        className={`${data.isAdvanced ? '!bg-yellow-500' : '!bg-blue-500'}`}
      />
    </div>
  );
};

export default DockerNode;
