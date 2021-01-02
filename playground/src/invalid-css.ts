import { iswmcs } from "./helpers/shared/lang";
import { toString } from "./helpers/shared/string";

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
const _rulesInUse = [];

function escapeSelector(
  $$1: string,
  exceptChars: string[] = [],
): string {
  const algo = (str: string) => {
    const characters = SPECIAL_CHARS.split("")
      .filter((w) => !exceptChars.includes(w))
      .map((w) => `\\${w}`)
      .join("");
    const CHARS_TO_ESCAPE = new RegExp(`[${characters}]`, "g");
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

  // @ts-expect-error
  const rules = style?.matchAll(
    /(\/\*[\s\S]*?\*\/|[^}{;\/]+\{[^{}]*\}|;|}|[^}{;\*]+\{)/gm,
  );

  for (let [rule] of rules) {
    rule = rule.trim();

    if (rule.indexOf("/*") === 0) continue;

    const [, body] = rule.split(/[{}]/);
    const selectors = rule.match(/^\..*/mg)
      .map((w: string) => w.trim().replace(/\s*\{/, ""));

    for (let selector of selectors) {
      const [id, params] = selector.split(":param");
      const types = params.split(/[^\w]/).filter(Boolean);
      const state = [];

      const _selector = id.replace(/[:](focus|hover)$/, (_, $1) => {
        state.push($1);
        return "";
      });

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
  document.head.appendChild($styleElement);
}

const manageBody = (types: string[], body: string) => {
  const replaceParam = (_, $1) => {
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
    $el = document.querySelector($el);
  }

  $el.querySelectorAll("*")
    .forEach(($el) => {
      createObserver($el);
      applyStyle($el.classList);
    });
}

const createObserver = ($el) => {
  const observer = new MutationObserver((entries) => {
    const [$firstEntry] = entries;
    applyStyle((<any> $firstEntry.target).classList);
  });

  observer.observe($el, {
    attributeFilter: ["class"],
    attributes: true,
  });
};

const applyStyle = (classList: DOMTokenList) => {
  const _test = (className, rule) => {
    const $$1 = escapeSelector(className, [".", "%"]);
    const $$2 = rule.selector.slice(1);
    const userData = $$1.split(testRegexify($$2)).filter(Boolean);

    const fakeElement = document.createElement("div");

    const data = [];
    for (let i = 0; i < rule.types.length; i++) {
      const type = rule.types[i];
      const value = userData[i];

      let temp;
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
    $styleElement!.textContent += "\n" + stylesheet;
  };

  const _buildStyle = (className, rule) => {
    for (let i = 0; i < rule[1].length; i++) {
      _test(className, rule[1][i]);
    }
  };

  if (classList.length === 0) {
    return;
  }

  for (let i = 0; i < classList.length; i++) {
    const className = classList[i];
    if (className.length === 1) continue;

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
