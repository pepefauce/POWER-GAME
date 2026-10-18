// 🔗 URL de tu dApp principal de pago
const DAPP_PRINCIPAL_URL = "https://pepe-fauce.pages.dev";

// 🛡️ GUARDIÁN DE ACCESO (APAGADO AUTOMÁTICO A LAS 24 HORAS)
(function checkAccessAndExpiry() {
    const urlParams = new URLSearchParams(window.location.search);
    const walletParam = urlParams.get("wallet");
    const expiryParam = urlParams.get("expiry");

    // 1. Si viene con parámetros de pago frescos desde la dApp principal, guarda el pase localmente
    if (walletParam && expiryParam) {
        localStorage.setItem("game_wallet", walletParam.toLowerCase());
        localStorage.setItem("game_expiry", expiryParam);
        // Limpia la URL borrando los parámetros visibles sin recargar
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const storedExpiry = localStorage.getItem("game_expiry");
    const now = Date.now();

    // 2. Si no hay pase o ya pasaron las 24 horas, apaga el acceso y regresa a la dApp principal
    if (!storedExpiry || now >= parseInt(storedExpiry)) {
        alert("🔒 El pase de 24 horas ha caducado o no está activo. Vuelve a la dApp principal para renovarlo.");
        localStorage.removeItem("game_expiry");
        window.location.href = DAPP_PRINCIPAL_URL;
        return;
    }

    // 3. Si el pase sigue activo, calcula el tiempo restante exacto
    const timeLeftMs = parseInt(storedExpiry) - now;
    
    // Programar apagado automático en tiempo real cuando se cumplan las 24h estando dentro
    setTimeout(() => {
        alert("⏳ Tus 24 horas de acceso han finalizado.");
        localStorage.removeItem("game_expiry");
        window.location.href = DAPP_PRINCIPAL_URL;
    }, timeLeftMs);
})();

// Botón para salir manualmente de regreso a la dApp principal
function exitToMainDapp() {
    window.location.href = DAPP_PRINCIPAL_URL;
}

// Reloj en pantalla mostrando las horas/minutos/segundos restantes del pase
function startTimerDisplay() {
    const expiry = localStorage.getItem("game_expiry");
    const timerEl = document.getElementById("timerDisplay");

    if (!expiry || !timerEl) return;

    function update() {
        const diff = parseInt(expiry) - Date.now();
        if (diff <= 0) {
            timerEl.innerText = "Pase Expirado";
            window.location.href = DAPP_PRINCIPAL_URL;
            return;
        }
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        timerEl.innerText = `Tiempo restante: ${hrs}h ${mins}m ${secs}s`;
    }

    update();
    setInterval(update, 1000);
}

// Inicializar la grilla táctica de ejemplo del juego
function initGrid() {
    const gridContainer = document.getElementById("gameGrid");
    if (!gridContainer) return;
    gridContainer.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.className = "game-cell bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-xl cursor-pointer hover:border-emerald-500/50 transition select-none aspect-square";
        cell.innerHTML = "⚡";
        cell.onclick = () => {
            cell.innerHTML = cell.innerHTML === "⚡" ? "💥" : "⚡";
        };
        gridContainer.appendChild(cell);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    startTimerDisplay();
    initGrid();
});
