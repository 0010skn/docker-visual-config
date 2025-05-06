import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  icon: string;
  color: string;
}

const templates: Template[] = [
  {
    id: 'node',
    name: 'Node.js应用',
    description:
      '用于Node.js应用的基础Dockerfile，适用于大多数Node.js Web应用程序',
    tags: ['node', 'javascript', 'web'],
    icon: 'NODE',
    color: 'green',
  },
  {
    id: 'python',
    name: 'Python应用',
    description: '用于Python应用的基础Dockerfile，适合各种Python应用程序',
    tags: ['python', 'web', 'api'],
    icon: 'PY',
    color: 'blue',
  },
  {
    id: 'golang',
    name: 'Go应用',
    description: '用于Go应用的基础Dockerfile，针对Go应用程序进行了优化',
    tags: ['golang', 'go', 'api'],
    icon: 'GO',
    color: 'cyan',
  },
  {
    id: 'java',
    name: 'Java Spring Boot',
    description: '用于Java Spring Boot应用的Dockerfile，包含JDK和运行时配置',
    tags: ['java', 'spring', 'web'],
    icon: 'JAVA',
    color: 'red',
  },
  {
    id: 'nginx',
    name: 'Nginx静态网站',
    description: '使用Nginx部署静态网站的简单Dockerfile配置',
    tags: ['nginx', 'static', 'web'],
    icon: 'NGX',
    color: 'green',
  },
  {
    id: 'multi-stage',
    name: '多阶段构建示例',
    description: '展示如何使用多阶段构建来优化Docker镜像大小的模板',
    tags: ['multi-stage', 'optimization', 'production'],
    icon: 'MULTI',
    color: 'purple',
  },
];

// 根据颜色获取对应的TailwindCSS类名
const getColorClasses = (color: string) => {
  switch (color) {
    case 'green':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
      };
    case 'blue':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
      };
    case 'cyan':
      return {
        bg: 'bg-cyan-100',
        text: 'text-cyan-800',
        border: 'border-cyan-200',
      };
    case 'red':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
      };
    case 'purple':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
      };
  }
};

const Templates: NextPage = () => {
  const router = useRouter();

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/editor/template/${templateId}`);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Head>
        <title>Dockerfile 模板 - Dockerfile蓝图</title>
        <meta
          name='description'
          content='选择一个预定义的Dockerfile模板开始创建，通过可视化界面轻松构建容器配置'
        />
      </Head>

      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-800'>Dockerfile 模板</h1>
          <Link
            href='/'
            className='text-blue-600 hover:text-blue-800 flex items-center'
          >
            返回首页
          </Link>
        </div>
      </header>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {templates.map((template) => {
              const colorClasses = getColorClasses(template.color);
              return (
                <div
                  key={template.id}
                  className='bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer'
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <div
                    className={`h-32 ${colorClasses.bg} flex items-center justify-center`}
                  >
                    <div
                      className={`w-20 h-20 ${colorClasses.bg} border-2 ${colorClasses.border} rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`text-2xl font-bold ${colorClasses.text}`}
                      >
                        {template.icon}
                      </span>
                    </div>
                  </div>
                  <div className='p-5'>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {template.name}
                    </h3>
                    <p className='mt-2 text-sm text-gray-600'>
                      {template.description}
                    </p>
                    <div className='mt-3 flex flex-wrap gap-2'>
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='bg-gray-50 px-5 py-3 flex justify-end'>
                    <button
                      className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      使用此模板
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='mt-8 bg-white shadow overflow-hidden sm:rounded-lg'>
          <div className='px-4 py-5 sm:p-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              没有找到适合你的模板？
            </h3>
            <div className='mt-2 max-w-xl text-sm text-gray-500'>
              <p>
                你可以从头开始创建自己的Dockerfile，完全自定义你的容器配置。
              </p>
            </div>
            <div className='mt-5'>
              <Link
                href='/editor/new'
                className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                创建新的Dockerfile
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Templates;
