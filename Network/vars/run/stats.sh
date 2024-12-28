#!/bin/bash
# Script to check network status

let oked=0
let total=0
declare -a allpeernodes=(peer1.senderbank.crossborder.com peer2.senderbank.crossborder.com peer3.senderbank.crossborder.com peer1.centralforexbank.crossborder.com peer1.receiverbank.crossborder.com)
for anode in ${allpeernodes[@]}; do
  let total=1+$total
  ss=$(wget -O- -S ${anode}:7061/healthz | jq '.status')
  printf "%20s %s\n" $anode $ss
  if [ $ss == '"OK"' ]; then
    let oked=1+$oked
  fi
done

declare -a allorderernodes=(orderer1.crossborder.com orderer2.crossborder.com orderer3.crossborder.com)
for anode in ${allorderernodes[@]}; do
  let total=1+$total
  ss=$(wget -O- -S ${anode}:7060/healthz | jq '.status')
  printf "%20s %s\n" $anode $ss
  if [ $ss == '"OK"' ]; then
    let oked=1+$oked
  fi
done

let percent=$oked*100/$total
echo "Network Status: $percent%"