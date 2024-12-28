#!/bin/bash
# Script to create channel block 0 and then create channel
cp $FABRIC_CFG_PATH/core.yaml /vars/core.yaml
cd /vars
export FABRIC_CFG_PATH=/vars
configtxgen -profile OrgChannel \
  -outputCreateChannelTx autochannel.tx -channelID autochannel

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=10.0.2.15:7005
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/senderbank.crossborder.com/peers/peer3.senderbank.crossborder.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=senderbank-crossborder-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/senderbank.crossborder.com/users/Admin@senderbank.crossborder.com/msp
export ORDERER_ADDRESS=10.0.2.15:7015
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/crossborder.com/orderers/orderer3.crossborder.com/tls/ca.crt
peer channel create -c autochannel -f autochannel.tx -o $ORDERER_ADDRESS \
  --cafile $ORDERER_TLS_CA --tls
