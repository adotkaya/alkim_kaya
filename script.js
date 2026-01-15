const plank = document.getElementById('plank');
let state = { objects: [] };

plank.addEventListener('click', (e) => {
    const rect = plank.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < 0 || x > 400) return;

    const newObj = {
        id: Date.now(),
        x: x,
        weight: Math.floor(Math.random() * 10) + 1,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };

    state.objects.push(newObj);
    renderObjects();
});

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
    const pivotX = 200;

    state.objects.forEach(obj => {
        const distance = obj.x - pivotX;
        const torque = Math.abs(obj.weight * distance);

        if (distance < 0) leftTorque += torque;
        else rightTorque += torque;
    });

    const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));
    plank.style.transform = `rotate(${angle}deg)`;
}