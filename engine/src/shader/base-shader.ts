
import { Shader, loc } from "./shader";

export class BaseShader extends Shader {

    get textureId() {
        return 0
    }

    constructor(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        super(gl, vertexShader, fragmentShader)
        this.use()

        gl.uniform1i(loc(this, "tex"), this.textureId)
    }

}
