# VeriLab redesign validation

Verified on 2026-11-09 in Chrome on macOS, served from the existing repository with Python's HTTP server on port 8090. These are executed checks, not a list of assumed capabilities.

## Engine checks

`node tests/engine-smoke.mjs` passed before and after the redesign. The harness executes the page's real orchestration functions against the shipped WASM binaries:

- AND gate console output and VCD truth table in Verilog-2005, 2009, and SystemVerilog-2012.
- Gate-level, dataflow, and behavioral half adders; shift register; counter; full adder using an included supporting source.
- All eight full-adder truth-table combinations.
- Shared preprocessor macros and `$readmemb` memory-file input.
- A simulation that produces no VCD.
- Invalid Verilog produces a real compiler failure.

Compared the before/after source: `ivlConf`, `preprocessAll`, `compile`, `simulate`, `parseVCD`, and the Yosys command scripts remain unchanged. The original JS/WASM engine files, ELK/netlistsvg bundles, and LICENSE have no changes. Waveform modifications are presentation tokens and a top-level signal selection shortcut; the original transition/value computation and zoom/pan math remain.

## Browser checks

| Check | Observed result |
|---|---|
| Starter action and Run Simulation | The real AND example produces 00→0, 01→0, 10→0, 11→1; finishes at 40 ns. |
| Console and errors | Real compiler filename/line diagnostics appear; status becomes Failed for invalid syntax. |
| Waveform selection | Individual top-level and internal DUT signals can be selected and deselected. Testbench signals selects only the shallowest scope. |
| Cursor | Around 35 ns, the AND gate shows a=1, b=1, y=1. |
| Zoom/pan/Fit view | Scroll narrows the time window; drag moves it; Fit view restores 0–40 ns. |
| Synthesis | AND design renders Gates: 1×AND and RTL: 1×and. Gates → RTL → Gates succeeds. |
| Synthesis failure | Invalid source produces the actual Yosys syntax error; terminal escape formatting is stripped in the UI. |
| Source editing | Editing the design reaches the real compiler; cursor line/column footer updates. |
| Local file import | Saved design.v and testbench.v were reopened through Chrome's native file picker and simulated successfully. The extension's automated chooser required an unavailable file-URL permission; no browser setting was changed. |
| URL import | Loaded tests/fixtures/and-design.v and and-testbench.v through Load / share. Filenames and source reached both editors and compiled correctly. |
| Exports | Downloaded each editor, project ZIP, and VCD. ZIP integrity and exact source contents checked from disk. Archive contains both sources, run.sh, run.bat, and dump.vcd. |
| Downloaded VCD | Parsed the actual browser download and checked all four input/output combinations and the final 40 ns timestamp. |
| Supporting files | Full-adder example loaded; supporting source opened in the right pane while the testbench remained in the model; simulation ran with the include. |
| Keyboard | Command+Enter runs a simulation; result-tab ArrowRight selects Waveform; separator ArrowUp resizes results. |
| Guide/About | Both dialogs open and close; Escape closes the guide; credits identify upstream engine/viewer and original UI contributions. |
| Typography | Browser reports all three local font families loaded. |
| Browser console | No application JavaScript errors observed. Extension-origin warnings were unrelated to VeriLab. |

## Visual checks

Screenshots inspected at **1440×900**, **1366×768**, and **1280×800**. Each had matching viewport/document dimensions with no page overflow. Run remained visible, editors stayed side by side, and the three AND traces plus time ruler fit in the results area. At **390×844**, editors stacked and document width remained 390 px; source panes retain their own horizontal scrolling for long code lines. Native editor scrolling is expected when a source is longer than its pane.

## Limits and repeatable checks

- Tested Chrome/macOS; Safari, Firefox, touch gestures, and screen-reader workflows were not exercised.
- No production GitHub Pages deployment was performed. Static relative asset paths were retained and checked locally.
- Core fonts, CodeMirror, and simulation assets are local. A disconnected-browser session was not tested. YoWASP/Yosys still needs its existing CDN on first use; remote file URLs require network access and CORS.
- File sharing and renamed-file behavior were verified during the preceding interface task. The sharing encoding/decoding and filename-role model are retained; clipboard-share round trips were not repeated in this redesign pass.
- Simulation still runs on the browser's main thread, as upstream; a non-terminating testbench can block the page. Use a bounded testbench with `$finish`.

Repeat the regression suite with `node tests/engine-smoke.mjs`. For a manual import test, use the two `.v` files in `tests/fixtures/`. Follow the README quick start for waveform truth-table checks.

## Focused polish pass — 2026-11-10

Executed: all 11 engine smoke checks pass, application module passes `node --check`, and `git diff --check` passes. New PNG downloads, new layout, and missing-testbench UI have not yet been exercised in a browser in this pass.

Manual acceptance steps:
1. Hard reload. Check toolbar alignment and the four-step guide at laptop and mobile widths.
2. Load AND, simulate, select a/b/y in Waveform, and Download PNG. Open the image: names, traces, ruler, colors should match the viewport. Zoom, pan, place a cursor, export again, and compare. PNG is 2× the visible viewer dimensions; offscreen rows are intentionally excluded.
3. Synthesize AND in Gates, download PNG, then switch to RTL and repeat. Pan/zoom and verify exports reflect the displayed viewport on white. Try export before generating graphics: a helpful message should appear.
4. Clear Testbench and Run. Expect “Testbench needed” and guidance in Console, no stale waveform/download, and an enabled Run button. Repeat with only comments. Load AND again and verify successful simulation.
5. Check the new V/circuit logo and favicon after refreshing the browser cache.

## VL branding correction — 2026-11-10

All 11 WASM smoke checks passed. Chrome DOM measurements at 1920×1080, 1440×900, 1366×768, 1280×800, 1024×768, 768×900, and 390×844 showed no horizontal page overflow; all toolbar controls measured 44px high and stayed inside the viewport. Screenshots of mobile layout and desktop Quick Guide were inspected. Actual AND simulation produced the four expected combinations and ended at 40ns; signal selection rendered real waveforms. Browser computed UI typography is Poppins. Favicon URL is versioned to invalidate the prior icon cache. Browser-tab chrome favicon appearance is not independently verified by the page screenshot.
