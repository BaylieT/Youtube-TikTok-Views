const WIDTH = 10;
const HEIGHT = 6;
const PLAYER_CHAR = '🤖'; // Futuristic human emoji
const EMPTY_CHAR = '.';

let playerPos = { y: Math.floor(HEIGHT / 2), x: Math.floor(WIDTH / 2) };
let score = 0;
let pokebrainBalls = 1000;
let pokerots = [];

function randomPos() {
    return {
        y: Math.floor(Math.random() * HEIGHT),
        x: Math.floor(Math.random() * WIDTH)
    };
}

function randomRarity() {
    const roll = Math.random();
    if (roll < 0.5) return 'common';
    if (roll < 0.8) return 'uncommon';
    if (roll < 0.95) return 'rare';
    if (roll < 0.995) return 'epic';
    return 'legendary';
}

const types = [
    {type: 'Fire', emoji: '🔥'},
    {type: 'Water', emoji: '💧'},
    {type: 'Electric', emoji: '⚡'},
    {type: 'Grass', emoji: '🌿'},
    {type: 'Psychic', emoji: '🧠'},
    {type: 'Steel', emoji: '⚙️'},
    {type: 'Ice', emoji: '❄️'},
    {type: 'Dark', emoji: '🌑'},
    {type: 'Fairy', emoji: '✨'},
    {type: 'Dragon', emoji: '🐉'}
];

const prefixes = ['Cyber', 'Neo', 'Quantum', 'Robo', 'Nano', 'Mega', 'Ultra', 'Bio', 'Plasma', 'Star', 'Aero', 'Terra', 'Mystic', 'Volt', 'Cryo', 'Luna', 'Solar', 'Echo', 'Pixel', 'Viral'];
const middles = ['flare', 'wave', 'shock', 'leaf', 'mind', 'gear', 'frost', 'shade', 'shine', 'scale', 'wing', 'root', 'beam', 'byte', 'pulse', 'nova', 'core', 'geist', 'spark', 'drake'];
const suffixes = ['mon', 'tron', 'droid', 'bot', 'core', 'geist', 'byte', 'pulse', 'spark', 'nova', 'ling', 'oid', 'mite', 'zilla', 'cub', 'hound', 'wyrm', 'fox', 'owl', 'bug'];

function randomName(idx) {
    // Use more varied name generation
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const m = middles[Math.floor(Math.random() * middles.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${p}${m}${s}`;
}

function generatePokerots() {
    pokerots = [];
    for (let i = 0; i < 1000; i++) {
        const rarity = randomRarity();
        const typeObj = types[Math.floor(Math.random() * types.length)];
            const pokerot = {
                name: randomName(i),
                rarity: rarity,
                type: typeObj.type,
                emoji: typeObj.emoji,
            };
            pokerot.biome = null; // Initialize biome property
            pokerot.photo = ''; // Initialize photo property
            pokerots.push(pokerot);
    }
}

function drawGrid() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';
    for (let y = 0; y < HEIGHT; y++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';
        for (let x = 0; x < WIDTH; x++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'grid-cell';
            if (playerPos.y === y && playerPos.x === x) {
                cellDiv.textContent = PLAYER_CHAR;
                cellDiv.style.background = '#00eaff';
                cellDiv.style.color = '#222';
            } else {
                cellDiv.textContent = EMPTY_CHAR;
            }
            rowDiv.appendChild(cellDiv);
        }
        gameDiv.appendChild(rowDiv);
    }
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('ball-count').textContent = pokebrainBalls;
}

function move(dir) {
    let { y, x } = playerPos;
    if (dir === 'w' && y > 0) y--;
    if (dir === 's' && y < HEIGHT - 1) y++;
    if (dir === 'a' && x > 0) x--;
    if (dir === 'd' && x < WIDTH - 1) x++;
    playerPos = { y, x };
    score++;
    drawGrid();
}

function drawPokerots() {
    const pokerotsDiv = document.getElementById('pokerots');
    pokerotsDiv.innerHTML = '';
    pokerots.forEach(p => {
        const div = document.createElement('div');
        div.className = `pokerot rarity-${p.rarity}`;
        div.innerHTML = `${p.emoji} <b>${p.name}</b> <span style="font-size:0.9em;">(${p.type})</span> <span>[${p.rarity}]</span>`;
        pokerotsDiv.appendChild(div);
    });
}

// Keyboard controls
window.addEventListener('keydown', function(e) {
    if (['w','a','s','d'].includes(e.key)) {
        move(e.key);
    }
});


// --- 3D GAME LOGIC ---
let scene, camera, renderer;
let player, pokerotMeshes = [], pokebrainBallsMeshes = [];
let caughtPokerots = [];
let playerGridPos = {x: 0, z: 0};
let gridSize = 30; // visible grid size
let pokerotGrid = {};

function initThreeJS() {
    const canvasDiv = document.getElementById('threejs-canvas');
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 500);
    canvasDiv.innerHTML = '';
    canvasDiv.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 800/500, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Infinite grid
    drawInfiniteGrid();

    // Player (futuristic human)
    const playerGeo = new THREE.SphereGeometry(1, 32, 32);
    const playerMat = new THREE.MeshPhongMaterial({color: 0x00eaff});
    player = new THREE.Mesh(playerGeo, playerMat);
    player.position.set(0, 1, 0);
    scene.add(player);

    // Generate Pokerots
    generatePokerots();
    spawnPokerotsOnGrid();

    // Render loop
    animate();
}

function gridKey(x, z) {
    return `${x},${z}`;
}

function spawnPokerotsOnGrid() {
    pokerotMeshes.forEach(m => scene.remove(m));
    pokerotMeshes = [];
    pokerotGrid = {};
    // Place Pokerots at grid points near player
    for (let i = 0; i < pokerots.length; i++) {
        const p = pokerots[i];
        // Spread out Pokerots in a grid around (playerGridPos.x, playerGridPos.z)
    let gx = Math.floor(Math.random() * (gridSize/2)) * 2 + playerGridPos.x - Math.floor(gridSize/2);
    let gz = Math.floor(Math.random() * (gridSize/2)) * 2 + playerGridPos.z - Math.floor(gridSize/2);
            let gy = 0.7; // Default height for Pokerots
        let key = gridKey(gx, gz);
        if (pokerotGrid[key]) continue; // avoid overlap
        pokerotGrid[key] = p;
        // Color by rarity
        let color = 0x888888;
        if (p.rarity === 'common') color = 0xaaaaaa;
        if (p.rarity === 'uncommon') color = 0x2b8a3e;
        if (p.rarity === 'rare') color = 0x0077ff;
        if (p.rarity === 'epic') color = 0xa020f0;
        if (p.rarity === 'legendary') color = 0xffd700;
        // Shape by type
        let mesh;
        if (p.type === 'Fire' || p.type === 'Electric') {
            mesh = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), new THREE.MeshPhongMaterial({color}));
        } else if (p.type === 'Water' || p.type === 'Ice') {
            mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({color}));
        } else if (p.type === 'Grass' || p.type === 'Fairy') {
            mesh = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.2, 16), new THREE.MeshPhongMaterial({color}));
        } else {
            mesh = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.2, 16, 32), new THREE.MeshPhongMaterial({color}));
        }
            mesh.position.set(gx, gy, gz);
        mesh.userData = {pokerot: p, idx: i, grid: {x: gx, z: gz}};
        pokerotMeshes.push(mesh);
        scene.add(mesh);
    }
}

function drawInfiniteGrid() {
    // Show current biome name above the grid
    let biomeIdx = getBiomeIndex(playerGridPos.x, playerGridPos.z);
    let biome = biomes[biomeIdx];
    let biomeNameDiv = document.getElementById('biome-name');
    if (!biomeNameDiv) {
        biomeNameDiv = document.createElement('div');
        biomeNameDiv.id = 'biome-name';
        biomeNameDiv.style.position = 'absolute';
        biomeNameDiv.style.top = '120px';
        biomeNameDiv.style.left = '50%';
        biomeNameDiv.style.transform = 'translateX(-50%)';
        biomeNameDiv.style.fontSize = '2em';
        biomeNameDiv.style.fontWeight = 'bold';
        biomeNameDiv.style.color = '#222';
        biomeNameDiv.style.background = 'rgba(255,255,255,0.7)';
        biomeNameDiv.style.padding = '8px 24px';
        biomeNameDiv.style.borderRadius = '12px';
        document.body.appendChild(biomeNameDiv);
    }
    biomeNameDiv.textContent = `Current Biome: ${biome.name}`;
    // Draw biome tiles and labels
    for (let bx = -2; bx <= 2; bx++) {
        for (let bz = -2; bz <= 2; bz++) {
            let biomeIdx = getBiomeIndex(playerGridPos.x + bx * 6, playerGridPos.z + bz * 6);
            let biome = biomes[biomeIdx];
            const tileGeo = new THREE.PlaneGeometry(6, 6);
            const tileMat = new THREE.MeshPhongMaterial({color: biome.color, side: THREE.DoubleSide, transparent: true, opacity: 0.95});
            const tile = new THREE.Mesh(tileGeo, tileMat);
            tile.position.set(playerGridPos.x + bx * 6, 0.01, playerGridPos.z + bz * 6);
            tile.rotation.x = -Math.PI/2;
            tile.name = `biomeTile_${bx}_${bz}`;
            scene.add(tile);

            // Add biome label
            const loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
                const textGeo = new THREE.TextGeometry(biome.name, {
                    font: font,
                    size: 1,
                    height: 0.1
                });
                const textMat = new THREE.MeshBasicMaterial({color: 0x222222});
                const textMesh = new THREE.Mesh(textGeo, textMat);
                textMesh.position.set(playerGridPos.x + bx * 6 - 2, 0.2, playerGridPos.z + bz * 6 - 2);
                textMesh.name = `biomeLabel_${bx}_${bz}`;
                scene.add(textMesh);
            });
        }
    }
    // Remove previous grid
    let oldTiles = scene.children.filter(obj => obj.name && obj.name.startsWith('biomeTile'));
    oldTiles.forEach(tile => scene.remove(tile));
    let oldGrid = scene.getObjectByName('infiniteGrid');
    if (oldGrid) scene.remove(oldGrid);
    // Draw biome tiles
    for (let bx = -2; bx <= 2; bx++) {
        for (let bz = -2; bz <= 2; bz++) {
            let biomeIdx = getBiomeIndex(playerGridPos.x + bx * 6, playerGridPos.z + bz * 6);
            let biome = biomes[biomeIdx];
            const tileGeo = new THREE.PlaneGeometry(6, 6);
            const tileMat = new THREE.MeshPhongMaterial({color: biome.color, side: THREE.DoubleSide, transparent: true, opacity: 0.95});
            const tile = new THREE.Mesh(tileGeo, tileMat);
            tile.position.set(playerGridPos.x + bx * 6, 0.01, playerGridPos.z + bz * 6);
            tile.rotation.x = -Math.PI/2;
            tile.name = `biomeTile_${bx}_${bz}`;
            scene.add(tile);
        }
    }
    // Draw grid lines
    const gridHelper = new THREE.GridHelper(30, 30, 0x333333, 0xcccccc);
    gridHelper.position.y = 0.02;
    gridHelper.name = 'infiniteGrid';
    scene.add(gridHelper);
}

function throwPokebrainBall() {
    if (pokebrainBalls <= 0) return;
    pokebrainBalls--;
    document.getElementById('ball-count').textContent = pokebrainBalls;
    // Ball starts at player, moves forward
    const ballGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const ballMat = new THREE.MeshPhongMaterial({color: 0xff4444});
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.copy(player.position);
    ball.userData = {velocity: new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).multiplyScalar(0.5)};
    pokebrainBallsMeshes.push(ball);
    scene.add(ball);
}

function animate() {
    requestAnimationFrame(animate);
    // Move balls
    for (let i = pokebrainBallsMeshes.length-1; i >= 0; i--) {
        const ball = pokebrainBallsMeshes[i];
        ball.position.add(ball.userData.velocity);
        // Check collision with Pokerots
        for (let j = 0; j < pokerotMeshes.length; j++) {
            const mesh = pokerotMeshes[j];
            if (!mesh.visible) continue;
            if (ball.position.distanceTo(mesh.position) < 0.8) {
                // Try to catch
                const p = mesh.userData.pokerot;
                let catchChance = 0.8;
                if (p.rarity === 'uncommon') catchChance = 0.6;
                if (p.rarity === 'rare') catchChance = 0.3;
                if (p.rarity === 'epic') catchChance = 0.1;
                if (p.rarity === 'legendary') catchChance = 0.03;
                if (Math.random() < catchChance) {
                    mesh.visible = false;
                    caughtPokerots.push(p);
                    updatePokerotDex();
                    alert(`You caught ${p.name}!`);
                } else {
                    alert(`Failed to catch ${p.name} (rarity: ${p.rarity})`);
                }
                scene.remove(ball);
                pokebrainBallsMeshes.splice(i, 1);
                break;
            }
        }
        // Remove ball if out of bounds
        if (Math.abs(ball.position.x) > 15 || Math.abs(ball.position.z) > 15) {
            scene.remove(ball);
            pokebrainBallsMeshes.splice(i, 1);
        }
    }
    renderer.render(scene, camera);
}

function updatePokerotDex() {
    const dexDiv = document.getElementById('pokerot-dex');
    dexDiv.innerHTML = '';
    caughtPokerots.forEach(p => {
        const div = document.createElement('div');
        div.className = `pokerot rarity-${p.rarity}`;
            div.innerHTML = `<img src='${p.photo}' alt='${p.name}' style='width:40px;height:40px;border-radius:8px;margin-right:8px;vertical-align:middle;'> ${p.emoji} <b>${p.name}</b> <span style="font-size:0.9em;">(${p.type}, ${p.biome})</span> <span>[${p.rarity}]</span>`;
        dexDiv.appendChild(div);
    });
}

function movePlayerOnGrid(dx, dz) {
    playerGridPos.x += dx;
    playerGridPos.z += dz;
    player.position.x = playerGridPos.x;
    player.position.z = playerGridPos.z;
    camera.position.x = playerGridPos.x;
    camera.position.z = playerGridPos.z + 20;
    camera.lookAt(player.position);
    // When moving, spawn new Pokerots nearby
    spawnPokerotsOnGrid();
}

function setupControls() {
    renderer.domElement.addEventListener('click', throwPokebrainBall);
    window.addEventListener('keydown', function(e) {
        if (e.key === 'w' || e.key === 'ArrowUp') movePlayerOnGrid(0, -1);
        if (e.key === 's' || e.key === 'ArrowDown') movePlayerOnGrid(0, 1);
        if (e.key === 'a' || e.key === 'ArrowLeft') movePlayerOnGrid(-1, 0);
        if (e.key === 'd' || e.key === 'ArrowRight') movePlayerOnGrid(1, 0);
    });
}

// Start 3D game
initThreeJS();
setupControls();

const biomes = [
    {name: 'Forest', color: 0x00ff00, types: ['Grass', 'Fairy'], minY: 1, maxY: 3}, // Neon green
    {name: 'Lake', color: 0x0099ff, types: ['Water', 'Ice'], minY: 0.5, maxY: 2}, // Bright blue
    {name: 'Mountain', color: 0xffffff, types: ['Steel', 'Dragon'], minY: 3, maxY: 6}, // White
    {name: 'Volcano', color: 0xff0000, types: ['Fire', 'Electric'], minY: 2, maxY: 5}, // Neon red
    {name: 'Cave', color: 0x8000ff, types: ['Dark', 'Psychic'], minY: 0.5, maxY: 2}, // Vivid purple
    {name: 'Crystal Fields', color: 0x00fff7, types: ['Electric', 'Fairy'], minY: 2, maxY: 4}, // Aqua
    {name: 'Sky Isles', color: 0x00ffff, types: ['Dragon', 'Psychic'], minY: 5, maxY: 8}, // Cyan
    {name: 'Mire', color: 0xffa500, types: ['Dark', 'Water'], minY: 0.5, maxY: 1.5} // Orange
];
