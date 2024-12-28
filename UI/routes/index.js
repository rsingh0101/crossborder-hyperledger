var express = require('express');
var router = express.Router();
const { ClientApplication } = require('./client');
const { Events } = require('./events');
let eventClient = new Events();

// Event listener for "createSender" eventst
//async contractEventListner(role, IdentityLabel,channelName, contractName, eventName)
eventClient.contractEventListner(
  "senderbank",
  "Admin",
  "autochannel",
  "CBchaincodeContract",
  "addtransactionEvent"
);
// Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
/* GET home page. */

//Sender Bank router functions

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

router.post('/createSender', function (req, res, next) {
  let senderClient = new ClientApplication();
  const getsenderaccountno=req.body.senderaccountno;
  const getbalance = req.body.balance;
  const getdenomination = req.body.denomination;
  const transientData = {
    balance: Buffer.from(getbalance),
    denomination: Buffer.from(getdenomination),
  }
  // Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
  senderClient.generateAndSubmitTxn(
    "senderbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "privateTxn",
    transientData,
    "createSender",
    getsenderaccountno
  )
    .then(message => {

      res.status(200).send("Successfully created")
    }).catch(error => {

      res.status(500).send({ error: `Failed to create`, message: `${error}` })
    });
})

router.post('/readSender', async function (req, res) {
  const getsenderaccountno = req.body.senderaccountno;
  let SenderClient = new ClientApplication();
  SenderClient.generateAndSubmitTxn(
    "senderbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "queryTxn",
    "",
    "readSender",
    getsenderaccountno).then(message => {

      // res.send({ orderData: message.toString() });
      res.status(200).send({ orderData: message.toString() });
    }).catch(error => {
      //alert('Error occured')
      console.log(error)
      res.status(500).send({ error: `Failed to Read`, message: `${error}` })

    })

})

router.get('/updateSender', function (req, res, next) {
  let senderClient = new ClientApplication();
  const getsenderaccountno=req.body.senderaccountno;
  const getbalance = req.body.balance;
  const getdenomination = req.body.denomination;
  const transientData = {
    balance: Buffer.from(getbalance),
    denomination: Buffer.from(getdenomination),
  }
  // Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
  senderClient.generateAndSubmitTxn(
    "senderbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "privateTxn",
    transientData,
    "updateSender",
    getsenderaccountno
  )
    .then(message => {

      res.status(200).send("Successfully updated")
    }).catch(error => {

      res.status(500).send({ error: `Failed to create`, message: `${error}` })
    });
})

router.get('/deleteSender', function (req, res, next) {
  let senderClient = new ClientApplication();
  const getsenderaccountno = req.body.senderaccountno;
  senderClient.generateAndSubmitTxn(
    "senderbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "invokeTxn",
    "",
    "deleteCBchaincode",
    getsenderaccountno
  )
    .then(message => {
      res.status(200).send("Successfully deleted");
    }).catch(error => {
      res.status(500).send({ error: `Failed to delete`, message: `${error}` });
    });
});


//Receiver Bank router functions
router.get('/createReceiver', function (req, res, next) {
  let receiverClient = new ClientApplication();
  const getreceiveraccountno=req.body.receiveraccountno;
  const getbalance = req.body.balance;
  const getdenomination = req.body.denomination;
  // Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
  receiverClient.generateAndSubmitTxn(
    "receiverbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "invokeTxn",
    "",
    "createReceiver",
    getreceiveraccountno,
    getbalance,
    getdenomination
  )
    .then(message => {

      res.status(200).send("Successfully created receiver")
    }).catch(error => {

      res.status(500).send({ error: `Failed to create`, message: `${error}` })
    });
})

router.post('/readReceiver', async function (req, res) {
  const getreceiveraccountno = req.body.receiveraccountno;
  let receiverClient = new ClientApplication();
  receiverClient.generateAndSubmitTxn(
    "receiverbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "queryTxn",
    "",
    "readReceiver",
    getreceiveraccountno).then(message => {

      // res.send({ orderData: message.toString() });
      res.status(200).send({ orderData: message.toString() });
    }).catch(error => {
      //alert('Error occured')
      console.log(error)
      res.status(500).send({ error: `Failed to Read`, message: `${error}` })

    })

})

router.get('/updateReceiver', function (req, res, next) {
  let senderClient = new ClientApplication();
  const getreceiveraccountno=req.body.receiveraccountno;
  const getbalance = req.body.balance;
  const getdenomination = req.body.denomination;
  // Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
  senderClient.generateAndSubmitTxn(
    "receiverbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "invokeTxn",
    "",
    "updateReceiver",
    getreceiveraccountno
  )
    .then(message => {

      res.status(200).send("Successfully updated receiver")
    }).catch(error => {

      res.status(500).send({ error: `Failed to create`, message: `${error}` })
    });
})

router.get('/deleteReceiver', function (req, res, next) {
  let receiverClient = new ClientApplication();
  const getreceiveraccountno = req.body.receiveraccountno;
  receiverClient.generateAndSubmitTxn(
    "receiverbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "invokeTxn",
    "",
    "deleteReceiver",
    getreceiveraccountno
  )
    .then(message => {
      res.status(200).send("Successfully deleted the receiver account");
    }).catch(error => {
      res.status(500).send({ error: `Failed to delete`, message: `${error}` });
    });
});


//Query from central forex
router.get('/allTransactions', async function (req, res) {
  let centralforexClient = new ClientApplication();
  centralforexClient.generateAndSubmitTxn(
    "centralforexbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "queryTxn",
    "",
    "queryAlltransactions").then(message => {
      const dataBuffer = message.toString();
      const value = JSON.parse(dataBuffer);
      res.status(200).json({ itemList: value });
    }).catch(error => {
      //alert('Error occured')
      console.log(error)
    })

})

router.get('/moneytransaction', function (req, res, next) {
  let senderClient = new ClientApplication();
  const gettxnId=req.body.txnId;
  const getsenderaccountno=req.body.senderaccountno;
  const getreceiveraccountno=req.body.receiveraccountno;  
  const getvalue = req.body.value;
  // Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
  senderClient.generateAndSubmitTxn(
    "senderbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "invokeTxn",
    "",
    "moneytransaction",
    gettxnId,
    getsenderaccountno,
    getreceiveraccountno,
    getvalue
  )
    .then(message => {

      res.status(200).send("Successfully invoked a transaction to forex")
    }).catch(error => {

      res.status(500).send({ error: `Failed to create`, message: `${error}` })
    });
})

router.post('/approvetransaction', function (req, res, next) {
  let centralforexbankClient = new ClientApplication();
  const gettxnId=req.body.txnId;
  // Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
  centralforexbankClient.generateAndSubmitTxn(
    "centralforexbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "invokeTxn",
    "",
    "approvetransaction",
    gettxnId
  )
    .then(message => {

      res.status(200).send({message:`Approved the transaction with txnID :${txnId}`})
    }).catch(error => {

      res.status(500).send({ error: `Failed to create`, message: `${error}` })
    });
})

router.post('/receivetransaction', function (req, res, next) {
  let centralforexbankClient = new ClientApplication();
  const gettxnId=req.body.txnId;
  // Generate and submit a transaction
  //generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,
  //txnType,transientData,txnName,...args)
  centralforexbankClient.generateAndSubmitTxn(
    "receiverbank",
    "Admin",
    "autochannel",
    "CBchaincode",
    "CBchaincodeContract",
    "invokeTxn",
    "",
    "receivetransaction",
    gettxnId
  )
    .then(message => {

      res.status(200).send({message:`Receiver and updated balance with order of txnID :${txnId}`})
    }).catch(error => {

      res.status(500).send({ error: `Failed to create`, message: `${error}` })
    });
})
module.exports = router;
