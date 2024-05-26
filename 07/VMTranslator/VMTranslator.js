const path = require("path");
const {Parser, commandTypes:parserCommandTypes} = require("./Parser");
const CodeWriter = require("./CodeWriter");

// Read file
const argv = process.argv;
if(argv.length < 3) throw new Error("File path is not provided!");
const filePath = argv[2];
const fileName = path.basename(filePath, ".vm");
const outputPath = path.join(path.dirname(filePath), `${fileName}.asm`);

// Translate
const parser = new Parser(filePath);
const codeWriter = new CodeWriter(outputPath);
codeWriter.setFileName(fileName);

while(parser.hasMoreCommands()) {
  parser.advance();
  const type = parser.commandType();
  const cmd = parser.currentCommand;
  if(type === parserCommandTypes.C_ARITHMETIC) {
    codeWriter.writeArithmetic(cmd);
  } else if(type === parserCommandTypes.C_POP || type === parserCommandTypes.C_PUSH) {
    codeWriter.writePushPop(cmd);
  }
}

codeWriter.close();