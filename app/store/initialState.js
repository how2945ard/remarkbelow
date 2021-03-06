import React from 'react';
import { EditorState, ContentState, CompositeDecorator } from 'draft-js';
import { List, Repeat, Range } from 'immutable';
const Prism = require('../utils/prism.js');
import styles from '../utils/prism.css';
import classNames from 'classnames';
import regex from '../utils/regex';

var _ = require('lodash')

const defaultContent = ContentState.createFromText(
`# Heading
=======
## Sub-heading
-----------
### Another deeper heading

Paragraphs are separated
by a blank line.

Two spaces at the end of a line leave a
line break.

Text attributes _italic_, *italic*, __bold__, **bold**, \`monospace\`, ~~strike~~.

Horizontal rule:

---

Bullet list:

  * apples
  * oranges
  * pears
    * apples
    * oranges
    * pears

Numbered list:

  1. apples
    1. apples
    2. oranges
    3. pears
  2. oranges
  3. pears

| Tables        | Are           | Cool  |
|---------------|:-------------:|-------|
| col 3 is      |    r-l        | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

> ar en resnksndf sdpofmopsdmf
sdlknksdnkf
> wofnosidn oi
> oejfosf

> ijewnef
> kneinfie

reist

> sfosdnf
>wnfoefm


A [link](http://example.com).`
);

const findWithRegex = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  while ((matchArr = reg.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};
const findWithTableRegex = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  while ((matchArr = reg.exec(text)) !== null) {
    start = matchArr.index;
    matchArr = matchArr[0].split('|')
    matchArr= _.compact(matchArr)
    let offset = 0;
    matchArr.forEach((match)=>{
      if(text[offset]==='|'){
        offset+=1
      }
      let end = offset + match.length 
      end = end < 0 ? 0: end 
      callback(offset, end);
      offset = end
    })
  }
};

const InlineComponent = props => (
  <span {...props} className={classNames(styles.token, styles[props.type])}>
    {props.children}
  </span>
);

const inlineDecorator = [
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.strong, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'bold' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.italic, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'italic' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.strike, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'strike' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.blockquote, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'matched' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.list, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'matched' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithTableRegex(regex.inline.table, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'matched'}
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.code, contentBlock, callback),
    component: props => (
      <code {...props} className="language-">
        {props.children}
      </code>
    ),
    props: { type: 'code' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.link, contentBlock, callback),
    component: props => (
      <a href={props.href} target="_blank">
        {props.children}
      </a>
    ),
    props: {
      type: 'link',
      href: '#'
    }
  },
];

const blockDecorator = [
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.block.heading, contentBlock, callback),
    component: props => React.createElement(
      `h${props.level}`,
      { ...props },
      props.children
    ),
    props: {
      type: 'code'
    }
  }
];

const regexDecorator = new CompositeDecorator([
  ...inlineDecorator,
]);

export default {
  editor: {
    editorState: EditorState.createWithContent(defaultContent, regexDecorator),
  },
};
