const M = require('./Matrix')

const sigmoid = x => 1 / (1 + Math.exp(-x))

class NeuralNetwork {
    constructor(numI, numH, numO, p) {
        this.p = p
        this.inputNodes = numI
        this.hiddenNodes = numH
        this.outputNodes = numO

        this.weights_IH = new M(numH, numI)
        this.weights_HO = new M(numO, numH)

        this.weights_IH.randomize()
        this.weights_HO.randomize()

        this.bias_H = new M(numH, 1)
        this.bias_O = new M(numO, 1)

        this.bias_H.randomize()
        this.bias_O.randomize()
    }

    feedForward(input_array) {
        if(input_array.length !== this.inputNodes) {
            console.error(`The lenght of the input (${input_array.length}) must match the number of input nodes in the Neural Network (${this.inputNodes}) !`)
            return
        }
        //generate hidden outputs
        const input = M.fromArray(input_array)
        const hidden = M.product(this.weights_IH, input)
        hidden.addMatrix(this.bias_H)
        //activation function
        hidden.loop(sigmoid)
        //generate outputs
        const output = M.product(this.weights_HO, hidden)
        output.addMatrix(this.bias_O)
        //activation function
        output.loop(sigmoid)
        //return
        return output.toArray()
    }

    train(input_array, target_array) {
        if(input_array.length !== this.inputNodes) {
            console.error(`The lenght of the input (${input_array.length}) must match the number of input nodes in the Neural Network (${this.inputNodes}) !`)
            return
        }
        if(target_array.length !== this.outputNodes) {
            console.error(`The lenght of the target (${target_array.length}) must match the number of output nodes in the Neural Network (${this.outputNodes}) !`)
            return
        }

        let output_array = this.feedForward(input_array)
        //convert to matrix
        const output = M.fromArray(output_array)
        const target = M.fromArray(target_array)

        //Calculate the error
        //ERROR = TARGET - OUTPUT
        const output_error = M.subtract(target, output)

        //Calculate hidden layers errors
    }
}

module.exports = NeuralNetwork