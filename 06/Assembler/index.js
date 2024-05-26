const fs = require("fs");
// const path = require('path');
const Parser = require("./Parser");
const Code = require("./Code");
const SymbolTable = require("./SymbolTable");

function getBinaryStringFromDecimal(decimal, targetLength) {
  let binary = decimal.toString(2);
  if(binary.length < targetLength) binary = "0".repeat(targetLength - binary.length) + binary;
  return binary;
}

// Read file
const argv = process.argv;
if(argv.length < 3) throw new Error("File path is not provided!");
const filePath = argv[2];

// Translate
const parser = new Parser(filePath);
const symbolTable = new SymbolTable();
// First-pass
let i = 0;
while(parser.hasMoreCommands()) {
  parser.advance();
  const type = parser.commandType();
  if(type === Parser.commandTypes.L_COMMAND) {
    const sym = parser.symbol();
    if(!symbolTable.contains(sym)) symbolTable.addEntry(sym, i);
  } else {
    i++;
  }
}

// Second-pass
parser.reset();
i = 16;
let result = [];
while(parser.hasMoreCommands()) {
  parser.advance();
  const type = parser.commandType();
  if(type === Parser.commandTypes.A_COMMAND) {
    const sym = parser.symbol();
    let add;
    if(sym.match(/^\d+$/) === null) {
      if(symbolTable.contains(sym)) {
        add = symbolTable.getAddress(sym);
      } else {
        symbolTable.addEntry(sym, i);
        add = i;
        i++;
      }
    } else {
      add = parseInt(sym);
    }
    const cmd = "0" + getBinaryStringFromDecimal(add, 15);
    result.push(cmd);
  } else if (type === Parser.commandTypes.C_COMMAND) {
    const cmd = "111" + Code.comp(parser.comp()) + Code.dest(parser.dest()) + Code.jump(parser.jump());
    result.push(cmd);
  }
}
const content = result.join("\n");

// Write file
fs.writeFileSync(filePath.replace(".asm", ".hack"), content); 