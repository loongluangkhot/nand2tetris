// push constant 7
@7
D=A
@SP
A=M
M=D
@SP
M=M+1
A=M
// push constant 8
@8
D=A
@SP
A=M
M=D
@SP
M=M+1
A=M
// add
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D+M
@SP
M=M+1
A=M
