
import { Shader } from "./shader"
import { projection, scaling, translation, view, Matrix } from "../matrix"
import { ShadowShader as ShadowShader } from "./shadow-shader"
import { OverlayShader as OverlayShader } from "./overlay-shader"
import { Camera } from "../camera"
import { BaseShader } from "./base-shader"
import { StandardShader } from "./standard-shader"
import { LightShader } from "./light-shader"
import { EntityShadowShader } from "./entity-shadow-shader"

/**
 * Loads shader source code and compiles an OpenGL shader
 */
async function loadGlShader(gl: WebGL2RenderingContext, srcPath: string, srcFile: string, type: number) {
    return fetch(srcPath + "/" + srcFile + ".glsl").then(res => res.text()).then(source => {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw "Could not make shader (" + srcFile + "): " + gl.getShaderInfoLog(shader)
        }

        return shader
    })
}

/**
 * Initializes a ShaderHandler
 * 
 * @param gl
 *      WebGL instance
 * 
 * @param srcPath 
 *      path to find the necessary GLSL source files
 */
export async function initShaders(gl: WebGL2RenderingContext, srcPath: string) {
    const vert = (file: string) => loadGlShader(gl, srcPath, file, gl.VERTEX_SHADER)
    const frag = (file: string) => loadGlShader(gl, srcPath, file, gl.FRAGMENT_SHADER)

    const results = await Promise.all([
        vert("standard-vert"),
        frag("standard-frag"),
        vert("base-vert"),
        vert("overlay-vert"),
        frag("overlay-frag"),
        vert("shadow-vert"),
        frag("shadow-frag"),
        vert("light-vert"),
        frag("light-frag"),
        vert("entity-shadow-vert"),
        frag("entity-shadow-frag")])

    let standardShader = new StandardShader(gl, results[0], results[1])
    let baseShader = new BaseShader(gl, results[2], results[1])
    let overlayShader = new OverlayShader(gl, results[3], results[4])
    let shadowShader = new ShadowShader(gl, results[5], results[6])
    let lightShader = new LightShader(gl, results[7], results[8])
    let entityShadowShader = new EntityShadowShader(gl, results[9], results[10])

    return new ShaderHandler(standardShader, baseShader, overlayShader,
        shadowShader, lightShader, entityShadowShader)
}

export class ShaderHandler {

    private current: Shader
    
    private standardShader: StandardShader
    private baseShader: BaseShader
    private overlayShader: OverlayShader
    private shadowShader: ShadowShader
    private lightShader: LightShader
    private entityShadowShader: EntityShadowShader

    private all: Shader[]

    constructor(standardShader: StandardShader, baseShader: BaseShader, overlayShader: OverlayShader, 
        shadowShader: ShadowShader, lightShader: LightShader, entityShadowShader: EntityShadowShader) 
    {
        this.standardShader = standardShader
        this.baseShader = baseShader
        this.overlayShader = overlayShader
        this.shadowShader = shadowShader
        this.lightShader = lightShader
        this.entityShadowShader = entityShadowShader

        /*
        Light shader purposefully excluded, as it uses its own view/projection matrices
        */
        this.all = [ standardShader, baseShader, overlayShader, shadowShader, entityShadowShader ]
    }

    private setCurrent(shader: Shader) {
        if(this.current == shader) return

        this.current = shader
        shader.use()
    }

    useStandardShader() {
        this.setCurrent(this.standardShader)
        return this.standardShader
    }

    useBaseShader() {
        this.setCurrent(this.baseShader)
        return this.baseShader
    }

    useOverlayShader() {
        this.setCurrent(this.overlayShader)
        return this.overlayShader
    }

    useShadowShader() {
        this.setCurrent(this.shadowShader)
        return this.shadowShader
    }

    useLightShader() {
        this.setCurrent(this.lightShader)
        return this.lightShader
    }

    useEntityShadowShader() {
        this.setCurrent(this.entityShadowShader)
        return this.entityShadowShader
    }

    setProjection(width: number, height: number) {
        const projectionMatrix = projection(width, height);
        this.setProjectionMatrix(projectionMatrix)
    }

    setProjectionMatrix(matrix: Matrix) {
        this.all.forEach(shader => {
            this.setCurrent(shader)
            shader.setProjectionMatrix(matrix)
        })
    }

    setView(x: number, y: number, scale: number) {
        const viewMatrix = view(x, y, scale)
        this.setViewMatrix(viewMatrix)
    }

    setViewMatrix(matrix: Matrix) {
        this.all.forEach(shader => {
            this.setCurrent(shader)
            shader.setViewMatrix(matrix)
        })
    }

}
