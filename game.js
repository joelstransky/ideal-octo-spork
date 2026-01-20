// Subway Surfers Clone - Three.js Game

// Game State
const GameState = {
    TITLE: 'title',
    PLAYING: 'playing',
    GAME_OVER: 'game_over',
    FINAL_GAME_OVER: 'final_game_over'
};

// Game Configuration
const CONFIG = {
    laneWidth: 3,
    laneCount: 3,
    groundLength: 200,
    obstacleSpeed: 0.3,
    spawnInterval: 1500,
    jumpHeight: 3,
    jumpDuration: 500,
    gravity: 0.015
};

// Lane positions (left, center, right)
const LANES = [
    -CONFIG.laneWidth,
    0,
    CONFIG.laneWidth
];

class Game {
    constructor() {
        this.state = GameState.TITLE;
        this.lives = 3;
        this.score = 0;
        this.currentLane = 1; // Center lane (0, 1, 2)
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.jumpStartY = 0;
        this.obstacles = [];
        this.clock = new THREE.Clock();
        this.lastSpawnTime = 0;
        this.groundTiles = [];
        
        // Initialize Three.js
        this.initThree();
        this.createScene();
        this.bindEvents();
        this.animate();
    }
    
    initThree() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 30, 100);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 1, -10);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    createScene() {
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Create player (simple blue box)
        const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
        const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x4fc3f7 });
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.set(0, 1, 0);
        this.player.castShadow = true;
        this.scene.add(this.player);
        
        // Create ground/track
        this.createGround();
        
        // Create side decorations
        this.createDecorations();
    }
    
    createGround() {
        // Main track (gray)
        const trackGeometry = new THREE.PlaneGeometry(
            CONFIG.laneWidth * CONFIG.laneCount + 2,
            CONFIG.groundLength
        );
        const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        this.track = new THREE.Mesh(trackGeometry, trackMaterial);
        this.track.rotation.x = -Math.PI / 2;
        this.track.position.z = -CONFIG.groundLength / 2 + 10;
        this.track.receiveShadow = true;
        this.scene.add(this.track);
        
        // Lane markers
        for (let i = 0; i < CONFIG.laneCount - 1; i++) {
            const markerX = -CONFIG.laneWidth * CONFIG.laneCount / 2 + CONFIG.laneWidth + i * CONFIG.laneWidth * 2 + CONFIG.laneWidth / 2;
            const markerGeometry = new THREE.PlaneGeometry(0.1, CONFIG.groundLength);
            const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.rotation.x = -Math.PI / 2;
            marker.position.set(markerX, 0.01, -CONFIG.groundLength / 2 + 10);
            this.scene.add(marker);
        }
        
        // Side rails
        const railGeometry = new THREE.BoxGeometry(0.3, 1, CONFIG.groundLength);
        const railMaterial = new THREE.MeshPhongMaterial({ color: 0xe94560 });
        
        const leftRail = new THREE.Mesh(railGeometry, railMaterial);
        leftRail.position.set(
            -CONFIG.laneWidth * CONFIG.laneCount / 2 - 1,
            0.5,
            -CONFIG.groundLength / 2 + 10
        );
        leftRail.castShadow = true;
        this.scene.add(leftRail);
        
        const rightRail = new THREE.Mesh(railGeometry, railMaterial);
        rightRail.position.set(
            CONFIG.laneWidth * CONFIG.laneCount / 2 + 1,
            0.5,
            -CONFIG.groundLength / 2 + 10
        );
        rightRail.castShadow = true;
        this.scene.add(rightRail);
    }
    
    createDecorations() {
        // Simple buildings in the background
        const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3436 });
        
        for (let i = 0; i < 20; i++) {
            const width = 3 + Math.random() * 5;
            const height = 10 + Math.random() * 20;
            const depth = 3 + Math.random() * 5;
            
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            
            const side = Math.random() > 0.5 ? 1 : -1;
            building.position.set(
                side * (15 + Math.random() * 10),
                height / 2,
                -20 - Math.random() * 80
            );
            building.castShadow = true;
            this.scene.add(building);
        }
        
        // Clouds
        const cloudMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        
        for (let i = 0; i < 10; i++) {
            const cloudGroup = new THREE.Group();
            
            for (let j = 0; j < 3; j++) {
                const cloudPartGeometry = new THREE.SphereGeometry(
                    2 + Math.random() * 2,
                    8,
                    8
                );
                const cloudPart = new THREE.Mesh(cloudPartGeometry, cloudMaterial);
                cloudPart.position.set(
                    j * 2 - 2,
                    Math.random() * 0.5,
                    Math.random() * 0.5
                );
                cloudGroup.add(cloudPart);
            }
            
            cloudGroup.position.set(
                (Math.random() - 0.5) * 60,
                30 + Math.random() * 20,
                -20 - Math.random() * 80
            );
            this.scene.add(cloudGroup);
        }
    }
    
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (this.state === GameState.PLAYING) {
                switch (e.code) {
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.switchLane(-1);
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        this.switchLane(1);
                        break;
                    case 'ArrowUp':
                    case 'Space':
                    case 'KeyW':
                        this.jump();
                        break;
                }
            }
        });
        
        // UI Events
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('title-btn').addEventListener('click', () => {
            this.showTitleScreen();
        });
    }
    
    switchLane(direction) {
        const newLane = this.currentLane + direction;
        if (newLane >= 0 && newLane < CONFIG.laneCount) {
            this.currentLane = newLane;
            // Animate to new position
            this.targetX = LANES[this.currentLane];
        }
    }
    
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = 0.2;
            this.jumpStartY = this.player.position.y;
        }
    }
    
    startGame() {
        this.state = GameState.PLAYING;
        this.lives = 3;
        this.score = 0;
        this.currentLane = 1;
        this.isJumping = false;
        this.obstacles = [];
        this.targetX = 0;
        this.player.position.set(0, 1, 0);
        this.lastSpawnTime = 0;
        
        // Hide screens, show HUD
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById('hud').classList.remove('hidden');
        this.updateLivesDisplay();
        
        // Reset clock
        this.clock.start();
    }
    
    spawnObstacle() {
        // Random lane
        const lane = Math.floor(Math.random() * CONFIG.laneCount);
        const laneX = LANES[lane];
        
        // Random obstacle type (ground or aerial)
        const isAerial = Math.random() > 0.6;
        
        let obstacle;
        let obstacleGeometry;
        let obstacleMaterial;
        
        if (isAerial) {
            // Floating obstacle (need to crouch or avoid)
            obstacleGeometry = new THREE.BoxGeometry(2, 1, 1);
            obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
            obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            obstacle.position.set(laneX, 3, -80);
        } else {
            // Ground obstacle (need to jump)
            obstacleGeometry = new THREE.BoxGeometry(2, 1.5, 1);
            obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xe94560 });
            obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            obstacle.position.set(laneX, 0.75, -80);
        }
        
        obstacle.castShadow = true;
        obstacle.userData = {
            lane: lane,
            isAerial: isAerial,
            passed: false
        };
        
        this.scene.add(obstacle);
        this.obstacles.push(obstacle);
    }
    
    checkCollision() {
        const playerPos = this.player.position;
        const playerBox = new THREE.Box3().setFromObject(this.player);
        
        // Shrink player hitbox slightly for fairness
        playerBox.min.x += 0.2;
        playerBox.max.x -= 0.2;
        playerBox.min.z += 0.2;
        playerBox.max.z -= 0.2;
        
        for (const obstacle of this.obstacles) {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            
            if (playerBox.intersectsBox(obstacleBox)) {
                return obstacle;
            }
        }
        return null;
    }
    
    handleCollision(obstacle) {
        // Remove obstacle
        this.scene.remove(obstacle);
        this.obstacles = this.obstacles.filter(o => o !== obstacle);
        
        // Lose a life
        this.lives--;
        this.updateLivesDisplay();
        
        // Visual feedback
        this.flashScreen('#ff0000');
        
        if (this.lives <= 0) {
            this.state = GameState.FINAL_GAME_OVER;
            this.showFinalGameOver();
        } else {
            this.state = GameState.GAME_OVER;
            this.showGameOver();
        }
    }
    
    flashScreen(color) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            opacity: 0.3;
            pointer-events: none;
            z-index: 200;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 100);
    }
    
    showGameOver() {
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('final-score').textContent = Math.floor(this.score);
        
        const livesText = this.lives === 1 ? '❤️' : '❤️'.repeat(this.lives);
        document.getElementById('lives-remaining').textContent = `Lives remaining: ${livesText}`;
        
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
    
    showFinalGameOver() {
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('best-time').textContent = Math.floor(this.score);
        document.getElementById('final-screen').classList.remove('hidden');
    }
    
    showTitleScreen() {
        this.state = GameState.TITLE;
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('title-screen').classList.remove('hidden');
        
        // Reset player position
        this.player.position.set(0, 1, 0);
        
        // Clear obstacles
        this.obstacles.forEach(o => this.scene.remove(o));
        this.obstacles = [];
    }
    
    updateLivesDisplay() {
        const hearts = '❤️'.repeat(this.lives);
        document.getElementById('lives').textContent = hearts;
    }
    
    update(deltaTime) {
        if (this.state !== GameState.PLAYING) return;
        
        // Update score (time based)
        this.score += deltaTime;
        document.getElementById('score').textContent = `Time: ${Math.floor(this.score)}s`;
        
        // Smooth lane switching
        if (this.targetX !== undefined) {
            this.player.position.x += (this.targetX - this.player.position.x) * 0.2;
        }
        
        // Jump physics
        if (this.isJumping) {
            this.player.position.y += this.jumpVelocity;
            this.jumpVelocity -= CONFIG.gravity;
            
            // Land on ground
            if (this.player.position.y <= 1) {
                this.player.position.y = 1;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }
        
        // Spawn obstacles
        this.lastSpawnTime += deltaTime * 1000;
        if (this.lastSpawnTime > CONFIG.spawnInterval) {
            this.spawnObstacle();
            this.lastSpawnTime = 0;
            
            // Gradually increase difficulty
            if (CONFIG.spawnInterval > 800) {
                CONFIG.spawnInterval -= 10;
            }
        }
        
        // Move obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.position.z += CONFIG.obstacleSpeed * (60 * deltaTime);
            
            // Remove if passed
            if (obstacle.position.z > 10) {
                this.scene.remove(obstacle);
                this.obstacles.splice(i, 1);
            }
        }
        
        // Check collisions
        const collidedObstacle = this.checkCollision();
        if (collidedObstacle) {
            this.handleCollision(collidedObstacle);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        this.update(deltaTime);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
