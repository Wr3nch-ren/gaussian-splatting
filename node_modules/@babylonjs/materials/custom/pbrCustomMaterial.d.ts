import type { Texture } from "@babylonjs/core/Materials/Textures/texture.js";
import { Effect } from "@babylonjs/core/Materials/effect.js";
import type { MaterialDefines } from "@babylonjs/core/Materials/materialDefines.js";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial.js";
import type { Mesh } from "@babylonjs/core/Meshes/mesh.js";
import type { Scene } from "@babylonjs/core/scene.js";
import type { ICustomShaderNameResolveOptions } from "@babylonjs/core/Materials/material.js";
import type { Nullable } from "@babylonjs/core/types.js";
import type { SubMesh } from "@babylonjs/core/Meshes/subMesh.js";
/**
 * Albedo parts of the shader
 */
export declare class ShaderAlbedoParts {
    constructor();
    /**
     * Beginning of the fragment shader
     */
    Fragment_Begin: string;
    /**
     * Fragment definitions
     */
    Fragment_Definitions: string;
    /**
     * Beginning of the main function
     */
    Fragment_MainBegin: string;
    /**
     * End of main function
     */
    Fragment_MainEnd: string;
    /**
     * Albedo color
     */
    Fragment_Custom_Albedo: string;
    /**
     * Lights
     */
    Fragment_Before_Lights: string;
    /**
     * Metallic and roughness
     */
    Fragment_Custom_MetallicRoughness: string;
    /**
     * Microsurface
     */
    Fragment_Custom_MicroSurface: string;
    /**
     * Fog computations
     */
    Fragment_Before_Fog: string;
    /**
     * Alpha
     */
    Fragment_Custom_Alpha: string;
    /**
     * Color composition
     */
    Fragment_Before_FinalColorComposition: string;
    /**
     * Fragment color
     */
    Fragment_Before_FragColor: string;
    /**
     * Beginning of vertex shader
     */
    Vertex_Begin: string;
    /**
     * Vertex definitions
     */
    Vertex_Definitions: string;
    /**
     * Vertex main begin
     */
    Vertex_MainBegin: string;
    /**
     * Vertex before position updated
     */
    Vertex_Before_PositionUpdated: string;
    /**
     * Vertex before normal updated
     */
    Vertex_Before_NormalUpdated: string;
    /**
     * Vertex after world pos computed
     */
    Vertex_After_WorldPosComputed: string;
    /**
     * Vertex main end
     */
    Vertex_MainEnd: string;
}
/**
 * @deprecated use ShaderAlbedoParts instead.
 */
export declare const ShaderAlebdoParts: typeof ShaderAlbedoParts;
export declare class PBRCustomMaterial extends PBRMaterial {
    /**
     * Index for each created shader
     */
    static ShaderIndexer: number;
    /**
     * Custom shader structure
     */
    CustomParts: ShaderAlbedoParts;
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
     * @param options options to compile the shader
     * @returns the shader name
     */
    Builder(shaderName: string, uniforms: string[], uniformBuffers: string[], samplers: string[], defines: MaterialDefines | string[], attributes?: string[], options?: ICustomShaderNameResolveOptions): string;
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
    AddUniform(name: string, kind: string, param: any): PBRCustomMaterial;
    /**
     * Adds a custom attribute
     * @param name the name of the attribute
     * @returns the current material
     */
    AddAttribute(name: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Begin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Begin(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Definitions portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Definitions(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_MainBegin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_MainBegin(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Custom_Albedo portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Custom_Albedo(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Custom_Alpha portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Custom_Alpha(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Before_Lights portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Before_Lights(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Custom_MetallicRoughness portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Custom_MetallicRoughness(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Custom_MicroSurface portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Custom_MicroSurface(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Before_Fog portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Before_Fog(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Before_FinalColorComposition portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Before_FinalColorComposition(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_Before_FragColor portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_Before_FragColor(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Fragment_MainEnd portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Fragment_MainEnd(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Vertex_Begin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Begin(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Vertex_Definitions portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Definitions(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Vertex_MainBegin portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_MainBegin(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Vertex_Before_PositionUpdated portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Before_PositionUpdated(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Vertex_Before_NormalUpdated portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_Before_NormalUpdated(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Vertex_After_WorldPosComputed portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_After_WorldPosComputed(shaderPart: string): PBRCustomMaterial;
    /**
     * Sets the code on Vertex_MainEnd portion
     * @param shaderPart the code string
     * @returns the current material
     */
    Vertex_MainEnd(shaderPart: string): PBRCustomMaterial;
}
