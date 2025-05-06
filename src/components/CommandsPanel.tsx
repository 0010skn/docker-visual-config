import React, { FC, useState } from 'react';

import { DockerCommand, DockerCommands } from '../types/docker';

interface CommandsPanelProps {
  onAddNode: (type: string) => void;
}

const CommandsPanel: FC<CommandsPanelProps> = ({ onAddNode }) => {
  const [search, setSearch] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<DockerCommand | null>(
    null,
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 过滤命令基于搜索词和是否显示高级指令
  const filteredCommands = DockerCommands.filter((cmd) => {
    const matchesSearch =
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase());

    const matchesAdvancedFilter = showAdvanced ? true : !cmd.isAdvanced;

    return matchesSearch && matchesAdvancedFilter;
  });

  // 分离基础命令和高级命令
  const basicCommands = filteredCommands.filter((cmd) => !cmd.isAdvanced);
  const advancedCommands = filteredCommands.filter((cmd) => cmd.isAdvanced);

  // 渲染命令
  const renderCommand = (command: DockerCommand) => (
    <div
      key={command.id}
      className={`p-3 border rounded-md cursor-pointer transition-colors ${
        command.isAdvanced
          ? 'border-yellow-200 hover:bg-yellow-50'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
      onClick={() => onAddNode(command.type)}
      onDragStart={(event) => {
        event.dataTransfer.setData('application/reactflow', command.type);
        event.dataTransfer.effectAllowed = 'move';
      }}
      draggable
    >
      <div className='flex items-center justify-between'>
        <div
          className={`flex items-center ${
            command.isAdvanced ? 'text-yellow-600' : 'text-blue-600'
          } font-medium`}
        >
          {command.label}
          {command.isAdvanced && (
            <span className='ml-1 px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded'>
              Pro
            </span>
          )}
        </div>
        <button
          className={`text-xs px-2 py-1 rounded ${
            command.isAdvanced
              ? 'bg-yellow-100 hover:bg-yellow-200'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCommand(command === selectedCommand ? null : command);
          }}
        >
          {selectedCommand === command ? '收起' : '详情'}
        </button>
      </div>

      <div className='text-sm text-gray-600 mt-1'>{command.description}</div>

      {selectedCommand === command && (
        <div
          className={`mt-3 text-xs p-2 rounded ${
            command.isAdvanced ? 'bg-yellow-50' : 'bg-gray-50'
          }`}
        >
          <div className='mb-1'>
            <span className='font-semibold'>示例:</span>
            <ul className='list-disc ml-4 mt-1'>
              {command.examples?.map((example, index) => (
                <li key={index} className='text-gray-600'>
                  {example}
                </li>
              ))}
            </ul>
          </div>
          {command.documentation && (
            <div className='mt-2'>
              <span className='font-semibold'>说明:</span>
              <p className='text-gray-600 mt-1'>{command.documentation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className='w-full h-full bg-white shadow-md rounded-md overflow-hidden flex flex-col'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-bold text-gray-800'>Docker 命令</h2>
        <p className='text-sm text-gray-600 mb-2'>拖拽命令到画布或单击添加</p>

        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <input
              id='show-advanced'
              type='checkbox'
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
            />
            <label
              htmlFor='show-advanced'
              className='ml-2 text-sm text-gray-700'
            >
              显示高级指令
            </label>
          </div>
        </div>

        <div className='mt-2'>
          <input
            type='text'
            placeholder='搜索命令...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='grid grid-cols-1 gap-2 p-3'>
          {/* 基础指令 */}
          {basicCommands.length > 0 && (
            <div className='mb-3'>
              <h3 className='text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider'>
                基础指令
              </h3>
              <div className='space-y-2'>
                {basicCommands.map(renderCommand)}
              </div>
            </div>
          )}

          {/* 高级指令 */}
          {showAdvanced && advancedCommands.length > 0 && (
            <div className='mb-2'>
              <h3 className='text-sm font-medium text-yellow-600 mb-2 uppercase tracking-wider flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-4 h-4 mr-1'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z'
                    clipRule='evenodd'
                  />
                </svg>
                高级指令
              </h3>
              <div className='space-y-2 p-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-md border border-yellow-100'>
                {advancedCommands.map(renderCommand)}
              </div>
            </div>
          )}

          {/* 没有匹配的结果 */}
          {filteredCommands.length === 0 && (
            <div className='text-center py-6 text-gray-500'>
              没有找到匹配的命令
              {!showAdvanced && search && (
                <div className='mt-2'>
                  <button
                    onClick={() => setShowAdvanced(true)}
                    className='text-yellow-600 hover:text-yellow-700 text-sm'
                  >
                    尝试在高级指令中搜索
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandsPanel;
