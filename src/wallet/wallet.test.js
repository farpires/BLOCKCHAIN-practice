import Wallet,{INITIAL_BALANCE} from './wallet';


describe('Wallet',()=>{
    let walle ;
    beforeEach(() => {//cada teste que generemos pasara por aqui y generara una nueva instancia de wuallet
        walle = new Wallet()
      });
    it('it is a healthy wallet',()=>{
        expect(walle.balance).toEqual(INITIAL_BALANCE);
        expect(typeof walle.keyPair).toEqual('object');
        expect(typeof walle.publicKey).toEqual('string');
        expect(walle.publicKey.length).toEqual(130); //colocamos 130 por que es el tamano del resultado  que te da la curva eliptica secp256k1 convertiendo a hex
    });
});