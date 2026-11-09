// Run the actual app's orchestration and VCD parser against the shipped WASM.
// No browser, package install, or mocked simulation data required: node tests/engine-smoke.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import initIvlpp from '../ivlpp.js';
import initIvl from '../ivl.js';
import initVvp from '../vvp.js';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const section = (start, end) => {
  const a = html.indexOf(start), b = html.indexOf(end, a);
  assert.ok(a >= 0 && b > a, `Missing app section: ${start}`);
  return html.slice(a, b);
};
const context = vm.createContext({ initIvlpp, initIvl, initVvp });
vm.runInContext([
  section('const HA_TB =', "$('#startExample').onclick"),
  section('const ivlConf=', 'let lastVCD='),
  section('function parseVCD(', 'function binToHex('),
  section('function valAt(', 'function niceStep('),
  'globalThis.app = { EXAMPLES, preprocessAll, compile, simulate, parseVCD, valAt };'
].join('\n'), context);
const { EXAMPLES, preprocessAll, compile, simulate, parseVCD, valAt } = context.app;
async function run(design, tb, extra = [], generation = '2005') {
  const pp = await preprocessAll([{ name: 'design.v', src: design }, { name: 'testbench.v', src: tb }], extra);
  const compiled = await compile(pp, generation);
  assert.ok(compiled.vvp, compiled.err);
  const result = await simulate(compiled.vvp, extra);
  return { ...result, wave: result.vcd && parseVCD(result.vcd) };
}
function signal(wave, name) {
  const result = Object.values(wave.vars).find(v => v.name === name);
  assert.ok(result, `Missing VCD signal ${name}`);
  return result;
}
for (const generation of ['2005', '2009', '2012']) {
  const r = await run(EXAMPLES.and.design, EXAMPLES.and.tb, [], generation);
  assert.ok(r.vcd.includes('$enddefinitions'));
  assert.equal(r.wave.tsSec, 1e-12);
  assert.equal(r.wave.tmax, 40000);
  for (const [t, a, b, y] of [[0,0,0,0], [10000,0,1,0], [20000,1,0,0], [30000,1,1,1]]) {
    for (const [name, expected] of Object.entries({a,b,y}))
      assert.equal(valAt(signal(r.wave, 'tb.'+name), t), String(expected), `${name} at ${t} ps`);
  }
  assert.match(r.out, /t=30 ns\s+a=1 b=1 -> y=1/);
  console.log(`PASS real AND gate, console + VCD truth table, generation ${generation}`);
}
for (const name of ['gate','dataflow','behavioral','shiftreg','counter2','include']) {
  const ex = EXAMPLES[name], r = await run(ex.design, ex.tb, ex.extra || []);
  assert.ok(r.wave.order.length > 0, `${name}: missing waveform signals`);
  if (name === 'include') {
    for (let i=0; i<8; i++) {
      const sum = (i>>2) + ((i>>1)&1) + (i&1);
      assert.equal(valAt(signal(r.wave, 'tb.s'), i*10000), String(sum&1));
      assert.equal(valAt(signal(r.wave, 'tb.cout'), i*10000), String(sum>>1));
    }
  }
  console.log(`PASS existing ${name} example through all three WASM stages`);
}
const memory = await run('`define EXPECTED 1\nmodule unused; endmodule', `
module tb;
reg data[0:1];
initial begin
  $readmemb("vectors.txt", data);
  $display("memory=%b%b macro=%b", data[0], data[1], 1'b\`EXPECTED);
  $finish;
end
endmodule`, [{name:'vectors.txt', src:'0\n1\n'}]);
assert.match(memory.out, /memory=01 macro=1/);
assert.equal(memory.vcd, null);
console.log('PASS supporting memory files, shared macros, and no-VCD simulation');
const previousExitCode = process.exitCode;
const bad = await compile('module broken; assign y = ; endmodule', '2005');
assert.equal(bad.vvp, null);
assert.match(bad.err, /syntax error/);
// Emscripten propagates the expected compiler failure to Node's exit status.
process.exitCode = previousExitCode ?? 0;
console.log('PASS invalid Verilog reports a real compilation failure');
