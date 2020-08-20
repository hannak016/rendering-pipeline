
import Matrix from './mat'

export default class Vector {

  constructor(x, y, z, w) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
    this.w = w || 0
  }

  add(v) {
   
    this.x += v.x
    this.y += v.y
    this.z += v.z
    this.w += v.w

    return this
  }

  sub(v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
    this.w -= v.w


    return this
  }
  
  multiplyScalar(scalar) {

    this.x *= scalar
    this.y *= scalar
    this.z *= scalar
    this.w *= scalar

    return this
  }

  dot(v) {
  
    if( v.w === 0 && this.w === 0 ){
      return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w}
      
    else {
      throw new Error( 'i need vectors!!!!!!!!!!!' )
  }}

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

  normalize() {
    if(this.w === 0){
      const length = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z ) 
      this.multiplyScalar(1/length) 
      return this
    }

    else {
      throw new Error( 'give me vertors!' )}
    
  }
 
  applyMatrix(m) {


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
