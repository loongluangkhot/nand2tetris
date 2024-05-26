// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

(LOOP)
  // Reset screen memory map pointer
  @SCREEN
  D=A
  @address
  M=D

  // Probe RAM[KBD] & branch to ON/OFF accordingly
  @KBD
  D=M
  @OFF
  D;JEQ

  // Set val to -1 if RAM[KBD] != 0 (Keyboard is pressed)
  (ON)
    @val
    M=-1
    @SET
    0;JMP

  // Set val to 0 if RAM[KBD] == 0 (Keyboard is NOT pressed)
  (OFF)
    @val
    M=0
    @SET
    0;JMP

  (SET)
    // Set value
    @val
    D=M
    @address
    A=M
    M=D
    // Increment pointer and repeat loop if have not reached the end of screen mem map
    @address
    M=M+1
    D=M
    @24576
    D=A-D
    @SET
    D;JGT

  @LOOP
  0;JMP