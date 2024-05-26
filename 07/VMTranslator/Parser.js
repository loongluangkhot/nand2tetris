const fs = require("fs");

const commandTypes = {
  C_ARITHMETIC: "C_ARITHMETIC",
  C_PUSH: "C_PUSH",
  C_POP: "C_POP",
  C_LABEL: "C_LABEL",
  C_GOTO: "C_GOTO",
  C_IF: "C_IF",
  C_FUNCTION: "C_FUNCTION",
  C_RETURN: "C_RETURN",
  C_CALL: "C_CALL",
};

class Parser {
  constructor(filePath) {
    this.currentCommandIndex = -1;
    this.commands = fs
      .readFileSync(filePath, { encoding: "utf8", flag: "r" })
      .split(/\r?\n/)
      .map((line) => line.split("//")[0])
      .filter((line) => line.length > 0);
  }

  get currentCommand() {
    return this.commands[this.currentCommandIndex];
  }

  hasMoreCommands() {
    return this.currentCommandIndex + 1 < this.commands.length;
  }

  advance() {
    if(!this.hasMoreCommands) throw new Error("advance() should only be called when hasMoreCommands() is true!")
    this.currentCommandIndex++;
  }

  commandType() {
    const cmd = this.currentCommand.split(" ")[0];
    const arithmeticCmds = ["add", "sub", "neg"];
    const logicalCmds = ["eq", "gt", "lt", "and", "or", "not"];
    if([...arithmeticCmds, ...logicalCmds].includes(cmd)) {
      return commandTypes.C_ARITHMETIC;
    } else if(cmd === "push") {
      return commandTypes.C_PUSH;
    } else if(cmd === "pop") {
      return commandTypes.C_POP;
    } else if(cmd === "label") {
      return commandTypes.C_LABEL;
    } else if(cmd === "goto") {
      return commandTypes.C_GOTO;
    } else if(cmd === "if-goto") {
      return commandTypes.C_IF;
    } else if(cmd === "function") {
      return commandTypes.C_FUNCTION;
    } else if(cmd === "call") {
      return commandTypes.C_CALL;
    } else if(cmd === "return") {
      return commandTypes.C_RETURN;
    } else {
      throw new Error("Command provided is invalid: " + cmd);
    }
  }

  arg1() {
    if(this.commandType() === commandTypes.C_ARITHMETIC) {
      return this.currentCommand.split(" ")[0];
    } else if(this.commandType() === commandTypes.C_RETURN) {
      throw new Error("Function arg1 should not be called for command type C_RETURN");
    } else {
      return this.currentCommand.split(" ")[1];
    }
  }

  arg2() {
    const validCommandTypes = [
      commandTypes.C_PUSH,
      commandTypes.C_POP,
      commandTypes.C_FUNCTION,
      commandTypes.C_CALL,
    ]
    if(validCommandTypes.includes(this.commandType())) {
      const tokens = this.currentCommand.split(" ")
      return tokens[tokens.length - 1];
    } else {
      throw new Error("Function arg2 should only be called for command types " + validCommandTypes);
    }
  }
}

module.exports = {Parser, commandTypes};