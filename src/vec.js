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
    this.x += v.x
    this.y += v.y
    this.z += v.z
    this.w += v.w

    return this
  }
  /**
    * sub subtracts the given two vectors, or point and vector, or two points
    * @param {Vector} v is a point or a vector
    * @returns {Vector} this
    */
  sub(v) {
    // TODO: implement vector subtraction
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    this.w -= v.w


    return this
  }
  /**
    * multiplyScalar implements scalar vector or scalar point multiplication.
    * @param {number} scalar is a scalar number.
    * @returns {Vector} this is a point or a vector
    */
  multiplyScalar(scalar) {
    // TODO: implement vector scalar multiplication
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar
    this.w *= scalar

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
    if( v.w === 0 && this.w === 0 ){
      return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w}
      
    else {
      throw new Error( 'i need vectors!!!!!!!!!!!' )
  }}
  /**
    * crossVectors implements cross product for two given vectors
    * and assign the result to this and returns it.
    * This function will throw an error if this or v is not a vector.
    * @param {Vector} v1 is a given vector NOT a point
    * @param {Vector} v2 is a given vector NOT a point
    * @returns {Vector} the result of cross product
    */
  crossVectors(v1, v2) {
    if( v1.w === 0 && v2.w === 0 && this.w === 0  ){

      this.x = v1.y*v2.z - v1.z*v2.y
      this.y = v1.z*v2.x - v1.x*v2.z
      this.z = v1.x*v2.y - v1.y*v2.x
      
      return this
    }

    else {
      throw new Error( 'give me vectors brooo!' )}
  }
  /**
    * normalize normalizes this vector to a unit vector.
    * This function will throw an error if this is not a vector.
    * 
    * @returns {Vector} the result of normalization
    */
  normalize() {
    // TODO: implement vector normalization
    if(this.w === 0){
      const length = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z ) 
      this.multiplyScalar(1/length) 
      return this
    }

    else {
      throw new Error( 'give me vertors!' )}
    
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

    // Matrix.xs
   const x = this.x, y = this.y, z = this.z, w = this.w;
   const e = m.xs;
  

    this.x = e[ 0 ] * x + e[ 1 ] * y + e[ 2 ] * z + e[ 3 ] * w;
		this.y = e[ 4 ] * x + e[ 5 ] * y + e[ 6 ] * z + e[ 7 ] * w;
		this.z = e[ 8 ] * x + e[ 9 ] * y + e[ 10 ] * z + e[ 11 ] * w;
		this.w = e[ 12 ] * x + e[ 13 ] * y + e[ 14 ] * z + e[ 15 ] * w;  


   return this

  }
}
