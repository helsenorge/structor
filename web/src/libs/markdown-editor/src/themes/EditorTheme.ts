/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./EditorTheme.css";

import type { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  blockCursor: "EditorTheme__blockCursor",
  characterLimit: "EditorTheme__characterLimit",
  code: "EditorTheme__code",
  codeHighlight: {
    atrule: "EditorTheme__tokenAttr",
    attr: "EditorTheme__tokenAttr",
    boolean: "EditorTheme__tokenProperty",
    builtin: "EditorTheme__tokenSelector",
    cdata: "EditorTheme__tokenComment",
    char: "EditorTheme__tokenSelector",
    class: "EditorTheme__tokenFunction",
    "class-name": "EditorTheme__tokenFunction",
    comment: "EditorTheme__tokenComment",
    constant: "EditorTheme__tokenProperty",
    deleted: "EditorTheme__tokenProperty",
    doctype: "EditorTheme__tokenComment",
    entity: "EditorTheme__tokenOperator",
    function: "EditorTheme__tokenFunction",
    important: "EditorTheme__tokenVariable",
    inserted: "EditorTheme__tokenSelector",
    keyword: "EditorTheme__tokenAttr",
    namespace: "EditorTheme__tokenVariable",
    number: "EditorTheme__tokenProperty",
    operator: "EditorTheme__tokenOperator",
    prolog: "EditorTheme__tokenComment",
    property: "EditorTheme__tokenProperty",
    punctuation: "EditorTheme__tokenPunctuation",
    regex: "EditorTheme__tokenVariable",
    selector: "EditorTheme__tokenSelector",
    string: "EditorTheme__tokenSelector",
    symbol: "EditorTheme__tokenProperty",
    tag: "EditorTheme__tokenProperty",
    url: "EditorTheme__tokenOperator",
    variable: "EditorTheme__tokenVariable",
  },
  embedBlock: {
    base: "EditorTheme__embedBlock",
    focus: "EditorTheme__embedBlockFocus",
  },
  hashtag: "EditorTheme__hashtag",
  heading: {
    h1: "EditorTheme__h1",
    h2: "EditorTheme__h2",
    h3: "EditorTheme__h3",
    h4: "EditorTheme__h4",
    h5: "EditorTheme__h5",
    h6: "EditorTheme__h6",
  },
  image: "editor-image",
  indent: "EditorTheme__indent",
  inlineImage: "inline-editor-image",
  layoutContainer: "EditorTheme__layoutContaner",
  layoutItem: "EditorTheme__layoutItem",
  link: "EditorTheme__link",
  list: {
    listitem: "EditorTheme__listItem",
    listitemChecked: "EditorTheme__listItemChecked",
    listitemUnchecked: "EditorTheme__listItemUnchecked",
    nested: {
      listitem: "EditorTheme__nestedListItem",
    },
    olDepth: [
      "EditorTheme__ol1",
      "EditorTheme__ol2",
      "EditorTheme__ol3",
      "EditorTheme__ol4",
      "EditorTheme__ol5",
    ],
    ul: "EditorTheme__ul",
  },
  ltr: "EditorTheme__ltr",
  mark: "EditorTheme__mark",
  markOverlap: "EditorTheme__markOverlap",
  paragraph: "EditorTheme__paragraph",
  quote: "EditorTheme__quote",
  rtl: "EditorTheme__rtl",
  table: "EditorTheme__table",
  tableAddColumns: "EditorTheme__tableAddColumns",
  tableAddRows: "EditorTheme__tableAddRows",
  tableCell: "EditorTheme__tableCell",
  tableCellActionButton: "EditorTheme__tableCellActionButton",
  tableCellActionButtonContainer: "EditorTheme__tableCellActionButtonContainer",
  tableCellEditing: "EditorTheme__tableCellEditing",
  tableCellHeader: "EditorTheme__tableCellHeader",
  tableCellPrimarySelected: "EditorTheme__tableCellPrimarySelected",
  tableCellResizer: "EditorTheme__tableCellResizer",
  tableCellSelected: "EditorTheme__tableCellSelected",
  tableCellSortedIndicator: "EditorTheme__tableCellSortedIndicator",
  tableResizeRuler: "EditorTheme__tableCellResizeRuler",
  tableSelected: "EditorTheme__tableSelected",
  tableSelection: "EditorTheme__tableSelection",
  text: {
    bold: "EditorTheme__textBold",
    code: "EditorTheme__textCode",
    italic: "EditorTheme__textItalic",
    strikethrough: "EditorTheme__textStrikethrough",
    subscript: "EditorTheme__textSubscript",
    superscript: "EditorTheme__textSuperscript",
    underline: "EditorTheme__textUnderline",
    underlineStrikethrough: "EditorTheme__textUnderlineStrikethrough",
  },
};

export default theme;
