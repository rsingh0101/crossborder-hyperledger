#!/bin/bash
# Script to join a peer to a channel
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=10.0.2.15:7007
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/receiverbank.crossborder.com/peers/peer1.receiverbank.crossborder.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=receiverbank-crossborder-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/receiverbank.crossborder.com/users/Admin@receiverbank.crossborder.com/msp
export ORDERER_ADDRESS=10.0.2.15:7013
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/crossborder.com/orderers/orderer1.crossborder.com/tls/ca.crt
if [ ! -f "autochannel.genesis.block" ]; then
  peer channel fetch oldest -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA \
  --tls -c autochannel /vars/autochannel.genesis.block
fi

peer channel join -b /vars/autochannel.genesis.block \
  -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA --tls
