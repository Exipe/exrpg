
/**
 * Makes a view matrix for the specified camera details
 */
export function view(x, y, scale) {
    return scaling(scale, scale).translate(-x, -y)
    //return translation(-x, -y).scale(scale, scale)
}

/*
Makes a 2D projection matrix for the specified dimensions
Origin in the top-left
*/
export function projection(width: number, height: number): Matrix {
    /* 
    divide coords by half the width, and half the height (with the height inversed),
    (0, 0) -> (0, 0); (width, height) -> (2, -2)
    then move everything 1 step left and 1 step up (because this is how opengl expects the coords)
    */
    return scaling(2 / width, -2 / height).translate(-1, 1)
}

/*
Makes a transformation matrix that translates by the specified values
*/
export function translation(x: number, y: number) {
    return new Matrix(
        1, 0, x,
        0, 1, y,
        0, 0, 1
    )
}

/*
Makes a transformation matrix that scales by the specified values
*/
export function scaling(x: number, y: number) {
    return new Matrix(
        x, 0, 0,
        0, y, 0,
        0, 0, 1
    )
}

/*
Makes a transformation matrix that rotates by the specified degress
*/
export function rotation(degrees: number) {
    const radians = degrees * (Math.PI / 180)
    return new Matrix(
        Math.cos(radians), -Math.sin(radians), 0,
        Math.sin(radians), Math.cos(radians), 0,
        0, 0, 1
    )
}

export function identity() {
    return new Matrix(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    )
}

/*
Represents a 3x3 matrix that can be transformed, and used in shaders
*/
export class Matrix {

    x11: number; x12: number; x13: number
    x21: number; x22: number; x23: number
    x31: number; x32: number; x33: number

    constructor(x11: number, x12: number, x13: number, 
                x21: number, x22: number, x23: number, 
                x31: number, x32: number, x33: number) {
        this.x11 = x11; this.x12 = x12; this.x13 = x13
        this.x21 = x21; this.x22 = x22; this.x23 = x23
        this.x31 = x31; this.x32 = x32; this.x33 = x33
    }

    multiply(other: Matrix): Matrix {
        return new Matrix(
            this.x11*other.x11 + this.x12*other.x21 + this.x13*other.x31, //x11
            this.x11*other.x12 + this.x12*other.x22 + this.x13*other.x32, //x12
            this.x11*other.x13 + this.x12*other.x23 + this.x13*other.x33, //x13

            this.x21*other.x11 + this.x22*other.x21 + this.x23*other.x31, //x21
            this.x21*other.x12 + this.x22*other.x22 + this.x23*other.x32, //x22
            this.x21*other.x13 + this.x22*other.x23 + this.x23*other.x33, //x23

            this.x31*other.x11 + this.x32*other.x21 + this.x33*other.x31, //x31
            this.x31*other.x12 + this.x32*other.x22 + this.x33*other.x32, //x32
            this.x31*other.x13 + this.x32*other.x23 + this.x33*other.x33, //x33
        )
    }

    /*
    A new matrix that is this matrix scaled
    */
    scale(x: number, y: number) {
        return scaling(x, y).multiply(this)
    }

    /*
    A new matrix that is this matrix translated
    */
    translate(x: number, y: number) {
        return translation(x, y).multiply(this)
    }

    rotate(degrees: number) {
        return rotation(degrees).multiply(this)
    }

    get value(): Float32Array {
        return new Float32Array([this.x11, this.x12, this.x13, this.x21, this.x22, this.x23, this.x31, this.x32, this.x33])
    }

}