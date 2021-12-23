import { tokens, EVM_REVERT } from './helpers';

const Token = artifacts.require('Token');
require('chai').use(require('chai-as-promised')).should();



contract('Token',async([deployer,receiver,exchange])=>{
    // first argument deployer used ES6 which is accounts[0].
    let token;
    const name='Mern Token',symbol='MERN',decimals='18',totalSupply=tokens(1000000).toString();

    beforeEach(async()=>{
        token=await Token.new();
    })

    describe('deployment',()=>{
        it('tracks the name',async()=>{
            const result = await token.name();
            result.should.equal(name);
        })

        it('tracks the symbol',async()=>{
            const result = await token.symbol();
            result.should.equal(symbol);
        })

        it('tracks the decimals',async()=>{
            const result = await token.decimals();
            result.toString().should.equal(decimals);
        })

        it('tracks the totalSupply',async()=>{
            const result = await token.totalSupply();
            result.toString().should.equal(totalSupply);
        })

        it('assigns the total supply to the deployer',async()=>{
            const result = await token.balanceOf(deployer);
            result.toString().should.equal(totalSupply);
        })
    })

    describe('sending tokens', () => {
        let result //why let is used for result, to get the event data in beforeEach() below.
        let amount // we are assuming these.
    
        describe('success', async () => {
          beforeEach(async () => {
            amount = tokens(100)
            result = await token.transfer(receiver, amount, { from: deployer })
          })
    
          it('transfers token balances', async () => {
            let balanceOf
            balanceOf = await token.balanceOf(deployer)
            balanceOf.toString().should.equal(tokens(999900).toString())
            balanceOf = await token.balanceOf(receiver)
            balanceOf.toString().should.equal(tokens(100).toString())
          })
    
          it('emits a transfer event', async () => {
            const log = result.logs[0]
            log.event.should.eq('Transfer')
            const event = log.args
            event.from.toString().should.equal(deployer, 'from is correct')
            event.to.should.equal(receiver, 'to is correct')
            event.value.toString().should.equal(amount.toString(), 'value is correct')
          })
    
        })
    
        describe('failure', async () => {
    
          it('rejects insufficient balances', async () => {
            let invalidAmount
            invalidAmount = tokens(100000000) // 100 million - greater than total supply
            await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT)
    
            // Attempt transfer tokens, when you have none
            invalidAmount = tokens(10) // recipient has no tokens
            await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT)
          })
    
          it('rejects invalid recipients', async () => {
            await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
          })
    
        })
    })

    describe('Approving Tokens',()=>{
      let result;
      let amount;

      beforeEach(async()=>{
        amount=tokens(100);
        result=await token.approve(exchange,amount,{from:deployer})
      })
      describe('success',()=>{
        it('alocates an alowance for authorised token spending on exchange',async()=>{
          const allowance = await token.allowance(deployer,exchange);
          allowance.toString().should.equal(amount.toString());
        })

        it('emits a Approval event', async () => {
          const log = result.logs[0]
          log.event.should.eq('Approval')
          const event = log.args
          event.owner.toString().should.equal(deployer, 'from is correct')
          event.spender.should.equal(exchange, 'to is correct')
          event.value.toString().should.equal(amount.toString(), 'value is correct')
        })

      })

      describe('failure',()=>{
          it('rejects invalid spenders', async () => {
            await token.approve(0x0, amount, { from: deployer }).should.be.rejected
          })
      })
    })

    describe('sending tokens by third party authorisers', () => {
      let result //why let is used for result, to get the event data in beforeEach() below.
      let amount // we are assuming these.
  
      beforeEach(async()=>{
        amount = tokens(100);
        result=await token.approve(exchange,amount,{from:deployer});
      })

      describe('success', async () => {
        beforeEach(async () => {
          result = await token.transferFrom(deployer,receiver, amount, { from: exchange })
        })
  
        it('transfers token balances', async () => {
          let balanceOf;
          balanceOf = await token.balanceOf(deployer)
          balanceOf.toString().should.equal(tokens(999900).toString())
          balanceOf = await token.balanceOf(receiver)
          balanceOf.toString().should.equal(tokens(100).toString())
        })
  
        it('resets alowance after spending tokens',async()=>{
          const allowance = await token.allowance(deployer,exchange);
          allowance.toString().should.equal('0');
        })

        it('emits a transfer event', async () => {
          const log = result.logs[0]
          log.event.should.eq('Transfer')
          const event = log.args
          event.from.toString().should.equal(deployer, 'from is correct')
          event.to.should.equal(receiver, 'to is correct')
          event.value.toString().should.equal(amount.toString(), 'value is correct')
        })
  
      })
  
      describe('failure', async () => {
  
        it('rejects insufficient amounts', async () => {
          let invalidAmount
          invalidAmount = tokens(101);
          await token.transferFrom(deployer,receiver, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REVERT)
        })

        it('rejects invalid recipients', async () => {
          await token.transferFrom(deployer,0x0, amount, { from: exchange }).should.be.rejected
        })
  
      })
  })

})
