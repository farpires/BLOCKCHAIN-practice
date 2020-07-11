import { v1 as uuidV1 } from 'uuid';
// import uuidV1 from 'uuid/v1';
import { elliptic } from '../modules';

class Transaction {
  constructor() {
    this.id = uuidV1();
    this.input = null;
    this.outputs = [];//como aprendimos tiene que ser un array ya que aqui tendr varios recipiente o receptores de la transacion 
  }

      //metodo statico : create
    //create: crea una nueva nstancia de transaciones
    //solo necesitamos una direccion , no necesitamos toda una wuallet  o algo a si , reamente necesitamos publicKey 
    //por lo que lo llamaremos recipientAdress  
    //amout: cuanto queremos mover  

    //---------wallet envia un amount-adonde se lo envis- y cuanto queremos enviarlo
  static create(senderWallet, recipientAdress, amount) {
    const { balance, publicKey } = senderWallet;
//primero: el amout no puede ser mayo que el balance que tenemos
    if (amount > balance) throw Error(`Amount: ${amount} exceeds balance.`);
    const transaction = new Transaction();
    //tenemos que generar dos recipiento, recordar que una transacion tien que  , que el receptor tiene que ser,recipient adres PERO tambien nosotros mismo
        // descomponemos un array con las expresion (...[{}]) y adentro meteromos dos outpus
    transaction.outputs.push(...[
      { amount: balance - amount, address: publicKey },//es el nuestro
      { amount, address: recipientAdress },
    ]);

    transaction.input = Transaction.sign(transaction, senderWallet);

    return transaction; //retornamos la transacion 
  }

  static verify(transaction) {
    const { input: { address, signature }, outputs } = transaction;

    return elliptic.verifySignature(address, signature, outputs);
  }

  static sign(transaction, senderWallet) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(transaction.outputs),
    };
  }

  update(senderWallet, recipientAdress, amount) {
    const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) throw Error(`Amount: ${amount} exceeds balance`);

    senderOutput.amount -= amount;
    this.outputs.push({ amount, address: recipientAdress });
    this.input = Transaction.sign(this, senderWallet);

    return this;
  }
}

export default Transaction;
