# rendering-pipeline:3D modeling without API

## let's go
* Be sure to have [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed.
* `git pull` to copy the repository
* `npm i` to install dependencies
* `npm start` to run.


##  files:
* src/assets/ folder: bunny model + bunny texture.
* package.json, package-lock.json, webpack.config.js, babel.config.js
* src/main.js: for more understanding of how the “hardware display” is constructed
* src/vec.js src/mat.js
* src/rasterizer.js implements a CPU rasterization rendering pipeline.



## points
* vector
* matrix
* frame buffer
* depth buffer
* Transformation matrices
  1. Tmodel
  2. Tcamera
  3. Tpersp
  4. Tviewport
  5. Tnormal
* access infos from Geometry
* AABB culling approach
* barycentric coordinate
* z-test
* uv interpolation
* fragment position interpolation
* normal interpolation
* vertex shader
* fragment shader:color query+ Blinn-Phong

