
import { Shader, loc } from "./shader";
import { SHADOW_OUTLINE } from "..";

export class OverlayShader extends Shader {

    get textureId() {
        return 0
    }

    get shapeTextureId() {
        return 1
    }

    private outlineColorLoc: WebGLUniformLocation

    constructor(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        super(gl, vertexShader, fragmentShader)
        this.use()

        this.outlineColorLoc = loc(this, "outlineColor")
        this.setOutlineColor(SHADOW_OUTLINE)
        gl.uniform1i(loc(this, "tex"), this.textureId)
        gl.uniform1i(loc(this, "shape"), this.shapeTextureId)
    }

    setOutlineColor(outline: [number, number, number, number]) {
        this.gl.uniform4fv(this.outlineColorLoc, new Float32Array(outline))
    }

}
