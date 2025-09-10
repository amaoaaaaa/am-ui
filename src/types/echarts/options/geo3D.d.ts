interface RealisticMaterial {
    detailTexture: string;
    textureTiling: number;
    roughness: number;
    textureOffset: number;
}

interface PostEffectBloom {
    enable: boolean;
    intensity: number;
}

interface PostEffectDepthOfField {
    enable: boolean;
    focalRange: number;
    fstop: number;
    blurRadius: number;
    focalDistance: number;
    quality: 'low' | 'medium' | 'high';
}

interface PostEffectScreenSpaceAmbientOcclusion {
    enable: boolean;
    radius: number;
    quality: 'low' | 'medium' | 'high';
    intensity: number;
}

interface PostEffectScreenSpaceReflection {
    enable: boolean;
    quality: 'low' | 'medium' | 'high';
    maxRoughness: number;
}

interface PostEffectColorCorrection {
    enable: boolean;
    exposure: number;
    brightness: number;
    contrast: number;
    saturation: number;
    lookupTexture: string;
}

interface PostEffectEdge {
    enable: boolean;
}

interface PostEffectFXAA {
    enable: boolean;
}

interface PostEffect {
    enable: boolean;
    bloom: PostEffectBloom;
    depthOfField: PostEffectDepthOfField;
    screenSpaceAmbientOcclusion: PostEffectScreenSpaceAmbientOcclusion;
    screenSpaceReflection: PostEffectScreenSpaceReflection;
    colorCorrection: PostEffectColorCorrection;
    edge: PostEffectEdge;
    FXAA: PostEffectFXAA;
}

interface AmbientLight {
    intensity: number;
    color: string;
}

interface MainLight {
    alpha: number;
    beta: number;
    shadow: boolean;
    shadowQuality: 'low' | 'medium' | 'high';
    color: string;
    intensity: number;
}

interface AmbientCubemap {
    texture: null;
    exposure: number;
    diffuseIntensity: number;
    specularIntensity: number;
}

interface Light {
    ambient: AmbientLight;
    main: MainLight;
    ambientCubemap: AmbientCubemap;
}

interface ItemStyle {
    borderColor: string;
    borderWidth: number;
    color: string;
}

interface EmphasisItemStyle {
    color: string;
}

interface EmphasisLabel {
    show: boolean;
}

interface Emphasis {
    itemStyle: EmphasisItemStyle;
    label: EmphasisLabel;
}

interface LabelTextStyle {
    fontSize: number;
    color: string;
    backgroundColor: string;
    padding: number;
    borderRadius: number;
}

interface Label {
    show?: boolean;
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    distance?: number;
    textStyle?: LabelTextStyle;
    formatter?: (p: any) => string;
}

/**
 * 用于鼠标的旋转，缩放等视角控制。
 */
interface ViewControl {
    /**
     * 默认视角距离主体的距离，对于 globe 来说是距离地球表面的距离，对于 grid3D 和 geo3D 等其它组件来说是距离中心原点的距离。在 projection 为'perspective'的时候有效。
     */
    distance?: number;

    /**
     * 视角绕 x 轴，即上下旋转的角度。配合 beta 可以控制视角的方向。
     */
    alpha?: number;

    /**
     * 视角绕 y 轴，即左右旋转的角度。
     */
    beta?: number;

    minBeta?: null | number;
    maxBeta?: null | number;
    center?: number[];
    orthographicSize?: number;
    minAlpha?: number;
    projection?: 'perspective' | 'orthographic';
    autoRotate?: boolean;
    autoRotateDirection?: 'cw' | 'ccw';
    autoRotateSpeed?: number;
    autoRotateAfterStill?: number;
    damping?: number;
    rotateSensitivity?: number | [number, number];
    zoomSensitivity?: number;
    panSensitivity?: number;
    panMouseButton?: 'left' | 'right' | 'middle';
    rotateMouseButton?: 'left' | 'right' | 'middle';
    minDistance?: number;
    maxDistance?: number;
    maxOrthographicSize?: number;
    minOrthographicSize?: number;
    maxAlpha?: number;
}

interface Region {
    name: string;
}

interface TemporalSuperSampling {
    enable: 'auto' | boolean;
}

interface LambertMaterial {
    textureTiling: number;
    textureOffset: number;
    detailTexture: null | string;
}

interface ColorMaterial {
    textureTiling: number;
    textureOffset: number;
    detailTexture: null | string;
}

interface HatchingMaterial {
    textureTiling: number;
    textureOffset: number;
    paperColor: string;
}

/**
 * 三维的地理坐标系组件。组件提供了三维 GeoJSON 的绘制以及相应的坐标系，开发者可以在上面展示三维的散点图、气泡图、柱状图、飞线图。
 */
export interface Geo3D {
    map?: string;
    shading?: string;
    realisticMaterial?: RealisticMaterial;
    postEffect?: PostEffect;
    groundPlane?: {
        show?: boolean;
        realisticMaterial?: RealisticMaterial;
        color?: string;
    };
    light?: Light;
    itemStyle?: ItemStyle;
    emphasis?: Emphasis;
    label?: Label;
    instancing?: boolean;

    /**
     * 用于鼠标的旋转，缩放等视角控制。
     */
    viewControl?: ViewControl;

    width?: number;
    height?: number;
    boxWidth?: number;
    regionHeight?: number;
    regions?: Region[];
    show?: boolean;
    zlevel?: number;
    left?: number;
    top?: number;
    boxHeight?: number;
    boxDepth?: 'auto' | number;
    environment?: 'auto' | string;
    temporalSuperSampling?: TemporalSuperSampling;
    lambertMaterial?: LambertMaterial;
    colorMaterial?: ColorMaterial;
    hatchingMaterial?: HatchingMaterial;
}
