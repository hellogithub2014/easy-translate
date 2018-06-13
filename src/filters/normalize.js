import TOOL_NAME from '../const/tool-name';

function getMaskVariable(variableIndex) {
  const char = String.fromCharCode('a'.charCodeAt(0) + variableIndex);
  const upperCaseChar = char.toUpperCase();
  return `${upperCaseChar}${char}${upperCaseChar}${char}${upperCaseChar}`;
}

/**
 * 将字符串中的插值变量转换为一些特殊字符。
 *
 * @example
 * my name is {name} => my name is AaAaA
 *
 * my name is {name}, my age is {age} => my name is AaAaA, my age is BbBbB
 *
 * @author liubin.frontend
 * @export
 * @param {*} str
 * @returns
 */
export default function (tools) {
  if (!tools) {
    return {};
  }
  const variableIndex = 0;
  // const pluralCount = 0;
  const variableMaskMap = {};

  return tools.reduce((result, tool) => {
    let preResult = result;
    switch (tool.component) {
      case TOOL_NAME.PLAIN_TEXT_TOOL:
        preResult += tool.value.plainText;
        break;
      case TOOL_NAME.VARIABLE_TOOL:
        variableMaskMap[tool.value.variableName] = getMaskVariable(variableIndex);
        preResult += getMaskVariable(variableIndex);
        break;
      case TOOL_NAME.PLURAL_TOOL:
        // preResult += formatParser.pluralPreview({ other: tool.value.other }, this.isLocaleEN);
        break;
      default:
        break;
    }
    return preResult;
  }, '');
}
