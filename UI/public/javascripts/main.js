function addData(event) {
    event.preventDefault();
    console.log("Make transaction Function")
    const txnId = document.getElementById('txnId').value;
    const senderaccountno = document.getElementById('senderaccountno').value;
    const recieveraccountno = document.getElementById('recieveraccountno').value;
    const denomination = document.getElementById('denomination').value;
    const value = document.getElementById('value').value;
    console.log(txnId + senderaccountno + recieveraccountno + denomination + value);
    if (txnId.length == 0 || senderaccountno.length == 0 || recieveraccountno.length == 0 || denomination.length == 0 || value.length == 0) {
        alert("Please enter the data properly");

    }
    else {
        fetch('/createTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ TxnId: txnId, senderaccountno: senderaccountno, recieveraccountno: recieveraccountno, denomination: denomination, value: value })
        }).then(function (response) {
            console.log(response);
            if (response.status == 200) {
                alert("Added a new transaction");

            } else {
                alert("Error in processing request");
            }

        }).catch(function (err) {
            console.log(err);
            alert("Error in processing request");
        })
    }

}

function readData(event) {

    event.preventDefault();
    const readCarId = document.getElementById('readCarId').value;

    console.log(readCarId);

    if (readCarId.length == 0) {
        alert("Please enter the data properly");
    }
    else {
        fetch('/readCar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ CarId: readCarId })
        })
            .then(function (response) {
                console.log(response);
                if (response.status != 200) {
                    console.log(response.status)
                    // alert("Error in processing request");

                } else {
                    return response.json();
                }
            })
            .then(function (Cardata) {
                dataBuf = Cardata["Cardata"]
                console.log(dataBuf)
                alert(dataBuf);
            })
            .catch(function (err) {
                console.log(err);
                alert("Error in processing request");
            })
    }
}