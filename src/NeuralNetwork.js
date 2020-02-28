class NeuralNetwork {
    constructor(numI, numH, numO, p) {
        this.p = p
        this.inputNodes = numI
        this.hiddenNodes = numH
        this.outputNodes = numO
    }
}

module.exports = NeuralNetwork