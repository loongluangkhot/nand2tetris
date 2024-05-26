class SymbolTable {
  constructor() {
    this.table = {
      SP: 0,
      LCL: 1,
      ARG: 2,
      THIS: 3,
      THAT: 4,
      SCREEN: 16384,
      KBD: 24576,
    };
    for(let i = 0; i < 16; i++) {
      this.table[`R${i}`] = i;
    }
  }

  addEntry(symbol, address) {
    this.table[symbol] = address;
    return;
  }

  contains(symbol) {
    return this.table.hasOwnProperty(symbol);
  }

  getAddress(symbol) {
    return this.table[symbol];
  }
}

module.exports = SymbolTable;