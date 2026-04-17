/**
 *
 * Based on the original PlaygroundEditorTheme.ts file made under:
 *
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
  heading: {
    h2: "EditorTheme__h2",
    h3: "EditorTheme__h3",
    h4: "EditorTheme__h4",
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
  text: {
    bold: "EditorTheme__textBold",
    italic: "EditorTheme__textItalic",
    underline: "EditorTheme__textUnderline",
  },
};

export default theme;
