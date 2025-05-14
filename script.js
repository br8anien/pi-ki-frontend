document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const chatSection = document.getElementById("chat-section");
  const loginSection = document.getElementById("login-section");
  const payBtn = document.getElementById("pay-btn");

  // Prüfen, ob Pi SDK verfügbar ist
  if (!window.Pi) {
    alert("Bitte öffne diese App im offiziellen Pi Browser.");
    return;
  }

  // === PI WALLET LOGIN ===
  loginBtn.addEventListener("click", async () => {
    try {
      const scopes = ["username", "payments"];

      const auth = await window.Pi.authenticate(
        scopes,
        onIncompletePaymentFound,
        { sandbox: true } // Wichtig: Sandbox-Modus aktivieren
      );

      console.log("Login erfolgreich: ", auth.user.username);
      sessionStorage.setItem("pi_username", auth.user.username);
      loginSection.style.display = "none";
      chatSection.style.display = "block";

    } catch (err) {
      console.error("Login fehlgeschlagen:", err);
      alert("Login fehlgeschlagen. Stelle sicher, dass du im Pi Browser bist und die App registriert ist.");
    }
  });

  // === ZAHLUNG MIT 1 PI ===
  if (payBtn) {
    payBtn.addEventListener("click", async () => {
      const paymentData = {
        amount: 1,
        memo: "Zugang zur KI",
        metadata: { type: "pi_ki_chat_access" },
        to: "GDBPMB7FOCW4N67KNTVGVRGJKU7VIFOIZCYLCAG6EMT4TU6DK7YKK6PH"
      };

      try {
        const payment = await window.Pi.createPayment(paymentData, {
          onReadyForServerApproval: paymentId => {
            console.log("Zahlung zur Genehmigung bereit:", paymentId);
          },
          onReadyForServerCompletion: paymentId => {
            console.log("Zahlung abgeschlossen:", paymentId);
            alert("Zahlung erfolgreich! Du kannst jetzt mit der KI chatten.");
          },
          onCancel: error => {
            console.error("Zahlung vom Nutzer abgebrochen", error);
            alert("Zahlung abgebrochen.");
          },
          onError: error => {
            console.error("Zahlungsfehler:", error);
            alert("Zahlung fehlgeschlagen.");
          }
        });
      } catch (err) {
        console.error("Fehler beim Erstellen der Zahlung:", err);
        alert("Zahlung konnte nicht gestartet werden.");
      }
    });
  }

  // === EVENT FÜR UNVOLLSTÄNDIGE ZAHLUNGEN (Pi SDK-Vorgabe) ===
  async function onIncompletePaymentFound(payment) {
    console.log("Unvollständige Zahlung gefunden:", payment);
    // Optional: Zahlung erneut verarbeiten
  }
});
