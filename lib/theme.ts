/**
 * Dark mode is BUILT but DEACTIVATED.
 *
 * The whole implementation is intact — the `.dark` token block in
 * app/globals.css, ThemeScript, ThemeToggle, and every `dark:` variant
 * across the components. Nothing was deleted. Flipping this one constant
 * back to `true` re-enables all of it: the no-flash script starts emitting
 * again and the toggle reappears in the navbar.
 *
 * Turned off deliberately: a professional studio site doesn't need a theme
 * switcher, and the dark palette needed more design attention than it was
 * getting (the footer band in particular). Light-only is the shipping state.
 */
export const DARK_MODE_ENABLED = false;
