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

let showArena = document.querySelector('.showArena');
let gladiatorsUI = document.querySelector('.gladiators-list');
let ol;

start = () => {
    for (let i = 0; i < 10; i++) {
        gladiators.push(new Gladiators());
    }

    startAttack();
}

function startAttack() {
    ol = document.createElement('ol');
    gladiatorsUI.appendChild(ol);
    ol.innerHTML += '<span class="state"></span>';

    for (let i = 0; i < gladiators.length; i++) {
        ol.innerHTML += `<li><span class="gladiator-name">${gladiators[i].name}:</span> health ${gladiators[i].health}, power ${gladiators[i].power}, speed ${gladiators[i].speed}</li>`;
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
                showArena.innerHTML += `<span class="warning">${randomGladiator.name} is dying </span><br />`;

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

    showArena.innerHTML += `<span class="hitting-name">[${hittingGladiator.name} x ${hittingGladiator.health}]</span> hits <span class="beaten-name">[${beatenGladiator.name} x ${beatenGladiator.health} ]</span> with power ${hittingGladiator.power} <br />`;
}


function decision(hittingGladiator, beatenGladiator, beatenGladiatorInd, gladiatorInd) {
    const randomDecisionNum = Math.floor(Math.random() * caesarDecision.length);
    const randomDecision = caesarDecision[randomDecisionNum];

    if (randomDecision === 'Finish him') {
        showArena.innerHTML += `<span class="negative">Caesar showed ${thumbsDown} to ${beatenGladiator.name}!</span> <br />`;
        gladiators.splice(beatenGladiatorInd, 1);
        if (gladiators.length === 1) {
            showArena.innerHTML += `<p class="winner">${hittingGladiator.name} won the battle with health x${hittingGladiator.health}</p> <br />`;
            gladiatorsUI.innerHTML += `<p class="winner-gladiator">${hittingGladiator.name}: health ${hittingGladiator.health}, power ${hittingGladiator.power}, speed ${hittingGladiator.speed}</p>`;
        } else {
            startAttack();
        }
    } else {
        showArena.innerHTML += `<span class="positive">Caesar showed ${thumbsUp} to ${beatenGladiator.name}</span> <br />`;

        beatenGladiator.health = 50;
        startAttack();
    }
}

start();