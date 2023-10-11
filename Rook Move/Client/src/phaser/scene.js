import Phaser from "phaser";

class ChessBoard extends Phaser.Scene {
  constructor() {
    super({ key: "ChessBoard" });
  }

  preload() {
    this.load.svg('rook', '/images/rook.svg', { width: 40, height: 40 });
    this.load.svg('rookDown', '/images/rook_down.svg', { width: 40, height: 40 });
    this.load.svg('rookLeft', '/images/rook_left.svg', { width: 40, height: 40 });
    this.load.svg('finish', '/images/check.svg', { width: 60, height: 60 });
    this.load.svg('player', '/images/player.svg', { width: 75, height: 75 });
  }

  init(data) {
    // Access the socket instance passed from IntroScene
    this.socket = data.socket;
  }

  create() {
    let player = null;
    const sq = 41.77;

    function highlightValidMoves() {
      if (isRookActive) {
        // Create an array to store the square sprites
        const squares = [];
    
        // Loop through the squares and highlight them
        for (let x = rookPositionX - 1; x >= 0; x--) {
          const squareX = 20.42 + x * sq + sq / 2;
          const squareY = 166.42 + rookPositionY * sq + sq / 2;
    
          // Create a square sprite with breathing animation
          const square = scene.add.sprite(squareX, squareY, "square");
          square.setScale(0.75); // Initial scale for the breathing effect
    
          // Add an animation to the square
          scene.tweens.add({
            targets: square,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1, // Infinite animation
          });
    
          // Event listener for tap or click on the square
          square.setInteractive();
          square.on("pointerdown", () => {
            if (isRookActive) {
              // Move the rook to the selected square
              scene.socket.emit("moveRook", { x: x, y: rookPositionY });
              toggleRookActivity(); // Deactivate the rook
    
              // Remove the square highlights
              squares.forEach((s) => s.destroy());
            }
          });
    
          // Add the square to the array
          squares.push(square);
        }
    
        for (let y = rookPositionY + 1; y <= 7; y++) {
          const squareX = 20.42 + rookPositionX * sq + sq / 2;
          const squareY = 166.42 + y * sq + sq / 2;
    
          // Create a square sprite with breathing animation
          const square = scene.add.sprite(squareX, squareY, "square");
          square.setScale(1.1); // Initial scale for the breathing effect
    
          // Add an animation to the square
          scene.tweens.add({
            targets: square,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1, // Infinite animation
          });
    
          // Event listener for tap or click on the square
          square.setInteractive();
          square.on("pointerdown", () => {
            if (isRookActive) {
              // Move the rook to the selected square
              scene.socket.emit("moveRook", { x: rookPositionX, y: y });
              toggleRookActivity(); // Deactivate the rook
    
              // Remove the square highlights
              squares.forEach((s) => s.destroy());
            }
          });
    
          // Add the square to the array
          squares.push(square);
        }
      }
    }
    
    function toggleRookActivity() {
      isRookActive = !isRookActive;
      // Add or remove animation, or change sprite appearance to indicate activity
      if (isRookActive) {
        rook.setAlpha(0.7); // Make the rook slightly transparent to indicate it's active
      } else {
        rook.setAlpha(1); // Reset the rook's transparency
      }
    }

    function getMovementDirection(oldX, oldY, newX, newY) {
    if (newX < oldX) {
        return "left";
      } else if (newY > oldY) {
        return "down";
      }
    }

    function getRookImageKey(direction) {
      // Choose the appropriate image key based on the direction
      switch (direction) {
        case "left":
          return "rookLeft";
        case "down":
          return "rookDown";
        default:
          return "rook"; // Default to the "rook" image
      }
    }

    // vertical grid line
    for (let i = 0; i <= 8; i++) {
      const x = 20.42 + i * sq; // Adjust spacing as needed
      this.add.line(0, 0, x, 0, x, 667, 0xffffff, 0.15).setOrigin(0, 0);
    }

    // horizontal grid lines
    for (let i = 0; i <= 15; i++) {
      const y = i * sq; // Adjust spacing as needed
      this.add.line(0, 0, 0, y, 375, y, 0xffffff, 0.15).setOrigin(0, 0);
    }

    // chessboard
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const x = 20.42 + col * sq; // Adjust spacing as needed
        const y = 166.42 + row * sq; // Adjust spacing as needed
        const isWhite = (row + col) % 2 === 0;

        if (isWhite) {
          // Create a white box
          this.add.rectangle(x, y, sq, sq, 0xffffff, 0.15).setOrigin(0, 0);
        }
      }
    }

    // labels for rows (1-8)
    for (let i = 0; i < 8; i++) {
      const y = 166.42 + sq * (i + 0.85); // Adjust positioning
      this.add
        .text(12.5, y, (i + 1).toString(), {
          font: "7.5px Arial",
          fill: "#fff",
          opacity: "0.15",
        })
        .setOrigin(0.5, 0.5);
    }

    // labels for columns (a-h)
    const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let i = 0; i < 8; i++) {
      const x = sq * (i + 0.85) + 20; // Adjust positioning
      this.add
        .text(x, 157.5, columns[i], {
          font: "7.5px Arial",
          fill: "#fff",
          opacity: "0.15",
        })
        .setOrigin(0.5, 0.5);
    }

    const finish = this.add.image(20.42+sq/2, 166.42+7.5*sq, 'finish');
    this.tweens.add({
      targets: finish,
      angle: 360, // Rotate 360 degrees (full circle)
      duration: 1500, // Rotation duration in milliseconds
      repeat: -1, // Repeat indefinitely
    });
    const playerSprite = this.add.sprite(187.5, 567, "player");

    // Store the scene context
    const scene = this;

    this.socket.emit("clientReady");

    this.socket.on("playerId", (playerId) => {
      console.log("Received playerId:", playerId);
      player = playerId;
    });

    let rook = null;
    let rookPositionX = null;
    let rookPositionY = null;
    let isRookActive = false;

    this.socket.on("initialGameState", (initialGameState) => {
      const { currentPlayer, rookPosition } = initialGameState;
      rookPositionX = rookPosition.x;
      rookPositionY = rookPosition.y;

      // rook sprite initialization
      rook = this.add.sprite(
        20.42 + rookPositionX * sq + sq / 2,
        166.42 + rookPositionY * sq + sq / 2,
        "rook"
      );

      // Enable rook interactivity for the current player
      if (currentPlayer === player) {     
  
        rook.setInteractive(); // Allow interactions for the rook

        rook.on("pointerdown", () => {
          if (!isRookActive) {
            toggleRookActivity(isRookActive);
            highlightValidMoves(); // Highlight valid move squares
          }
        });
      }
    });

    function handleUpdateGameState(updatedGameState) {
      const direction = getMovementDirection(rookPositionX, rookPositionY, updatedGameState.rookPosition.x, updatedGameState.rookPosition.y);
      rookPositionX = updatedGameState.rookPosition.x;
      rookPositionY = updatedGameState.rookPosition.y;

      animateRook(rook, direction, () => {

        if (updatedGameState.currentPlayer === player) {
          rook.setInteractive();
          rook.on("pointerdown", () => {
            if (!isRookActive) {
              toggleRookActivity(isRookActive);
              highlightValidMoves();
            }
          });
        } else {
          rook.disableInteractive();
        }
      });

    }

    function animateRook(rook, direction, onCompleteCallback) {
      // appropriate image based on the direction
      const rookImageKey = getRookImageKey(direction);
      rook.setTexture(rookImageKey);
      // tween to move the rook to the new position
      scene.tweens.add({
        targets: rook,
        x: 20.42 + rookPositionX * sq + sq / 2,
        y: 166.42 + rookPositionY * sq + sq / 2,
        duration: 2000, // Adjust the duration as needed
        onComplete: () => {
          rook.setTexture('rook'); // Set the rook's image
          onCompleteCallback();
        },
      });
    }    
    
    this.socket.on('updateGameState', (updatedGameState) => {
      handleUpdateGameState(updatedGameState);
    });

    this.socket.on('gameOver', (message) => {
      // game over message on the screen
      const gameOverText = this.add.text(187.5, 332.25, message, {
          font: '18px Arial', // You can change the font here
          fill: '#fff',
          wordWrap: { width: 325, useAdvancedWrap: true }
      });
      gameOverText.setOrigin(0.5);

      const returnButton = this.add.text(187.5, 382.25, 'Return to Intro', {
          font: '24px Arial', // You can change the font here
          fill: '#fff',
      });
      returnButton.setOrigin(0.5);
      returnButton.setInteractive();

      returnButton.on('pointerdown', () => {
          this.scene.start('IntroScene');
      });
  });
  }
}

export default ChessBoard;
