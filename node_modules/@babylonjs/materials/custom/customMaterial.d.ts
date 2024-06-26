import type { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { Effect } from "@babylonjs/core/Materials/effect.js";
import type { MaterialDefines } from "@babylonjs/core/Materials/materialDefines.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import type { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import type { Scene } from "@babylonjs/core/scene.js";
import type { Nullable } from "@babylonjs/core/types.js";
import type { SubMesh } from "@babylonjs/core/Meshes/subMesh.js";
/**
 * Structure of a custom shader
 */
export declare class CustomShaderStructure {
    /**
     * Fragment store
     */
    FragmentStore: string;
    /**
     * Vertex store
     */
    VertexStore: string;
    constructor();
}
/**
 * Parts of a shader
 */
export declare class ShaderSpecialParts {
    constructor();
    /**
     * Beginning of the fragment shader
     */
    Fragment_Begin: string;
    /**
     * Variable definitions of the fragment shader
     */
    Fragment_Definitions: string;
    /**
     * Beginning of the fragment main function
     */
    Fragment_MainBegin: string;
    /**
     * End of the fragment main function
     */
    Fragment_MainEnd: string;
    /**
     * Diffuse color calculation
     */
    Fragment_Custom_Diffuse: string;
    /**
     * Before lightning computations
     */
    Fragment_Before_Lights: string;
    /**
     * Before fog computations
     */
    Fragment_Before_Fog: string;
    /**
     * Alpha calculations
     */
    Fragment_Custom_Alpha: string;
    /**
     * Before frag color is assigned
     */
    Fragment_Before_FragColor: string;
    /**
     * Beginning of the vertex shader
     */
    Vertex_Begin: string;
    /**
     * Variable definitions of the vertex shader
     */
    Vertex_Definitions: string;
    /**
     * Start of the main function of the vertex shader
     */
    Vertex_MainBegin: string;
    /**
     * Before the world position computation
     */
    Vertex_Before_PositionUpdated: string;
    /**
     * Before the normal computation
     */
    Vertex_Before_NormalUpdated: string;
    /**
     * After the world position has been computed
     */
    Vertex_After_WorldPosComputed: string;
    /**
     * Main end of the vertex shader
     */
    Vertex_MainEnd: string;
}
/**
 * Customized material
 */
export declare class CustomMaterial extends StandardMaterial {
    /**
     * Index for each created shader
     */
    static ShaderIndexer: number;
    /**
     * Custom shader structure
     */
    CustomParts: ShaderSpecialParts;
    /**
     * Name of the shader
     */
    _createdShaderName: string;
    /**
     * List of custom uniforms
     */
    _customUniform: string[];
    /**
     * Names of the new uniforms
     */
    _newUniforms: string[];
    /**
     * Instances of the new uniform objects
     */
    _newUniformInstances: {
        [name: string]: any;
    };
    /**
     * Instances of the new sampler objects
     */
    _newSamplerInstances: {
        [name: string]: Texture;
    };
    /**
     * List of the custom attributes
     */
    _customAttributes: string[];
    /**
     * Fragment shader string
     */
    FragmentShader: string;
    /**
     * Vertex shader string
     */
    VertexShader: string;
    /**
     * Runs after the material is bound to a mesh
     * @param mesh mesh bound
     * @param effect bound effect used to render
     */
    AttachAfterBind(mesh: Mesh | undefined, effect: Effect): void;
    /**
     * @internal
     */
    ReviewUniform(name: string, arr: string[]): string[];
    /**
     * Builds the material
     * @param shaderName name of the shader
     * @param uniforms list of uniforms
     * @param uniformBuffers list of uniform buffers
     * @param samplers list of samplers
     * @param defines list of defines
     * @param attributes list of attributes
     * @returns the shader name
     */
    Builder(shaderName: string, uniforms: string[], uniformBuffers: string[], samplers: string[], defines: MaterialDefines | string[], attributes?: string[]): string;
    protected _injectCustomCode(code: string, shaderType: string): string;
    protected _getCustomCode(shaderType: string): {
        [pointName: string]: string;
    };
    constructor(name: string, scene?: Scene);
    protected _afterBind(mesh?: Mesh, effect?: Nullable<Effect>, subMesh?: SubMesh): void;
    /**
     * Adds a new uniform to the shader
     * @param name the name of the uniform to add
     * @param kind the type of the uniform to add
     * @param param the value of the uniform to add
     * @returns the current material
     */
    AddUniform(name: string, kind: string, param: any): CustomMaterial;
    /**
     * Adds a custom attribute
     * @param name the name of the attribute
     * @returns the current material
     */
    AddAttribute(name: string): CustomMaterial;
    /**
     * Sets the code on Fragment_Begin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Begin(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_Definitions portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Definitions(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_MainBegin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_MainBegin(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_MainEnd portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_MainEnd(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_Custom_Diffuse portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Custom_Diffuse(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_Custom_Alpha portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Custom_Alpha(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_Before_Lights portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Before_Lights(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_Before_Fog portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Before_Fog(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Fragment_Before_FragColor portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Before_FragColor(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Vertex_Begin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Begin(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Vertex_Definitions portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Definitions(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Vertex_MainBegin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_MainBegin(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Vertex_Before_PositionUpdated portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Before_PositionUpdated(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Vertex_Before_NormalUpdated portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Before_NormalUpdated(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Vertex_After_WorldPosComputed portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_After_WorldPosComputed(shaderPart: string): CustomMaterial;
    /**
     * Sets the code on Vertex_MainEnd portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_MainEnd(shaderPart: string): CustomMaterial;
}
