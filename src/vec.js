// Note: you are not allowed to import any other APIs here.
import Matrix from './mat'

/**
* Vector uses homogeneous coordinates (x, y, z, w) that represents
* either a point or a vector.
*/
export default class Vector {
  /**
    * constructs a point or a vector with given parameters.
    * @param {number} x is x value of a vector, default: 0
    * @param {number} y is y value of a vector, default: 0
    * @param {number} z is z value of a vector, default: 0
    * @param {number} w is w value of a vector, default: 0
    */
  constructor(x, y, z, w) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
    this.w = w || 0
  }
  /**
    * add adds the given two vectors, or point and vector, or two points
    * @param {Vector} v is a point or a vector
    * @returns {Vector} this
    */
  add(v) {
    // TODO: implement vector addition

    return this
  }
  /**
    * sub subtracts the given two vectors, or point and vector, or two points
    * @param {Vector} v is a point or a vector
    * @returns {Vector} this
    */
  sub(v) {
    // TODO: implement vector subtraction

    return this
  }
  /**
    * multiplyScalar implements scalar vector or scalar point multiplication.
    * @param {number} scalar is a scalar number.
    * @returns {Vector} this is a point or a vector
    */
  multiplyScalar(scalar) {
    // TODO: implement vector scalar multiplication

    return this
  }
  /**
    * dot implements dot product of two vectors.
    * This function will throw an error if this or v is not a vector.
    * @param {Vector} v is a vector NOT a point
    * @return {number} the result of dot product
    */
  dot(v) {
    // TODO: implement dot product

  }
  /**
    * crossVectors implements cross product for two given vectors
    * and assign the result to this and returns it.
    * This function will throw an error if this or v is not a vector.
    * @param {Vector} v1 is a given vector NOT a point
    * @param {Vector} v2 is a given vector NOT a point
    * @returns {Vector} the result of cross product
    */
  crossVectors(v1, v2) {
    // TODO: implement cross product

    return this
  }
  /**
    * normalize normalizes this vector to a unit vector.
    * This function will throw an error if this is not a vector.
    * 
    * @returns {Vector} the result of normalization
    */
  normalize() {
    // TODO: implement vector normalization

    return this
  }
  /**
    * applyMatrix applies 4x4 matrix by 4x1 vector multiplication.
    * the given matrix multiplies `this` vector from the left.
    *
    * @param {Matrix} m is a given 4x4 matrix
    * @returns {Vector} the result of matrix-vector multiplication.
    */
  applyMatrix(m) {
    // TODO: implement 4x4 matrix and 4x1 vector multiplication

    return this
  }
}
