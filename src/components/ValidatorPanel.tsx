import React, { FC, useEffect, useState } from 'react';

import {
  analyzeDockerfileBuildability,
  validateDockerfile,
} from '../services/dockerValidator';
import { useDockerStore } from '../store/dockerStore';

interface ValidationResultProps {
  isValid: boolean;
  buildAnalysis: string;
  errors: { line: number; message: string; severity: 'error' | 'warning' }[];
  suggestions: string[];
}

const ValidatorPanel: FC = () => {
  const { getDockerfileContent } = useDockerStore();
  const [validationResult, setValidationResult] =
    useState<ValidationResultProps>({
      isValid: true,
      buildAnalysis: '',
      errors: [],
      suggestions: [],
    });

  useEffect(() => {
    const dockerfileContent = getDockerfileContent();
    if (!dockerfileContent) {
      setValidationResult({
        isValid: true,
        buildAnalysis: '',
        errors: [],
        suggestions: [],
      });
      return;
    }

    // 验证Dockerfile
    const result = validateDockerfile(dockerfileContent);
    const buildAnalysis = analyzeDockerfileBuildability(dockerfileContent);

    setValidationResult({
      isValid: result.isValid,
      buildAnalysis,
      errors: result.errors,
      suggestions: result.suggestions,
    });
  }, [getDockerfileContent]);

  if (!getDockerfileContent()) {
    return (
      <div className='p-4'>
        <h2 className='text-lg font-bold text-gray-800 mb-2'>Dockerfile验证</h2>
        <p className='text-gray-600 text-sm'>
          请添加Docker命令节点以生成Dockerfile进行验证。
        </p>
      </div>
    );
  }

  return (
    <div className='w-full h-full bg-white shadow-md rounded-md overflow-hidden flex flex-col'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-bold text-gray-800'>Dockerfile验证</h2>
        <div className='mt-2'>
          <div
            className={`text-sm font-medium ${
              validationResult.isValid ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {validationResult.isValid ? '✓ 语法验证通过' : '✗ 存在语法错误'}
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        {/* 构建可行性分析 */}
        <div className='mb-4'>
          <h3 className='font-medium text-gray-800 mb-2'>构建可行性分析</h3>
          <div className='p-3 bg-blue-50 rounded-md text-blue-800 text-sm'>
            {validationResult.buildAnalysis}
          </div>
        </div>

        {/* 错误列表 */}
        {validationResult.errors.length > 0 && (
          <div className='mb-4'>
            <h3 className='font-medium text-gray-800 mb-2'>
              错误 ({validationResult.errors.length})
            </h3>
            <ul className='bg-red-50 rounded-md p-2'>
              {validationResult.errors.map((error, index) => (
                <li
                  key={index}
                  className='text-red-700 text-sm p-2 border-b border-red-100 last:border-b-0'
                >
                  <span className='font-medium'>第 {error.line} 行:</span>{' '}
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 建议列表 */}
        {validationResult.suggestions.length > 0 && (
          <div>
            <h3 className='font-medium text-gray-800 mb-2'>
              优化建议 ({validationResult.suggestions.length})
            </h3>
            <ul className='bg-yellow-50 rounded-md p-2'>
              {validationResult.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className='text-yellow-700 text-sm p-2 border-b border-yellow-100 last:border-b-0'
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorPanel;
