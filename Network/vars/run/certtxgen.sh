#!/bin/bash
cd $FABRIC_CFG_PATH
# cryptogen generate --config crypto-config.yaml --output keyfiles
configtxgen -profile OrdererGenesis -outputBlock genesis.block -channelID systemchannel

configtxgen -printOrg centralforexbank-crossborder-com > JoinRequest_centralforexbank-crossborder-com.json
configtxgen -printOrg receiverbank-crossborder-com > JoinRequest_receiverbank-crossborder-com.json
configtxgen -printOrg senderbank-crossborder-com > JoinRequest_senderbank-crossborder-com.json
