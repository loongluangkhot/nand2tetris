// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
// R2 = R0 * R1

// Put your code here.

// Approach: Add R1 to R2 over R0 iterations
// Store num of iterations needed in a variable "n"
@R2
M=0
@R0
D=M
@n
M=D

(LOOP)
  // If n is zero, exit loop
  @n
  D=M
  @END
  D;JEQ

  // If n is greater than zero, do R2 += R1
  @R1
  D=M
  @R2
  M=M+D

  // n--
  @n
  M=M-1

  @LOOP
  0;JMP

(END)
  @END
  0;JMP