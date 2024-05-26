const fs = require("fs");

const pointers = {
  local: "LCL",
  argument: "ARG",
  this: "THIS",
  that: "THAT",
}

const segmentTypes = [
  ["local", "argument", "this", "that"],
  ["constant"],
  ["static"],
  ["temp"],
  ["pointer"],
]

class CodeWriter {
  constructor(filePath) {
    this.writeStream = fs.createWriteStream(filePath);
    this.fileName = undefined;
    this.labelNum = 0;
    this.varNum = 0;
  }

  setFileName(fileName) {
    this.fileName = fileName;
  }

  writeArithmetic(command) {
    const asm = [`// ${command}`];
    const cmd = command;
    // const arithmeticCmds = ["add", "sub", "neg"];
    // const logicalCmds = ["eq", "gt", "lt", "and", "or", "not"];
    let trueLabel, exitLabel;
    asm.push(...this.spDec());
    switch(cmd) {
      case "add":
        asm.push("D=M");
        asm.push(...this.spDec());
        asm.push("M=M+D");
        break;
      case "sub":
        asm.push("D=M");
        asm.push(...this.spDec());
        asm.push("M=M-D");
        break;
      case "neg":
        asm.push("M=-M");
        break;
      case "eq":
        trueLabel = "EQ" + this.labelNum;
        exitLabel = "EQX" + this.labelNum;
        asm.push("D=M");
        asm.push(...this.spDec());
        asm.push("D=M-D");
        asm.push("@" + trueLabel);
        asm.push("D;JEQ");
        // Not true
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=0");
        asm.push("@" + exitLabel);
        asm.push("0;JMP");
        // True
        asm.push("(" + trueLabel + ")");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=-1");
        // Exit
        asm.push("(" + exitLabel + ")");
        this.labelNum += 1;
        break;
      case "gt":
        trueLabel = "GT" + this.labelNum;
        exitLabel = "GTX" + this.labelNum;
        asm.push("D=M");
        asm.push(...this.spDec());
        asm.push("D=M-D");
        asm.push("@" + trueLabel);
        asm.push("D;JGT");
        // Not true
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=0");
        asm.push("@" + exitLabel);
        asm.push("0;JMP");
        // True
        asm.push("(" + trueLabel + ")");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=-1");
        // Exit
        asm.push("(" + exitLabel + ")");
        this.labelNum += 1;
        break;
      case "lt":
        trueLabel = "LT" + this.labelNum;
        exitLabel = "LTX" + this.labelNum;
        asm.push("D=M");
        asm.push(...this.spDec());
        asm.push("D=M-D");
        asm.push("@" + trueLabel);
        asm.push("D;JLT");
        // Not true
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=0");
        asm.push("@" + exitLabel);
        asm.push("0;JMP");
        // True
        asm.push("(" + trueLabel + ")");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=-1");
        // Exit
        asm.push("(" + exitLabel + ")");
        this.labelNum += 1;
        break;
      case "and":
        asm.push("D=M");
        asm.push(...this.spDec());
        asm.push("M=D&M");
        break;
      case "or":
        asm.push("D=M");
        asm.push(...this.spDec());
        asm.push("M=D|M");
        break;
      case "not":
        asm.push("M=!M");
        break;
    }
    asm.push(...this.spInc());
    const code = asm.join("\n") + "\n";
    this.writeStream.write(code);
  }

  writePushPop(command) {
    const asm = [`// ${command}`];
    const [cmd, segment, iStr] = command.split(" ");
    const i = parseInt(iStr);
    if(segmentTypes[0].includes(segment)) {
      // local / argument / this / that
      const pointer = pointers[segment];
      if(cmd === "push") {
        asm.push("@" + pointer);
        asm.push("D=M");
        asm.push("@" + i);
        asm.push("A=D+A");
        asm.push("D=M");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=D");
        asm.push(...this.spInc());
      } else if(cmd === "pop") {
        asm.push("@" + pointer);
        asm.push("D=M");
        asm.push("@" + i);
        asm.push("D=D+A");
        asm.push(...this.spDec());
        asm.push("D=D+M");
        asm.push("A=D-M");
        asm.push("M=D-A");
      }
    } else if(segmentTypes[1].includes(segment)) {
      // constant
      if(cmd === "push") {
        asm.push("@" + i);
        asm.push("D=A");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=D");
        asm.push(...this.spInc());
      }
    } else if(segmentTypes[2].includes(segment)) {
      // static
      if(cmd === "push") {
        asm.push("@" + this.fileName + "." + i);
        asm.push("D=M");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=D");
        asm.push(...this.spInc());
      } else if(cmd === "pop") {
        asm.push(...this.spDec());
        asm.push("D=M");
        asm.push("@" + this.fileName + "." + i);
        asm.push("M=D");
      }
    } else if(segmentTypes[3].includes(segment)) {
      // temp
      const addr = 5 + i;
      if(cmd === "push") {
        asm.push("@" + addr);
        asm.push("D=M");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=D");
        asm.push(...this.spInc());
      } else if(cmd === "pop") {
        asm.push(...this.spDec());
        asm.push("D=M");
        asm.push("@" + addr);
        asm.push("M=D");
      }
    } else if(segmentTypes[4].includes(segment)) {
      // pointer
      let addr;
      switch(i) {
        case 0:
          addr = "THIS";
          break;
        case 1:
          addr = "THAT";
          break;
        default:
          throw new Error("i can only be 0 or 1 for push/pop pointer commands!");
      }
      if(cmd === "push") {
        asm.push("@" + addr);
        asm.push("D=M");
        asm.push("@SP");
        asm.push("A=M");
        asm.push("M=D");
        asm.push(...this.spInc());
      } else if(cmd === "pop") {
        asm.push(...this.spDec());
        asm.push("D=M");
        asm.push("@" + addr);
        asm.push("M=D");
      }
    } else {
      throw new Error("Segment provided is invalid: " + segment);
    }
    const code = asm.join("\n") + "\n";
    this.writeStream.write(code);
  }

  spInc() {
    const asm = [
      "@SP",
      "M=M+1",
      "A=M",
    ];
    return asm;
  }

  spDec() {
    const asm = [
      "@SP",
      "M=M-1",
      "A=M",
    ];
    return asm;
  }

  close() {
    this.writeStream.end();
  }
}

module.exports = CodeWriter;