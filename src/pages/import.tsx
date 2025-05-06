import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { parseDockerfile } from '../services/importService';
import { useDockerStore } from '../store/dockerStore';

const ImportPage: NextPage = () => {
  const router = useRouter();
  const [dockerfile, setDockerfile] = useState('');
  const [fileName, setFileName] = useState('Dockerfile');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resetFlow = useDockerStore((state) => state.resetFlow);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setDockerfile(content || '');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!dockerfile.trim()) {
      setError('请上传或粘贴Dockerfile内容');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 重置当前流程
      resetFlow();

      // 调用服务解析Dockerfile
      const { nodes, edges } = parseDockerfile(dockerfile);

      // 将解析结果存储到状态
      useDockerStore.setState({
        nodes,
        edges,
        fileName,
      });

      // 导航到编辑器页面
      router.push('/editor/new');
    } catch (err) {
      console.error('解析Dockerfile失败:', err);
      setError('解析Dockerfile失败，请检查格式是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Head>
        <title>导入Dockerfile - Dockerfile蓝图</title>
        <meta
          name='description'
          content='导入现有的Dockerfile，转换为可视化节点进行编辑'
        />
      </Head>

      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-800'>导入 Dockerfile</h1>
          <Link
            href='/'
            className='text-blue-600 hover:text-blue-800 flex items-center'
          >
            返回首页
          </Link>
        </div>
      </header>

      <main className='max-w-3xl mx-auto py-10 px-4 sm:px-6'>
        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <div className='mb-6'>
              <h2 className='text-lg leading-6 font-medium text-gray-900 mb-2'>
                上传Dockerfile文件
              </h2>
              <div className='mt-2'>
                <input
                  type='file'
                  accept='.dockerfile,.txt'
                  onChange={handleFileUpload}
                  className='block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100'
                />
              </div>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                或粘贴Dockerfile内容
              </label>
              <textarea
                value={dockerfile}
                onChange={(e) => setDockerfile(e.target.value)}
                rows={12}
                className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
                placeholder='FROM node:14-alpine&#10;WORKDIR /app&#10;COPY . .&#10;RUN npm install&#10;EXPOSE 3000&#10;CMD ["npm", "start"]'
              />
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                文件名称
              </label>
              <input
                type='text'
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md'
              />
            </div>

            {error && (
              <div className='rounded-md bg-red-50 p-4 mb-6'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-red-400'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-red-800'>
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className='flex justify-end space-x-3'>
              <Link
                href='/'
                className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                取消
              </Link>
              <button
                onClick={handleImport}
                disabled={isLoading || !dockerfile.trim()}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isLoading || !dockerfile.trim()
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    处理中...
                  </>
                ) : (
                  '导入并编辑'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white overflow-hidden shadow rounded-lg mt-6'>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900 mb-2'>
              导入说明
            </h3>
            <div className='text-sm text-gray-600'>
              <ul className='list-disc pl-5 space-y-1'>
                <li>支持所有标准Dockerfile指令</li>
                <li>每条指令将转换为节点图中的一个节点</li>
                <li>节点会自动按顺序连接</li>
                <li>导入后，您仍可以修改节点参数或添加新节点</li>
                <li>复杂的多行指令可能需要手动调整</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImportPage;
