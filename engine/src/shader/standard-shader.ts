
import { Shader, loc } from "./shader";
import { Matrix } from "../matrix";

export class StandardShader extends Shader {

    private readonly modelLoc: WebGLUniformLocation

    get textureId() {
        return 0
    }

    constructor(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        super(gl, vertexShader, fragmentShader)
        this.use()

        this.modelLoc = loc(this, "model")
        gl.uniform1i(loc(this, "tex"), this.textureId)
    }

    setModelMatrix(matrix: Matrix) {
        this.gl.uniformMatrix3fv(this.modelLoc, true, matrix.value)
    }

}