
// Estructura inicial del proyecto y lógica del juego


/**
 * Creación del tablero de juego (Módulo Gameboard)
 * Explicacion: Utilizamos una IIEF para encapsular el estado del tablero dentro del módulo Gameboard.
 * Creamos la funcion getBoard que devuelve el estado del tablero.
 * Creamos la función setMark que deja colocar 'X' o 'O' en una celda si esta está vacía.
 * Creamos la función resetBoard que deja el tablero vacío nuevamente.
 */
const Gameboard = (function() {
  // Array de 9 elementos representando el tablero de juego
  let board = Array(9).fill(""); 

  // Funcion que devuelve el estado del tablero
  const getBoard = () => board;

  const setMark = (index, mark) => {
    // Comprobamos si la celda que queremos marcar está vacia
    if (index >= 0 && index < board.length && !board[index]) {
      board[index] = mark;
    }
  };

  const resetBoard = () => {
    board = Array(9).fill("");
  }

  const render = () => {
    // Selecciona en el DOM el elemento con id 'gameboard'
    const gameBoardHTML = document.querySelector("#gameboard");
    // Limpia el contenido acutal del elemento 'gameboard'
    gameBoardHTML.innerHTML= "";
    // Recorre cada celda del tablero
    board.forEach((square, index) => {
      // Crea un nuevo elemento 'div' para representar la celda
      const squareElement = document.createElement("div");
      // Le agrega la clase 'square' para darle estilos desde el .css
      squareElement.classList.add("square");
      // Establece el texto interno del div como el valor de la celda actual (square). Esto puede ser "X", "O" o una cadena vacía "".
      squareElement.textContent = square;
      // Establece un atributo 'data-index' con el índice de la celda
      squareElement.setAttribute("data-index", index);
      // Agrega el nuevo div al elmento '#gameboard'
      gameBoardHTML.appendChild(squareElement);
    });
    };

  return {
    getBoard,
    setMark,
    resetBoard,
    render,
  };
})();

/**
 * Crear los objetos player
 * Utilizamos una factory function con sus propiedades (name y marker).
 * Métodos: getName y getMarker devuelven un objeto con las propiedades del jugador
 */
const Player = (name, marker) => { //Propiedades del jugador
  const getName = () => name; // Devuelve el nombre del jugador
  const getMarker = () => marker; // Devuelve el marca del jugador ('X' o 'O').

  return {
    getName,
    getMarker,
  };
};

/**
 * Creación del objeto GameController (Módulo )
 * Manejará el flujo del juego inicializando a los jugadores y 
 * almacenando el índice del jugador actual.
 */

const GameController = (function() {
  //Array para almacenar a los jugadores
  let players = [];
  // Índice del jugador actual
  let currentPlayerIndex;
  // Inicializamos el estado del juego
  let gameOver;

  //Inicializar el juego con dos jugadores
  const initializeGame = (playerName1, playerName2) => {
    if (!playerName1 || !playerName2) {
      alert("Both players need to enter their names.");
      return;
    }
    players = [Player(playerName1, "X"), Player(playerName2, "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    // Reseteamos el tablero y lo mostramos en el DOM
    Gameboard.resetBoard();
    Gameboard.render();
  };

  // Función para verificar el ganador
  const checkWinner = () => {
    // Obtener el estado actual del tablero.
    const board = Gameboard.getBoard();
    // Definimos las combinaciones ganadoras
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6]            // Diagonales
    ];

    // Verifica si alguna combinación está presente en el tablero con el método some().
    // Descomponer la lógica dentro del método some().
    return winningCombinations.some(combination => {
      // Estrae los índices de la combinación actual y los asigna a las variables 'a', 'b'y 'c'
      const [a, b, c] = combination;
      /**
       * Verifica si los tres índices contienen el mismo valor 'no vacío'
       * board[a]: Verifica que la celda en la posición a no esté vacía (es decir, tiene un marcador "X" o "O").
       * board[a] === board[b]: Verifica que el valor en la celda a sea igual al valor en la celda b.
       * board[a] === board[c]: Verifica que el valor en la celda a sea igual al valor en la celda c.
       */
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  };

  const playRound = (index) => {
    if (!gameOver) {
      currentPlayer = players[currentPlayerIndex];
      Gameboard.setMark(index, currentPlayer.getMarker());
      Gameboard.render();
      if (checkWinner()) {
        gameOver = true;
        alert(`${currentPlayer.getName()} wins!`);
      } else if (Gameboard.getBoard().every(cell => cell !== "")) {
        gameOver = true;
        alert("It's a tie!");
      } else {
        currentPlayerIndex = 1 - currentPlayerIndex;
      }
    }
  };

  return {
    initializeGame,
    checkWinner,
    playRound
  };

})();

// Evento para inicializar el juego

document.getElementById("start-btn").addEventListener('click', () => {
  const player1Name = document.getElementById('player1').value;
  const player2Name = document.getElementById('player2').value;

  GameController.initializeGame(player1Name, player2Name);
  console.log(`${player1Name} is player 1 and ${player2Name} is player 2`)
});

// Evento para manejar los click en el tablero de juego

document.addEventListener("DOMContentLoaded", () => {
  Gameboard.render();
  document.querySelector("#gameboard").addEventListener("click", (e) => {
    if (e.target.classList.contains("square")) {
      const index = parseInt(e.target.getAttribute("data-index"));
      GameController.playRound(index);
    }
  });
});

document.getElementById('restart-btn').addEventListener('click', () => {
  Gameboard.resetBoard();
  Gameboard.render();
});