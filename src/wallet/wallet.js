import Transaction from './transaction';
import { elliptic, hash } from '../modules';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor(blockchain) {
    this.balance = INITIAL_BALANCE;
    this.keyPair = elliptic.createKeyPair();//se utiliza la curva eliptica
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.blockchain = blockchain;
  }

  toString() {
    const { balance, publicKey } = this;

    return ` Wallet -
      publicKey     : ${publicKey.toString()}
      balance       : ${balance}
    `;
  }
//por que va a ser la propia wuallet la que va a firmar un grupo de datos , porque porque es el que tiene el KydPair
// Tiene la primer Key y la que tiene la postesta de poder firmar cualquier tipo de datos 
  sign(data) {
    return this.keyPair.sign(hash(data));//recomendable es pasa r un hash 
  }

  createTransaction(recipientAddress, amount) {
    // 1-comprobar que le amount que estamos intentando envaiar  es ksuficiente 
    const { balance, blockchain: { memoryPool } } = this;
    if (amount > balance) throw Error(`Amount: ${amount} exceds current balance: ${balance}`);
    //tenemos que c rear una transacion PERO antes tendremos que ver en memory pool si esa transacion existe o no 
        //porque si existe llamaremos al metodo update  de transacion y si no crearemos esa transacion
        //tx= es un socket de transacion
    let tx = memoryPool.find(this.publicKey);
    if (tx) {
      tx.update(this, recipientAddress, amount);
    } else {
      tx = Transaction.create(this, recipientAddress, amount);
      memoryPool.addOrUpdate(tx);
    }

    return tx;
  }
}

export { INITIAL_BALANCE };

export default Wallet;
