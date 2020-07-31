
import { Texture } from "./texture";
import { Engine } from "..";
import { Quad } from "../quad";
import { translation, scaling, Matrix } from "../matrix";

export class Sprite {

    private readonly engine: Engine
    private readonly texture: Texture
    private readonly vao: WebGLVertexArrayObject

    constructor(engine: Engine, texture: Texture) {
        this.engine = engine
        this.texture = texture

        const gl = engine.gl

        const quad = new Quad(0, 0, texture.width, texture.height, gl, true)
        const texQuad = texture.quad.copy(gl, true)

        this.vao = gl.createVertexArray()
        gl.bindVertexArray(this.vao)

        gl.bindBuffer(gl.ARRAY_BUFFER, quad.vbo)
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(0)

        gl.bindBuffer(gl.ARRAY_BUFFER, texQuad.vbo)
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(1)
    }

    public get width() {
        return this.texture.width
    }

    public get height() {
        return this.texture.height
    }

    public draw(x: number, y: number) {
        this.drawMatrix(translation(x, y))
    }

    public drawMatrix(matrix: Matrix) {
        const engine = this.engine
        const gl = engine.gl

        const shader = engine.shaderHandler.useStandardShader()
        this.texture.bind(shader.textureId)
        shader.setModelMatrix(matrix)

        gl.bindVertexArray(this.vao)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

}