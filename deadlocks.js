const transactions = [];
const MAX_TRANSACTIONS = 100;

function addTransaction() {
    const transactionID = parseInt(document.getElementById('transactionID').value);
    const waitingFor = parseInt(document.getElementById('waitingFor').value);

    if (transactions.length < MAX_TRANSACTIONS) {
        transactions.push({
            id: transactionID,
            waiting_for: waitingFor
        });
        alert(`Transaction ${transactionID} added, waiting for transaction ${waitingFor}.`);
    } else {
        alert('Maximum number of transactions reached.');
    }
}

function detectDeadlocks() {
    let deadlockDetected = false;
    let visited = new Array(MAX_TRANSACTIONS).fill(0);

    transactions.forEach((t, i) => {
        if (t.waiting_for !== -1 && !visited[i]) {
            let current = i;
            let cycle_detected = false;

            while (!visited[current]) {
                visited[current] = 1;
                current = transactions.findIndex(t => t.id === transactions[current].waiting_for);
                if (current === i) {
                    cycle_detected = true;
                    deadlockDetected = true;
                    break;
                }
                if (current === -1) break;
            }

            if (cycle_detected) {
                alert(`Deadlock detected involving transaction ${i}.`);
                resolveDeadlock(i, current);
            }
        }
    });

    if (!deadlockDetected) {
        alert('No deadlocks detected.');
    }
}

function resolveDeadlock(i, current) {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'block';
    if (i < current) {
        transactions[i].waiting_for = -1;
        alertBox.innerHTML = `Deadlock resolved: Terminated transaction ${i}.`;
    } else {
        transactions[current].waiting_for = -1;
        alertBox.innerHTML = `Deadlock resolved: Terminated transaction ${current}.`;
    }
}

function alert(message) {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'block';
    alertBox.innerHTML = message;
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}
