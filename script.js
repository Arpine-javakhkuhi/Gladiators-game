class Gladiators {
    constructor() {
        this.health = Number((Math.random() * 21 + 80).toFixed(0));
        this.power = Number((Math.random() * 3 + 2).toFixed(1));
        this.speed = Number((Math.random() * 4 + 1).toFixed(3));
        this.name = faker.name.findName();
    }
}

let gladiators = [];
const caesarDecision = ['Finish him', 'Live'];
let intervals = [];

const thumbsDown = String.fromCodePoint('0x1F44E');
const thumbsUp = String.fromCodePoint('0x1F44D');

start = () => {
    for (let i = 0; i < 10; i++) {
        gladiators.push(new Gladiators());
    }

    startAttack();
}

function startAttack() {
    for (let i = 0; i < gladiators.length; i++) {
        attackProcess(gladiators[i], i);
    }
}

async function attackProcess(gladiator, gladiatorInd) {
    let speedToMs = (5 / gladiator.speed * 1000).toFixed(0);

    if (gladiators.length > 1) {
        let attackInterval = setInterval(() => {
            let randomGladiatorInd = chooseRandomGladiator(gladiators, gladiatorInd);
            let randomGladiator = gladiators[randomGladiatorInd];

            recalcHealthAndSpeed(gladiator, randomGladiator);

            if (randomGladiator.health <= 0) {
                intervals.forEach((el) => {
                    clearInterval(el);
                });
                intervals = [];

                console.log(`${randomGladiator.name} is dying`);

                decision(gladiator, randomGladiator, randomGladiatorInd, gladiatorInd);
            }
        }, speedToMs);

        intervals.push(attackInterval);
    }
};

const chooseRandomGladiator = (gladiators, hittingGladiatorInd) => {
    let randomRival;
    do {
        randomRival = Math.floor(Math.random() * gladiators.length);
    } while (randomRival === hittingGladiatorInd)
    return randomRival;
}


function recalcHealthAndSpeed(hittingGladiator, beatenGladiator) {
    const initialHelath = beatenGladiator.health;
    beatenGladiator.health = Math.round(beatenGladiator.health - hittingGladiator.power);

    if (beatenGladiator.health > 30) {
        beatenGladiator.speed = +(beatenGladiator.speed * (beatenGladiator.health / initialHelath)).toFixed(3);
    } else if (beatenGladiator.health >= 0 && beatenGladiator.health <= 30) {
        beatenGladiator.speed = Math.min(5,(beatenGladiator.speed * 3)).toFixed(3);
    }

    console.log(`[${hittingGladiator.name} x ${hittingGladiator.health}] hits [${beatenGladiator.name} x ${beatenGladiator.health}] with power ${hittingGladiator.power}`);
}


function decision(hittingGladiator, beatenGladiator, beatenGladiatorInd, gladiatorInd) {
    const randomDecisionNum = Math.floor(Math.random() * caesarDecision.length);
    const randomDecision = caesarDecision[randomDecisionNum];

    if (randomDecision === 'Finish him') {
        console.log(`Caesar showed ${thumbsDown} to ${beatenGladiator.name}!`);

        gladiators.splice(beatenGladiatorInd, 1);
        if (gladiators.length === 1) {
            console.log(`${hittingGladiator.name} won the battle with health x${hittingGladiator.health}`);
        } else {
            startAttack();
        }
    } else {
        console.log(`Caesar showed ${thumbsUp} to ${beatenGladiator.name}!`);

        beatenGladiator.health = 50;
        startAttack();
    }
}

start();