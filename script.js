class Gladiators {
    constructor() {
        this.health = Number((Math.random() * 21 + 80).toFixed(0));
        this.power = Number((Math.random() * 3 + 2).toFixed(1));
        this.speed = Number((Math.random() * 4 + 1).toFixed(3));
        this.name = faker.name.findName();
    }
}

start = () => {
    for (let i = 0; i < 10; i++) {
        gladiators.push(new Gladiators());
    }
}

start();