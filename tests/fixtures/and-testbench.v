`timescale 1ns/1ps
module tb;
  reg a, b;
  wire y;
  and_gate dut(.a(a), .b(b), .y(y));
  initial begin
    $dumpfile("dump.vcd");
    $dumpvars(0, tb);
    $monitor("t=%0d ns a=%b b=%b y=%b", $time, a, b, y);
    a=0; b=0;
    #10 b=1;
    #10 a=1; b=0;
    #10 b=1;
    #10 $finish;
  end
endmodule
