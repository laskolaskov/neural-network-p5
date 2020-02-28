const p5 = require('p5')
const NN = require('./src/NeuralNetwork')
const M = require('./src/Matrix')

let sketch = (p) => {

    let brain, matrix

    p.setup = () => {
        p.createCanvas(400, 400)

        brain = new NN(3, 3, 1, p)

        console.log('brain :: ', brain)

        matrix = new M(2, 3)
        //m1 = new M(3, 4)
        matrix.randomize()
        //m1.randomize()

        matrix.print()

        const trans = M.transpose(matrix)
        const sec = M.transpose(trans)

        sec.print()

        //matrix.scale(5)
        //matrix.add(1.5)
        //matrix.multiply(m1)

        //const prod = M.product(matrix, m1)
        //const prod1 = M.product(m1, matrix)

        
        //console.table(prod.matrix)
        //console.table(prod1.matrix)
    }

    p.draw = () => {
        p.background(0)
    }
}

//create the sketch
const P5 = new p5(sketch);