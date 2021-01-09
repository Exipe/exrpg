
import { Engine } from "..";
import { initLightVAO, Light, renderLight } from "./light";

export const LIGHT_TEXTURE_ID = 7

export class LightHandler {

    public brightness: number

    private lights = [] as Light[]

    private readonly gl: WebGL2RenderingContext
    private glTexture: WebGLTexture
    private fb: WebGLFramebuffer

    private width: number
    private height: number

    private lightVao: WebGLVertexArrayObject

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl
        this.lightVao = initLightVAO(gl)
        this.init()
    }

    private init() {
        const gl = this.gl

        this.glTexture = gl.createTexture()

        gl.activeTexture(gl.TEXTURE0 + LIGHT_TEXTURE_ID)
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

        this.fb = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.glTexture, 0)

        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.activeTexture(gl.TEXTURE0)
    }

    public resize(width: number, height: number) {
        this.width = width
        this.height = height

        const gl = this.gl
        gl.activeTexture(gl.TEXTURE0 + LIGHT_TEXTURE_ID)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.activeTexture(gl.TEXTURE0)
    }

    public addLight(light: Light) {
        this.lights.push(light)
    }

    public removeLight(light: Light) {
        this.lights = this.lights.filter(l => l != light)
    }

    private preRender(engine: Engine) {
        const gl = engine.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)
        gl.viewport(0, 0, this.width, this.height)

        gl.bindVertexArray(this.lightVao)
    }

    private postRender(engine: Engine) {
        const gl = engine.gl
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(0, 0, engine.camera.realWidth, engine.camera.realHeight)
    }

    public render(engine: Engine) {
        this.preRender(engine)
        const gl = engine.gl

        gl.clearColor(this.brightness, this.brightness, this.brightness, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)

        const shader = engine.shaderHandler.useLightShader()
        this.lights.forEach(l => renderLight(gl, shader, l))

        this.postRender(engine)
    }

}