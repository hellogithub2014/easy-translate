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
  generatePlainTextTool({ plainText = '', composeText = '', readonly = false } = {}) {
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
  /**
   * 生成只读的PlainTextTool
   *
   * @author liubin.frontend
   * @param {string} [plainText='']
   * @param {string} [composeText='']
   * @returns
   */
  generateReadonlyPlainTextTool({ plainText = '', composeText = '' } = {}) {
    return this.generatePlainTextTool({ plainText, composeText, readonly: true });
  },
  /**
   *
   *
   * @author liubin.frontend
   * @param {*} [{
   *     variableName = '',
   *     composeText = '',
   *     showDialog = false,
   *     isNew = false,
   *     readonly = false,
   *   }={}]
   * @returns
   */
  generateVaribaleTool({
    variableName = '',
    composeText = '',
    showDialog = false,
    isNew = false,
    readonly = false,
  } = {}) {
    return {
      ...TOOL_TEMPLATE.VARIABLE,
      value: {
        ...TOOL_TEMPLATE.VARIABLE.value,
        variableName,
        composeText,
        showDialog, // 是否显示弹窗
        isNew,
        readonly,
      },
    };
  },
  /**
   *
   *
   * @author liubin.frontend
   * @param {*} [{ variableName = '', composeText = '' }={}]
   * @returns
   */
  generateReadonlyVaribaleTool({ variableName = '', composeText = '' } = {}) {
    return this.generateVaribaleTool({ variableName, composeText, readonly: true });
  },
  /**
   *
   *
   * @author liubin.frontend
   * @param {*} [{
   *     plural = '',
   *     zero = '',
   *     one = '',
   *     other = '',
   *     composeText = '',
   *     showDialog = false,
   *     isNew = false,
   *     readonly = false,
   *   }={}]
   * @returns
   */
  generatePluralTool({
    plural = '',
    zero = '',
    one = '',
    other = '',
    composeText = '',
    showDialog = false,
    isNew = false,
    readonly = false,
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
        isNew,
        readonly,
      },
    };
  },
  /**
   *
   *
   * @author liubin.frontend
   * @param {*} [{
   *     plural = '',
   *     zero = '',
   *     one = '',
   *     other = '',
   *     composeText = '',
   *   }={}]
   * @returns
   */
  generateReadonlyPluralTool({
    plural = '',
    zero = '',
    one = '',
    other = '',
    composeText = '',
  } = {}) {
    return this.generatePluralTool({ plural, zero, one, other, composeText, readonly: true });
  },
};
