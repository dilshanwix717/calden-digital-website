/* @ds-bundle: {"format":4,"namespace":"CaldenDigitalDesignSystem_fe8b3f","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"ProcessStep","sourcePath":"components/cards/ProcessStep.jsx"},{"name":"ProjectCard","sourcePath":"components/cards/ProjectCard.jsx"},{"name":"ServiceCard","sourcePath":"components/cards/ServiceCard.jsx"},{"name":"FIELD_CSS","sourcePath":"components/forms/Field.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"db4136148b60","components/cards/ProcessStep.jsx":"9235171e57ad","components/cards/ProjectCard.jsx":"f701f11fcabd","components/cards/ServiceCard.jsx":"1648843bb3ef","components/cards/cardsBase.js":"f32a5106eac1","components/forms/Field.jsx":"3da9ff7cf60f","components/forms/Input.jsx":"055106971783","components/forms/Select.jsx":"4191481da289","components/forms/Textarea.jsx":"1b8ab2f0fb9d","components/navigation/Footer.jsx":"258ef6b54891","components/navigation/Navbar.jsx":"c73f692d7aa1","ui_kits/website/Home.jsx":"3fa44fda9a61","ui_kits/website/Screens.jsx":"6fb639bad78e"},"inlinedExternals":[],"unexposedExports":[{"name":"ensureCardCSS","sourcePath":"components/cards/cardsBase.js"}]} */

(() => {

const __ds_ns = (window.CaldenDigitalDesignSystem_fe8b3f = window.CaldenDigitalDesignSystem_fe8b3f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cd-btn{
  --_bg: var(--teal); --_fg: var(--warm-card); --_bd: transparent;
  display:inline-flex; align-items:center; justify-content:center; gap:var(--space-2);
  font-family:var(--font-sans); font-weight:var(--fw-semibold); letter-spacing:-0.01em;
  line-height:1; text-decoration:none; cursor:pointer; white-space:nowrap;
  border:var(--border-width) solid var(--_bd); border-radius:var(--radius-sm);
  background:var(--_bg); color:var(--_fg);
  transition: background var(--dur) var(--ease-standard), color var(--dur) var(--ease-standard),
              border-color var(--dur) var(--ease-standard), opacity var(--dur) var(--ease-standard);
}
.cd-btn--md{ font-size:15px; padding:12px 22px; }
.cd-btn--sm{ font-size:13px; padding:8px 16px; }
.cd-btn--lg{ font-size:17px; padding:16px 30px; }

.cd-btn--primary{ --_bg:var(--teal); --_fg:var(--warm-card); --_bd:var(--teal); }
.cd-btn--primary:hover{ --_bg:#0C4A4A; --_bd:#0C4A4A; }
.cd-btn--primary:active{ --_bg:#0A3E3E; --_bd:#0A3E3E; }

.cd-btn--secondary{ --_bg:transparent; --_fg:var(--teal); --_bd:var(--teal); }
.cd-btn--secondary:hover{ --_bg:rgba(15,92,92,0.07); }
.cd-btn--secondary:active{ --_bg:rgba(15,92,92,0.13); }

.cd-btn--text{ --_bg:transparent; --_fg:var(--teal); --_bd:transparent; padding-left:6px; padding-right:6px; border-radius:var(--radius-xs); }
.cd-btn--text:hover{ --_fg:var(--link-hover); text-decoration:underline; text-underline-offset:3px; }

.cd-btn:focus-visible{ outline:var(--border-width-strong) solid var(--focus-ring); outline-offset:3px; }
.cd-btn[disabled], .cd-btn[aria-disabled="true"]{ opacity:0.4; pointer-events:none; }
`;
if (typeof document !== 'undefined' && !document.getElementById('cd-button-css')) {
  const s = document.createElement('style');
  s.id = 'cd-button-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
  variant = 'primary',
  size = 'md',
  as,
  href,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  const cls = `cd-btn cd-btn--${variant} cd-btn--${size} ${className}`.trim();
  const Tag = as || (href ? 'a' : 'button');
  const extra = Tag === 'a' ? {
    href,
    'aria-disabled': disabled || undefined
  } : {
    disabled,
    type: rest.type || 'button'
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, extra, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/cardsBase.js
try { (() => {
// Shared flat-card styling for the Calden card family. Injected once.
const CSS = `
.cd-card{
  font-family:var(--font-sans); background:var(--surface-card);
  border:var(--border-width) solid var(--border-subtle); border-radius:var(--radius-md);
  box-sizing:border-box; transition: border-color var(--dur) var(--ease-standard);
}
.cd-project{ overflow:hidden; display:flex; flex-direction:column; }
a.cd-project{ text-decoration:none; color:inherit; }
a.cd-project:hover{ border-color:var(--border-strong); }
a.cd-project:hover .cd-project__title{ color:var(--teal); }
.cd-project__media{ aspect-ratio:4/3; background:var(--surface-sunken); border-bottom:var(--border-width) solid var(--border-subtle); overflow:hidden; }
.cd-project__media img{ width:100%; height:100%; object-fit:cover; display:block; }
.cd-project__body{ padding:var(--space-5); display:flex; flex-direction:column; gap:var(--space-3); }
.cd-project__tags{ display:flex; flex-wrap:wrap; gap:var(--space-2); }
.cd-tag{ font-size:12px; letter-spacing:0.04em; text-transform:uppercase; font-weight:var(--fw-medium); color:var(--text-subtle); background:var(--surface-sunken); border-radius:var(--radius-full); padding:4px 10px; }
.cd-project__title{ font-size:22px; font-weight:var(--fw-semibold); letter-spacing:-0.015em; color:var(--text-primary); margin:0; transition:color var(--dur) var(--ease-standard); }
.cd-project__summary{ font-size:15px; line-height:1.6; color:var(--text-muted); margin:0; }
.cd-service{ padding:var(--space-6); display:flex; flex-direction:column; gap:var(--space-4); }
.cd-service__top{ display:flex; align-items:center; gap:var(--space-3); }
.cd-service__idx{ font-size:13px; font-weight:var(--fw-semibold); letter-spacing:0.06em; color:var(--teal); }
.cd-service__rule{ height:1px; flex:1; background:var(--border-subtle); }
.cd-service__title{ font-size:21px; font-weight:var(--fw-semibold); letter-spacing:-0.01em; color:var(--text-primary); margin:0; }
.cd-service__desc{ font-size:15px; line-height:1.62; color:var(--text-muted); margin:0; max-width:46ch; }
.cd-service__link{ margin-top:auto; font-size:14px; font-weight:var(--fw-semibold); color:var(--teal); text-decoration:none; display:inline-flex; align-items:center; gap:6px; }
.cd-service__link:hover{ gap:10px; color:var(--link-hover); }
.cd-step{ padding:var(--space-5); display:grid; grid-template-columns:auto 1fr; gap:var(--space-4); align-items:start; }
.cd-step__num{ width:44px; height:44px; flex:none; display:grid; place-items:center; border-radius:var(--radius-full); border:var(--border-width-strong) solid var(--teal); color:var(--teal); font-weight:var(--fw-semibold); font-size:17px; }
.cd-step__body{ display:flex; flex-direction:column; gap:var(--space-2); }
.cd-step__title{ font-size:19px; font-weight:var(--fw-semibold); letter-spacing:-0.01em; color:var(--text-primary); margin:0; }
.cd-step__desc{ font-size:15px; line-height:1.6; color:var(--text-muted); margin:0; }
`;
function ensureCardCSS() {
  if (typeof document !== 'undefined' && !document.getElementById('cd-card-css')) {
    const s = document.createElement('style');
    s.id = 'cd-card-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}
Object.assign(__ds_scope, { ensureCardCSS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/cardsBase.js", error: String((e && e.message) || e) }); }

// components/cards/ProcessStep.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.ensureCardCSS();
function ProcessStep({
  step,
  title,
  description,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `cd-card cd-step ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "cd-step__num"
  }, step), /*#__PURE__*/React.createElement("div", {
    className: "cd-step__body"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "cd-step__title"
  }, title), description && /*#__PURE__*/React.createElement("p", {
    className: "cd-step__desc"
  }, description)));
}
Object.assign(__ds_scope, { ProcessStep });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProcessStep.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProjectCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.ensureCardCSS();
function ProjectCard({
  image,
  alt = '',
  tags = [],
  title,
  summary,
  href,
  className = '',
  ...rest
}) {
  const Tag = href ? 'a' : 'div';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `cd-card cd-project ${className}`.trim(),
    href: href
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "cd-project__media"
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: alt
  })), /*#__PURE__*/React.createElement("div", {
    className: "cd-project__body"
  }, tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "cd-project__tags"
  }, tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "cd-tag"
  }, t))), /*#__PURE__*/React.createElement("h3", {
    className: "cd-project__title"
  }, title), summary && /*#__PURE__*/React.createElement("p", {
    className: "cd-project__summary"
  }, summary)));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ServiceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.ensureCardCSS();
function ServiceCard({
  index,
  title,
  description,
  linkLabel,
  href,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `cd-card cd-service ${className}`.trim()
  }, rest), index != null && /*#__PURE__*/React.createElement("div", {
    className: "cd-service__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cd-service__idx"
  }, index), /*#__PURE__*/React.createElement("span", {
    className: "cd-service__rule"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "cd-service__title"
  }, title), description && /*#__PURE__*/React.createElement("p", {
    className: "cd-service__desc"
  }, description), linkLabel && /*#__PURE__*/React.createElement("a", {
    className: "cd-service__link",
    href: href || '#'
  }, linkLabel, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192")));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
const FIELD_CSS = `
.cd-field{ display:flex; flex-direction:column; gap:var(--space-2); font-family:var(--font-sans); }
.cd-field__label{ font-size:14px; font-weight:var(--fw-medium); color:var(--text-body); letter-spacing:-0.005em; }
.cd-field__req{ color:var(--teal); margin-left:2px; }
.cd-field__hint{ font-size:13px; color:var(--text-subtle); line-height:1.4; }
.cd-field__error{ font-size:13px; color:var(--danger); line-height:1.4; }
.cd-control{
  font-family:var(--font-sans); font-size:16px; color:var(--text-body); line-height:1.5;
  background:var(--surface-card); border:var(--border-width) solid var(--border-default);
  border-radius:var(--radius-sm); padding:11px 14px; width:100%; box-sizing:border-box;
  transition: border-color var(--dur) var(--ease-standard), background var(--dur) var(--ease-standard);
  -webkit-appearance:none; appearance:none;
}
.cd-control::placeholder{ color:var(--grey-400); }
.cd-control:hover{ border-color:var(--border-strong); }
.cd-control:focus{ outline:none; border-color:var(--teal); box-shadow:0 0 0 3px rgba(15,92,92,0.14); }
.cd-control[disabled]{ background:var(--surface-sunken); color:var(--text-subtle); cursor:not-allowed; }
.cd-control--invalid{ border-color:var(--danger); }
.cd-control--invalid:focus{ box-shadow:0 0 0 3px rgba(166,67,47,0.14); }
textarea.cd-control{ resize:vertical; min-height:120px; }
.cd-select-wrap{ position:relative; }
.cd-select-wrap select.cd-control{ padding-right:40px; cursor:pointer; }
.cd-select-wrap__chev{ position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none; color:var(--grey-500); }
`;
if (typeof document !== 'undefined' && !document.getElementById('cd-field-css')) {
  const s = document.createElement('style');
  s.id = 'cd-field-css';
  s.textContent = FIELD_CSS;
  document.head.appendChild(s);
}
function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "cd-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "cd-field__label",
    htmlFor: htmlFor
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "cd-field__req"
  }, "*")), children, error ? /*#__PURE__*/React.createElement("span", {
    className: "cd-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "cd-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { FIELD_CSS, Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let uid = 0;
function Input({
  label,
  hint,
  error,
  required,
  id,
  className = '',
  ...rest
}) {
  const fid = id || `cd-input-${++uid}`;
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    htmlFor: fid,
    required: required,
    hint: hint,
    error: error
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: `cd-control ${error ? 'cd-control--invalid' : ''} ${className}`.trim(),
    "aria-invalid": !!error || undefined
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let uid = 0;
function Select({
  label,
  hint,
  error,
  required,
  id,
  options = [],
  placeholder,
  children,
  className = '',
  ...rest
}) {
  const fid = id || `cd-select-${++uid}`;
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    htmlFor: fid,
    required: required,
    hint: hint,
    error: error
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: `cd-control ${error ? 'cd-control--invalid' : ''} ${className}`.trim(),
    "aria-invalid": !!error || undefined,
    defaultValue: placeholder ? '' : undefined
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  }), children), /*#__PURE__*/React.createElement("svg", {
    className: "cd-select-wrap__chev",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6l4 4 4-4",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let uid = 0;
function Textarea({
  label,
  hint,
  error,
  required,
  id,
  rows = 4,
  className = '',
  ...rest
}) {
  const fid = id || `cd-textarea-${++uid}`;
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    htmlFor: fid,
    required: required,
    hint: hint,
    error: error
  }, /*#__PURE__*/React.createElement("textarea", _extends({
    id: fid,
    rows: rows,
    className: `cd-control ${error ? 'cd-control--invalid' : ''} ${className}`.trim(),
    "aria-invalid": !!error || undefined
  }, rest)));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cd-footer{ font-family:var(--font-sans); background:var(--surface-dark); color:var(--text-on-dark); }
.cd-footer__inner{ max-width:var(--container-max); margin:0 auto; padding:var(--space-9) var(--section-x) var(--space-7); }
.cd-footer__top{ display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:var(--space-7); }
.cd-footer__wordmark{ display:flex; align-items:baseline; gap:8px; margin-bottom:var(--space-4); text-decoration:none; }
.cd-footer__wordmark b{ font-weight:var(--fw-semibold); font-size:24px; letter-spacing:-0.02em; color:var(--ink-on-dark); }
.cd-footer__wordmark span{ font-size:11px; letter-spacing:0.24em; text-transform:uppercase; color:var(--gold); align-self:center; }
.cd-footer__tagline{ font-size:16px; line-height:1.6; color:rgba(237,239,238,0.72); max-width:34ch; margin:0; }
.cd-footer__col h4{ font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:var(--gold); font-weight:var(--fw-semibold); margin:0 0 var(--space-4); }
.cd-footer__col ul{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--space-3); }
.cd-footer__col a{ font-size:15px; color:rgba(237,239,238,0.82); text-decoration:none; transition:color var(--dur) var(--ease-standard); }
.cd-footer__col a:hover{ color:var(--text-on-dark); }
.cd-footer__bottom{ margin-top:var(--space-8); padding-top:var(--space-5); border-top:var(--border-width) solid var(--border-on-dark); display:flex; justify-content:space-between; align-items:center; gap:var(--space-4); flex-wrap:wrap; }
.cd-footer__copy{ font-size:13px; color:rgba(237,239,238,0.55); margin:0; }
.cd-footer__loc{ font-size:13px; color:rgba(237,239,238,0.55); margin:0; }
@media (max-width:820px){
  .cd-footer__top{ grid-template-columns:1fr 1fr; gap:var(--space-6); }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('cd-footer-css')) {
  const s = document.createElement('style');
  s.id = 'cd-footer-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
const DEFAULT_COLS = [{
  title: 'Studio',
  links: ['Work', 'Services', 'Process', 'About']
}, {
  title: 'Services',
  links: ['Websites', 'Software', 'Design', 'Add-ons']
}, {
  title: 'Contact',
  links: ['Start a project', 'hello@calden.digital', 'Colombo, Sri Lanka']
}];
function Footer({
  tagline = 'Building the digital foundation for modern businesses.',
  columns = DEFAULT_COLS,
  copyright = `© ${new Date().getFullYear()} Calden Digital`,
  location = 'A software studio in Sri Lanka',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    className: `cd-footer ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "cd-footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-footer__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-footer__brandmark"
  }, /*#__PURE__*/React.createElement("a", {
    className: "cd-footer__wordmark",
    href: "#",
    "aria-label": "Calden Digital"
  }, /*#__PURE__*/React.createElement("b", null, "Calden"), /*#__PURE__*/React.createElement("span", null, "Digital")), /*#__PURE__*/React.createElement("p", {
    className: "cd-footer__tagline"
  }, tagline)), columns.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title,
    className: "cd-footer__col"
  }, /*#__PURE__*/React.createElement("h4", null, c.title), /*#__PURE__*/React.createElement("ul", null, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    className: "cd-footer__bottom"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cd-footer__copy"
  }, copyright), /*#__PURE__*/React.createElement("p", {
    className: "cd-footer__loc"
  }, location))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cd-nav{ font-family:var(--font-sans); background:var(--surface-page); border-bottom:var(--border-width) solid var(--border-subtle); }
.cd-nav__inner{ max-width:var(--container-max); margin:0 auto; padding:0 var(--section-x); height:76px; display:flex; align-items:center; gap:var(--space-6); }
.cd-nav__brand{ display:flex; align-items:center; flex:none; }
.cd-nav__brand img{ height:34px; width:auto; display:block; }
.cd-nav__links{ display:flex; align-items:center; gap:var(--space-6); margin-left:var(--space-4); }
.cd-nav__link{ font-size:15px; font-weight:var(--fw-medium); color:var(--text-body); text-decoration:none; letter-spacing:-0.005em; padding:6px 0; position:relative; transition:color var(--dur) var(--ease-standard); }
.cd-nav__link:hover{ color:var(--teal); }
.cd-nav__link[aria-current="page"]{ color:var(--teal); }
.cd-nav__link[aria-current="page"]::after{ content:""; position:absolute; left:0; right:0; bottom:-2px; height:2px; background:var(--teal); }
.cd-nav__spacer{ flex:1; }
.cd-nav__cta{ display:flex; align-items:center; gap:var(--space-3); }
@media (max-width:820px){
  .cd-nav__links{ display:none; }
  .cd-nav__inner{ padding:0 var(--section-x); }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('cd-nav-css')) {
  const s = document.createElement('style');
  s.id = 'cd-nav-css';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Navbar({
  logoSrc = '../../assets/calden-digital-horizontal.svg',
  links = [{
    label: 'Work',
    href: '#'
  }, {
    label: 'Services',
    href: '#'
  }, {
    label: 'Process',
    href: '#'
  }, {
    label: 'About',
    href: '#'
  }],
  current,
  ctaLabel = 'Start a project',
  ctaHref = '#',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: `cd-nav ${className}`.trim()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "cd-nav__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "cd-nav__brand",
    href: "#",
    "aria-label": "Calden Digital home"
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Calden Digital"
  })), /*#__PURE__*/React.createElement("div", {
    className: "cd-nav__links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    className: "cd-nav__link",
    href: l.href,
    "aria-current": current === l.label ? 'page' : undefined
  }, l.label))), /*#__PURE__*/React.createElement("span", {
    className: "cd-nav__spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cd-nav__cta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "text",
    size: "sm",
    href: "#"
  }, "Log in"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    href: ctaHref
  }, ctaLabel))));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Calden Digital — marketing site UI kit. Shared bits + Home screen.
const {
  Navbar,
  Footer,
  Button,
  ProjectCard,
  ServiceCard,
  ProcessStep
} = window.CaldenDigitalDesignSystem_fe8b3f;
const ASSET = '../../assets';
const LOGO = ASSET + '/calden-digital-horizontal.svg';
const MARK = ASSET + '/calden-mark.svg';
const container = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 var(--section-x)'
};
const eyebrow = {
  fontSize: 12,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  fontWeight: 600,
  color: 'var(--teal)',
  margin: 0
};
function Section({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'var(--section-y) 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: container
  }, children));
}
function Hero({
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...container,
      padding: '84px var(--section-x) 88px',
      display: 'grid',
      gridTemplateColumns: '1.15fr 0.85fr',
      gap: 'var(--space-8)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Software studio \xB7 Sri Lanka"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-display)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--tr-display)',
      fontWeight: 600,
      margin: '20px 0 0',
      color: 'var(--ink)',
      maxWidth: '15ch'
    }
  }, "Modernising businesses through design and technology"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-body-lg)',
      lineHeight: 'var(--lh-body-lg)',
      color: 'var(--text-muted)',
      margin: '24px 0 0',
      maxWidth: '52ch'
    }
  }, "We plan, design and build custom websites and software \u2014 the digital foundation a growing business can rely on."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => go('contact')
  }, "Start a project"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: () => go('work')
  }, "See our work"))), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/5',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: MARK,
    alt: "",
    style: {
      width: 132,
      height: 'auto',
      opacity: 0.9
    }
  }))));
}
const SERVICES = [{
  index: '01',
  title: 'Websites',
  description: 'Marketing sites that are planned, not just decorated — clear structure, fast, easy to run.',
  linkLabel: 'What\u2019s included'
}, {
  index: '02',
  title: 'Custom software',
  description: 'Web applications and internal tools built around how your business actually works.',
  linkLabel: 'How we build'
}, {
  index: '03',
  title: 'Design',
  description: 'Interface and brand design grounded in real content and real users.',
  linkLabel: 'Our approach'
}, {
  index: '04',
  title: 'Add-ons',
  description: 'Photography, social and marketing that attach to the core development work.',
  linkLabel: 'Explore add-ons'
}];
const PROCESS = [{
  step: '1',
  title: 'Plan',
  description: 'We map goals, scope and structure before a pixel is drawn.'
}, {
  step: '2',
  title: 'Design',
  description: 'Interfaces designed for clarity and tested against real content.'
}, {
  step: '3',
  title: 'Build',
  description: 'Reliable, maintainable code — shipped in clear, reviewable stages.'
}, {
  step: '4',
  title: 'Support',
  description: 'We stay on to measure, refine and keep things running.'
}];
const WORK = [{
  tags: ['Website', 'Web app'],
  title: 'Aurora Freight',
  summary: 'A logistics portal rebuilt from the ground up.'
}, {
  tags: ['Website'],
  title: 'Marind Tea',
  summary: 'A quiet, editorial storefront for a Ceylon tea house.'
}, {
  tags: ['Software'],
  title: 'Ledger Clinic',
  summary: 'Scheduling and records for a growing practice.'
}];
function Home({
  go
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    go: go
  }), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "What we do"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      lineHeight: 'var(--lh-h2)',
      letterSpacing: 'var(--tr-h2)',
      fontWeight: 600,
      margin: '12px 0 var(--space-7)',
      color: 'var(--ink)',
      maxWidth: '20ch'
    }
  }, "Web and software work leads. Everything else supports it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-4)'
    }
  }, SERVICES.map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.index
  }, s))))), /*#__PURE__*/React.createElement(Section, {
    style: {
      background: 'var(--surface-card)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 'var(--space-7)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "Selected work"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      lineHeight: 'var(--lh-h2)',
      letterSpacing: 'var(--tr-h2)',
      fontWeight: 600,
      margin: '12px 0 0',
      color: 'var(--ink)'
    }
  }, "Recent projects")), /*#__PURE__*/React.createElement(Button, {
    variant: "text",
    onClick: () => go('work')
  }, "View all \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-5)'
    }
  }, WORK.map(w => /*#__PURE__*/React.createElement(ProjectCard, _extends({
    key: w.title
  }, w, {
    onClick: () => go('work'),
    href: "#"
  }))))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("p", {
    style: eyebrow
  }, "How we work"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      lineHeight: 'var(--lh-h2)',
      letterSpacing: 'var(--tr-h2)',
      fontWeight: 600,
      margin: '12px 0 var(--space-7)',
      color: 'var(--ink)'
    }
  }, "A studio that plans before it builds"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-4)'
    }
  }, PROCESS.map(p => /*#__PURE__*/React.createElement(ProcessStep, _extends({
    key: p.step
  }, p))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-teal)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...container,
      padding: 'var(--space-9) var(--section-x)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h1)',
      lineHeight: 'var(--lh-h1)',
      letterSpacing: 'var(--tr-h1)',
      fontWeight: 600,
      margin: 0,
      color: 'var(--warm-card)',
      maxWidth: '18ch',
      marginInline: 'auto'
    }
  }, "Building the digital foundation for modern businesses"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('contact'),
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: 17,
      padding: '16px 30px',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      background: 'var(--gold)',
      color: 'var(--ink)',
      cursor: 'pointer'
    }
  }, "Start a project")))));
}
Object.assign(window, {
  Section,
  container,
  eyebrow,
  ASSET,
  LOGO,
  MARK,
  Home,
  WORK,
  SERVICES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Screens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Calden Digital — Work index + Contact screens.
const {
  Button,
  ProjectCard,
  Input,
  Select,
  Textarea
} = window.CaldenDigitalDesignSystem_fe8b3f;
const ALL_WORK = [{
  tags: ['Website', 'Web app'],
  title: 'Aurora Freight',
  summary: 'A logistics portal rebuilt from the ground up.'
}, {
  tags: ['Website'],
  title: 'Marind Tea',
  summary: 'A quiet, editorial storefront for a Ceylon tea house.'
}, {
  tags: ['Software'],
  title: 'Ledger Clinic',
  summary: 'Scheduling and records for a growing practice.'
}, {
  tags: ['Website', 'Design'],
  title: 'Harbour & Co',
  summary: 'A practical site for a Colombo law firm.'
}, {
  tags: ['Web app'],
  title: 'Fieldnote',
  summary: 'An inspection tool for site engineers.'
}, {
  tags: ['Design'],
  title: 'Senkada',
  summary: 'Brand and identity for a furniture maker.'
}];
function Work({
  go
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...window.container,
      padding: '72px var(--section-x)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: window.eyebrow
  }, "Our work"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)',
      lineHeight: 'var(--lh-h1)',
      letterSpacing: 'var(--tr-h1)',
      fontWeight: 600,
      margin: '14px 0 0',
      color: 'var(--ink)',
      maxWidth: '20ch'
    }
  }, "Projects planned, designed and built in-house"))), /*#__PURE__*/React.createElement(window.Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-5)'
    }
  }, ALL_WORK.map(w => /*#__PURE__*/React.createElement(ProjectCard, _extends({
    key: w.title
  }, w, {
    href: "#"
  }))))));
}
function Contact({
  go
}) {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement(window.Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 'var(--space-9)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: window.eyebrow
  }, "Start a project"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)',
      lineHeight: 'var(--lh-h1)',
      letterSpacing: 'var(--tr-h1)',
      fontWeight: 600,
      margin: '14px 0 0',
      color: 'var(--ink)'
    }
  }, "Tell us what you\\u2019re planning"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-body)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-muted)',
      margin: '20px 0 0',
      maxWidth: '42ch'
    }
  }, "Send a few lines about the work. We reply within two business days, from Colombo."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: window.eyebrow
  }, "Email"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17,
      color: 'var(--ink)'
    }
  }, "hello@calden.digital"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-7)'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--fs-h3)',
      fontWeight: 600,
      color: 'var(--ink)',
      margin: 0
    }
  }, "Thanks \u2014 message received."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      margin: '12px 0 24px'
    }
  }, "We\\u2019ll be in touch shortly."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setSent(false)
  }, "Send another")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full name",
    placeholder: "Ada Lovelace",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "you@company.com",
    required: true
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Project type",
    placeholder: "Choose one",
    options: ['Website', 'Web application', 'Design & branding', 'Something else']
  }), /*#__PURE__*/React.createElement(Textarea, {
    label: "About the project",
    rows: 4,
    hint: "A sentence or two is plenty to start."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    type: "submit"
  }, "Send message"))))));
}
Object.assign(window, {
  Work,
  Contact,
  ALL_WORK
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ProcessStep = __ds_scope.ProcessStep;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.FIELD_CSS = __ds_scope.FIELD_CSS;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Navbar = __ds_scope.Navbar;

})();
