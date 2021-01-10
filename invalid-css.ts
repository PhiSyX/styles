import type { ARRAY, OBJECT } from "./helpers/shared/types.ts";
import { iswmcs } from "./helpers/shared/lang.ts";
import { escapeCharacters, toString } from "./helpers/shared/string.ts";

function testRegexify(str: string) {
  return new RegExp(
    toString(str)
      .replace(/\\/g, "\\\\")
      .replace(/\*/g, "(.*)")
      .replace(/\?/g, "(.)"),
  );
}

interface RulesStylesheet {
  types: string[];
  selector: string;
  body: string;
  rule: string;
  state: string[];
}

const SPECIAL_CHARS = `!"#$%&'()*+./:;<=>?@[\\]^\`{|}~`;

const _rules = new Map<string, RulesStylesheet[]>();
const _rulesInUse: string[] = [];

const customMediaQueries: OBJECT<ARRAY<string>> = {
  ".xs\\:@media (min-width:1px) and (max-width:321px)": [],
  ".xs\\*\\:@media (min-width:321px)": [],
  ".\\*xs\\:@media (max-width:321px)": [],
  ".sm\\:@media (min-width:321px) and (max-width:376px)": [],
  ".sm\\*\\:@media (min-width:376px)": [],
  ".\\*sm\\:@media (max-width:376px)": [],
  ".md\\:@media (min-width:376px) and (max-width:426px)": [],
  ".md\\*\\:@media (min-width:426px)": [],
  ".\\*md\\:@media (max-width:426px)": [],
  ".lg\\:@media (min-width:426px) and (max-width:769px)": [],
  ".lg\\*\\:@media (min-width:769px)": [],
  ".\\*lg\\:@media (max-width:769px)": [],
  ".xl\\:@media (min-width:769px) and (max-width:1025px)": [],
  ".xl\\*\\:@media (min-width:1025px)": [],
  ".\\*xl\\:@media (max-width:1025px)": [],
  ".xxl\\:@media (min-width:1025px) and (max-width:1441px)": [],
  ".xxl\\*\\:@media (min-width:1441px)": [],
  ".\\*xxl\\:@media (max-width:1441px)": [],
  ".s4K\\:@media (min-width:1441px) and (max-width:2561px)": [],
  ".s4K\\*\\:@media (min-width:2561px)": [],
  ".\\*s4K\\:@media (max-width:2561px)": [],
};

function escapeSelector(
  $$1: string,
  exceptChars: string[] = [],
): string {
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

export async function loadStyle(url: string) {
  const response = await fetch(url, {
    method: "GET",
  });

  const style = await response.text();

  const rules = style?.matchAll(
    /(\/\*[\s\S]*?\*\/|[^}{;\/]+\{[^{}]*\}|;|}|[^}{;\*]+\{)/gm,
  );

  for (let [rule] of rules) {
    rule = rule.trim();

    if (rule.indexOf("/*") === 0) continue;

    const [, body] = rule.split(/[{}]/);
    const selectors = rule.match(/^\..*/mg)
      ?.map((w: string) => w.trim().replace(/\s*\{/, "")) || [];

    for (let selector of selectors) {
      const [id, params] = selector.split(":param");
      const types = params.split(/[^\w]/).filter(Boolean);
      const state: any[] = [];

      const _selector = id.replace(
        /[:](focus|hover)$/, // TODO: améliorer cette partie
        (_: string, $1: string) => {
          state.push($1);
          return "";
        },
      );

      const payload = {
        selector: _selector,
        types,
        body: manageBody(types, body),
        rule,
        state,
      };

      let _rule = _rules.get(_selector);
      if (!_rule) {
        _rules.set(_selector, [payload]);
      } else {
        _rules.set(_selector, [..._rule, payload]);
      }

      _rule = _rules.get(_selector);
    }
  }

  const $styleElement = document.createElement("style");
  $styleElement.id = "custom-css";
  $styleElement.dataset.src = url;
  const $styleMQElement = document.createElement("style");
  $styleMQElement.id = "mq-custom-css";
  $styleMQElement.dataset.src = url;
  document.head.appendChild($styleElement);
  document.head.appendChild($styleMQElement);
}

const manageBody = (types: string[], body: string) => {
  const replaceParam = (_: string, $1: string) => {
    const index = types.findIndex((type: string) => type === $1);
    if (index < 0) return _;
    return "${data[" + index + "]}";
  };

  return "`" + body.split(/\n/)
    .map((w) => w.trim()).filter(Boolean)
    .map((w) => w.replace(/param\(([^)]+)\)/g, replaceParam))
    .join(" ")
    .replace(/`/g, "\\`") +
    "`";
};

export function setStyle($el: string | Element) {
  if (typeof $el === "string") {
    const selector = $el;
    $el = document.querySelector(selector) as Element;
    if (!$el) throw new Error("Le sélecteur " + selector + " est introuvable.");
  }

  (<Element> $el).querySelectorAll("*")
    .forEach(($el) => {
      createObserver($el);
      applyStyle($el.classList);
    });
}

const createObserver = ($el: HTMLElement | Node) => {
  const observer = new MutationObserver(function (entries) {
    const [$firstEntry] = entries;

    if ($firstEntry.addedNodes.length > 0) {
      $firstEntry.addedNodes.forEach((el) => {
        setStyle(<HTMLElement> el);
      });
      return;
    }

    applyStyle((<HTMLElement> $firstEntry.target).classList);
  });

  observer.observe($el, {
    attributeFilter: ["class"],
    attributes: true,
    childList: true,
  });
};

const applyStyle = (classList: DOMTokenList) => {
  const _test = (className: string, rule: RulesStylesheet) => {
    const $$1 = escapeSelector(className, [".", "%"]);
    const $$2 = rule.selector.slice(1);
    const userData = $$1.split(testRegexify($$2)).filter(Boolean);

    const fakeElement = document.createElement("div");

    const data = [];
    for (let i = 0; i < rule.types.length; i++) {
      const type = rule.types[i];
      const value = userData[i];

      let temp: string | number;
      switch (type) {
        case "color":
          temp = escapeSelector(value);
          fakeElement.style.color = temp;
          if (fakeElement.style.color) {
            data.push(temp);
          }
          break;
        case "number":
          if (value.startsWith(".")) {
            temp = "." + parseInt(value.slice(1), 10);
          } else {
            temp = parseInt(value, 10);
          }

          data.push(temp);
          break;
        case "length":
          temp = escapeSelector(value);
          fakeElement.style.fontSize = temp;
          if (fakeElement.style.fontSize) {
            data.push(temp);
          }
          break;
        case "percentage":
          temp = escapeSelector(value, ["%"]);
          fakeElement.style.fontSize = temp;
          if (fakeElement.style.fontSize) {
            data.push(temp);
          }
          break;
        default:
          console.warn(type);
      }
    }

    if (data.length === 0) return;

    // Dans le cas où deux types sont obligatoires
    // mais que un ou plusieurs valeurs sont mauvaises:
    if (userData.length > data.length) return;

    const injectData = new Function("data", `return ${rule.body}`);

    let stylesheet = [
      ".",
      escapeSelector(className),
      rule.state.length ? ":" + (rule.state.join(":")) : "",
      "{",
      injectData(data),
      "}",
    ].join("");

    const $styleElement = document.querySelector("#custom-css");
    if ($styleElement!.textContent!.indexOf(stylesheet) >= 0) {
      return;
    }

    const $styleMQElement = document.querySelector("#mq-custom-css");

    $styleElement!.textContent += "\n" + stylesheet;

    const stylesheetForMQ = stylesheet.slice(1);

    const stylesheetForMQMapper = Object.keys(customMediaQueries).map((_mq) => {
      const values = customMediaQueries[_mq];
      const [mqrule, ...rules] = _mq.split(/(@)/);

      const rule = mqrule + stylesheetForMQ;
      if (!values.includes(rule)) {
        customMediaQueries[_mq].push(mqrule + stylesheetForMQ);
      }

      let stylesheetMQ = [
        rules.join(""),
        "{",
        customMediaQueries[_mq].join("\n"),
        "}",
      ];

      return stylesheetMQ.join("\n");
    });

    $styleMQElement!.textContent = "\n" + stylesheetForMQMapper.join("\n");
  };

  const _buildStyle = (
    className: string,
    rule: [string, RulesStylesheet[]],
  ) => {
    for (let i = 0; i < rule[1].length; i++) {
      _test(className, rule[1][i]);
    }
  };

  if (classList.length === 0) {
    return;
  }

  for (let i = 0; i < classList.length; i++) {
    let className = classList[i];
    if (className.length === 1) continue;

    className = className.replace(/^\*?(xs|sm|md|lg|xxl|xl|s4K)\*?:/, "");

    if (_rulesInUse.includes(className)) {
      continue;
    }

    for (const rule of _rules) {
      if (iswmcs("." + className, rule[0])) {
        _rulesInUse.push(className);
        _buildStyle(className, rule);
        break;
      }
    }
  }
};
