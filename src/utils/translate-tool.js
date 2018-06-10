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
  generatePlainTextTool(plainText = '', composeText = '', readonly = '') {
    return {
      ...TOOL_TEMPLATE.PLAIN_TEXT,
      value: {
        ...TOOL_TEMPLATE.PLAIN_TEXT.value,
        plainText,
        composeText,
        readonly,
      },
    };
  },
  generateVaribaleTool(variableName = '', composeText = '', readonly = '') {
    return {
      ...TOOL_TEMPLATE.VARIABLE,
      value: {
        ...TOOL_TEMPLATE.VARIABLE.value,
        variableName,
        composeText,
        readonly,
      },
    };
  },
  generatePluralTool(
    { plural = '', zero = '', one = '', other = '' } = {},
    composeText = '',
    readonly = '',
  ) {
    return {
      ...TOOL_TEMPLATE.PLURAL,
      value: {
        ...TOOL_TEMPLATE.PLURAL.value,
        plural,
        zero,
        one,
        other,
        composeText,
        readonly,
      },
    };
  },
};
