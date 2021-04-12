import { iswmcs } from "./helpers/shared/lang.ts";
import { Option, Some } from "./helpers/shared/option.ts";
import { Err, Ok, Result } from "./helpers/shared/result.ts";
import { escapeCharacters, toString } from "./helpers/shared/string.ts";

import {
  higherOrderFunction,
  higherOrderFunctionReverse,
} from "./helpers/shared/utils.ts";

interface InvalidCSSState {
  $style: HTMLStyleElement;
  initialized: boolean;
  options: Partial<InvalidCSSFetchOptions & InvalidCSSSetStyleOptions>;
}

const RULE_REGEXP = /(\/\*[\s\S]*?\*\/|[^}{;\/]+\{[^{}]*\}|;|}|[^}{;\*]+\{)/gm;
const RULE_STATE = /[:]([\w]+)$/;

const FULL_TYPES_SUPPORT: InvalidCSSType[] = [
  "color",
  "length",
  "number",
  "percentage",
  "percent",
];

const cacheRules = new Map<string, InvalidCSSParser[]>();
const rulesInUse = new Set<string>();
const stateConfig: Partial<InvalidCSSState> = {
  initialized: false,
  options: { children: true },
};

const isComment = (rule: string) => rule.startsWith("/*");
const isValidSelectorStart = (rule: string) => rule.startsWith(".");
const isValidSelectorEnd = (rule: string) => rule.endsWith(")");

const isValidNodeTypeForScript = (node: NodeElement) =>
  ![Node.COMMENT_NODE, Node.TEXT_NODE].includes(node.nodeType);

const isValidType = (type: string) => FULL_TYPES_SUPPORT.includes(<any> type);

function parseInvalidCSS(raw: string) {
  const rules = raw?.matchAll(RULE_REGEXP);

  for (let [rule] of rules) {
    rule = rule.trim();

    if (isComment(rule)) continue;

    const { selectors, body: [body, bodyParser] } = getMetadataRule(rule);

    for (const selector of selectors) {
      const { key, inject, state, types } = getMetadataSelector(selector);

      const payload: InvalidCSSParser = {
        key,

        state,
        types,

        inject: {
          selector: inject,
          body: bodyParser(types),
        },

        meta: {
          rule,
          selector,
          body,
        },
      };

      let cachedRule = cacheRules.get(key);
      if (!cachedRule) {
        cacheRules.set(key, [payload]);
      } else {
        cacheRules.set(key, [...cachedRule, payload]);
      }
    }
  }
}

function parseBody(body: string, types: string[]) {
  const replaceVariableParam = (_: string, $1: string) => {
    const idx = types.findIndex(($types: string) => $types.includes($1));
    if (idx < 0) return _;
    return "${data[" + idx + "]}";
  };

  const temp = body.split(/\n/)
    .map((w) => w.trim()).filter(Boolean)
    .map((w) => w.replaceAll(/param\(([^)]+)\)/g, replaceVariableParam))
    .join(" ").replaceAll("`", "\\`");

  return "`" + temp + "`";
}

function getMetadataRule(rule: string) {
  const [selector_str, body_str] = rule.split(/[{}]/);

  const mapSelector = (selector: string) => selector.trim();

  const reduceSelector = (
    selectors: string[],
    current: string,
  ) => {
    const isValidSelector = (rule: string) =>
      isValidSelectorStart(rule) &&
      isValidSelectorEnd(rule);

    if (isValidSelector(current) || isValidSelectorStart(current)) {
      return [...selectors, current];
    }

    let lastSelector = selectors[selectors.length - 1];
    if (lastSelector) {
      if (isValidSelectorStart(lastSelector) && isValidSelectorEnd(current)) {
        return [
          ...selectors.slice(0, -1),
          lastSelector + "," + current,
        ];
      } else {
        return [...selectors, current];
      }
    }

    return selectors;
  };

  const selectors = selector_str
    .split(",")
    .map(mapSelector)
    .reduce(reduceSelector, []);

  return {
    selectors,
    body: [
      body_str,
      higherOrderFunction(parseBody)(body_str),
    ],
  };
}

function getMetadataSelector(selector: string) {
  const [key_str, types_str] = selector.split(":param");

  const reduceType = (types: string[], current: string) => {
    let lastType = types[types.length - 1];

    if (
      lastType
    ) {
      if (
        !lastType.endsWith("|") && current === "|" ||
        lastType.endsWith("|") && current !== "|"
      ) {
        return [
          ...types.slice(0, -1),
          lastType + current,
        ];
      }
    }

    return [...types, current];
  };

  const mapType = (type: string) => {
    return type.split("|").filter(isValidType);
  };

  const types = types_str?.split(/[^\w|]/)
    .filter(Boolean)
    .reduce(reduceType, [])
    .map(mapType);

  const state = key_str.match(RULE_STATE) || [];

  let key = key_str.replace(RULE_STATE, "");

  let args = 0;
  let inject = key
    .replaceAll("*", (_) => "${es_s(data[" + args++ + "])}")
    .replaceAll("`", "\\`");

  return {
    key: key.replace(/^\.|\\/g, ""),
    inject: "`" + inject + "`",
    state: Some(state[1]),
    types: types || [],
  };
}

function createObserver($el_to_observe: NodeElement) {
  const { $style, options } = stateConfig;

  const mutation = function (entries: MutationRecord[]) {
    const iter = (entry: MutationRecord) => {
      if (entry.addedNodes.length > 0) {
        const setStyle$ = higherOrderFunctionReverse(setStyle)($style)(options);
        entry.addedNodes.forEach(setStyle$);
        return;
      }

      applyStyle(entry.target as Element);
    };

    entries.forEach(iter);
  };

  const observer = new MutationObserver(mutation);

  observer.observe($el_to_observe as Node, {
    attributeFilter: ["class"],
    attributes: true,
    childList: options?.children ?? true,
  });
}

function applyStyle($on_el: NodeElement) {
  const { $style, options } = stateConfig;

  const for_ruletype = (
    userData: string[],
    types: InvalidCSSType[],
    idx: number,
  ) => {
    let value: any = userData[idx] || "";

    if (types.length !== 1) { // todo:
      return;
    }

    let [type] = types;

    let temp: string | number;
    let $fake = document.createElement("div");

    switch (type) {
      case "color":
        temp = escapeSelector(value);
        $fake.style.color = temp;
        if ($fake.style.color) {
          value = $fake.style.color;
        } else {
          value = undefined;
        }
        break;

      case "length":
        temp = escapeSelector(value);
        $fake.style.fontSize = temp;
        if ($fake.style.fontSize) {
          value = $fake.style.fontSize;
        } else {
          value = undefined;
        }
        break;

      case "number":
        temp = Number(value);
        if (!isNaN(temp)) {
          if (value.startsWith(".")) {
            value = "." + value.slice(1);
          } else {
            value = temp;
          }
        } else {
          value = undefined;
        }
        break;

      case "percent":
      case "percentage":
        temp = escapeSelector(value, ["%"]);
        $fake.style.fontSize = temp;
        if ($fake.style.fontSize) {
          value = $fake.style.fontSize;
        } else {
          value = undefined;
        }
        break;

      default:
        console.warn(type);
        value = escapeSelector(value);
        break;
    }

    return value;
  };

  const for_rule = (className: string, rule: InvalidCSSParser) => {
    if (rulesInUse.has(className)) return;

    const mediaQueries = options!?.mq!;

    let kClassName = className;
    let useMQ: any = [""];

    if (mediaQueries) {
      const mediaQueriesKeys = Object.keys(mediaQueries);
      const mediaQueriesArr = [
        ...mediaQueriesKeys,
        ...mediaQueriesKeys.map((w) => w + "*"),
        ...mediaQueriesKeys.map((w) => "*" + w),
      ];
      const [mq] = className.split(/^([^:]+)/).filter(Boolean);
      if (mediaQueriesArr.includes(mq)) {
        kClassName = kClassName.replace(mq + ":", "");

        const mq$ = mq.replace("*", "");

        useMQ = ["MQ_SELECTOR:", {
          minW_maxW: escapeSelector(mq$),
          minW: escapeSelector(mq$ + "*"),
          maxW: escapeSelector("*" + mq$),
        }, mediaQueries[mq.replace("*", "")]];
      }
    }

    if (!iswmcs(kClassName, rule.key)) {
      return;
    }

    rulesInUse.add(className);

    let userData = kClassName.split(testRegexify(rule.key)).filter(Boolean);

    const data = rule.types
      .map(higherOrderFunction(for_ruletype)(userData))
      .filter(Boolean);

    if (data.length === 0) return;
    if (userData.length > data.length) return;

    const injectSelector = new Function(
      "data",
      "es_s",
      `return ${rule.inject.selector.replace(/^`\./, "`." + useMQ[0])}`,
    );

    const injectBody = new Function(
      "data",
      `return ${rule.inject.body}`,
    );
    const selectorState = rule.state.unwrap_or("");

    const selector = escapeSelector(injectSelector(data, escapeSelector), [
      ".",
      "\\",
    ]);
    const body = injectBody(data);

    let stylesheet = `${selector}${selectorState} { ${body} }`;

    if (useMQ.length > 1) {
      const mqSelectors = useMQ[1];
      const [min, max] = useMQ[2];

      stylesheet = `
      @media (min-width:${min}) and (max-width:${max}) {
        ${stylesheet.replace(".MQ_SELECTOR", "." + mqSelectors.minW_maxW)}
      }
      @media (min-width:${max}) {
        ${stylesheet.replace(".MQ_SELECTOR", "." + mqSelectors.minW)}
      }
      @media (max-width:${max}) {
        ${stylesheet.replace(".MQ_SELECTOR", "." + mqSelectors.maxW)}
      }
      `;
    }

    if ($style!.textContent!.indexOf(stylesheet) >= 0) {
      return;
    }

    $style!.textContent += "\n" + stylesheet;
  };

  const for_rules = (className: string, rules: InvalidCSSParser[]) => {
    rules.forEach(higherOrderFunction(for_rule)(className));
  };

  const for_class = (
    rules: Map<string, InvalidCSSParser[]>,
    class_str: string,
  ) => {
    if (class_str.length === 1) return;
    rules.forEach(higherOrderFunction(for_rules)(class_str));
  };

  const sortedRules = new Map(
    [...cacheRules].sort(([a], [b]) =>
      b.length - a.length || a.localeCompare(b)
    ),
  );

  const { classList } = $on_el as Element;
  classList.forEach(higherOrderFunction(for_class)(sortedRules));
}

function escapeSelector(
  $$1: string,
  exceptChars: string[] = [],
): string {
  const SPECIAL_CHARS = `!"#$%&'()*+./:;<=>?@[\\]^\`{|}~`;

  const algo = (str: string) => {
    const escapedCharacters = escapeCharacters(
      SPECIAL_CHARS,
      "\\",
      exceptChars,
    );
    const CHARS_TO_ESCAPE = new RegExp(`[${escapedCharacters}]`, "g");
    const CHECK_CHARS = new RegExp(CHARS_TO_ESCAPE.source, "g");
    return CHECK_CHARS.test(str) ? str.replace(CHARS_TO_ESCAPE, "\\$&") : str;
  };

  return algo(toString($$1));
}

function testRegexify(str: string) {
  return new RegExp(
    toString(str)
      .replace(/\\/g, "\\\\")
      .replace(/\*/g, "(.*)")
      .replace(/\?/g, "(.)"),
  );
}

function get_element_from_dom(domEl: Element): Result<Element, Error> {
  try {
    // @ts-expect-error
    return Ok(domEl || voluntary_error);
  } catch {
    // @ts-expect-error
    return Err(new Error(`élément inexistant`));
  }
}

function get_element_from_str(selector: string): Result<Element, Error> {
  try {
    // @ts-expect-error
    return Ok(document.querySelector(selector) || voluntary_error);
  } catch {
    // @ts-expect-error
    return Err(
      new Error(`le sélecteur "${selector}" ne semble exister dans le DOM`),
    );
  }
}

function get_element(
  $observe_el: NodeElement | string,
): Result<Element, Error> {
  const $el = (typeof $observe_el === "string")
    ? get_element_from_str($observe_el as string)
    : get_element_from_dom($observe_el as Element);

  if ($el.is_err()) {
    throw $el.err().unwrap();
  }

  return $el;
}

/**
 * Le code ci-bas contient des éléments exportables,
 * ceux-ci peuvent s'utiliser en dehors de ce fichier.
 */

export type InvalidCSSType =
  | "color"
  | "length"
  | "number"
  | "percentage"
  | "percent";

export interface InvalidCSSParser {
  key: string;

  meta: { // les données ne sont pas altérées
    rule: string;
    selector: string;
    body: string;
  };

  inject: { // les données sont altérées
    selector: string;
    body: string;
  };

  state: Option<string>;
  types: string[][];
}

export interface InvalidCSSFetchOptions {
  mq: { [p: string]: [string, string] };
}

export interface InvalidCSSSetStyleOptions {
  children: boolean;
}

export async function fetchCSS(url: string, options: InvalidCSSFetchOptions) {
  const HTTP_STATUS_CODE_OK = 200;

  const response = await fetch(url, { method: "GET" });

  stateConfig.options = {
    ...stateConfig.options,
    ...options,
  };

  parseInvalidCSS(await response.text());

  return response.status === HTTP_STATUS_CODE_OK;
}

export function prepareDOM($el_where: Element, href: string) {
  let $styleElement = document.createElement("style");
  $styleElement.id = "custom-css";
  $styleElement.dataset.href = href;

  $el_where.appendChild($styleElement);

  return $styleElement;
}

type NodeElement = Node | Element;

export function setStyle(
  $observe_el: NodeElement | string,
  $style: HTMLStyleElement,
  options: Partial<InvalidCSSSetStyleOptions>,
) {
  $observe_el = get_element($observe_el).unwrap() as NodeElement;
  //!           ^^^^^^^^^^^ can throw an error

  if (!isValidNodeTypeForScript($observe_el)) {
    return;
  }

  if (!stateConfig.initialized) {
    stateConfig.initialized = true;
    stateConfig.options = {
      ...stateConfig.options,
      ...options,
    };
    stateConfig.$style = $style;
  }

  let $elements = [$observe_el];
  if (stateConfig.options?.children) {
    $elements = [
      ...$elements,
      ...Array.from((<Element> $observe_el).querySelectorAll("*")),
    ];
  }

  $elements.forEach(applyStyle);
  $elements.forEach(createObserver);
}
