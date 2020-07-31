# Online-Hausarbeit 3: Implementing a Rendering Pipeline

> Bearbeitungszeitraum: 20.07.2020 00:00 Uhr - 31.07.2020 23:59Uhr
>
> Computer Graphics 1 - Summer Semester 2020 - LMU Munich

To report your implemented features, check the checkboxes in the [Feature List](#feature-list) section.
For instance:

- [ ] This is an unchecked checkbox
- [x] This is a checked checkbox

## Feature List (100p)

- Implement the vector and matrix operations (**total: 13p**)
  - [x] vector addition (1p)
  - [x] subtraction (1p)
  - [x] scalar multiplication (1p)
  - [x] dot product (1p)
  - [x] cross products (2p)
  - [x] normalization (1p)
  - [x] 4x4 matrix by 4x1 vector multiplication (2p)
  - [x] set method (1p)
  - [x] 4x4 by 4x4 matrix multiplication (3p)

- Buffers initialization  (**total: 4p**)
  - [x] init the frame buffer by _black_ color (2p)
  - [x] init depth buffer by an appropriate value (2p)

- Prepare transformation matrices(**total: 21p**)
  - [x] Init model matrix (6p)
  - [x] nit view matrix (6p)
  - [x] Init perspective matrix (6p)
  - [x] Init viewport matrix (3p)

- Prepare the needed informations for drawing (**total: 10p**)
  - [x] invoke needed initializations (1p)
  - [x] accessing vertices coordinates (3p)
  - [x] accessing UVs (2p)
  - [x] accessing normals (2p)
  - [x] pass them as arguments to `draw` method (2p)

- Implement a rendering pipeline with vertex and fragment shader support (**total: 30p**)
  - [x] process each vertex using vertex shader (1p)
  - [x] implement a culling approach (5p)
  - [x] computes barycentric coordinates (6p)
  - [x] skips fragments that outside the processing triangle (3p)
  - [x] implement occlusion testing (4p)
  - [x] interpolate UVs (2p)
  - [x] interpolate fragment position (2p)
  - [x] interpolate normals (4p)
  - [x] update the depth buffer (1p)
  - [x] update the frame buffer by fragment shader (2p)

- Implement the vertex shader and fragment shader (**total: 22p**)
  - [x] implement vertex shader (5p)
  - [x] implement query texture color in fragment shader (5p)
  - [x] then compute the Blinn-Phong model in Phong shading frequency (12p)
