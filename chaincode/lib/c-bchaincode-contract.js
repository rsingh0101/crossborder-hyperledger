/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');

async function getCollectionName(ctx) {
    const collectionName = `senderbank`;
    return collectionName;
}


class CBchaincodeContract extends Contract {

    //Sender Bank user crud operations
    async senderExists(ctx, senderaccountno) {
        const collectionName=await getCollectionName(ctx);
        const buffer = await ctx.stub.getPrivateDataHash(collectionName,senderaccountno);
        return (!!buffer && buffer.length > 0);
    }

    async createSender(ctx, senderaccountno) {
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID === 'senderbank-crossborder-com') {
        const exists = await this.senderExists(ctx, senderaccountno);
        if (exists) {
            throw new Error(`The sender with account number ${senderaccountno} already exists`);
        }
        const transientData = ctx.stub.getTransient();
        if (transientData.size === 0 || !transientData.has('balance') || !transientData.has('denomination')) {
            throw new Error('The privateValue key was not specified in transient data. Please try again.');
        }   
        const orderAsset = {};
        orderAsset.balance=transientData.get('balance').toString();
        orderAsset.denomination=transientData.get('denomination').toString();
        const collectionName = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, senderaccountno, Buffer.from(JSON.stringify(orderAsset)));
        return orderAsset;
    }
    else
    {
        return `User under the following MSP: ${mspID} cannot perform this action`}
    }

    async readSender(ctx, senderaccountno) {
        const exists = await this.senderExists(ctx, senderaccountno);
        if (!exists) {
            throw new Error(`The asset c bchaincode ${senderaccountno} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        const privateData = await ctx.stub.getPrivateData(collectionName, senderaccountno);
        const privateDataString = JSON.parse(privateData.toString());
        return privateDataString;
    }

    async updateSender(ctx, senderaccountno) {
        const exists = await this.senderExists(ctx, senderaccountno);
        if (!exists) {
            throw new Error(`The asset cbchaincode ${senderaccountno} does not exist`);
        }

        const transientData = ctx.stub.getTransient();
        if (transientData.size === 0 || !transientData.has('balance')) {
            throw new Error('The balance key was not specified in transient data. Please try again.');
        }
        const newbalance = transientData.get('balance').toString();
        const gotdenomination=transientData.get('denomination').toString();
        const privateAsset = { balance: newbalance, denomination:gotdenomination};
        const collectionName = await getCollectionName(ctx);
        await ctx.stub.putPrivateData(collectionName, senderaccountno, Buffer.from(JSON.stringify(privateAsset)));
    }

    async deleteCBchaincode(ctx, senderaccountno) {
        const exists = await this.senderExists(ctx, senderaccountno);
        if (!exists) {
            throw new Error(`The asset c bchaincode ${senderaccountno} does not exist`);
        }
        const collectionName = await getCollectionName(ctx);
        await ctx.stub.deletePrivateData(collectionName, senderaccountno);
    }

    async verifyCBchaincode(ctx, mspid, senderaccountno, objectToVerify) {

        // Convert provided object into a hash
        const hashToVerify = crypto.createHash('sha256').update(objectToVerify).digest('hex');
        const pdHashBytes = await ctx.stub.getPrivateDataHash(`_implicit_org_${mspid}`, senderaccountno);
        if (pdHashBytes.length === 0) {
            throw new Error('No private data hash with the key: ' + senderaccountno);
        }

        const actualHash = Buffer.from(pdHashBytes).toString('hex');

        // Compare the hash calculated (from object provided) and the hash stored on public ledger
        if (hashToVerify === actualHash) {
            return true;
        } else {
            return false;
        }
    }




    //Sender makes a request to forex bank for fund transfer
    async moneytransaction(ctx, txnId, senderaccountno, receiveraccountno, value) {
        const mspID = ctx.clientIdentity.getMSPID();
        const collectionName = await getCollectionName(ctx);
        if (mspID === 'senderbank-crossborder-com') {
            if (await this.senderExists(ctx, senderaccountno)) {
                const senderData = await ctx.stub.getPrivateData(collectionName, senderaccountno);
                const senderBalance = JSON.parse(senderData.toString()).balance;
                const senderDenomination = JSON.parse(senderData.toString()).denomination;
                const updatedSenderBalance = parseFloat(senderBalance) - parseFloat(value);
                const senderPrivateAsset = { balance: updatedSenderBalance, denomination:senderDenomination};
                await ctx.stub.putPrivateData(collectionName, senderaccountno, Buffer.from(JSON.stringify(senderPrivateAsset)));
                const asset = {
                    txnId,
                    senderaccountno,
                    receiveraccountno,
                    value,
                    senderDenomination
                };
                const buffer = Buffer.from(JSON.stringify(asset));
                await ctx.stub.putState(txnId, buffer);

                //Event chaincode listener
                // let addcontractEventdata={Type:'Transaction for money transfer',denomination:senderDenomination};
                // await ctx.stub.setEvent('addtransactionEvent',buffer.from(JSON.stringify(addcontractEventdata)));
            return asset;
            } else {
                throw new Error(`The sender or receiver account does not exist`);
            }
        } else {
            throw new Error(`User under the following MSP: ${mspID} cannot perform this action`);
        }
    }
    
    

    //ReceiverBank
    async receiveraccountnoExists(ctx, receiveraccountno) { 
        const mspID = ctx.clientIdentity.getMSPID()
        if (mspID === 'receiverbank-crossborder-com') {   
        const buffer = await ctx.stub.getState(receiveraccountno);
        return (!!buffer && buffer.length > 0);
         }
         else
         {
            return `User under the following MSP: ${mspID} cannot perform this action`
        }
    }   

    async createReceiver(ctx, receiveraccountno,balance,denomination){
        const mspID = ctx.clientIdentity.getMSPID()
        if (mspID === 'receiverbank-crossborder-com') {   
            
            const exists = await this.receiveraccountnoExists(ctx, receiveraccountno);
            if (exists) {
                throw new Error(`The receiver account ${receiveraccountno} already exists`);
            }
            const asset = {
                balance: balance,
                denomination: denomination
            };
            const buffer = Buffer.from(JSON.stringify(asset));
            await ctx.stub.putState(receiveraccountno, buffer);
            return asset;
        }
        else
        {
           return `User under the following MSP: ${mspID} cannot perform this action`
       }
    }
    
    async readReceiver(ctx, receiveraccountno) {
        const mspID = ctx.clientIdentity.getMSPID()
        if (mspID === 'receiverbank-crossborder-com') {
        const exists = await this.receiveraccountnoExists(ctx, receiveraccountno);
        if (!exists) {
            throw new Error(`The account ${receiveraccountno} does not exist`);
        }
        const buffer = await ctx.stub.getState(receiveraccountno);
        const asset = JSON.parse(buffer.toString());
        return asset;
    } else {
        return `User under the following MSP: ${mspID} cannot perform this action`
    }
    }

    async updateReceiver(ctx, receiveraccountno,newbalance,newdenomination) {
        const mspID = ctx.clientIdentity.getMSPID()
        if (mspID === 'receiverbank-crossborder-com') {
        const exists = await this.receiveraccountnoExists(ctx, receiveraccountno);
        if (!exists) {
            throw new Error(`The account ${receiveraccountno} does not exist`);
        }
        const asset={
            balance:newbalance,
            denomination:newdenomination
        }
        const buffer = Buffer.from(JSON.stringify(asset));
            await ctx.stub.putState(receiveraccountno, buffer);
            return asset;
    } else {
        return `User under the following MSP: ${mspID} cannot perform this action`
    }
    }

    
    async deleteReceiver(ctx, receiveraccountno) {
        const mspID = ctx.clientIdentity.getMSPID()
        if (mspID === 'receiverbank-crossborder-com') {
            const exists = await this.receiveraccountnoExists(ctx, receiveraccountno);
            if (!exists) {
                throw new Error(`The account ${receiveraccountno} does not exist`);
            }
            await ctx.stub.deleteState(receiveraccountno);
        } else {
            return `User under the following MSP: ${mspID} cannot perform this action`
        }
    } 

    //////////////////////////////////////
    //Central Forex Bank function receives and approves the transaction with required rates conversion

    async approvetransaction(ctx,txnId){
        const mspID = ctx.clientIdentity.getMSPID()
        let status=false
        if (mspID === 'centralforexbank-crossborder-com') {
            const buffer = await ctx.stub.getState(txnId);
            const asset = JSON.parse(buffer.toString());
            const senderdenom=asset.senderDenomination;
            //const receiverdenom=await this.readReceiver(ctx,asset.receiveraccountno);
            const buffer3=await ctx.stub.getState(asset.receiveraccountno);
            const asset3= JSON.parse(buffer3.toString());
            const receiverdenom=asset3.denomination;
            let converted_value=0,next_converted_value=0;
            const inr=0.0121,eur=1.0674,jpy=0.0072,aud=0.6667;
            switch(senderdenom){
                case "inr":
                converted_value=(asset.value)*inr
                break
                case "eur":
                converted_value=(asset.value)*eur
                break
                case "jpy":
                converted_value=(asset.value)*jpy
                break
                case "aud":
                converted_value=(asset.value)*aud
                break
                default:
                throw new Error(`Invalid denomination: ${senderdenom}`);
            }
            const usd_inr=82.4645, usd_eur=0.93062, usd_aud=1.48294,usd_jpy=139.499;
            if(receiverdenom !== "usd"){
                switch(receiverdenom){
                    case "inr":
                    next_converted_value=(converted_value)*usd_inr
                    break
                    case "eur":
                    next_converted_value=(converted_value)*usd_eur
                    break
                    case "jpy":
                    next_converted_value=(converted_value)*usd_jpy
                    break
                    case "aud":
                    next_converted_value=(converted_value)*usd_aud
                    break
                    default:
                    throw new Error(`Invalid denomination: ${receiverdenom}`);
                }
            }
            if(next_converted_value!=0){
                status=true
            }
            const fasset={
                txnId,
                receiveraccountno:asset.receiveraccountno,
                next_converted_value,
                status: status
            };
            const buffer2 = Buffer.from(JSON.stringify(fasset));
            await ctx.stub.putState(txnId, buffer2);
            return fasset;
        }
        else {
            return `User under the following MSP: ${mspID} cannot perform this action`
        }
    }

    ///Query transactions
    
    async queryAlltransactions(ctx) {
        const mspID = ctx.clientIdentity.getMSPID()
        if (mspID === 'centralforexbank-crossborder-com') {
            const queryString = {
                selector: {
                    status: true
                }
            }
            let resultIterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
            let result = await this.getAllResults(resultIterator, false)
            return JSON.stringify(result)
        }
        else {
            return `User under the following MSP: ${mspID} cannot perform this action`
        }
        }
    async getAllResults(iterator) {
        let allResult = []
        for (let res = await iterator.next(); !res.done; res = await iterator.next()) {
            let jsonRes = {}
            jsonRes.Key = res.value.key
            jsonRes.Record = JSON.parse(res.value.value.toString())
            allResult.push(jsonRes)
        }
        await iterator.close()
        return allResult

    }



    async receivetransaction(ctx, txnId) {
        const mspID = ctx.clientIdentity.getMSPID();
        const buffer = await ctx.stub.getState(txnId);
        const asset = JSON.parse(buffer.toString());

        if (mspID == 'receiverbank-crossborder-com'&&asset.status == true) {
                const buffers=await ctx.stub.getState(asset.receiveraccountno)
                const assets=JSON.parse(buffers.toString());
                let updatedbalance = parseFloat(assets.balance)+parseFloat(asset.next_converted_value);
                const newasset = {
                    balance: updatedbalance,
                    denomination: assets.denomination
                };
                const buffer2 = Buffer.from(JSON.stringify(newasset));
                await ctx.stub.putState(asset.receiveraccountno, buffer2);
                return newasset
            }
        }
    }
    

module.exports = CBchaincodeContract;