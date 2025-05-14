document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const chatSection = document.getElementById("chat-section");
  const loginSection = document.getElementById("login-section");
  const payBtn = document.getElementById("pay-btn");

  if (!window.Pi) {
    alert("Bitte öffne diese App im offiziellen Pi Browser.");
    return;
  }

  loginBtn.addEventListener("click", async () => {
    try {
      const scopes = ["username", "payments"];
      const isSandbox = window.location.search.includes("sandbox=true");

      const auth = await window.Pi.authenticate(
        scopes,
        onIncompletePaymentFound,
        { sandbox: isSandbox }
      );

      console.log("Login erfolgreich: ", auth.user.username);
      sessionStorage.setItem("pi_username", auth.user.username);
      loginSection.style.display = "none";
      chatSection.style.display = "block";

    } catch (err) {
      console.error("Login fehlgeschlagen:", err);
      alert("Login fehlgeschlagen. Stelle sicher, dass du im Pi Browser bist und die App korrekt geöffnet wurde.");
    }
  });

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
            alert("Zahlung erfolgreich! Du kannst jetzt mit de
