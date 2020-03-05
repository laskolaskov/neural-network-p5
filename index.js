const p5 = require('p5')
const NN = require('./src/NeuralNetwork')
const M = require('./src/Matrix')

let sketch = (p) => {

    let brain, matrix

    p.setup = () => {
        p.createCanvas(400, 400)

        brain = new NN(2, 2, 2, p)

        console.log('brain :: ', brain)

        const inputArr = [1, 0]
        const targetArr = [1, 0]

        //const output = brain.feedForward(inputArr)

        const output = brain.train(inputArr, targetArr)

        output.print()
    }

    p.draw = () => {
        p.background(0)
    }
}

//create the sketch
const P5 = new p5(sketch);