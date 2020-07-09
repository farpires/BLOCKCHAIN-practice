import Elliptic from 'elliptic';
//lo que se debera hacer es usar una nueva instancia utilizando una curva determinadad 
//tipologia de curva es : secp 256k1(se refiere a los parametros de la curva eliptica va a utilizar )
//secp standard efficient cryptography //ACTUALMENTE BITCOIN USA ESTA CURVA junto con el algoritmo
//nose uso mucho cuando bitcoin se hiso popular , pero ahora se esta haciendo popular devido a sus grandes propiedades 
// la mayoria de las curva usadas anteriormente tienen una estructura aleatorias 
//secp256k1 se construlle de una manera especial no aleatoria , que permite una claculo efiscasente eficiente
//es un 30% mas rapido que otras curvas - si la implementacion esta suficientemente optimisada 
const ec = new Elliptic.ec('secp256k1'); 
const INITIAL_BALANCE = 100
class Wallet {
    constructor(){
       this.balance = INITIAL_BALANCE ;
       this.keyPair = ec.genKeyPair(); //se utiliza la curva eliptica
       this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    toString(){
        const {balance, publicKey} = this;
        return ` Wallet -
        publicKey         :${publicKey.toString()}
        balance           :${balance}
        `;
    }
}
export {INITIAL_BALANCE};
export default Wallet;