const inline = {
  strong: /__([\s\S]+?)__(?!_)|\*\*([\s\S]+?)\*\*(?!\*)/g,
  italic: /\b_((?:[^_]|__)+?)_\b|\*((?:\*\*|[\s\S])+?)\*(?!\*)/g,
  code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/g,
  strike: /~~(?=\S)([\s\S]*?\S)~~/g,
  link: /!?\[(inside)\]\(href\)/g,
  _inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/g,
  _href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/g,
  blockquote: /^>(?:[\t ]*>)*/g,
  list:/(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/mg,
  table: /[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?\r?\n?/g
};

inline.link = new RegExp(
  inline.link.source
    .replace('inside', inline._inside.source)
    .replace('href', inline._href.source)
, 'g');

export default {
  inline
};
