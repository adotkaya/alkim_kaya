# alkim_kaya

Well i am a backend developer thus my experience with JS is on backend and last time i wrote html and css was on college i guess...I wont try to fool you by acting like i didn't get help from AI. Times are changing and its happening rapidly, usage of AI is already in our daily professional routine and how big of a part it is will be rapidly increasing too day by day. So yeah, i used it in this task because i am not familiar with vanilla js for ui and html css, but i am being honest that it's not part of my thought process.

So, the core logic is physics; main attr is torque which force x distance, in our case "weight x distance."
Distance will be taken from click point of user, plank with pivot foot on middle. 
User can click anywhere, in reality the object that user creates, cant stay at plank without a force on the opposite side, it will just slide off with its momentum. That physic logic can be applied too, i'll decide if i will later on. But for start, i'll imagine the plank beign sticky...so the boxes will drop down to the exact place that user clicked and will stay there.

So, 400px plank with pivot on middle. But due to DOM uses px's we need to take pivot as anchor and act as 0px

Scenario;

(0px)         (200px)       (400px)

-200px-----------|-----------200px

object a = 10kg at 50px from left edge, which is -150px from middle
diff from pivot = 150, 10kgx150=1500torq

object b = 5kg at at 300px from left edge, which is 100px from middle
diff from pivot= 100, 5kgx100=500torq

500-1500 = -1000

provided in docs, so 10 is divider. "const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10));"

-1000/10 = -100deg to left, -30/+30 is cap so titled fully to the left at -30.

func calculatePhysics() {
    leftTorque = 0;
    rightTorque = 0;
    totalLeftWeight = 0;
    totalRightWeight = 0;

    pivotX = 200; // center of 400px

    objects.forEach(obj => {
        distance = obj.x - pivotX; // X's as position
        torque = obj.weight * distance;

        if (distance < 0) {
            leftTorque += abs(torque); // cannot be negative, if negative its left side of plank
            totalLeftWeight += obj.weight;
        } else {
            rightTorque += torque;
            totalRightWeight += obj.weight;
        }
    });
    // calculate angle
    const angle = max(-30, min(30, (rightTorque - leftTorque) / 10))
}

As a backend developer, the realization that "Weight" is a misleading metric for balance, so i added force(torque) metric to the ui too to help user understand why it tilts to rights even though left is heavier.
Also all data will be stored in localStorage so there wont be any loss of data in "refresh"