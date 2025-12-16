/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from "react";
import "./ContentEditable.css";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";

export default function LexicalContentEditable({
  className,
  id,
}: {
  className?: string;
  id?: string;
}): JSX.Element {
  return (
    <ContentEditable className={className || "ContentEditable__root"} id={id} />
  );
}
