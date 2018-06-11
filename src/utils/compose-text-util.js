/**
 * 为各种工具生成composetext
 */
export default {
  plainTextTool(plainText = '') {
    return plainText;
  },
  variableTool(variableName = '') {
    return `{${variableName}}`;
  },
  pluralTool({ plural = '', zero = '', one = '', other = '' }) {
    let addedText = `{${plural}, plural, `;
    addedText += `=0{${zero}} `;

    if (one.trim()) {
      addedText += `one{${one}} `;
    }

    addedText += `other{${other}}}`;

    return addedText;
  },
};
