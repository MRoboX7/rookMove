import './style.css'
import Phaser from 'phaser';
import ChessBoard from './src/phaser/scene';
import IntroScene from './src/phaser/intro';

const config = {
    type: Phaser.AUTO,
    width: 375,
    height: 667,
    id: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [IntroScene,ChessBoard]
};

// Create a Phaser game instance
const game = new Phaser.Game(config);

// Add HTML content as an overlay
document.querySelector('#app').innerHTML = `
    <div>
    </div>
`;
