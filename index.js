const p5 = require('p5')
const NN = require('./src/NeuralNetwork')
const M = require('./src/Matrix')

//data set to train for solving XOR
const xorTrainDataSet = [
    {
        input: [0, 0],
        target: [0]
    },
    {
        input: [1, 0],
        target: [1]
    },
    {
        input: [0, 1],
        target: [1]
    },
    {
        input: [1, 1],
        target: [0]
    }
]

const staticTest = () => {
    console.log('Solving XOR')
    console.log('Static test started ...')

    const brain = new NN(2, 2, 1)

    console.log('brain :: ', brain)

    //train hard !!! no pain no GAIN !!!
    for (let i = 0; i < 50000; i++) {
        //full training with same order (maybe not so good ???)
        xorTrainDataSet.forEach(data => brain.train(data.input, data.target))

        //get random entry from the set to train with (must train for a lot more iterations in this case)
        //const data = xorTrainDataSet[Math.floor((Math.random()*xorTrainDataSet.length))]
        //brain.train(data.input, data.target)
    }

    //test
    const g1 = brain.feedForward([0, 0])
    const g2 = brain.feedForward([0, 1])
    const g3 = brain.feedForward([1, 0])
    const g4 = brain.feedForward([1, 1])

    console.log('0 ::', g1)
    console.log('1 ::', g2)
    console.log('1 ::', g3)
    console.log('0 ::', g4)

    console.log('Static test ended.')
}

//run static test function
//staticTest()

//sketch to visualize XOR solving
const sketchXOR = (p) => {

    let brain

    p.setup = () => {
        p.createCanvas(400, 400)

        brain = new NN(2, 5, 1)

        console.log('brain :: ', brain)

    }

    p.draw = () => {
        p.background(0)

        //train on each draw step
        for (let i = 0; i < 1000; i++) {
            const data = p.random(xorTrainDataSet)
            brain.train(data.input, data.target)
        }

        //set up grid
        let resolution = 10
        let cols = p.width / resolution
        let rows = p.height / resolution

        //get brain outputs for each grid point
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x1 = i / cols
                const x2 = j / rows
                const inputs = [x1, x2]
                const y = brain.feedForward(inputs)
                //draw
                p.noStroke()
                p.fill(y * 255)
                p.rect(i * resolution, j * resolution, resolution, resolution)
            }
        }

        //test prediction - should approach '0' over time
        console.log(brain.feedForward([1, 1]))
    }
}

const sketchColorPredictor = (p) => {

    let brain

    p.setup = () => {
        p.createCanvas(400, 400)

        brain = new NN(2, 5, 1)

        console.log('brain :: ', brain)

    }

    p.draw = () => {
        p.background(255, 0, 0)        
    }
}

//create sketch
const P5 = new p5(sketchXOR)
//const P5 = new p5(sketchColorPredictor)