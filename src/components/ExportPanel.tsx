import React, { FC, useState } from 'react';

import { useDockerStore } from '../store/dockerStore';

const ExportPanel: FC = () => {
  const { getDockerfileContent, fileName, setFileName } = useDockerStore();
  const [copied, setCopied] = useState(false);

  const dockerfileContent = getDockerfileContent();

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([dockerfileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(dockerfileContent);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className='w-full h-full bg-white shadow-md rounded-md overflow-hidden flex flex-col'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-bold text-gray-800'>导出 Dockerfile</h2>
        <div className='mt-2 flex gap-2'>
          <input
            type='text'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className='flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={handleDownload}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center'
            disabled={!dockerfileContent}
          >
            下载
          </button>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        <div className='relative'>
          <button
            onClick={handleCopy}
            className='absolute top-2 right-2 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded'
            disabled={!dockerfileContent}
          >
            {copied ? '已复制' : '复制'}
          </button>
          <pre className='bg-gray-50 p-4 rounded-md text-sm text-gray-800 h-80 overflow-y-auto whitespace-pre'>
            {dockerfileContent ||
              '# 生成的Dockerfile将显示在这里\n# 添加节点并连接它们来创建Dockerfile'}
          </pre>
        </div>

        <div className='mt-4'>
          <h3 className='font-medium text-gray-800 mb-2'>说明</h3>
          <ul className='list-disc ml-5 text-sm text-gray-600 space-y-1'>
            <li>节点将按照连接顺序生成Dockerfile</li>
            <li>FROM指令应该是Dockerfile的第一条指令</li>
            <li>确保节点之间正确连接，以确保命令顺序正确</li>
            <li>每个节点代表一个Dockerfile指令</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
