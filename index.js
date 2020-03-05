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

        //get brain outputs for each grid cell
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

//scetch for solving color prediction
const sketchColorPredictor = (p) => {

    let brain, r, g, b
    let which = 'B'

    const pickColor = () => {
        r = p.random(255)
        g = p.random(255)
        b = p.random(255)

        p.redraw()
    }

    const colorPredictor = () => {
        //create normalized input from the color values
        const input = [r / 255, g / 255, b / 255]

        //get the output
        const output = brain.feedForward(input)

        if (output[0] > output[1]) {
            which = 'B'
        } else {
            which = 'W'
        }
    }

    p.setup = () => {
        p.createCanvas(600, 300)
        pickColor()

        brain = new NN(3, 3, 2)
    }

    p.draw = () => {
        p.background(r, g, b)

        p.textSize(p.width / 10)
        p.noStroke()
        p.fill(0)
        p.textAlign(p.CENTER, p.CENTER)
        p.text('BLACK', p.width / 4, p.height / 2)
        p.fill(255)
        p.text('WHITE', 3 * p.width / 4, p.height / 2)
        p.stroke(0)
        p.line(p.width / 2, 0, p.width / 2, p.height)

        colorPredictor()

        if (which == 'B') {
            p.fill(0)
            p.circle(p.width / 4, p.height / 3, p.width / 20)
        } else {
            p.fill(255)
            p.circle(3 * p.width / 4, p.height / 3, p.width / 20)
        }

        p.noLoop()
    }

    p.mousePressed = () => {
        //check click position
        if (p.mouseX > p.width && p.mouseY > p.height) {
            console.log('Click out of bounds, no training')
            return
        }

        //create normalized input from the color values
        const input = [r / 255, g / 255, b / 255]

        //train based on click position
        if (p.mouseX < p.width / 2) {
            brain.train(input, [1, 0])
            console.log('Training for BLACK')
        } else {
            brain.train(input, [0, 1])
            console.log('Training for WHITE')
        }
        //pick new color for the next redraw
        pickColor()
    }
}

//create sketch
//const P5 = new p5(sketchXOR)
const P5 = new p5(sketchColorPredictor)