#!/bin/bash
# Script to join a peer to a channel
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=10.0.2.15:7006
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/centralforexbank.crossborder.com/peers/peer1.centralforexbank.crossborder.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=centralforexbank-crossborder-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/centralforexbank.crossborder.com/users/Admin@centralforexbank.crossborder.com/msp
export ORDERER_ADDRESS=10.0.2.15:7014
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/crossborder.com/orderers/orderer2.crossborder.com/tls/ca.crt
if [ ! -f "autochannel.genesis.block" ]; then
  peer channel fetch oldest -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA \
  --tls -c autochannel /vars/autochannel.genesis.block
fi

peer channel join -b /vars/autochannel.genesis.block \
  -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA --tls
