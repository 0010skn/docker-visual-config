/**
 * Docker语法检测和智能分析服务
 */

interface ValidationError {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  suggestions: string[];
}

/**
 * 验证Dockerfile语法
 * @param dockerfileContent Dockerfile内容
 * @returns 验证结果
 */
export const validateDockerfile = (
  dockerfileContent: string,
): ValidationResult => {
  const lines = dockerfileContent.split('\n');
  const errors: ValidationError[] = [];
  const suggestions: string[] = [];

  // 基本规则检查
  let hasFromInstruction = false;
  let fromInstructionIndex = -1;

  // 检查每一行
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // 跳过注释和空行
    if (trimmedLine.startsWith('#') || trimmedLine === '') {
      return;
    }

    // 指令正则表达式
    const instructionRegex =
      /^(FROM|RUN|COPY|ADD|WORKDIR|ENV|EXPOSE|CMD|ENTRYPOINT|VOLUME|USER|LABEL|ARG|HEALTHCHECK|SHELL|STOPSIGNAL|ONBUILD)\s+/i;
    const match = trimmedLine.match(instructionRegex);

    if (!match || !match[1]) {
      errors.push({
        line: index + 1,
        message: `无效的Dockerfile指令: ${trimmedLine}`,
        severity: 'error',
      });
      return;
    }

    const instruction = match[1].toUpperCase();
    const instructionArgs = trimmedLine.substring(match[0].length).trim();

    // 检查FROM指令
    if (instruction === 'FROM') {
      hasFromInstruction = true;
      fromInstructionIndex = index;

      // 检查基础镜像格式
      if (!instructionArgs.includes(':')) {
        suggestions.push(
          `第${
            index + 1
          }行: 建议为基础镜像指定具体的标签版本，而不是使用latest`,
        );
      }
    }

    // 检查CMD和ENTRYPOINT格式
    if (instruction === 'CMD' || instruction === 'ENTRYPOINT') {
      if (!instructionArgs.startsWith('[') && !instructionArgs.includes('${')) {
        suggestions.push(
          `第${
            index + 1
          }行: 建议使用JSON数组格式 (${instruction} ["executable", "param1", "param2"])`,
        );
      }
    }

    // 检查RUN指令优化
    if (instruction === 'RUN') {
      if (
        instructionArgs.includes('apt-get install') &&
        !instructionArgs.includes('-y')
      ) {
        suggestions.push(
          `第${index + 1}行: 使用apt-get install时建议添加-y参数以避免交互提示`,
        );
      }

      if (
        instructionArgs.includes('apt-get update') &&
        !instructionArgs.includes('apt-get install')
      ) {
        suggestions.push(
          `第${
            index + 1
          }行: 建议将apt-get update与apt-get install合并到同一个RUN指令中，以减少层数`,
        );
      }

      if (
        instructionArgs.includes('npm install') &&
        !instructionArgs.includes('--production')
      ) {
        suggestions.push(
          `第${index + 1}行: 考虑使用npm install --production减小镜像体积`,
        );
      }
    }

    // 检查COPY和ADD指令
    if (instruction === 'COPY' || instruction === 'ADD') {
      if (
        instruction === 'ADD' &&
        !instructionArgs.includes('http://') &&
        !instructionArgs.includes('https://') &&
        !instructionArgs.includes('.tar')
      ) {
        suggestions.push(
          `第${index + 1}行: 对于简单的文件复制，建议使用COPY而非ADD指令`,
        );
      }
    }
  });

  // 检查FROM是否为第一条非注释指令
  if (hasFromInstruction && fromInstructionIndex > 0) {
    // 检查FROM前面是否有非注释指令
    for (let i = 0; i < fromInstructionIndex; i++) {
      const line = lines[i].trim();
      if (line !== '' && !line.startsWith('#') && !line.startsWith('ARG')) {
        errors.push({
          line: i + 1,
          message: 'FROM指令必须是Dockerfile中的第一条指令（ARG指令除外）',
          severity: 'error',
        });
        break;
      }
    }
  }

  // 检查是否有FROM指令
  if (!hasFromInstruction) {
    errors.push({
      line: 1,
      message: 'Dockerfile必须包含FROM指令',
      severity: 'error',
    });
  }

  // 检查最佳实践
  if (!dockerfileContent.includes('HEALTHCHECK')) {
    suggestions.push('考虑添加HEALTHCHECK指令以监控容器健康状态');
  }

  if (
    !dockerfileContent.includes('USER') &&
    !dockerfileContent.toLowerCase().includes('alpine')
  ) {
    suggestions.push('考虑添加USER指令以非root用户运行容器，提高安全性');
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
  };
};

/**
 * 智能分析Dockerfile构建可行性
 * @param dockerfileContent Dockerfile内容
 * @returns 分析结果
 */
export const analyzeDockerfileBuildability = (
  dockerfileContent: string,
): string => {
  const validationResult = validateDockerfile(dockerfileContent);

  if (!validationResult.isValid) {
    return '该Dockerfile存在语法错误，无法构建。请修复所有错误后再尝试构建。';
  }

  if (
    validationResult.errors.length === 0 &&
    validationResult.suggestions.length === 0
  ) {
    return '该Dockerfile语法正确，应该可以成功构建。';
  }

  // 分析指令完整性
  const essentialInstructions = ['FROM', 'RUN', 'COPY', 'CMD'];
  const missingEssential = essentialInstructions.filter(
    (instruction) => !dockerfileContent.includes(instruction),
  );

  let buildabilityAnalysis = '该Dockerfile语法基本正确，但';

  if (missingEssential.length > 0) {
    buildabilityAnalysis += `缺少一些常见的关键指令: ${missingEssential.join(
      ', ',
    )}。`;
  } else {
    buildabilityAnalysis += '包含了基本的必要指令。';
  }

  if (validationResult.suggestions.length > 0) {
    buildabilityAnalysis += ' 有一些建议可以优化您的Dockerfile。';
  }

  return buildabilityAnalysis;
};
