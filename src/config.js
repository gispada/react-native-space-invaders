const options = {
    numberOfStars: 30,
    starSize: 1,
    
    startingGameSpeed: 1000,
    speedMultiplier: 0.08,
    rocketSpeed: 1600,
    explosionDuration: 400,

    aliensInit: [5, 5, 5], // 3 file, ciascuna con 5 alieni; l'index + 1 è il tipo di alieno
    aliensHorSpace: 60,
    aliensVerSpace: 50,
    aliensHorStep: 20,
    aliensVerStep: 30,
    shootingProbability: 0.2,
    
    maxRocketsOnScreen: 4,
    numberOfLives: 3
}

export default options