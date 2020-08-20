
/**
 * Matrix represents a 4x4 matrix.
 */
export default class Matrix {
  /**
   * constructor initializes the matrix as indentity matrix.
   */
  constructor() {
    this.xs = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
  }
  /**
   * set sets the matrix elements
   * @param {number} x11 is the elements in the matrix
   * @param {number} x12 is the elements in the matrix
   * @param {number} x13 is the elements in the matrix
   * @param {number} x14 is the elements in the matrix
   * @param {number} x21 is the elements in the matrix
   * @param {number} x22 is the elements in the matrix
   * @param {number} x23 is the elements in the matrix
   * @param {number} x24 is the elements in the matrix
   * @param {number} x31 is the elements in the matrix
   * @param {number} x32 is the elements in the matrix
   * @param {number} x33 is the elements in the matrix
   * @param {number} x34 is the elements in the matrix
   * @param {number} x41 is the elements in the matrix
   * @param {number} x42 is the elements in the matrix
   * @param {number} x43 is the elements in the matrix
   * @param {number} x44 is the elements in the matrix
   */
  set(
    x11, x12, x13, x14,
    x21, x22, x23, x24,
    x31, x32, x33, x34,
    x41, x42, x43, x44
  ) {
    // TODO: set given the parameters to the matrix elements (1p)
    this.xs = [
      x11, x12, x13, x14,
      x21, x22, x23, x24,
      x31, x32, x33, x34,
      x41, x42, x43, x44,
    ]
  }
  /**
   * multiplyMatrices implements matrix multiplication for two
   * 4x4 matrices and assigns the result to this.
   * @param {Matrix} m1 is a given 4x4 matrix
   * @param {Matrix} m2 is a given 4x4 matrix
   * @return {Matrix} this
   */
  multiplyMatrices(m1, m2) {
    // TODO: implement 4x4 matrix multiplication (3p)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0
        for (let k = 0; k < 4; k++) {
          sum += m1.xs[i*4+k]*m2.xs[k*4+j]
        }
        this.xs[i*4+j] = sum
      }
    }
    return this
  }
  /**
   * implements the inverse operation of a matrix
   * @return {Matrix} this
   */
  extraOp1() {
  
    const inv = new Array(16)
    inv[0] = this.xs[5] * this.xs[10] * this.xs[15] -
             this.xs[5] * this.xs[11] * this.xs[14] -
             this.xs[9] * this.xs[6] * this.xs[15] +
             this.xs[9] * this.xs[7] * this.xs[14] +
             this.xs[13] * this.xs[6] * this.xs[11] -
             this.xs[13] * this.xs[7] * this.xs[10]
    inv[4] = -this.xs[4] * this.xs[10] * this.xs[15] +
              this.xs[4] * this.xs[11] * this.xs[14] +
              this.xs[8] * this.xs[6] * this.xs[15] -
              this.xs[8] * this.xs[7] * this.xs[14] -
              this.xs[12] * this.xs[6] * this.xs[11] +
              this.xs[12] * this.xs[7] * this.xs[10]
    inv[8] = this.xs[4] * this.xs[9] * this.xs[15] -
             this.xs[4] * this.xs[11] * this.xs[13] -
             this.xs[8] * this.xs[5] * this.xs[15] +
             this.xs[8] * this.xs[7] * this.xs[13] +
             this.xs[12] * this.xs[5] * this.xs[11] -
             this.xs[12] * this.xs[7] * this.xs[9]
    inv[12] = -this.xs[4] * this.xs[9] * this.xs[14] +
               this.xs[4] * this.xs[10] * this.xs[13] +
               this.xs[8] * this.xs[5] * this.xs[14] -
               this.xs[8] * this.xs[6] * this.xs[13] -
               this.xs[12] * this.xs[5] * this.xs[10] +
               this.xs[12] * this.xs[6] * this.xs[9]
    inv[1] = -this.xs[1] * this.xs[10] * this.xs[15] +
              this.xs[1] * this.xs[11] * this.xs[14] +
              this.xs[9] * this.xs[2] * this.xs[15] -
              this.xs[9] * this.xs[3] * this.xs[14] -
              this.xs[13] * this.xs[2] * this.xs[11] +
              this.xs[13] * this.xs[3] * this.xs[10]
    inv[5] = this.xs[0] * this.xs[10] * this.xs[15] -
             this.xs[0] * this.xs[11] * this.xs[14] -
             this.xs[8] * this.xs[2] * this.xs[15] +
             this.xs[8] * this.xs[3] * this.xs[14] +
             this.xs[12] * this.xs[2] * this.xs[11] -
             this.xs[12] * this.xs[3] * this.xs[10]
    inv[9] = -this.xs[0] * this.xs[9] * this.xs[15] +
              this.xs[0] * this.xs[11] * this.xs[13] +
              this.xs[8] * this.xs[1] * this.xs[15] -
              this.xs[8] * this.xs[3] * this.xs[13] -
              this.xs[12] * this.xs[1] * this.xs[11] +
              this.xs[12] * this.xs[3] * this.xs[9]
    inv[13] = this.xs[0] * this.xs[9] * this.xs[14] -
              this.xs[0] * this.xs[10] * this.xs[13] -
              this.xs[8] * this.xs[1] * this.xs[14] +
              this.xs[8] * this.xs[2] * this.xs[13] +
              this.xs[12] * this.xs[1] * this.xs[10] -
              this.xs[12] * this.xs[2] * this.xs[9]
    inv[2] = this.xs[1] * this.xs[6] * this.xs[15] -
             this.xs[1] * this.xs[7] * this.xs[14] -
             this.xs[5] * this.xs[2] * this.xs[15] +
             this.xs[5] * this.xs[3] * this.xs[14] +
             this.xs[13] * this.xs[2] * this.xs[7] -
             this.xs[13] * this.xs[3] * this.xs[6]
    inv[6] = -this.xs[0] * this.xs[6] * this.xs[15] +
              this.xs[0] * this.xs[7] * this.xs[14] +
              this.xs[4] * this.xs[2] * this.xs[15] -
              this.xs[4] * this.xs[3] * this.xs[14] -
              this.xs[12] * this.xs[2] * this.xs[7] +
              this.xs[12] * this.xs[3] * this.xs[6]
    inv[10] = this.xs[0] * this.xs[5] * this.xs[15] -
              this.xs[0] * this.xs[7] * this.xs[13] -
              this.xs[4] * this.xs[1] * this.xs[15] +
              this.xs[4] * this.xs[3] * this.xs[13] +
              this.xs[12] * this.xs[1] * this.xs[7] -
              this.xs[12] * this.xs[3] * this.xs[5]
    inv[14] = -this.xs[0] * this.xs[5] * this.xs[14] +
               this.xs[0] * this.xs[6] * this.xs[13] +
               this.xs[4] * this.xs[1] * this.xs[14] -
               this.xs[4] * this.xs[2] * this.xs[13] -
               this.xs[12] * this.xs[1] * this.xs[6] +
               this.xs[12] * this.xs[2] * this.xs[5]
    inv[3] = -this.xs[1] * this.xs[6] * this.xs[11] +
              this.xs[1] * this.xs[7] * this.xs[10] +
              this.xs[5] * this.xs[2] * this.xs[11] -
              this.xs[5] * this.xs[3] * this.xs[10] -
              this.xs[9] * this.xs[2] * this.xs[7] +
              this.xs[9] * this.xs[3] * this.xs[6]
    inv[7] = this.xs[0] * this.xs[6] * this.xs[11] -
             this.xs[0] * this.xs[7] * this.xs[10] -
             this.xs[4] * this.xs[2] * this.xs[11] +
             this.xs[4] * this.xs[3] * this.xs[10] +
             this.xs[8] * this.xs[2] * this.xs[7] -
             this.xs[8] * this.xs[3] * this.xs[6]
    inv[11] = -this.xs[0] * this.xs[5] * this.xs[11] +
               this.xs[0] * this.xs[7] * this.xs[9] +
               this.xs[4] * this.xs[1] * this.xs[11] -
               this.xs[4] * this.xs[3] * this.xs[9] -
               this.xs[8] * this.xs[1] * this.xs[7] +
               this.xs[8] * this.xs[3] * this.xs[5]
    inv[15] = this.xs[0] * this.xs[5] * this.xs[10] -
              this.xs[0] * this.xs[6] * this.xs[9] -
              this.xs[4] * this.xs[1] * this.xs[10] +
              this.xs[4] * this.xs[2] * this.xs[9] +
              this.xs[8] * this.xs[1] * this.xs[6] -
              this.xs[8] * this.xs[2] * this.xs[5]
    const det = this.xs[0] * inv[0] +
              this.xs[1] * inv[4] +
              this.xs[2] * inv[8] +
              this.xs[3] * inv[12]
    if (det == 0) {
      throw new Error('cannot invert matrix, det === 0')
    }
    for (let i = 0; i < 16; i++) {
      this.xs[i] = inv[i] / det
    }
    return this
  }
  /**
   * implements the transpose operation a given 4x4 matrix.
   * @return {Matrix} this
   */
  extraOp2() {
    

    const swap = (arr, a, b) => {
      const tmp = arr[a]
      arr[a] = arr[b]
      arr[b] = tmp
    }
    swap(this.xs, 1, 4)
    swap(this.xs, 2, 8)
    swap(this.xs, 3, 12)
    swap(this.xs, 6, 9)
    swap(this.xs, 7, 13)
    swap(this.xs, 11, 14)
    return this
  }
}
