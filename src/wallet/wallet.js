import {elliptic,hash} from '../modules';

const INITIAL_BALANCE = 100
class Wallet {
    constructor(){
       this.balance = INITIAL_BALANCE ;
       this.keyPair = elliptic.createKeyPair(); //se utiliza la curva eliptica
       this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    toString(){
        const {balance, publicKey} = this;
        return ` Wallet -
        publicKey         :${publicKey.toString()}
        balance           :${balance}
        `;
    }
    //por que va a ser la propia wuallet la que va a firmar un grupo de datos , porque porque es el que tiene el KydPair
               // Tiene la primer Key y la que tiene la postesta de poder firmar cualquier tipo de datos 
    sign() {  
        return this.keyPair.sign(hash);//recomendable es pasa r un hash 
 
    }
}
export {INITIAL_BALANCE};
export default Wallet;