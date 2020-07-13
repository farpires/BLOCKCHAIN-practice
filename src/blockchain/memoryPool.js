import { Transaction } from "../wallet";
class MemoryPool {
  constructor() {
    this.transactions = [];
  }

  addOrUpdate(transaction) {
    const {input, outputs = []}=transaction;
    const outputTotal = outputs.reduce((total , output )=> total + output.amount,0);
    if(input.amount !== outputTotal) throw Error(`IKnvalid transaction ${input.address}`);
    if(!Transaction.verify(transaction)) throw Error(`Invalid Signature  from ${input.address}`);
    const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
    if (txIndex >= 0) this.transactions[txIndex] = transaction;
    else this.transactions.push(transaction);
  }

  find(address) {
    return this.transactions.find(({ input }) => input.address === address);
  }
//borrar transa
  wipe(){
    this.transactions =[];

  }
}

export default MemoryPool;
