import Transaction from './transaction';
import { elliptic, hash } from '../modules';

const INITIAL_BALANCE = 100;

class Wallet {
  constructor(blockchain, inicialBalance = INITIAL_BALANCE) {
    this.balance = inicialBalance;
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
    const { blockchain: { memoryPool } } = this;
    const balance  = this.calculaBalance();
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

  calculaBalance(){
    const {blockchain:{blocks=[]}, publicKey} = this;
    let { balance } = this;
    const txs = [];//se guardara todas las transaciones que ha tenido nuestra blockchain

    blocks.forEach(({data=[]})=>{
      if(Array.isArray(data)) data.forEach((tx)=> txs.push(tx));
    });
    //buscaremos los input de nuestra walet
      const walletInputTxs = txs.filter((tx)=>tx.input.address === publicKey);
      const timestamp =0;
      //puede pasar que no contega ninguna
      if(walletInputTxs.length>0){
        const  recentInputTx = walletInputTxs
        .sort((a,b)=>a.input.timestamp - b.input.timestamp)
        .pop();// de esta manera tenemos la ultimas transaccion

        balance = recentInputTx.ouputs.find(({address})=> address === publicKey).amount;
        timestamp = recentInputTx.input.timestamp;

      }
      tx
      .filter(({input})=>input.timestamp>timestamp)
      .forEach(({ouputs})=>{
        ouputs.find(({ address, amount })=>{
          if(address === publicKey) balance += amount;
        });
      });
      return balance;
  }
}

export { INITIAL_BALANCE };

export default Wallet;
