# Bundled assets and attribution

VeriLab is derived from [VeriSim by senolgulgonul](https://github.com/senolgulgonul/verisim). The existing project [GPL license](../LICENSE), upstream source references, and notices remain in place. See the [README](../README.md#license--attribution) for the Icarus Verilog source reference and engine licensing information.

## Typography

The following variable fonts are bundled locally, without modification, as Latin WOFF2 subsets from Fontsource packages version **5.3.0**:

- Space Grotesk — [upstream](https://github.com/floriankarsten/space-grotesk), [SIL Open Font License](fonts/space-grotesk-OFL.txt).
- Inter — [upstream](https://github.com/rsms/inter), [SIL Open Font License](fonts/inter-OFL.txt).
- JetBrains Mono — [upstream](https://github.com/JetBrains/JetBrainsMono), [SIL Open Font License](fonts/jetbrains-mono-OFL.txt).

Downloaded from the npm registry packages `@fontsource-variable/space-grotesk`, `@fontsource-variable/inter`, and `@fontsource-variable/jetbrains-mono`. The font licenses retain their original copyright notices. Non-Latin characters use system fallbacks.

## Editor

CodeMirror **5.65.16** is the same version used by the original page, now self-hosted in `vendor/codemirror/` for reliable offline editing. `codemirror.js`, `codemirror.css`, and `verilog.js` are unmodified package files. [MIT license and copyright](../vendor/codemirror/LICENSE). [Upstream source](https://github.com/codemirror/codemirror5).

## Existing technical assets

- Icarus Verilog / VVP / ivlpp: GPL-2.0-or-later; existing JS wrappers and WASM binaries are unchanged.
- Yosys: ISC; loaded using the existing YoWASP integration.
- netlistsvg: MIT; existing local bundle is unchanged.
- Eclipse Layout Kernel (ELK): EPL-2.0; existing local bundle is unchanged.

## Original VeriLab design

`verilab-symbol.svg` and `favicon.svg` are original vector assets for this redesign, using a stepped V / digital waveform construction. The interface styling, layout, dark CodeMirror theme, and these SVG assets follow the repository's existing license. They do not imply authorship of the reused simulation or synthesis engines.

Poppins 500/600/700/800 Latin WOFF2 files are from `@fontsource/poppins` 5.2.7 (npm), under the bundled `fonts/poppins-OFL.txt`. The active VL monogram is an original font-independent SVG path drawing; it replaces the previous circuit mark.
