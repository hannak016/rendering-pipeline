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


    //init
    this.initBuffers()
    this.initTransformation()

    


    //transform the light here so that it does not go into the loop
    console.log(this.light.position)
    this.vertexShader(this.light.position);
    console.log(this.light.position)
    console.log('lala')
    
  

    //vertex generation
    //test for 1 face 
    for(let fI=0;fI<3;fI++){

    //for all faces
    //for(let fI=0;fI<this.model.geometry.faces.length;fI++){

      let finalVs = [];
      let finalUVs = [];
      let finalVNs = [];
        
        
      //vertice in face fI 
      let vListfIv3 =
      [   this.model.geometry.vertices[this.model.geometry.faces[fI].a],
          this.model.geometry.vertices[this.model.geometry.faces[fI].b],
          this.model.geometry.vertices[this.model.geometry.faces[fI].c]
      ]
      //vertice in face fI (vec4)
      vListfIv3.forEach(e=>{
        let vIn4 = new Vector(e.x,e.y,e.z,1);
        finalVs.push(vIn4);
      })
        
   
      
      for(let vI=0;vI<3;vI++){
         
      //uvs
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

    //backface culling

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

    v01.normalize();
    v12.normalize(); 

   //this face normal. move it first without moving the vertices 
    let myfaceN = new Vector();
    myfaceN.crossVectors(v01,v12).normalize();
    myfaceN.applyMatrix(this.Tmodel);
    myfaceN.applyMatrix(this.Tcamera);


  //backface culling 

    const  camDir = new Vector(
      this.camera.position.x-this.camera.lookAt.x,
      this.camera.position.y-this.camera.lookAt.y,
      this.camera.position.z-this.camera.lookAt.z,
      0
    )
    camDir.normalize();

    let cosTheta = myfaceN.dot(camDir)
    if(cosTheta>0){
    
      //ok draw 


      
    //transform the vertices on screen  
    tri.forEach(e=>{
      this.vertexShader(e);
    })

    normals.forEach(normal=>{

      normal.applyMatrix(this.Tmodel);
      }
    )

    //culling: boundary calculation
    let myBox = {

      xmax:Math.max(tri[0].x, tri[2].x, tri[2].x),
      xmin:Math.min(tri[0].x, tri[2].x, tri[2].x),
      ymax:Math.max(tri[0].y, tri[2].y, tri[2].y),
      ymin:Math.min(tri[0].y, tri[2].y, tri[2].y),
      zmax:Math.max(tri[0].z, tri[2].z, tri[2].z),
      zmin:Math.min(tri[0].z, tri[2].z, tri[2].z),

    }
    


//test 
    for(let x=myBox.xmin+200;x<myBox.xmin+300;x++){
      for(let y=myBox.ymin+200;y<myBox.ymin+300;y++){
       for(let z=myBox.zmin+200;z<myBox.zmin+300;z++){
        
//loop all
/*     for(let x=myBox.xmin;x<myBox.xmax;x++){
      for(let y=myBox.ymin;y<myBox.ymax;y++){
       for(let z=myBox.zmin;z<myBox.zmax;z++){ */

        //Pixel in box, which is defined from transformed vertices, therefore pixel position interpolation is not needed

        let P = new Vector(x,y,z,0);
        let PN = new Vector();
        let PUV = {x:null,y:null}


        //Barycentric coordinates
         const _v20 = new Vector(
           tri[2].x-tri[0].x,
           tri[2].y-tri[0].y,
           tri[2].z-tri[0].z,
           0
         );

         const _v10=new Vector(
          tri[1].x-tri[0].x,
          tri[1].y-tri[0].y,
          tri[1].z-tri[0].z,
          0
        );
        const _vp0=new Vector(
          P.x-tri[0].x,
          P.y-tri[0].y,
          P.z-tri[0].z,
          0
        );
        const dot00 = _v20.dot( _v20 );
        const dot01 = _v20.dot( _v10 );
        const dot02 = _v20.dot( _vp0 );
        const dot11 = _v10.dot( _v10 );
        const dot12 = _v10.dot( _vp0 );
        const denom = ( dot00 * dot11 - dot01 * dot01 );
        
        
        if(denom!==0){
		
          const u = ( dot11 * dot02 - dot01 * dot12 ) / denom
          const v = ( dot00 * dot12 - dot01 * dot02 ) / denom
      
          let PBC = new Vector(1 - u - v, v, u, 0);
      
      
          //skip the pixels outside
          //Geometry()from three.js are the points counter-clockwise=>the pixel is in the triangle only if u v and 1-u-v are all positive
        
          if (PBC.x > 0 && PBC.y > 0 && PBC.z > 0){
       
         
      
          //uv interpolation 
          PUV.x = uvs[0].x*(1-u-v)+uvs[1].x*v+uvs[2].x*u
          PUV.y = uvs[0].y*(1-u-v)+uvs[1].y*v+uvs[2].y*u
          
      
          //normal interpolation 
          PN.x=normals[0].x*(1-u-v)+normals[1].x*v+normals[2].x*u;
          PN.y=normals[0].y*(1-u-v)+normals[1].y*v+normals[2].y*u;
          PN.z=normals[0].z*(1-u-v)+normals[1].z*v+normals[2].z*u;
  
      
          //pass to fs
          this.fragmentShader(PUV,PN,P);
          }
      
      
      
        }
	  
  }
  }
  }

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
    vertex.applyMatrix(this.Tmodel);
    vertex.applyMatrix(this.Tcamera);
    vertex.applyMatrix(this.Tpersp);
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


    //query the color
    let myTU;
    let myTV;
    let myTex = new Array();
    let indexT;

    myTU = Math.trunc(uv.x*this.model.texture.width);
    myTV = Math.trunc(uv.y*this.model.texture.height);
    indexT = myTU*myTV-1;
    
    
    //myT texture(rgb value) at this pixel x
    myTex = [
      this.model.texture.data[4*indexT],
      this.model.texture.data[4*indexT+1],
      this.model.texture.data[4*indexT+2]
    ]  
    console.log('lulu')

    //console.log(myTex)

    let myLight=new Vector(
      this.light.position.x-x.x,
      this.light.position.y-x.y,
      this.light.position.z-x.z,
      0
/*    x.x-this.light.position.x,
      x.y-this.light.position.y,
      x.z-this.light.position.z,
      0 */
    );
    myLight.normalize();

    // Intensity:myT
    // shading point:x
    // light direction:myLight
    // normal:normal
    // grad: default 10? shiness?
    //params from this.light


    const ka = this.light.Kamb;
    const kd = this.light.Kdiff;
    const ks = this.light.Kspec;

    const V =new Vector(
      this.camera.position.x-x.x,
      this.camera.position.y-x.y,
      this.camera.position.z-x.z,
      0);
    V.normalize();

  

    const H = new Vector(
      myLight.x+V.x,
      myLight.y+V.y,
      myLight.z+V.z,
      0)
    H.normalize();
    

    const la = myTex[0]*ka
    const ld = myTex[1]*kd*Math.max(0.0,normal.dot(myLight))
    const ls = myTex[2]*ks*Math.pow(Math.max(normal.dot(H),0.0),this.model.texture.shininess)

    let outColor = [la,ld,ls]

    console.log(outColor)
    //occlusion test
      //if(x.z<this.depthBuf){
      //Buffer update
      console.log('bbbbbbbbb')
      this.depthBuf[x.x * x.y-1]=x.z;
      //this.frameBuf[x.x*x.y-1]=outColor;
      this.frameBuf[x.x*x.y-1]=[0, 256, 256];
    //} 
  }
}
