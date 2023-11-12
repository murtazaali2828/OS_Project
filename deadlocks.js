const transactions = [];
        const MAX_TRANSACTIONS = 100;

        function addTransaction() {
    const transactionID = parseInt(document.getElementById('transactionID').value, 10);
    const waitingFor = parseInt(document.getElementById('waitingFor').value, 10);

    if (isNaN(transactionID) || isNaN(waitingFor)) {
        showAlert('Please fill out both Transaction ID and Waiting For Transaction ID fields.');
        return;
    }

    if (transactionID >= MAX_TRANSACTIONS || waitingFor >= MAX_TRANSACTIONS) {
        showAlert('Transaction ID and Waiting For Transaction ID must be less than ' + MAX_TRANSACTIONS + '.');
        return;
    }

    if (transactionID === waitingFor) {
        showAlert('A transaction cannot wait for itself.');
        return;
    }

    if (transactions.some(t => t.id === transactionID)) {
        showAlert(`Transaction ${transactionID} already exists. Please use a unique ID.`);
        return;
    }

    transactions.push({ id: transactionID, waiting_for: waitingFor });
    showAlert(`Transaction ${transactionID} added, waiting for transaction ${waitingFor}.`);
}

function detectDeadlocks() {
    let deadlockDetected = false;
    let visited = new Array(MAX_TRANSACTIONS).fill(false);

    transactions.forEach((transaction, index) => {
        if (visited[index]) {
            return;
        }
        let stack = [];
        let current = index;
        while (true) {
            visited[current] = true;
            stack.push(current);
            let next = transactions.findIndex(t => t.id === transactions[current].waiting_for);
            if (next === -1) {
                showAlert(`Transaction ${transactions[current].waiting_for} does not exist.`);
                return;
            }
            if (stack.includes(next)) {
                deadlockDetected = true;
                resolveDeadlock(next);
                return;
            }
            if (visited[next]) {
                break;
            }
            current = next;
        }
    });

    if (!deadlockDetected) {
        showAlert('No deadlocks detected.');
    }
}

        function resolveDeadlock(index) {
            const deadlockedTransaction = transactions[index];
            transactions.splice(index, 1);
            showAlert(`Deadlock resolved: Terminated transaction ${deadlockedTransaction.id}.`);
        }

        function showAlert(message) {
            const alertBox = document.getElementById('alertBox');
            alertBox.style.display = 'block';
            alertBox.textContent = message;
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }