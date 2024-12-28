# Cross Border Transaction blockchain
<img src="https://github.com/rsingh0101/crossborder-hyperledger/blob/main/cross-borders.svg" width="1000">

----

The project entails the transaction flow from one bank to another bank (having international relations) for foreign currency exchanges and money transfer from one currency to another currency.

## Steps to run the project
1. Clone the repository in your local system.
2. Install the related dependencies and software to run the project- hyperledger fabric, network, docker, minifab etc.
3. In the network folder, run the command from terminal
    ```
    chmod +x startNetwork.sh
    ./startNetwork.sh
    ```
4. Check the containers from the same terminal-
    ```
    docker ps -a
    docker volume ls
    ```
5. Run the command, to remove the locks on network related files
    ```
    sudo chmod -R 777 vars/
    ```
6. In the VScode, you can use IBM blockchain extension to check the working. It would require adding of wallets, environment and gateway from the vars folder only.
7. Open the terminal in UI folder of the project.
8. Run the command
    ```
    npm install
    ```
9. After installations
    ```
    npm start
    ```

10. Now open the POSTMAN API, for connecting to the blockchain network and perform transactions.
11. Example- 
    For money transaction creation from sender-
    Method- GET
    ```
    localhost:3000/moneytransaction
    ```
    Input (in raw JSON format)
    ```
        {
            "txnId":"TXNABC11",
            "senderaccountno":"ABC001",
            "receiveraccountno":"XYZ001",
            "value":"50"
        }
    ```
    
## Change the url and call type (GET or POST), to perform other functions on the network.
    /createSender - for sender bank account creation
    /readSender - for reading the bank account of sender
    /updateSender - for updating the bank account of sender
    /deleteSender - for account deletion
    /createReceiver - for sender bank account creation
    /readReceiver - for reading the bank account of sender
    /updateReceiver - for updating the bank account of sender
    /deleteReceiver - for account deletion
    /moneytransaction - for transaction request from sender
    /allTransactions - for viewing valid approved transactions
    /approvetransaction -for central bank to validate the moneytransaction
    /receivertransaction - for receiver bank to fetch transaction order from central forex to update receiver balance
    