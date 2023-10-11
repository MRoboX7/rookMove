// In IntroScene.js
import Phaser from 'phaser';
import io from 'socket.io-client';

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // Load any assets needed for your intro, e.g., background music
        this.load.audio('arcade_music', '/audio/arcadeauto.mp3');
    }

    create() {
        const music = this.sound.add('arcade_music');
        music.play();

        // Create a socket connection to the server
        const socket = io('http://localhost:3000');

        // Show a "Start" button
        const startButton = this.add.text(187.5, 532.25, 'Start', {
            font: '36px Arial',
            fill: '#fff',
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive();

        // Listen for the 'playerCount' event from the server
        socket.on('playerCount', (count) => {
            if (count >= 2) {
                music.stop(); // Stop the intro music

                // Transition to the ChessBoard scene when the button is clicked
                startButton.on('pointerdown', () => {
                    this.scene.start('ChessBoard', { socket });
                });
            } else {
                // Show a waiting screen
                const waitingText = this.add.text(187.5, 332.25, 'Waiting for players...', {
                    font: '18px Arial',
                    fill: '#fff',
                });
                waitingText.setOrigin(0.5);
            }
        });
    }
}

export default IntroScene;
