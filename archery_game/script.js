// Game variables
let canvas, ctx, score = 0, shotsLeft = 10, gameActive = false;
let targetX = 100, targetY = 200, targetRadius = 50, targetSpeed;
let arrows = [];
let difficulty = 'medium';

// Difficulty settings
const difficultySettings = {
    easy: { speed: 2, targetRadius: 60 },
    medium: { speed: 4, targetRadius: 50 },
    hard: { speed: 6, targetRadius: 40 }
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    document.getElementById('startBtn').addEventListener('click', startGame);
    canvas.addEventListener('click', shootArrow);
    document.getElementById('difficulty').addEventListener('change', (e) => {
        difficulty = e.target.value;
    });
});

// Start the game
function startGame() {
    if (gameActive) return;
    gameActive = true;
    score = 0;
    shotsLeft = 10;
    arrows = [];
    targetSpeed = difficultySettings[difficulty].speed;
    targetRadius = difficultySettings[difficulty].targetRadius;
    updateScoreDisplay();
    document.getElementById('startBtn').textContent = 'Restart Game';
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (!gameActive) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw target
    drawTarget();

    // Move target
    moveTarget();

    // Draw arrows
    drawArrows();

    // Check collisions
    checkCollisions();

    // Update game state
    if (shotsLeft <= 0) {
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Draw the target (concentric circles)
function drawTarget() {
    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(targetX, targetY, targetRadius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

// Move the target horizontally
function moveTarget() {
    targetX += targetSpeed;
    if (targetX + targetRadius > canvas.width || targetX - targetRadius < 0) {
        targetSpeed = -targetSpeed;
    }
}

// Shoot an arrow
function shootArrow(event) {
    if (!gameActive || shotsLeft <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    arrows.push({ x, y });
    shotsLeft--;
    updateScoreDisplay();
}

// Draw all arrows on the canvas
function drawArrows() {
    arrows.forEach(arrow => {
        ctx.beginPath();
        ctx.moveTo(arrow.x, arrow.y);
        ctx.lineTo(arrow.x, arrow.y - 20); // Arrow shaft
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(arrow.x - 5, arrow.y - 15);
        ctx.lineTo(arrow.x, arrow.y - 25); // Arrowhead left
        ctx.lineTo(arrow.x + 5, arrow.y - 15); // Arrowhead right
        ctx.fillStyle = '#FF4500';
        ctx.fill();
        ctx.closePath();
    });
}

// Check if arrows hit the target and update score
function checkCollisions() {
    arrows.forEach((arrow, index) => {
        const dist = Math.hypot(arrow.x - targetX, arrow.y - targetY);
        if (dist <= targetRadius) {
            if (dist <= targetRadius * 0.1) score += 50; // Bullseye
            else if (dist <= targetRadius * 0.4) score += 30; // Yellow
            else if (dist <= targetRadius * 0.7) score += 20; // White
            else score += 10; // Red
            arrows.splice(index, 1); // Remove arrow after hit
            updateScoreDisplay();
        }
    });
}

// Update score and shots display
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('shots').textContent = shotsLeft;
}

// End the game
function endGame() {
    gameActive = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2, canvas.height / 2);
    document.getElementById('startBtn').textContent = 'Start Game';
}

// Reset game state on difficulty change or restart
function resetGame() {
    gameActive = false;
    arrows = [];
    score = 0;
    shotsLeft = 10;
    updateScoreDisplay();
}