/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Source: https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/utils/url.ts
 */

const SUPPORTED_URL_PROTOCOLS = new Set([
  "http:",
  "https:",
  "mailto:",
  "sms:",
  "tel:",
]);

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return "about:blank";
    }
  } catch {
    return url;
  }
  return url;
}

const PROTOCOL = "[A-Za-z]{3,9}:(?:\\/\\/)?"; // http://, https://, ftp:, mailto:, etc.
const AUTH = "(?:[-;:&=+$,\\w]+@)?"; // optional user:pass@
// Host must start with alphanumeric, can contain hyphens/dots in middle, must have valid structure
const HOST =
  "[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*";
const WWW_OR_AUTH = "(?:www\\.|[-;:&=+$,\\w]+@)"; // www. prefix or user@
const PATH = "(?:\\/[+~%\\/.\\w_-]*)?"; // /path/to/resource
const QUERY = "\\??(?:[-+=&;%@.\\w_]*)"; // ?query=string
const FRAGMENT = "#?(?:[\\w]*)"; // #anchor

// Full URL pattern: (protocol + auth? + host) OR (www/auth + host), followed by path/query/fragment
const urlRegExp = new RegExp(
  `((${PROTOCOL}${AUTH}${HOST}|${WWW_OR_AUTH}${HOST})(${PATH}${QUERY}${FRAGMENT})?)`,
);

export function validateUrl(url: string): boolean {
  return url === "https://" || urlRegExp.test(url);
}
