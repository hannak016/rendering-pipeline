// Note: you are not allowed to import any other APIs, you must only use
// the Vector and Matrix class.

import Vector from './vec'
import Matrix from './mat'


export default class Rasterizer {
  /**
   * constructor creates all properties of a Rasterizer.
   *
   * @param {Object} params contains an object with the scene parameters.
   * @returns {Rasterizer} this
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
      Kamb: 0.5,  // ambient
      Kdiff: 0.6, // diffuse
      Kspec: 1,   // specular
      position: new Vector(-200, 250, 600, 1),
    }
    this.model = {
      // Hint: geometry is a three.js Geometry object.
      // You can check the document for the needed properties here:
      // https://threejs.org/docs/#api/en/core/Geometry
      geometry: params.model.geometry,
      // Hint: The texture color is an array of numbers that aligned as
      // [r, g, b, a, r, g, b, a, ...] with size (width x height x 4).
      // r, g, b, a represents red, green, blue and alpha channel values.
      // You only need r, g, b values in this assignment.
      texture: {
        data: params.model.texture.data,
        width: params.model.texture.width,
        height: params.model.texture.height,
        shininess: params.model.texture.shininess,
      },
      scale: new Vector(1500, 1500, 1500, 0),
      position: new Vector(-700, -5, 350, 1)
    }

    // Buffers that is used in the rasterizer.
    //
    // The frameBuf must be an array of RGB colors, where a color is an
    // array of three numbers (r, g, b), and RGB values is from 0 to 255.
    // For instance: this.frameBuf = [[0, 0, 0], [255, 255, 255], ...]
    // where ... means unlisted elements.
    //
    // The depthBuf must be an array of numbers, which are z values.
    // For instance: this.depthBuf = [-0.6, -0.1, 0.5, ...]
    // where ... means unlisted elements.
    this.frameBuf = new Array(this.screen.width * this.screen.height)
    this.depthBuf = new Array(this.screen.width * this.screen.height)

    // transformation matrices
    //
    // Tmodel is a model transformation Matrix.
    // Tcamera is a view transformation Matrix.
    // Tpersp is a perspective transformation Matrix.
    // Tviewport is a viewport transformation Matrix.
    this.Tmodel = null
    this.Tcamera = null
    this.Tpersp = null
    this.Tviewport = null
    return this
  }
  /**
   * initBuffers initializes this.frameBuf and this.depthBuf.
   */
  initBuffers() {
    // TODO: buffer initialization

    //frameBuf black rgb [0,0,0]
    const myCol = [0,0,0]
     for( let i = 0;i < this.frameBuf.length;i++ ){
      this.frameBuf[ i ] = myCol;
    } 


    //depthBuf
    const myDepth = 1
    for(let j = 0;j < this.depthBuf.length;j++ ){
     this.depthBuf[ j ] = myDepth;
   } 
    
    return this

  }
  /**
   * initTransformation initializes all transformation matrices,
   * including this.Tmodel, this.Tcamera, this.Tpersp, and this.Tviewport
   */
  initTransformation() {
    // TODO: prepare transformation matrices

    //Tmodel
    const myTmodel = new Matrix();
    myTmodel.set( 
      this.model.scale.x,0,0,-this.model.position.x,
      0,this.model.scale.y,0,-this.model.position.y,
      0,0,this.model.scale.z,-this.model.position.z,
      0,0,0,1
    )

    this.Tmodel = myTmodel;
    // => model at (0,0,0)

// Tmodel is right, but the result....
/*     console.log(this.myTmodel)
    console.log(this.Tmodel)

    let tt =new Vector( -0.910323821202561,  0.3934034445356127, -0.12862453256934675,  0);
    tt.applyMatrix(this.Tmodel);
    console.log(tt)
    console.log(this.Tmodel) */




    //Tcamera
    const myTcamera = new Matrix();
    let myZ = new Vector(
      this.camera.position.x-this.camera.lookAt.x,
      this.camera.position.y-this.camera.lookAt.y,
      this.camera.position.z-this.camera.lookAt.z,
      0
    )
    myZ.normalize();

    let myX = new Vector();
    myX.crossVectors(this.camera.up,myZ).normalize();
    let myY = new Vector();
    myY.crossVectors(myZ,myX).normalize();


    myTcamera.set(
      myX.x,myY.x,myZ.x,0,
      myX.y,myY.y,myZ.y,0,
      myX.z,myY.z,myZ.z,0,
      0,0,0,1 
    )

    
    this.Tcamera = myTcamera;
    //=> model's position is relative to the camera





    //Tpersp
    const aspect = this.camera.aspect;
    const fov = this.camera.fov * Math.PI / 180
    const n = this.camera.near;
    const f = this.camera.far;
    const r = - aspect * n * Math.tan(fov/2);
    const t = - n * Math.tan(fov/2);

    
    //step1: Tortho
    const Tortho = new Matrix();
    Tortho.set(
      1/r,0,0,0,
      0,1/t,0,0,
      0,0,2/(n-f),(f+n)/(f-n),
      0,0,0,1
    )
    //step2:Tpo
    const Tpo = new Matrix();
    Tpo.set(
      n,0,0,0,
      0,n,0,0,
      0,0,n+f,-n*f,
      0,0,1,0
    )

    const myTpersp = new Matrix();
    myTpersp.multiplyMatrices(Tortho,Tpo);


    this.Tpersp = myTpersp;
    //=> model is in 2D
 




    //Tviewport
    const myTviewport = new Matrix();
    myTviewport.set(
      this.screen.width/2,0,0,this.screen.width/2,
      0,this.screen.height/2,0,this.screen.height/2,
      0,0,1,0,
      0,0,0,1
    )

    
    this.Tviewport = myTviewport;
    // => model on screen


  }

  /**
   * render implements a rasterization rendering pipeline.
   * Evetually, this methods stored all computed color in the frame buffer.
   */
  render() {
    // TODO: initialization, and vertex generation, etc.


    this.initBuffers();//prepare Buffer
    this.initTransformation();//prepare needed matrices 


    //outerloop()
    //unit:each face

/*     vertex generation
    --vertex positions
    --vertex uvs
    --vertex normals
 */

    //test for face 1
    for(let fI=0;fI<1;fI++){

    //for all faces
    //for(let fI=0;fI<this.model.geometry.faces.length;fI++){

      let finalVs = [];
      let finalUVs = [];
      let finalVNs = [];
        
        
        //vertice in face fI in vec3
      let vListfIv3 =
      [   this.model.geometry.vertices[this.model.geometry.faces[fI].a],
          this.model.geometry.vertices[this.model.geometry.faces[fI].b],
          this.model.geometry.vertices[this.model.geometry.faces[fI].c]
      ]
        //vertice in face fI in vec4
      vListfIv3.forEach(e=>{
        let vIn4 = new Vector(e.x,e.y,e.z,1);
        finalVs.push(vIn4);
      })
        
   
        //uv and normals
      for(let vI=0;vI<3;vI++){
        
        
      //uv of vertex vI in fI
      finalUVs.push(this.model.geometry.faceVertexUvs[0][fI][vI])
      /*    console.log(this.model.geometry.faceVertexUvs[0][fI])
      console.log(this.model.geometry.faceVertexUvs[0][fI][vI]) */
  


      //normal of 1 vertex 
      let n4 = new Vector(
        this.model.geometry.faces[fI].vertexNormals[vI].x,
        this.model.geometry.faces[fI].vertexNormals[vI].y,
        this.model.geometry.faces[fI].vertexNormals[vI].z,
        0
      )
      //normals of 3 vertrices
      finalVNs.push(n4) 
        
      } 
/*       console.log(finalVs)
      console.log(finalUVs)
      console.log(finalVNs) */

      //for this face
      this.draw(finalVs,finalUVs,finalVNs)
    
    }

  }
  /**
   * draw implements the rendering pipeline for a triangle with
   * vertex shader and fragment shader support.
   * 
   * @param {Array.<Vector>} tri is an Array of Vector vertices
   * @param {Array.<Vector>} uvs is an Array of Vector UVs
   * @param {Array.<Vector>} normals is an Array of Vector normals
   */
  draw(tri, uvs, normals) {
    // TODO: implement a rendering pipeline.

    //innerloop
    //unit: pixel





 
    //my culling approch


    
 


    let v01 = new Vector(
      tri[0].x-tri[1].x,
      tri[0].y-tri[1].y,
      tri[0].z-tri[1].z,
      0);
    

    let v12 = new Vector(
      tri[1].x-tri[2].x,
      tri[1].y-tri[2].y,
      tri[1].z-tri[2].z,
      0)


    //test: pass
    //safe from sub() side effect
    {
/*       console.log(tri[1])
      
      let v01 = new Vector(
      tri[0].x-tri[1].x,
      tri[0].y-tri[1].y,
      tri[0].z-tri[1].z,
      0);
    

    let v12 = new Vector(
      tri[1].x-tri[2].x,
      tri[1].y-tri[2].y,
      tri[1].z-tri[2].z,
      0)
    console.log(tri[1]) */
  }


    v01.normalize();
    v12.normalize();
     
  //test: pass 
  {/*
    console.log(v01)
    console.log(v12)

    v01.normalize();
    v12.normalize();

    console.log(v01)
    console.log(v12)
   
  */}

  //normal of this face: calculating here instead of from geometry attribute cuz the parameter passing limit


    let myfaceN = new Vector();
    myfaceN.crossVectors(v01,v12).normalize();


  //test:pass
{
/*     let myfaceN = new Vector();
    myfaceN.crossVectors(v01,v12).normalize();
    console.log(myfaceN);
    console.log(this.model.geometry.faces[0].normal) */
}

  // to camera pos 
    myfaceN.applyMatrix(this.Tmodel);
    myfaceN.applyMatrix(this.Tcamera);
    //test: pass
    {


           /*  //console.log(myfaceN)
            myfaceN.applyMatrix(this.Tmodel);
            //console.log(myfaceN)
            myfaceN.applyMatrix(this.Tcamera);
            //console.log(myfaceN); */
    }

  //and see the angel

    const  camDir = new Vector(
      this.camera.position.x-this.camera.lookAt.x,
      this.camera.position.y-this.camera.lookAt.y,
      this.camera.position.z-this.camera.lookAt.z,
      0
    )
/* //safe
    console.log(this.camera.position)
    console.log(this.camera.lookAt) */
    camDir.normalize();
    //console.log(camDir);
    //console.log(myfaceN)
/*   //safe
    console.log(this.camera.position)
    console.log(this.camera.lookAt)
 */

    let cosTheta = myfaceN.dot(camDir)

    //backface culling
    if(cosTheta>0){
      //draw this face
      
    
      //transform the vertices on screen 
      
    tri.forEach(e=>{this.vertexShader(e)})
      //test:pass
      {/*     console.log(tri[0]);

    tri.forEach(e=>{this.vertexShader(e)})
       console.log(tri[0]); */}

       //to screen

       //now 2D triangel

  


       //generate every pixel in this 2D tri 
       

    /*calculate colors:
    ---barycentric center according the 3 vertrices

    ---every pixel's barycentrical coordinate(their weight)==>interpolate uv 


    ??????? check how 
    --pixelposition(interpolated),for:
       --skipping (according to their b coor?) whose not in
       --passing to fs


    ??????? check how 

    --pixelnormal(interpolated)


    --depthBuf<=>x.z
     ---if(depthBuf<?/>?x.z)//if true 
     
     
     {

      folien
   
    ---pass the pixel to framgmentshader：下面就是fs通过Blinn Phong 来确定最终的颜色了

    this.fragmentShader(currentpixel.uv,currentpixel.n,currentpixel.pos)
    ---update frameBuf    
        
        
        
     }

    } */
 


   

  }
  }
  /**
   * vertexShader is a shader that consumes a vertex then returns a vertex.
   * 
   * @param {Vector} vertex is an input vertex to the vertexShader
   * @returns {Vector} a transformed new vertex
   */
  vertexShader(vertex) {
    // TODO: transforms vertex from model space to projection space

    //all right

/*     console.log('original')
    console.log(vertex) */

    vertex.applyMatrix(this.Tmodel);
/*     console.log('to 000')
    console.log(vertex) */

    vertex.applyMatrix(this.Tcamera);
/*     console.log('to cam')
    console.log(vertex) */

    vertex.applyMatrix(this.Tpersp);
/*     console.log('projected')
    console.log(vertex) */
    
    vertex.applyMatrix(this.Tviewport);
    

  }
  /**
   * fragmentShader is a shader that implements texture mapping and 
   * the Blinn-Phong reflectance model.
   * @param {Vector} uv the UV values of this fragment
   * @param {Vector} normal the surface normal of this fragment
   * @param {Vector} x is the coordinates of the shading point
   * @returns {Array.<number>} an array of three numbers that represents
   * rgb color, e.g. [128, 128, 128] as gray color.
   */
  fragmentShader(uv, normal, x) {
    // TODO: texture mapping and Blinn-Phong model in Phong shading frequency


    //有了这一个pixel的信息 uv 和 normal->颜色可以算出来了
    //用 Blinn-Phong

   
 
    const ka = this.light.Kamb;
    const kd = this.light.Kdiff;
    const ks = this.light.Kspec;

    const V =new Vector(this.camera.position-x);
    V.normalize();
    const LPos3 = [this.light.position.x,this.light.position.y,this.light.position.z]
    const L= new Vector(this.vertexShader(LPos3),1);
    L=L.sub(x);
    L.normalize();
    const H = L.add(V);
    H.normalize();
    //?const I=new Vector(uv,x)
    const I=(this.texture,uv);




    const la = new Vector(ka,ka,ka,1)*I
    const ld = new Vector(kd,kd,kd,1)*I*Math.max(0.0,normal.dot(L))
    const ls = new Vector(ks,ks,ks,1)*I*Math.pow(Math.max(normal.dot(H),0.0),10)

    


    var outColor = la.add(ld).add(ls);
    //


    
    return outColor;
 
  }
}
