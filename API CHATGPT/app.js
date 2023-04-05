// Define constantes con los palos y valores de las cartas
const PALOS = ['C', 'D', 'H', 'S'];
const VALORES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Función para crear una baraja de cartas
function crearBaraja() {
  let baraja = [];
  for (let palo of PALOS) {
    for (let valor of VALORES) {
      baraja.push(valor + palo);
    }
  }
  return baraja;
}

// Función para barajar la baraja
function barajar(baraja) {
  for (let i = baraja.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
  }
  return baraja;
}

// Función para tomar una carta de la baraja
function tomarCarta(baraja) {
  return baraja.pop();
}

// Función para obtener el valor de una carta
function valorCarta(carta) {
  const valor = carta.slice(0, -1);
  if (valor === 'A') {
    return 11;
  } else if (['K', 'Q', 'J'].includes(valor)) {
    return 10;
  } else {
    return parseInt(valor);
  }
}

// Función para obtener el valor de una mano
function valorMano(mano) {
  let valor = 0;
  let tieneAs = false;
  for (let carta of mano) {
    valor += valorCarta(carta);
    if (carta.slice(0, -1) === 'A') {
      tieneAs = true;
    }
  }
  if (tieneAs && valor > 21) {
    valor -= 10;
  }
  return valor;
}

// Función para mostrar una mano en el DOM
function mostrarMano(mano, elemento) {
  let html = '';
  for (let carta of mano) {
    html += `<div class="carta">${carta}</div>`;
  }
  elemento.innerHTML = html;
}

// Función para mostrar el valor de una mano en el DOM
function mostrarValorMano(mano, elemento) {
  elemento.innerHTML = valorMano(mano);
}

// Función para mostrar un mensaje en el DOM
function mostrarMensaje(mensaje, elemento) {
  elemento.innerHTML = mensaje;
}

// Variables para guardar el estado del juego
let baraja = crearBaraja();
let manoJugador = [tomarCarta(baraja), tomarCarta(baraja)];
let manoDealer = [tomarCarta(baraja), tomarCarta(baraja)];
let valorManoJugador = valorMano(manoJugador);
let valorManoDealer = valorMano(manoDealer);
let mensaje = '';

// Elementos del DOM
const dealerHandElement = document.getElementById('dealer-hand');
const dealerHandValueElement = document.getElementById('dealer-hand-value');
const playerHandElement = document.getElementById('player-hand');
const playerHandValueElement = document.getElementById('player-hand-value');
const hitButton = document.getElementById('hit');
const stayButton = document.getElementById('stay');
const messageElement = document.getElementById('message');
// Mostrar la mano del jugador y la carta visible del dealer
mostrarMano(manoJugador, playerHandElement);
dealerHandElement.innerHTML = `<div class="carta">${manoDealer[0]}</div><div class="carta">??</div>`;


// Mostrar el valor de la mano del jugador y la carta visible del dealer
mostrarValorMano(manoJugador, playerHandValueElement);
dealerHandValueElement.innerHTML = valorCarta(manoDealer[0]);

// Función para mostrar la mano completa del dealer y su valor
function mostrarManoDealerCompleta() {
mostrarMano(manoDealer, dealerHandElement);
mostrarValorMano(manoDealer, dealerHandValueElement);
}

// Función para verificar si la mano del jugador está pasada de 21
function verificarPasado21() {
if (valorManoJugador > 21) {
mensaje = 'Perdiste! Pasaste de 21.';
mostrarMensaje(mensaje, messageElement);
mostrarManoDealerCompleta();
hitButton.disabled = true;
stayButton.disabled = true;
return true;
}
return false;
}

// Función para el botón Hit
hitButton.addEventListener('click', function() {
manoJugador.push(tomarCarta(baraja));
valorManoJugador = valorMano(manoJugador);
mostrarMano(manoJugador, playerHandElement);
mostrarValorMano(manoJugador, playerHandValueElement);
if (verificarPasado21()) {
return;
}
});

// Función para el botón Stay
stayButton.addEventListener('click', function() {
while (valorManoDealer < 17) {
manoDealer.push(tomarCarta(baraja));
valorManoDealer = valorMano(manoDealer);
}
mostrarManoDealerCompleta();
if (valorManoDealer > 21 || valorManoJugador > valorManoDealer) {
mensaje = 'Ganaste!';
} else if (valorManoJugador === valorManoDealer) {
mensaje = 'Empate!';
} else {
mensaje = 'Perdiste!';
}
mostrarMensaje(mensaje, messageElement);
hitButton.disabled = true;
stayButton.disabled = true;
});

// Mostrar la mano completa del dealer si el jugador aún no ha perdido
if (!verificarPasado21()) {
mostrarManoDealerCompleta();
}
