/**
 * hostTheme — the host shell's colour tokens, translated into L'Archipel's own
 * variable names before they land on <html>.
 *
 * The two palettes share some names with DIFFERENT meanings, and an inline
 * token beats index.css, so passing the host's set through untouched would
 * repaint the app wrong: L'Archipel's `--bg-surface` is the opaque colour of
 * its cards and side panels, the host's is a 4% wash meant to sit on a panel.
 * Taken as is, every card would turn see-through.
 *
 * @module utils/hostTheme
 */

/** Host names this app must never take: same name, another job here. */
const NOT_OURS = ['--bg-surface', '--bg-surface-hover'];

/**
 * The tokens to write on <html>: the host's set minus the names that mean
 * something else here, plus this app's own names fed from the host's
 * equivalents. Keys that do not start with `--` are dropped.
 */
export function archipelTokens(host: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(host)) {
    if (key.startsWith('--') && !NOT_OURS.includes(key)) out[key] = value;
  }
  // The page ground, the card colour and the frosted header follow the host's
  // ground and panel; the accent follows the host's one accent.
  if (host['--bg-void']) out['--bg-deep'] = host['--bg-void'];
  if (host['--bg-panel']) {
    out['--bg-surface'] = host['--bg-panel'];
    out['--bg-surface-glass'] = `color-mix(in srgb, ${host['--bg-panel']} 85%, transparent)`;
  }
  if (host['--accent']) out['--accent-teal'] = host['--accent'];
  return out;
}
