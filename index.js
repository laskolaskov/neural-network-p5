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

const doodleclasifier = (p) => {
    //based on Google's Quick Draw dataset
    const len = 784

    let brain

    let totalTrained = 0

    let trainBtn, testBtn, guessBtn, clearBtn

    const CAT = 0
    const RAINBOW = 1
    const TRAIN = 2

    const cats = {
        data: null,
        training: [],
        testing: []
    }
    const rainbows = {
        data: null,
        training: [],
        testing: []
    }
    const trains = {
        data: null,
        training: [],
        testing: []
    }

    const prepareData = (category, label) => {
        const totalData = 1000
        const treshold = p.floor(0.8 * totalData)

        for (let i = 0; i < totalData; i++) {
            const offset = i * len
            if (i < treshold) {
                category.training[i] = category.data.bytes.subarray(offset, offset + len)
                category.training[i].label = label
            } else {
                category.testing[i - treshold] = category.data.bytes.subarray(offset, offset + len)
                category.testing[i - treshold].label = label
            }
        }
    }

    const trainEpoch = () => {
        //train
        const trainingData = p.shuffle(cats.training.concat(trains.training, rainbows.training))
        for (let i = 0; i < trainingData.length; i++) {
            const input = []
            const target = Array(3).fill(0)
            target[trainingData[i].label] = 1
            //normalize input
            for (let j = 0; j < trainingData[i].length; j++) {
                input[j] = trainingData[i][j] / 255.0
            }
            //train
            brain.train(input, target)
        }
    }

    const train = (epochs = 1) => {
        console.log(`Starting training for ${epochs} epoch(s), please wait ...`)
        for (let i = 0; i < epochs; i++) {
            trainEpoch()
            console.log(`Training epoch ${i + 1} done`)
            testAll()
        }
        console.log(`Trained for ${epochs} epoch(s)`)
    }

    const testAll = () => {
        console.log(`Running testing data, please wait ...`)
        const testingData = cats.testing.concat(trains.testing, rainbows.testing)
        let correct = 0
        for (let i = 0; i < testingData.length; i++) {
            const input = []
            //normalize input
            for (let j = 0; j < testingData[i].length; j++) {
                input[j] = testingData[i][j] / 255.0
            }
            //train
            let guess = brain.feedForward(input)
            if (guess.indexOf(p.max(guess)) == testingData[i].label) {
                correct++
            }
        }
        console.log(`Testing complete`)
        console.log(`Prediction success rate :: ${correct / testingData.length * 100} %`)
    }

    const checkDataLoad = () => {
        //show some doodles to test data loading
        let total = 100
        for (let n = 0; n < total; n++) {
            let img = p.createImage(28, 28)
            img.loadPixels()
            let offset = n * len
            for (let i = 0; i < len; i++) {
                let val = 255 - cats.data.bytes[i + offset]
                img.pixels[i * 4 + 0] = val
                img.pixels[i * 4 + 1] = val
                img.pixels[i * 4 + 2] = val
                img.pixels[i * 4 + 3] = val
            }
            img.updatePixels()
            let x = (n % 10) * 28
            let y = p.floor(n / 10) * 28
            p.image(img, x, y)
        }
    }

    p.preload = () => {
        cats.data = p.loadBytes('data/cats1000.bin')
        trains.data = p.loadBytes('data/trains1000.bin')
        rainbows.data = p.loadBytes('data/rainbows1000.bin')
    }

    p.setup = () => {
        p.createCanvas(280, 280)
        p.background(255)

        trainBtn = p.createButton('Train')
        testBtn = p.createButton('Test')
        guessBtn = p.createButton('Guess')
        clearBtn = p.createButton('Clear')

        brain = new NN(len, 64, 3)

        trainBtn.mousePressed(() => {
            train()
            totalTrained++
            console.log(`Trained for total ${totalTrained} epoch(s)`)
        })

        testBtn.mousePressed(() => {
            testAll()
        })

        clearBtn.mousePressed(() => {
            p.clear()
            p.background(255)
        })

        guessBtn.mousePressed(() => {
            const input = []
            const img = p.get()
            img.resize(28, 28)
            img.loadPixels()
            for (let i = 0; i < len; i++) {
                const bright = img.pixels[i * 4]
                input[i] = (255 - bright) / 255.0
            }
            
            const guess = brain.feedForward(input)
            const m = p.max(guess)
            const classification = guess.indexOf(m)

            console.log(guess)

            if(classification === CAT) {
                console.log(`Guess : ${m} value for CAT`)
            } else if (classification === TRAIN) {
                console.log(`Guess : ${m} value for TRAIN`)
            } else if (classification === RAINBOW) {
                console.log(`Guess : ${m} value for RAINBOW`)
            }

            
        })

        prepareData(cats, CAT)
        prepareData(trains, TRAIN)
        prepareData(rainbows, RAINBOW)
    }

    p.draw = () => {
        p.strokeWeight(8)
        p.stroke(0)
        if (p.mouseIsPressed) {
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY)
        }
    }
}

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
//const P5 = new p5(sketchColorPredictor)
const P5 = new p5(doodleclasifier)