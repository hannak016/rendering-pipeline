// Note: you are not allowed to import any other APIs here.
import Vector from './vec'

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
    // los geht : 10:35 TODO: set given the parameters to the matrix elements (1p)

  }
  /**
   * multiplyMatrices implements matrix multiplication for two 
   * 4x4 matrices and assigns the result to this.
   * @param {Matrix} m1 is a given 4x4 matrix
   * @param {Matrix} m2 is a given 4x4 matrix
   * @returns {Matrix} this
   */
  multiplyMatrices(m1, m2) {
    // TODO: implement 4x4 matrix multiplication (3p)

    return this
  }
  extraOp1() {
    // TODO: You are allowed to extend a Matrix method,
    // but no points are given here. Document what's your implemented operation.

  }
  extraOp2() {
    // TODO: You are allowed to extend another Matrix method,
    // but no points are given here. Document what's your implemented operation.

  }
}