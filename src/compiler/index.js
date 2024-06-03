import { parseHTML } from "./parse";

function genProps(attrs) {
  let str = ""; // {name, value}
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === "style") {
      // color: red = {color: 'red'}
      let obj = {};
      attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        obj[key.trim()] = value.trim();
      });

      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
    console.log(str);
  }
  return `{${str.slice(0, -1)}}`;
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function gen(node) {
  if (node.type === 1) {
    return codegen(node);
  } else {
    let text = node.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      // _v(_s(name) + 'hello' + _s(name))
      let tokens = [];
      let match;
      // 注意： 这里要处理只匹配第一个 {{}} 的问题
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index; // 匹配位置
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }

      // 判断最后还有没有纯文本没有推入
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      console.log(tokens);
    }
    return "xxx";
  }
}

function genChildren(children) {
  return children.map((child) => gen(child)).join(",");
}

function codegen(ast) {
  console.log(ast.children);
  let children = genChildren(ast.children);
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? genProps(ast.attrs) : "null"
  }${ast.children.length > 0 ? `,${children}` : ""})`;

  return code;
}

// 对模板进行编译
export function compileToFunction(template) {
  // 1. 将 template 转换成 ast 语法树
  let ast = parseHTML(template);

  // 2. 生成 render 方法 ( render 方法执行后的放回的结果就是 虚拟 DOM)
  // render(h){
  //     return h('div',{id: 'app'},h('div',{style:{color:'red'}}, _v(_s(name) +'hello'),_c('span',undefined,_v(_s(age)))))
  // }

  let code = codegen(ast);
  // 模板引擎的实现原理就是 with + new Function
  code = `with(this){return ${code}};`;
  let render = new Function(code); // 根据代码生成 render 函数

  return render;
}
