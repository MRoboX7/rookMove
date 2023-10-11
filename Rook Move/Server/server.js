import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.get('/', (req, res) => {
  res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

const chessboardState = initializeChessboardState();
const players = [];
const turnTimeout = 30000; // 30 seconds 

function initializeChessboardState() {
  return {
    rookPosition: { x: 7, y: 0 },
    currentPlayer: 1,
  };
}

io.on('connection', (socket) => {
  console.log('A player has connected');
  let timer; // Timer for the current player's turn

  // Assign a unique player ID to the connected player
  const playerId = players.length + 1;

  // Add the player to the list
  const player = {
    id: playerId,
    socket: socket,
  };
  players.push(player);
  io.emit('playerCount', players.length);

  socket.on('clientReady', () => {
    // Emit the player's ID to the client so they can identify themselves
    socket.emit('playerId', playerId);

    // When the client is ready, emit the 'initialGameState'
    socket.emit('initialGameState', chessboardState);
  });

  socket.on('moveRook', (newPosition) => {
    // Identify the current player by their player ID
    const currentPlayer = players.find((p) => p.socket === socket);
    if (currentPlayer && chessboardState.currentPlayer === currentPlayer.id) {
      clearTimeout(timer); // Reset the timer for the current player's turn
      
      chessboardState.rookPosition = newPosition;
      // Switch the current player's turn
      chessboardState.currentPlayer = currentPlayer.id === 1 ? 2 : 1;

      // Broadcast the move and the current player to all players
      io.emit('updateGameState', chessboardState);

      if (newPosition.x === 0 && newPosition.y === 7) {
        // The current player has won
        io.to(currentPlayer.socket.id).emit('gameOver', 'Congratulations! You win!');
        // The other player has lost
        const otherPlayer = players.find((p) => p.id !== currentPlayer.id);
        io.to(otherPlayer.socket.id).emit('gameOver', 'Sorry, you lost. Your opponent reached the corner.');
        return; // Game is over, no need to continue
      }
    }
  });

  // Set a timer for the current player's turn
  function startTurnTimer() {
    timer = setTimeout(() => {
      // Declare the other player as the winner
      const currentPlayer = players.find((p) => p.socket === socket);
      const otherPlayer = players.find((p) => p.id !== currentPlayer.id);
      io.to(otherPlayer.socket.id).emit('gameOver', 'You win! Your opponent ran out of time.');
      io.to(currentPlayer.socket.id).emit('gameOver', 'OOPS! Out of time! You Lose!');
    }, turnTimeout);
  }

  socket.on('disconnect', () => {
    console.log('A player has disconnected');
    // Remove the disconnected player from the list
    const index = players.findIndex((p) => p.id === playerId);
    if (index !== -1) {
      players.splice(index, 1);
    }
  });

  // Start the timer for the first player's turn
  if (players.length === 2) {
    startTurnTimer();
  }

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
