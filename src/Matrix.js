class Matrix {
    constructor(rows, cols, p) {
        this.p = p
        this.rows = rows
        this.cols = cols
        this.data = []

        //initialize
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = []
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = 0
            }
        }
    }

    randomize() {
        this.loop(el => Math.floor(Math.random() * 10))
    }

    scale(n) {
        this.loop(el => el * n)
    }

    add(n) {
        this.loop(el => el + n)
    }

    addMatrix(m) {
        if (!(m instanceof Matrix)) {
            console.error('addMatrix :: argument must be of type Matrix')
            return
        }
        if (this.rows != m.rows || this.cols != m.cols) {
            console.error('addMatrix :: argument must be Matrix with same dimensions -> ', this.rows, this.cols)
            return
        }

        this.loop((el, i, j) => el + m.data[i][j])
    }

    multiply(m) {
        if (!(m instanceof Matrix)) {
            console.error('multiply :: argument must be of type Matrix')
            return
        }
        if (this.rows != m.rows || this.cols != m.cols) {
            console.error('multiply :: argument must be Matrix with same dimensions -> ', this.rows, this.cols)
            return
        }

        this.loop((el, i, j) => el * m.data[i][j])
    }

    loop(callback) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = callback(this.data[i][j], i, j)
            }
        }
    }

    print() {
        console.table(this.data)
    }

    static product(a, b) {
        if (a.cols != b.rows || a.rows != b.cols) {
            console.error('product :: matrices dimensions does not match :: dim(A) != dim(TB) !')
            return
        }
        //initialize result matrix
        const result = new Matrix(a.rows, b.cols)
        //calculate
        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                let sum = 0
                for (let k = 0; k < a.cols; k++) {
                    sum += a.data[i][k] * b.data[k][j]
                }
                result.data[i][j] = sum
            }
        }
        //return
        return result
    }

    static transpose(m) {
        const result = new Matrix(m.cols, m.rows)
        result.loop((el, i, j) => m.data[j][i])
        return result
    }
}

module.exports = Matrix