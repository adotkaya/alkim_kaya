const plank = document.getElementById('plank');
const dropZone = document.getElementById('drop-zone');
const weightLeftEl = document.getElementById('weight-left');
const weightRightEl = document.getElementById('weight-right');
const forceLeftEl = document.getElementById('force-left');
const forceRightEl = document.getElementById('force-right');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
let state = { objects: [] };
let isPaused = false;

function saveState() {
    localStorage.setItem('seesawState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('seesawState');
    if (saved) {
        state = JSON.parse(saved);
        renderObjects();
        calculatePhysics();
    }
}

function addObject(x, startY) {
    if (isPaused) return;
    if (x < 0 || x > 400) return;

    const newObj = {
        id: Date.now(),
        x: x,
        weight: Math.floor(Math.random() * 10) + 1,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    state.objects.push(newObj);
    animateFall(newObj, startY);
}

dropZone.addEventListener('click', (e) => {
    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addObject(x, y);
});

plank.addEventListener('click', (e) => {
    const plankRect = plank.getBoundingClientRect();
    const dropRect = dropZone.getBoundingClientRect();
    const x = e.clientX - plankRect.left;
    const y = plankRect.top - dropRect.top;
    addObject(x, y);
});

function animateFall(obj, startY) {
    const ghost = document.createElement('div');
    ghost.className = 'weight';
    ghost.style.position = 'absolute';
    ghost.style.left = obj.x + 'px';
    ghost.style.top = (startY || 0) + 'px';
    ghost.style.bottom = 'auto';
    ghost.style.backgroundColor = obj.color;
    ghost.style.width = (20 + obj.weight * 3) + 'px';
    ghost.style.height = (20 + obj.weight * 3) + 'px';
    ghost.textContent = obj.weight + 'kg';
    dropZone.appendChild(ghost);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            ghost.style.transition = 'top 0.5s ease-in';
            ghost.style.top = '100%';
        });
    });

    setTimeout(() => {
        ghost.remove();
        renderObjects();
        calculatePhysics();
        saveState();
    }, 500);
}

function renderObjects() {
    plank.querySelectorAll('.weight').forEach(el => el.remove());

    state.objects.forEach(obj => {
        const div = document.createElement('div');
        div.className = 'weight';
        div.style.left = obj.x + 'px';
        div.style.backgroundColor = obj.color;
        div.style.width = (20 + obj.weight * 3) + 'px';
        div.style.height = (20 + obj.weight * 3) + 'px';
        div.textContent = obj.weight + 'kg';
        plank.appendChild(div);
    });
}

function calculatePhysics() {
    let leftTorque = 0;
    let rightTorque = 0;
    let leftWeight = 0;
    let rightWeight = 0;
    const pivotX = 200;

    state.objects.forEach(obj => {
        const distance = obj.x - pivotX;
        const torque = Math.abs(obj.weight * distance);

        if (distance < 0) {
            leftTorque += torque;
            leftWeight += obj.weight;
        } else {
            rightTorque += torque;
            rightWeight += obj.weight;
        }
    });

    weightLeftEl.textContent = leftWeight;
    weightRightEl.textContent = rightWeight;
    forceLeftEl.textContent = leftTorque;
    forceRightEl.textContent = rightTorque;

    const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
    plank.style.transform = `rotate(${angle}deg)`;
}

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

resetBtn.addEventListener('click', () => {
    state.objects = [];
    localStorage.removeItem('seesawState');
    renderObjects();
    calculatePhysics();
});

loadState();