const M = require('./Matrix')

const sigmoid = x => 1 / (1 + Math.exp(-x))

const dsigmoid = x => sigmoid(x) * (1 - sigmoid(x))

class NeuralNetwork {
    constructor(numI, numH, numO, p) {
        this.lr = 0.1
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
        if (input_array.length !== this.inputNodes) {
            console.error(`The lenght of the input (${input_array.length}) must match the number of input nodes in the Neural Network (${this.inputNodes}) !`)
            return
        }
        //generate hidden outputs
        const input = M.fromArray(input_array)
        const hidden = M.product(this.weights_IH, input)
        //set hidden to use in the train function
        this.hidden = hidden
        //add bias
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
        if (input_array.length !== this.inputNodes) {
            console.error(`The lenght of the input (${input_array.length}) must match the number of input nodes in the Neural Network (${this.inputNodes}) !`)
            return
        }
        if (target_array.length !== this.outputNodes) {
            console.error(`The lenght of the target (${target_array.length}) must match the number of output nodes in the Neural Network (${this.outputNodes}) !`)
            return
        }

        let output_array = this.feedForward(input_array)
        //convert to matrix
        const output = M.fromArray(output_array)
        const target = M.fromArray(target_array)
        const hidden = this.hidden

        //Calculate the error
        //ERROR = TARGET - OUTPUT
        const output_error = M.subtract(target, output)
        //Calculate hidden layers errors
        const hidden_error = M.product(M.transpose(this.weights_HO), output_error)

        //Calculate gradient
        const gradient = Object.assign(output, {})
        gradient.loop(el => el * (1 - el)) //derivative of output (which was mapped already by sigmoid)
        gradient.multiply(output_error)
        gradient.scale(this.lr)
        const weights_HO_delta = M.product(gradient, M.transpose(hidden))
        //adjust weights
        this.weights_HO.addMatrix(weights_HO_delta)
        //adjust gradients
        this.bias_O.addMatrix(gradient)

        //Calculate hidden gradient
        const hidden_gradient = Object.assign(this.hidden, {})
        hidden_gradient.loop(el => el * (1 - el)) //derivative of the hidden layer (which was mapped already by sigmoid)
        hidden_gradient.multiply(hidden_error)
        hidden_gradient.scale(this.lr)
        const weights_IH_delta = M.product(hidden_gradient, M.transpose(M.fromArray(input_array)))
        //adjust hidden weights
        this.weights_IH.addMatrix(weights_IH_delta)
        //adjust hidden gradients
        this.bias_H.addMatrix(hidden_gradient)
    }
}

module.exports = NeuralNetwork