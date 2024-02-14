import React, { useState, useEffect } from "react";
import "./App.css";
import plane from "./plane.png";
import enemy1 from "./enemy1.png"; // Import different enemy flights
import enemy2 from "./enemy2.png";
import enemy3 from "./enemy3.png";
import enemy4 from "./enemy4.png";
import enemy6 from "./enemy6.png";
import enemy7 from "./enemy7.png";
import bombSound from "./bomb.mp3"; // Import the sound file
import Gunsound from "./gun.mp3"; // Import the sound file
import explosionImg from "./explosion.png"; // Import explosion image
import tntBomb from "./bomb.png"; // Import tnt bomb image

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const BULLET_SIZE = 5;
const BULLET_SPEED = 5;
const ENEMY_WIDTH = 70;
const ENEMY_HEIGHT = 70;
const ENEMY_SPEED = 2;
const ENEMY_BULLET_SPEED = 3;
const TNT_WIDTH = 30;
const TNT_HEIGHT = 30;

const Player = ({ x, y }) => {
  return (
    <img
      src={plane}
      alt="Aeroplane"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
      }}
    />
  );
};

const Bullet = ({ x, y }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: `${BULLET_SIZE}px`,
        height: `${BULLET_SIZE}px`,
        backgroundColor: "red",
      }}
    />
  );
};

const Enemy = ({ x, y, type }) => {
  let enemyImage;
  switch (type) {
    case 1:
      enemyImage = enemy1;
      break;
    case 2:
      enemyImage = enemy2;
      break;
    case 3:
      enemyImage = enemy3;
      break;
    case 4:
      enemyImage = enemy4;
      break;
    case 5:
      enemyImage = enemy6;
      break;
    case 6:
      enemyImage = enemy7;
      break;
    default:
      enemyImage = enemy6;
      break;
  }
  return (
    <img
      src={enemyImage}
      alt={`Enemy ${type}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: `${ENEMY_WIDTH}px`,
        height: `${ENEMY_HEIGHT}px`,
      }}
    />
  );
};

const Explosion = ({ x, y }) => {
  return (
    <img
      src={explosionImg}
      alt="Explosion"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: `${ENEMY_WIDTH}px`, // Adjust width and height according to your explosion image size
        height: `${ENEMY_HEIGHT}px`, // Adjust width and height according to your explosion image size
      }}
    />
  );
};


const SpecialPower = ({ x, y }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: `${BULLET_SIZE}px`,
        height: `${BULLET_SIZE}px`,
        backgroundColor: "yellow",
      }}
    />
  );
};
const TNTBomb = ({ x, y }) => {
  return (
    <img
      src={tntBomb}
      alt="TNT Bomb"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: `${TNT_WIDTH}px`,
        height: `${TNT_HEIGHT}px`,
      }}
    />
  );
};

const GameOverPopover = ({ score, onRestart }) => {
  return (
    <div className="game-over-popover">
      <h2>Game Over!</h2>
      <p>Your Score: {score}</p>
      <button onClick={onRestart}>Restart Game</button>
    </div>
  );
};

const Game = () => {
  const [playerX, setPlayerX] = useState(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [playerY, setPlayerY] = useState(CANVAS_HEIGHT - PLAYER_HEIGHT - 20);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [explosions, setExplosions] = useState([]);
  const [ammo, setAmmo] = useState([]); // State for ammo
  const [ammoCount, setAmmoCount] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [tntBombs, setTNTBombs] = useState([]);
  const [specialPowers, setSpecialPowers] = useState([]);

  useEffect(() => {
    const explosionTimeout = setTimeout(() => {
      setExplosions([]);
    }, 500);

    return () => clearTimeout(explosionTimeout);
  }, [explosions]);

  useEffect(() => {
    const moveEnemies = () => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => ({ ...enemy, y: enemy.y + ENEMY_SPEED }))
      );

      // Check if any enemy has reached the bottom of the canvas
      setEnemies((prevEnemies) =>
        prevEnemies.filter((enemy) => enemy.y < CANVAS_HEIGHT)
      );
    };

    const enemyMoveInterval = setInterval(moveEnemies, 5); // Move enemies every 16ms (60 fps)

    return () => clearInterval(enemyMoveInterval);
  }, [enemies, enemyBullets]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameOver) {
        if (e.key === "ArrowLeft" && playerX > 0) {
          setPlayerX(playerX - 10);
        } else if (
          e.key === "ArrowRight" &&
          playerX < CANVAS_WIDTH - PLAYER_WIDTH
        ) {
          setPlayerX(playerX + 10);
        } else if (e.key === " ") {
          const audio = new Audio(Gunsound);
          audio.play();
          const newBullet = {
            x: playerX + PLAYER_WIDTH / 2 - BULLET_SIZE / 2,
            y: playerY,
          };
          setBullets([...bullets, newBullet]);
        }
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === " ") {
        e.preventDefault(); // Prevent scrolling when space is pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [playerX, playerY, bullets, gameOver]);

  useEffect(() => {
    const moveBullets = () => {
      setBullets(
        bullets.map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
      );
    };

    const bulletInterval = setInterval(moveBullets, 16); // Move bullets every 16ms (60 fps)

    return () => clearInterval(bulletInterval);
  }, [bullets]);

  useEffect(() => {
    const moveEnemyBullets = () => {
      setEnemyBullets(
        enemyBullets.map((bullet) => ({
          ...bullet,
          y: bullet.y + ENEMY_BULLET_SPEED,
        }))
      );
    };

    const enemyBulletInterval = setInterval(
      moveEnemyBullets,
      16
    ); // Move enemy bullets every 16ms (60 fps)

    return () => clearInterval(enemyBulletInterval);
  }, [enemyBullets]);

  useEffect(() => {
    const spawnEnemy = () => {
      const x = Math.random() * (CANVAS_WIDTH - ENEMY_WIDTH);
      const type = Math.floor(Math.random() * 6) + 1; // Randomly select enemy type between 1 and 6
      setEnemies((prevEnemies) => [
        ...prevEnemies,
        { x, y: -ENEMY_HEIGHT, type },
      ]);
    };

    const enemyInterval = setInterval(spawnEnemy, 500); // Spawn enemies every 2 seconds

    return () => clearInterval(enemyInterval);
  }, []);

  useEffect(() => {
    const moveTNTBombs = () => {
      setTNTBombs((prevBombs) =>
        prevBombs.map((bomb) => ({ ...bomb, y: bomb.y + 2 }))
      );
    };

    const tntBombInterval = setInterval(moveTNTBombs, 16); // Move TNT bombs every 16ms (60 fps)

    return () => clearInterval(tntBombInterval);
  }, [tntBombs]);

  useEffect(() => {
    const spawnTNTBomb = () => {
      const x = Math.random() * (CANVAS_WIDTH - TNT_WIDTH);
      setTNTBombs((prevBombs) => [...prevBombs, { x, y: -TNT_HEIGHT }]);
    };

    const tntSpawnInterval = setInterval(spawnTNTBomb, 5000); // Spawn TNT bombs every 5 seconds

    return () => clearInterval(tntSpawnInterval);
  }, []);

  useEffect(() => {
    // Check for collisions between bullets and enemies
    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        if (
          bullet.x < enemy.x + ENEMY_WIDTH &&
          bullet.x + BULLET_SIZE > enemy.x &&
          bullet.y < enemy.y + ENEMY_HEIGHT &&
          bullet.y + BULLET_SIZE > enemy.y
        ) {
          // Collision detected, remove bullet and enemy
          setBullets((prevBullets) =>
            prevBullets.filter((_, index) => index !== bulletIndex)
          );
          setEnemies((prevEnemies) =>
            prevEnemies.filter((_, index) => index !== enemyIndex)
          );
          // Increase score by 2
          setScore((prevScore) => prevScore + 2);
          // Play the bomb sound effect
          const audio = new Audio(bombSound);
          audio.play();
          setExplosions((prevExplosions) => [
            ...prevExplosions,
            { x: enemy.x, y: enemy.y },
          ]);
          setTimeout(() => {
            setExplosions((prevExplosions) =>
              prevExplosions.filter((_, index) => index !== enemyIndex)
            );
          }, 500); // Remove explosion after 1 second
        }
      });
    });

    // Check for collisions between player and enemies
    enemies.forEach((enemy) => {
      const playerLeft = playerX;
      const playerRight = playerX + PLAYER_WIDTH;
      const playerTop = playerY;
      const playerBottom = playerY + PLAYER_HEIGHT;

      const enemyLeft = enemy.x;
      const enemyRight = enemy.x + ENEMY_WIDTH;
      const enemyTop = enemy.y;
      const enemyBottom = enemy.y + ENEMY_HEIGHT;

      if (
        playerLeft < enemyRight &&
        playerRight > enemyLeft &&
        playerTop < enemyBottom &&
        playerBottom > enemyTop
      ) {
        setGameOver(true);
      }
    });

    // Check for collisions between TNT bombs and bullets
    tntBombs.forEach((bomb, bombIndex) => {
      bullets.forEach((bullet, bulletIndex) => {
        if (
          bullet.x < bomb.x + TNT_WIDTH &&
          bullet.x + BULLET_SIZE > bomb.x &&
          bullet.y < bomb.y + TNT_HEIGHT &&
          bullet.y + BULLET_SIZE > bomb.y
        ) {
          // Collision detected, remove bomb, bullets, and enemies
          setTNTBombs((prevBombs) =>
            prevBombs.filter((_, index) => index !== bombIndex)
          );
          setBullets([]);
          setEnemies([]);
          // Play the bomb sound effect
          const audio = new Audio(bombSound);
          audio.play();
          // Increase score by 10
          setScore((prevScore) => prevScore + 10);
          // Add explosion for all enemies
          const enemyExplosions = enemies.map((enemy) => ({
            x: enemy.x,
            y: enemy.y,
          }));
          setExplosions(enemyExplosions);
          setTimeout(() => {
            setExplosions([]);
          }, 1000); // Remove explosion after 1 second
        }
      });
    });
  }, [playerX, playerY, bullets, enemies, tntBombs]);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="App">
  <div className="game-container">
    {/* Add the cloud background */}
    <div className="cloud-background"></div>
    
    {/* Render game elements */}
    <Player x={playerX} y={playerY} />
    {bullets.map((bullet, index) => (
      <Bullet key={index} x={bullet.x} y={bullet.y} />
    ))}
    {enemies
      .filter((enemy) => enemy.y < CANVAS_HEIGHT)
      .map((enemy, index) => (
        <Enemy key={index} x={enemy.x} y={enemy.y} type={enemy.type} />
      ))}
    {tntBombs.map((bomb, index) => (
      <TNTBomb key={index} x={bomb.x} y={bomb.y} />
    ))}
    {explosions.map((explosion, index) => (
      <Explosion key={index} x={explosion.x} y={explosion.y} />
    ))}
  </div>
  {gameOver && (
    <>
      <GameOverPopover score={score} onRestart={handleRestart} />
      <div className="game-over-text">Game Over!</div>
    </>
  )}
  <div className="score">Score: {score}</div>
  <p>
    Game instructions: use arrow keys "left" and "right" to move and press
    "space" to shoot! Enjoy your game!
  </p>
  <button onClick={handleRestart}>Restart game</button>
</div>

  );
};

export default Game;
