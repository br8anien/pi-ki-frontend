
document.getElementById('login-btn').addEventListener('click', async () => {
  try {
    const scopes = ['username', 'payments'];
    const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    sessionStorage.setItem('pi_username', auth.user.username);
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
  } catch (err) {
    console.error(err);
  }
});

async function onIncompletePaymentFound(payment) {
  console.log("Unvollständige Zahlung gefunden:", payment);
}

document.getElementById('pay-btn').addEventListener('click', async () => {
  const paymentData = {
    amount: 1,
    memo: "Zugang zur KI",
    metadata: { type: "pi_ki_chat_access" },
    to: "GDBPMB7FOCW4N67KNTVGVRGJKU7VIFOIZCYLCAG6EMT4TU6DK7YKK6PH"
  };

  try {
    const payment = await window.Pi.createPayment(paymentData, {
      onReadyForServerApproval: paymentId => {
        console.log("Zahlung bereit zur Genehmigung", paymentId);
      },
      onReadyForServerCompletion: paymentId => {
        console.log("Zahlung abgeschlossen", paymentId);
      },
      onCancel: error => {
        console.error("Zahlung abgebrochen", error);
      },
      onError: error => {
        console.error("Zahlungsfehler", error);
      }
    });
  } catch (err) {
    console.error("Fehler beim Erstellen der Zahlung:", err);
  }
});
