const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;

//  ?: 非捕获括号
// ?! 顺序否定环视
// ?= 顺序肯定环视
// ?<! 逆序否定环视
// ?<= 逆序肯定环视
// \n 返回最后的第n个子捕获匹配的子字符串(捕获的数目以左括号计数)
// ?  量词控制符后面加上? 表示惰性匹配
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'].*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g',
);

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
const stringToPath = (string) => {
  // memoize缓存函数结果
  const result = [];
  // 处理开头的点号
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('');
  }
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match;
    if (quote) {
      key = subString.replace(reEscapeChar, '$1'); // $1 获取第一个匹配分组
    } else if (expression) {
      key = expression.trim();
    }
    result.push(key);
  });
  return result;
};

export default stringToPath;
