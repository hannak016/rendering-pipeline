
export default class Matrix {
  constructor() {
    this.xs = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
  }

  set(
    x11, x12, x13, x14,
    x21, x22, x23, x24,
    x31, x32, x33, x34,
    x41, x42, x43, x44
  ) {
      const xs = this.xs
  
      xs[ 0 ] = x11; xs[ 1 ] = x12; xs[ 2 ] = x13; xs[ 3 ] = x14;
      xs[ 4 ] = x21; xs[ 5 ] = x22; xs[ 6 ] = x23; xs[ 7 ] = x24;
      xs[ 8 ] = x31; xs[ 9 ] = x32; xs[ 10 ] = x33; xs[ 11 ] = x34;
      xs[ 12 ] = x41; xs[ 13 ] = x42; xs[ 14 ] = x43; xs[ 15 ] = x44;
  
      return this;
  
    }


  multiplyMatrices( m1, m2 ) {
 
		const m1e = m1.xs;
		const m2e = m2.xs;
		const te = this.xs;

		const m111 = m1e[ 0 ], m112 = m1e[ 1 ], m113 = m1e[ 2 ], m114 = m1e[ 3 ];
		const m121 = m1e[ 4 ], m122 = m1e[ 5 ], m123 = m1e[ 6 ], m124 = m1e[ 7 ];
		const m131 = m1e[ 8 ], m132 = m1e[ 9 ], m133 = m1e[ 10 ], m134 = m1e[ 11 ];
    const m141 = m1e[ 12 ], m142 = m1e[ 13 ], m143 = m1e[ 14 ], m144 = m1e[ 15 ];


    const m211 = m2e[ 0 ], m212 = m2e[ 1 ], m213 = m2e[ 2 ], m214 = m2e[ 3 ];
		const m221 = m2e[ 4 ], m222 = m2e[ 5 ], m223 = m2e[ 6 ], m224 = m2e[ 7 ];
		const m231 = m2e[ 8 ], m232 = m2e[ 9 ], m233 = m2e[ 10 ], m234 = m2e[ 11 ];
    const m241 = m2e[ 12 ], m242 = m2e[ 13 ], m243 = m2e[ 14 ], m244 = m2e[ 15 ];


		te[ 0 ] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241
		te[ 4 ] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241
		te[ 8 ] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241
		te[ 12 ] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241

		te[ 1 ] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242
		te[ 5 ] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242
    te[ 9 ] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242
    te[ 13 ] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242
    
    te[ 2 ] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243
		te[ 6 ] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243
    te[ 10 ] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243
    te[ 14 ] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243
    
    te[ 3 ] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244
    te[ 7 ] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244
    te[ 11 ] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244
    te[ 15 ] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244
    
		return this;

	}
  
    

  inverse() {
  
    let result = new Matrix();
    let m = this.xs; 
    let r = result.xs;
  
    r[0] = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10];
    r[1] = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10];
    r[2] = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6];
    r[3] = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6];
  
    r[4] = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
    r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
    r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
    r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];
  
    r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
    r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
    r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
    r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];
  
    r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
    r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
    r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
    r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];
  
    let det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
    for (let i = 0; i < 16; i++) r[i] /= det;
    return result;


  }
  
    transpose() {


     const te = this.xs;
     let tmp;

    tmp = te[ 4 ]; te[ 4 ] = te[ 1 ]; te[ 1 ] = tmp;
    tmp = te[ 8 ]; te[ 8 ] = te[ 2 ]; te[ 2 ] = tmp;
    tmp = te[ 9 ]; te[ 9 ] = te[ 6 ]; te[ 6 ] = tmp;

    tmp = te[ 12 ]; te[ 12 ] = te[ 3 ]; te[ 3 ] = tmp;
    tmp = te[ 13 ]; te[ 13 ] = te[ 7 ]; te[ 7 ] = tmp;
    tmp = te[ 14 ]; te[ 14 ] = te[ 11 ]; te[ 11 ] = tmp;

    return this;

}




}