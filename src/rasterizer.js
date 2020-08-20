/**
 * CG1 Online-Hausarbeit 3: Implementing a Rasterization Pipeline
 * Copyright (C) 2020 Changkun Ou <https://changkun.de/>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */



import Vector from './vec'
import Matrix from './mat'

/**
 * Rasterizer implements a CPU rasterization rendering pipeline.
 */
export default class Rasterizer {
  /**
   * constructor creates all properties of a Rasterizer.
   *
   * @param {Object} params contains an object with the scene parameters.
   * @return {Rasterizer} this
   */
  constructor(params) {
    this.screen = params.screen
    this.camera = {
      position: new Vector(-550, 194, 734, 1),
      fov: 45, aspect: this.screen.width/this.screen.height,
      near: 100, far: 600,
      lookAt: new Vector(-1000, 0, 0, 1),
      up: new Vector(0, 1, 1, 0),
    }
    this.light = {
      color: 0xffffff,
      Kamb: 0.5, // ambient
      Kdiff: 0.6, // diffuse
      Kspec: 1, // specular
      position: new Vector(-200, 250, 600, 1),
    }
    this.model = {
      
      geometry: params.model.geometry,
      texture: {
        data: params.model.texture.data,
        width: params.model.texture.width,
        height: params.model.texture.height,
        shininess: params.model.texture.shininess,
      },
      scale: new Vector(1500, 1500, 1500, 0),
      position: new Vector(-700, -5, 350, 1),
    }

    // Buffers that is used in the rasterizer.
    //
   
    this.frameBuf = new Array(this.screen.width * this.screen.height)
    this.depthBuf = new Array(this.screen.width * this.screen.height)

    this.Tmodel = null
    this.Tcamera = null
    this.Tpersp = null
    this.Tviewport = null
    return this
  }
 
  initBuffers() {
    // buffer initialization
    for (let i = 0; i < this.screen.width*this.screen.height; i++) {
      this.frameBuf[i] = [0 /* r */, 0 /* g */, /* b */ 0]
      this.depthBuf[i] = -Infinity
    }
  }

  initTransformation() {
    //matrices
    const Tscale = new Matrix()
    Tscale.set(
      this.model.scale.x, 0, 0, 0,
      0, this.model.scale.y, 0, 0,
      0, 0, this.model.scale.z, 0,
      0, 0, 0, 1
    )
    const Ttrans = new Matrix()
    Ttrans.set(
      1, 0, 0, this.model.position.x,
      0, 1, 0, this.model.position.y,
      0, 0, 1, this.model.position.z,
      0, 0, 0, 1
    )
    this.Tmodel = new Matrix()
    this.Tmodel.multiplyMatrices(Ttrans, Tscale)

    const Rview = new Matrix()
    const w = new Vector(
      this.camera.lookAt.x,
      this.camera.lookAt.y,
      this.camera.lookAt.z, 1).sub(this.camera.position).normalize()
    const u = new Vector().crossVectors(new Vector(this.camera.up.x,
      this.camera.up.y, this.camera.up.z, 0), w).multiplyScalar(-1).normalize()
    const v = new Vector().crossVectors(u, w).normalize()
    Rview.set(
      u.x, u.y, u.z, 0,
      v.x, v.y, v.z, 0,
      -w.x, -w.y, -w.z, 0,
      0, 0, 0, 1
    )
    const Tview = new Matrix()
    Tview.set(
      1, 0, 0, -this.camera.position.x,
      0, 1, 0, -this.camera.position.y,
      0, 0, 1, -this.camera.position.z,
      0, 0, 0, 1
    )
    this.Tcamera = new Matrix()
    this.Tcamera.multiplyMatrices(Rview, Tview)

    const aspect = this.camera.aspect
    const fov = this.camera.fov
    const near = this.camera.near
    const far = this.camera.far
    this.Tpersp = new Matrix()
    this.Tpersp.set(
      -1/(aspect * Math.tan(fov*Math.PI/360)), 0, 0, 0,
      0, -1/(Math.tan(fov*Math.PI/360)), 0, 0,
      0, 0, (near+far)/(near-far), 2*near*far/(near-far),
      0, 0, 1, 0
    )

    this.Tviewport = new Matrix()
    this.Tviewport.set(
      this.screen.width/2, 0, 0, this.screen.width/2,
      0, this.screen.height/2, 0, this.screen.height/2,
      0, 0, 1, 0,
      0, 0, 0, 1
    )


    const myTMC = new Matrix();
    myTMC.multiplyMatrices(new Matrix(),this.Tmodel);
    let TrInvMC = new Matrix();
    TrInvMC=myTMC.inverse();
    TrInvMC.transpose();
    this.normalMatrix = TrInvMC;
  }

  render() {
    // initialization
    this.initBuffers()
    this.initTransformation()

    //get infos
    for(let fI=0;fI<this.model.geometry.faces.length;fI++){

      let finalVs = [];
      let finalUVs = [];
      let finalVNs = [];
        
        
      //vertice coordinates
      let vListfIv3 =
      [   this.model.geometry.vertices[this.model.geometry.faces[fI].a],
          this.model.geometry.vertices[this.model.geometry.faces[fI].b],
          this.model.geometry.vertices[this.model.geometry.faces[fI].c]
      ]
      vListfIv3.forEach(e=>{
        let vIn4 = new Vector(e.x,e.y,e.z,1);
        finalVs.push(vIn4);
      })
        
   
      
      for(let vI=0;vI<3;vI++){
         
      finalUVs.push(this.model.geometry.faceVertexUvs[0][fI][vI])
 

      //normals
      let n4 = new Vector(
        this.model.geometry.faces[fI].vertexNormals[vI].x,
        this.model.geometry.faces[fI].vertexNormals[vI].y,
        this.model.geometry.faces[fI].vertexNormals[vI].z,
        0
      )
      finalVNs.push(n4)      
      } 

      //pass infos for draw()
      this.draw(finalVs,finalUVs,finalVNs)
    
    }
  }
 
  draw(tri, uvs, normals) {
  
    // return:  new allocated vertex
    // camera space vertex coordinates.
    const t = new Array(tri.length)
    tri.forEach((v, idx) => {
      t[idx] = this.vertexShader(v)
    })

    // backface culling
    const fN = new Vector().crossVectors(
      new Vector().add(t[1]).sub(t[0]),
      new Vector().add(t[2]).sub(t[0])
    ) // no need to normalize and save some calculation
    if (new Vector(0, 0, -1, 0).dot(fN) >= 0) {
      return
    }

    // view frustum culling: compute AABB based on the processed vertices
    const xMax = Math.min(Math.max(t[0].x, t[1].x, t[2].x), this.screen.width)
    const xMin = Math.max(Math.min(t[0].x, t[1].x, t[2].x), 0)
    const yMax = Math.min(Math.max(t[0].y, t[1].y, t[2].y), this.screen.height)
    const yMin = Math.max(Math.min(t[0].y, t[1].y, t[2].y), 0)
    if (xMin > xMax && yMin > yMax) { // no extra computation is needed
      return
    }

    // compute normals and shading point in world space for fragment shading
    normals[0] = normals[0].applyMatrix(this.normalMatrix)
    normals[1] = normals[1].applyMatrix(this.normalMatrix)
    normals[2] = normals[2].applyMatrix(this.normalMatrix)
    const a = new Vector().add(tri[0]).applyMatrix(this.Tmodel)
    const b = new Vector().add(tri[1]).applyMatrix(this.Tmodel)
    const c = new Vector().add(tri[2]).applyMatrix(this.Tmodel)

    /**
    * computeBarycentric implements barycentric coordinates
    *
    * @param {number} x is the x coordinate of the fragment
    * @param {number} y is the y coordinate of the fragment
    * @param {Array.<Vector>} vs is an Array of Vector vertices.
    * @return {Vector} a Vector that represents corresponding barycentric
    * coordinates. For instance, if the computed barycentric coordinates
    * is (0.1, 0.3, 0.6) then the return value is a vector (0.1, 0.3, 0.6, 0)
    */
    const computeBarycentric = (x, y, vs) => {
      // compute barycentric coordinates
      const ap = new Vector(x, y, 0, 1)
        .sub(new Vector(vs[0].x, vs[0].y, 0, 1))
      const ab = new Vector(vs[1].x, vs[1].y, 0, 1)
        .sub(new Vector(vs[0].x, vs[0].y, 0, 1))
      const ac = new Vector(vs[2].x, vs[2].y, 0, 1)
        .sub(new Vector(vs[0].x, vs[0].y, 0, 1))
      const bc = new Vector(vs[2].x, vs[2].y, 0, 1)
        .sub(new Vector(vs[1].x, vs[1].y, 0, 1))
      const bp = new Vector(x, y, 0, 1)
        .sub(new Vector(vs[1].x, vs[1].y, 0, 1))
      const out = new Vector(0, 0, -1, 0)
      const Sabc = new Vector().crossVectors(ab, ac).dot(out)
      const Sabp = new Vector().crossVectors(ab, ap).dot(out)
      const Sapc = new Vector().crossVectors(ap, ac).dot(out)
      const Sbcp = new Vector().crossVectors(bc, bp).dot(out)
      return new Vector(Sbcp / Sabc, Sapc / Sabc, Sabp / Sabc, 0)
    }

    for (let i = Math.floor(xMin); i < xMax; i++) {
      for (let j = Math.floor(yMin); j < yMax; j++) {
        // barycentric interpolation
        const w = computeBarycentric(i, j, t)
        // inside triangle test
        if (w.x < 0 || w.y < 0 || w.z < 0) {
          continue
        }

        // depth test
        const z = w.x * t[0].z + w.y * t[1].z + w.z * t[2].z
        if (z < this.depthBuf[j * this.screen.width + i]) {
          continue
        }

        // uv interpolation
        const uvx = w.x*uvs[0].x + w.y*uvs[1].x + w.z*uvs[2].x
        const uvy = w.x*uvs[0].y + w.y*uvs[1].y + w.z*uvs[2].y
        const uv = new Vector(uvx, uvy, 0, 1)

        // fragment position interpolation
        const px = w.x*a.x + w.y*b.x + w.z*c.x
        const py = w.x*a.y + w.y*b.y + w.z*c.y
        const pz = w.x*a.z + w.y*b.z + w.z*c.z
        const p = new Vector(px, py, pz, 1)

        // normal interpolation
        const nx = w.x*normals[0].x + w.y*normals[1].x + w.z*normals[2].x
        const ny = w.x*normals[0].y + w.y*normals[1].y + w.z*normals[2].y
        const nz = w.x*normals[0].z + w.y*normals[1].z + w.z*normals[2].z
        const normal = new Vector(nx, ny, nz, 0).normalize()

        // Update depth buffer and invoke fragment shader for
        // shading then update frame buffer using the processed color
        this.depthBuf[j*this.screen.width + i] = z
        this.frameBuf[j*this.screen.width + i] =
          this.fragmentShader(uv, normal, p)
          // [255, 255, 255]  // white bunny
          // [z, z, z]        // grascale bunny
      }
    }
  }
  /**
   * vertexShader is a shader that consumes a vertex then returns a vertex.
   *
   * @param {Vector} vertex is an input vertex to the vertexShader
   * @return {Vector} a transformed new vertex
   */
  vertexShader(vertex) {
    //transforms vertex from model space to projection space
    const p = new Vector(vertex.x, vertex.y, vertex.z, 1)
    p.applyMatrix(this.Tmodel)
    p.applyMatrix(this.Tcamera)
    p.applyMatrix(this.Tpersp)
    p.applyMatrix(this.Tviewport)
    p.x /= p.w
    p.y /= p.w
    p.z /= p.w
    p.w = 1
    return p
  }
  /**
   * fragmentShader is a shader that implements texture mapping and
   * the Blinn-Phong reflectance model.
   * @param {Vector} uv the UV values of this fragment
   * @param {Vector} normal the surface normal of this fragment
   * @param {Vector} x is the coordinates of the shading point
   * @return {Array.<number>} an array of three numbers that represents
   * rgb color, e.g. [128, 128, 128] as gray color.
   */
  fragmentShader(uv, normal, x) {
    // texture mapping and Blinn-Phong model in Phong shading frequency

    // fetch color from texture
    const width = this.model.texture.width
    const height = this.model.texture.height
    const idx = width * (height - Math.floor(uv.y * height)) +
                Math.floor(uv.x * width)
    const I = new Vector(
      this.model.texture.data[4*idx+0],
      this.model.texture.data[4*idx+1],
      this.model.texture.data[4*idx+2],
      this.model.texture.data[4*idx+3],
    )

    // compute the blinn-phong
    const L = new Vector().add(this.light.position).sub(x).normalize()
    const V = new Vector().add(this.camera.position).sub(x).normalize()
    const H = new Vector().add(L).add(V).normalize()
    const clamp = (v) => {
      v.x = Math.min(Math.max(v.x, 0), 255)
      v.y = Math.min(Math.max(v.y, 0), 255)
      v.z = Math.min(Math.max(v.z, 0), 255)
      return v
    }
    const p = this.model.texture.shininess
    const La = clamp(new Vector().add(I).multiplyScalar(this.light.Kamb))
    const Ld = clamp(new Vector().add(I).multiplyScalar(this.light.Kdiff)
      .multiplyScalar(normal.dot(L)))
    const Ls = clamp(new Vector().add(I).multiplyScalar(this.light.Kspec)
      .multiplyScalar(Math.pow(normal.dot(H), p)))

    const color = clamp(new Vector().add(La).add(Ld).add(Ls))
    return [color.x, color.y, color.z]
    // return [I.x, I.y, I.z] // no blinn-phong
  }
}
