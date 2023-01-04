import htm from 'htm';

const _taggedFn = (tags, ...values) => {
  return tags
    .map((tag, index) => {
      return `${tag}${values[index] || ""}`;
    })
    .join("");
};

const css = _taggedFn


function h(type, props, ...children) {
  return { type, props, children };
}

const html = htm.bind(h);

export { html, css }