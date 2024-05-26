const fs = require("fs");

commandTypes = {
  A_COMMAND: "A_COMMAND",
  C_COMMAND: "C_COMMAND",
  L_COMMAND: "L_COMMAND",
};

class Parser {
  static commandTypes = commandTypes;

  constructor(filePath) {
    this.currentCommandIndex = -1;
    this.commands = fs
      .readFileSync(filePath, { encoding: "utf8", flag: "r" })
      .split(/\r?\n/)
      .map((line) => line.replace(/\s/g, "").split("//")[0])
      .filter((line) => line.length > 0);
  }

  reset() {
    this.currentCommandIndex = -1;
  }

  hasMoreCommands() {
    return this.currentCommandIndex + 1 < this.commands.length;
  }

  advance() {
    if(!this.hasMoreCommands) throw new Error("advance() should only be called when hasMoreCommands() is true!")
    this.currentCommandIndex++;
  }

  commandType() {
    const currentCommand = this.commands[this.currentCommandIndex];
    switch(currentCommand[0]) {
      case "@":
        return commandTypes.A_COMMAND;
      case "(":
        return commandTypes.L_COMMAND;
      default:
        return commandTypes.C_COMMAND;
    }
  }

  symbol() {
    const currentCommand = this.commands[this.currentCommandIndex];
    const commandType = this.commandType();
    switch(commandType) {
      case commandTypes.A_COMMAND:
        return currentCommand.slice(1);
      case commandTypes.L_COMMAND:
        return currentCommand.slice(1,currentCommand.length - 1);
      default:
        throw new Error("symbol() should only be called if commandType() is A_COMMAND or L_COMMAND!");
    }
  }

  dest() {
    const currentCommand = this.commands[this.currentCommandIndex];
    const commandType = this.commandType();
    if(commandType !== commandTypes.C_COMMAND) throw new Error("dest() should only be called if commandType() is C_COMMAND!");
    const matches = currentCommand.match(/^(.*)=/);
    return matches === null
      ? null
      : matches[1];
  }

  comp() {
    const currentCommand = this.commands[this.currentCommandIndex];
    const commandType = this.commandType();
    if(commandType !== commandTypes.C_COMMAND) throw new Error("comp() should only be called if commandType() is C_COMMAND!");
    const matches = currentCommand.match(/=(.*);|^([^=]*);|=([^;]*)$/);
    return matches === null
      ? null
      : matches[1] || matches[2] || matches[3];
  }

  jump() {
    const currentCommand = this.commands[this.currentCommandIndex];
    const commandType = this.commandType();
    if(commandType !== commandTypes.C_COMMAND) throw new Error("jump() should only be called if commandType() is C_COMMAND!");
    const matches = currentCommand.match(/;(.*)$/);
    return matches === null
      ? null
      : matches[1];
  }
}

module.exports = Parser;