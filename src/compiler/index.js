const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名 <xxxx 匹配到的是开始 标签的名字

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配的是</xxxx> 最终匹配到的分组就是结束标签的名字
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 第一个分组就是属性的 key，value 就是分组3/分组4/分组5
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
// console.log(attribute);
function parseHTML(html) {
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  const stack = []; // 用于存放元素的
  let currentParent; // 指向的是栈中的最后一个
  let root;
  // 最终需要转化成一颗抽象语法树
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    };
  }

  // 利用栈形结构 来构造一棵树
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs); // 创造一个 ast 节点
    if (!root) {
      // 看下是否为空树
      root = node; // 如果为空则当前是树的根节点
    }
    if (currentParent) {
      node.parent = currentParent; // 只赋予了 parent 属性
      currentParent.children.push(node);
    }
    stack.push(node);
    currentParent = node; // currentParent 为栈中的最后一个
    // console.log(tag, attrs, "开始");
  }
  function chars(text) {
    text = text.replace(/\s/g, ""); // 如果空格超过两个以上 则删除2个以上的
    // 文本直接放到当前指向的节点中
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      });
    // console.log(text, "文本");
  }
  function end(tag) {
    let node = stack.pop(); // 弹出最后一个
    currentParent = stack[stack.length - 1];
    // console.log(tag, "结束");
  }

  function advance(n) {
    html = html.substring(n);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    // console.log(start); // ['<div', 'div', index: 0, input: '<div id="app">\n  ...... ]
    if (start) {
      const match = {
        tagName: start[1], // 标签名
        attrs: [],
      };
      advance(start[0].length);
      // console.log(html);

      // 如果不是开始标签的结束 就一直匹配下去
      let attr, end;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // console.log(attr);
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        });
      }
      if (end) {
        advance(end[0].length); // 移除 >
      }
      //   console.log(match);
      return match;
    }
    return false;
  }
  // html 最开始肯定是一个 div
  while (html) {
    // 如果 textEnd 为 0 说明是一个开始标签或者结束标签
    // 如果 textEnd > 0 说明就是文本的结束位置
    let textEnd = html.indexOf("<"); // 如果 indexOf 中的索引是 0 则说明是个标签
    if (textEnd == 0) {
      const startTagMatch = parseStartTag(); // 开始标签的匹配结果
      if (startTagMatch) {
        // 解析到的开始标签
        // console.log(html);
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd); // 文本内容
      if (text) {
        chars(text);
        advance(text.length);
        // console.log(html);
      }
    }
  }
  console.log(root);
}

// 对模板进行编译
export function compileToFunction(template) {
  // 1. 将 template 转换成 ast 语法树
  // 2. 生成 render 方法 ( render 方法执行后的放回的结果就是 虚拟 DOM)
  console.log(template);
  parseHTML(template);
}
