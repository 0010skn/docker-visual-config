import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50'>
      <Head>
        <title>Dockerfile蓝图 - 可视化Docker配置构建工具 | 新手友好</title>
        <meta
          name='description'
          content='Dockerfile蓝图是一款可视化Docker配置文件编辑器，通过简单的拖拽和点击操作，帮助初学者轻松创建专业的Dockerfile，无需记忆复杂命令语法'
        />
        <meta
          name='keywords'
          content='Dockerfile,Docker,容器化,可视化工具,拖拽编辑,Docker配置,DevOps,容器部署'
        />
        <meta
          property='og:title'
          content='Dockerfile蓝图 - 可视化Docker配置构建工具'
        />
        <meta
          property='og:description'
          content='通过简单的可视化界面，轻松创建专业的Docker配置文件，适合Docker初学者和专业开发者'
        />
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='Dockerfile蓝图 - 可视化Docker配置构建工具'
        />
        <meta
          name='twitter:description'
          content='通过简单的可视化界面，轻松创建专业的Docker配置文件'
        />
        <link rel='icon' href='/favicon.ico' />
        <link rel='canonical' href='https://dockerfileblueprint.com' />
      </Head>

      <main className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
        <h1 className='text-4xl font-bold text-gray-800 mb-8'>
          Dockerfile<span className='text-blue-600'>蓝图</span>
        </h1>
        <p className='text-xl text-gray-600 mb-4'>
          可视化构建专业Docker配置，无需记忆复杂命令
        </p>
        <p className='text-md text-gray-500 mb-12 max-w-2xl'>
          为开发者、运维人员和Docker初学者打造的直观可视化工具，通过简单拖拽即可创建高效、专业的Dockerfile
        </p>

        <div className='flex flex-col gap-6'>
          <Link
            href='/editor/new'
            className='px-8 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors'
          >
            创建新的Dockerfile
          </Link>

          <Link
            href='/templates'
            className='px-8 py-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors'
          >
            浏览专业模板
          </Link>

          <Link
            href='/import'
            className='px-8 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors'
          >
            导入现有Dockerfile
          </Link>
        </div>
      </main>

      <footer className='flex h-24 w-full items-center justify-center border-t'>
        <p className='text-gray-600'>
          Dockerfile蓝图 - 专业的Docker配置可视化工具 | 简化容器化流程
        </p>
      </footer>
    </div>
  );
};

export default Home;
