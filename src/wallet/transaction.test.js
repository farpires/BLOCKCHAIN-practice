import Transaction, { REWARD } from './transaction';
import Wallet from './wallet';
import {blockchainWallet} from './index'

describe('Transaction', () => {
  let wallet;
  let transaction;
  let amount;
  let recipientAdress;
    //para no mutar ninguno de los teses 
  beforeEach(() => {
    wallet = new Wallet();
    recipientAdress = 'r3c1p13nt';
    amount = 5;
    transaction = Transaction.create(wallet, recipientAdress, amount);
  });

  it('outputs the `amount` subtracted from the wallet balance', () => {
    const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
    expect(output.amount).toEqual(wallet.balance - amount);
  });
 //tenemos un output donde la adress del recipiente esta y el amount es el que hemos pedidos
  it('outputs the `amount` added to the recipient', () => {
    const output = transaction.outputs.find(({ address }) => address === recipientAdress);
    expect(output.amount).toEqual(amount);
  });
    //cuandointentamos enviar un amount que no es posible 
  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 500;//mutar
      transaction = undefined;// si no va incorectamente 
    });

    it('does not create the transaction', () => {
      expect(() => {
        transaction = Transaction.create(wallet, recipientAdress, amount);
      }).toThrowError(`Amount: ${amount} exceeds balance.`);
    });
  });
// Primerp: que le amount que aparece en ella es el correcto
  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });
    //Segundo: que la public key sea la que estamos esperando 
  it('inputs the sender address of the wallet', () => {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });
    //trampa:vamos aprobar, si tenemos una firma y que vamos a volver a firmarlo y nos devuleve el mismo objeto 
    //pero lla veremos mas adelante que esa no es la validadcion correcta, o la validacion que una persona
    //no tiene prekey que no tiene el keyp puede hacer
  it('inputs has a signature usign the wallet', () => {
    expect(typeof transaction.input.signature).toEqual('object');
    expect(transaction.input.signature).toEqual(wallet.sign(transaction.outputs));
  });
    //-----------------------------------------
  it('validates a valid transaction', () => {
    expect(Transaction.verify(transaction)).toBe(true);
  });

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 500;//supongamos que queremos sacar dinero 
    expect(Transaction.verify(transaction)).toBe(false);
  });

  describe('and updating a transaction', () => {
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      nextAmount = 3;
      nextRecipient = 'n3xt-4ddr3ss';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('subtracts the next amount from the senders wallet', () => {
      const output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
      expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it('outputs an amount for the next recipient', () => {
      const output = transaction.outputs.find(({ address }) => address === nextRecipient);
      expect(output.amount).toEqual(nextAmount);
    });
  });
  describe('creating a reward transaction ',()=>{
    beforeEach(()=>{
      transaction = Transaction.reward(wallet, blockchainWallet);
    });
    it('reward the miners wallet ',()=>{
      expect(transaction.outputs.length).toEqual(2);
      let output = transaction.outputs.find(({address})=>address === wallet.publicKey);
      expect(output.amount).toEqual(REWARD);
      output = transaction.outputs.find(({address})=> address === blockchainWallet.publicKey);
      expect(output.amount).toEqual(blockchainWallet.balance-REWARD);
    });
  });
});
// importamos wuallet, por que nuestra funcion STATICA create dentro de la clas transaction, recibe una wallet 