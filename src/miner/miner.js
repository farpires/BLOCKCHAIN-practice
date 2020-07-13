import {Transaction, blockchainWallet} from '../wallet';
import { MESSAGE } from '../service/p2p'

class Miner{
    constructor(blockchain, p2pService, wallet){
        this.blockchain = blockchain;
        this.p2pService = p2pService;
        this.wallet = wallet; 
    }

    mine(){
    const {
        blockchain:{memoryPool},
        p2pService,
        wallet, //wallet del minero
    } = this;
//CONTROL: no tenesmo que minar nada si en memmory pool , no  hay nada 
//sirve para que el minero no se lleve nada sin hacer nada
    if(memoryPool.transactions.length === 0) throw Error('there are no unconfirme transactions.');


        /*
        1_ incluir reward to miner , tendremos que recojer todas las transaciones de memeorypool
        2_ crear un bloque con todas las transacciones , que tenemos ahora mismo en memory pool
        3_ sync sincronizar la nueva blocchain que esta generando el minero con la netwoork
        4_deberiamos de borrar todas las transaciones que hay en memoripool(porque nuestro minero no hara una seleccion por fee , si on cogera todas y va a generar un bloque nuevo con todas las transaciones)
        5- transamitir (brodacasting ) de ese wipe para todos los nodo de nuestra red  
        */
        //1
        memoryPool.transactions.push(Transaction.reward(wallet,blockchainWallet))
        //2
        const block = this.blockchain.addBlock(memoryPool.transactions);
        //3
        p2pService.sync();
        //4-transaction
        memoryPool.wipe();
        //5
        p2pService.broadcast(MESSAGE.WIPE);
        return block;
    }
}

export default Miner;