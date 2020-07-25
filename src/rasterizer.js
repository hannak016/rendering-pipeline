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

  }
  /**
   * initTransformation initializes all transformation matrices,
   * including this.Tmodel, this.Tcamera, this.Tpersp, and this.Tviewport
   */
  initTransformation() {
    // TODO: prepare transformation matrices

  }

  /**
   * render implements a rasterization rendering pipeline.
   * Evetually, this methods stored all computed color in the frame buffer.
   */
  render() {
    // TODO: initialization, and vertex generation, etc.

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

  }
  /**
   * vertexShader is a shader that consumes a vertex then returns a vertex.
   * 
   * @param {Vector} vertex is an input vertex to the vertexShader
   * @returns {Vector} a transformed new vertex
   */
  vertexShader(vertex) {
    // TODO: transforms vertex from model space to projection space

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

  }
}
