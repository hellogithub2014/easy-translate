import translateTool from '../utils/translate-tool';

const parser = require('intl-messageformat-parser');

const ELEMNT_TYPE = {
  TEXT: 'messageTextElement',
  ARGUMENT: 'argumentElement',
};

export default {
  /**
   * 从抽象语法树生成的各种tool
   *
   * @author liubin.frontend
   * @param {string} str
   */
  generateToolProperties(str) {
    const ast = parser.parse(str);
    const { elements } = ast;
    // 目前认为除了messageTextElement就是argumentElement，不考虑其他的
    return elements.map((element) => {
      if (element.type === ELEMNT_TYPE.TEXT) {
        return this.parseToPlainTextTool(element); // 纯文本
      }
      if (!element.format) {
        return this.parseToVariableTool(element); // 插值
      }
      return this.parseToPluralTool(element); // 单复数
    });
  },
  /**
   * 从AST元素的插值元素中生成普通文本Tool
   *
   * @author liubin.frontend
   * @param {{type: string, id: string, format:null} messageTextElement
   * @returns
   */
  parseToPlainTextTool(messageTextElement) {
    return translateTool.generatePlainTextTool(messageTextElement.value);
  },
  /**
   * 从AST元素的插值元素中生成插值变量名tool
   *
   * @author liubin.frontend
   * @param {{type: string, id: string, format:null} argumentElement
   * @returns
   */
  parseToVariableTool(argumentElement) {
    return translateTool.generateVaribaleTool(argumentElement.id);
  },
  /**
   * 从AST元素的插值元素中生成单复数tool
   *
   * @author liubin.frontend
   * @param { {type: string, id: string,format:{type: string, offset: number, options: {type:string, selector:string,value:{type:string,elements: {type:string,value:string}[]}}[]}} argumentElement
   * @returns
   */
  parseToPluralTool(argumentElement) {
    const {
      id: plural,
      format: { options },
    } = argumentElement;

    const { zero, one = '', other } = options.reduce((result, option) => {
      const resultClone = result;
      const text = option.value.elements[0].value;
      switch (option.selector) {
        case '=0':
          resultClone.zero = text;
          break;
        case '=1':
          resultClone.one = text;
          break;
        case 'other':
          resultClone.other = text;
          break;
        default:
          break;
      }
      return resultClone;
    }, {});

    return translateTool.generatePluralTool({
      plural,
      zero,
      one,
      other,
    });
  },
};
