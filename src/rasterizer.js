


import Vector from './vec'
import Matrix from './mat'

/**
 * Rasterizer implements a CPU rasterization rendering pipeline.
 */
export default class Rasterizer {
  
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

  
   
    this.frameBuf = new Array(this.screen.width * this.screen.height)
    this.depthBuf = new Array(this.screen.width * this.screen.height)

    this.Tmodel = null
    this.Tcamera = null
    this.Tpersp = null
    this.Tviewport = null
    return this
  }
 
  initBuffers() {
   
    for (let i = 0; i < this.screen.width*this.screen.height; i++) {
      this.frameBuf[i] = [0 , 0 , 0]
      this.depthBuf[i] = - 1
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
  
    // new allocated vertex
    const t = new Array(tri.length)
    tri.forEach((v, idx) => {
      t[idx] = this.vertexShader(v)
    })

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
    
    //AABB
    const myBox = {
      xmax:Math.max(t[0].x, t[1].x, t[2].x),
      xmin:Math.min(t[0].x, t[1].x, t[2].x),
      ymax:Math.max(t[0].y, t[1].y, t[2].y),
      ymin:Math.min(t[0].y, t[1].y, t[2].y)
    }

    for (let i = Math.floor(myBox.xmin); i < myBox.xmax; i++) {
      for (let j = Math.floor(myBox.ymin); j < myBox.ymax; j++) {
    
        const w = computeBarycentric(i, j, t)// barycentric 
        if (w.x > 0 && w.y > 0 && w.z > 0) {// inside triangle test

          // depth test
          const z = w.x * t[0].z + w.y * t[1].z + w.z * t[2].z
          if (z >this.depthBuf[j * this.screen.width + i]) {
         
        
        // uv interpolation
        const uvx = w.x*uvs[0].x + w.y*uvs[1].x + w.z*uvs[2].x
        const uvy = w.x*uvs[0].y + w.y*uvs[1].y + w.z*uvs[2].y
        const uv = {x:uvx, y:uvy}

        // fragment position interpolation
        const a = new Vector().add(tri[0]).applyMatrix(this.Tmodel)
        const b = new Vector().add(tri[1]).applyMatrix(this.Tmodel)
        const c = new Vector().add(tri[2]).applyMatrix(this.Tmodel)
        const px = w.x*a.x + w.y*b.x + w.z*c.x
        const py = w.x*a.y + w.y*b.y + w.z*c.y
        const pz = w.x*a.z + w.y*b.z + w.z*c.z
        const p = new Vector(px, py, pz, 1)

        // normal interpolation
        normals[0] = normals[0].applyMatrix(this.normalMatrix)
        normals[1] = normals[1].applyMatrix(this.normalMatrix)
        normals[2] = normals[2].applyMatrix(this.normalMatrix)
         
        const nx = w.x*normals[0].x + w.y*normals[1].x + w.z*normals[2].x
        const ny = w.x*normals[0].y + w.y*normals[1].y + w.z*normals[2].y
        const nz = w.x*normals[0].z + w.y*normals[1].z + w.z*normals[2].z
        const normal = new Vector(nx, ny, nz, 0).normalize()

        // Update buffer 
        this.depthBuf[j*this.screen.width + i] = z
        this.frameBuf[j*this.screen.width + i] = this.fragmentShader(uv, normal, p);

          }
        }
      }
    }
  }
  
  vertexShader(vertex) {
    //model space => projection space
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
fragmentShader(uv, normal, x) {
   
    let myCol = new Array();
    

    const width = this.model.texture.width
    const height = this.model.texture.height
    const indexT = width * (height - Math.floor(uv.y * height)) +
                Math.floor(uv.x * width)
    myCol = [
      this.model.texture.data[4 * indexT],
      this.model.texture.data[4 * indexT + 1],
      this.model.texture.data[4 * indexT + 2]
    ]  
  
  

    const ka = this.light.Kamb;
    const kd = this.light.Kdiff;//light myLight
    const ks = this.light.Kspec;//light and view H

    let myLight = new Vector(
      this.light.position.x-x.x,
      this.light.position.y-x.y,
      this.light.position.z-x.z,
      0
    );
    myLight.normalize();

    const V = new Vector(
      this.camera.position.x - x.x,
      this.camera.position.y - x.y,
      this.camera.position.z - x.z,
      0);
    V.normalize();
    const H = new Vector(
      myLight.x + V.x,
      myLight.y + V.y,
      myLight.z + V.z,
      0)
    H.normalize();
    

    const la = ka
    const ld = kd*Math.max(0.0,normal.dot(myLight))
    const ls = ks*Math.pow(Math.max(normal.dot(H),0.0),this.model.texture.shininess)

 
    
    let result = new Array();
    for( let i = 0; i < 3; i++ ) {
      result.push(Math.min(Math.max(myCol[i] * (la + ld + ls), 0), 255))

    } 
    return result;
  }
 
}
