import TOOL_TEMPLATE from '../const/tool-template';
/**
 * 根据TOOL的数据模板，填充生成真正的TOOL数据
 */
export default {
  /**
   *
   *
   * @author liubin.frontend
   * @param {string} [plainText='']
   * @param {string} [composeText='']
   * @param {string} [readonly=''] tool是否为只读
   * @returns
   */
  generatePlainTextTool({ plainText = '', composeText = '' } = {}) {
    return {
      ...TOOL_TEMPLATE.PLAIN_TEXT,
      value: {
        ...TOOL_TEMPLATE.PLAIN_TEXT.value,
        plainText,
        composeText,
      },
    };
  },
  /**
   * 生成只读的PlainTextTool
   *
   * @author liubin.frontend
   * @param {string} [plainText='']
   * @param {string} [composeText='']
   * @returns
   */
  generateReadonlyPlainTextTool({ plainText = '', composeText = '' } = {}) {
    const tool = this.generatePlainTextTool({ plainText, composeText });
    return {
      ...tool,
      value: {
        ...tool.value,
        readonly: true,
      },
    };
  },
  generateVaribaleTool({ variableName = '', composeText = '', showDialog = false } = {}) {
    return {
      ...TOOL_TEMPLATE.VARIABLE,
      value: {
        ...TOOL_TEMPLATE.VARIABLE.value,
        variableName,
        composeText,
        showDialog, // 是否显示弹窗
      },
    };
  },
  generateReadonlyVaribaleTool({ variableName = '', composeText = '' } = {}) {
    const tool = this.generateVaribaleTool({ variableName, composeText });
    return {
      ...tool,
      value: {
        ...tool.value,
        readonly: true,
      },
    };
  },
  generatePluralTool({
    plural = '',
    zero = '',
    one = '',
    other = '',
    composeText = '',
    showDialog = false,
  } = {}) {
    return {
      ...TOOL_TEMPLATE.PLURAL,
      value: {
        ...TOOL_TEMPLATE.PLURAL.value,
        plural,
        zero,
        one,
        other,
        composeText,
        showDialog,
      },
    };
  },
  generateReadonlyPluralTool({
    plural = '',
    zero = '',
    one = '',
    other = '',
    composeText = '',
  } = {}) {
    const tool = this.generatePluralTool({ plural, zero, one, other, composeText });
    return {
      ...tool,
      value: {
        ...tool.value,
        readonly: true,
      },
    };
  },
};
