const plank = document.getElementById('plank');
let state = { objects: [] };

function calculatePhysics() {
    let leftTorque = 0;
    let rightTorque = 0;
    const pivotX = 200; // Center point

    state.objects.forEach(obj => {
        const distance = obj.x - pivotX;
        const torque = Math.abs(obj.weight * distance);

        if (distance < 0) leftTorque += torque;
        else rightTorque += torque;
    });

    const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 20));
    plank.style.transform = `rotate(${angle}deg)`;
}