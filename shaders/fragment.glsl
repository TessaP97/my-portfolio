uniform sampler2D sunTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
    float intensity = 1.05 - dot(
        vertexNormal, vec3(1.0, 0.4824, 0.0));
    vec3 rays = vec3(1.0, 0.5333, 0.0) *
        pow(intensity, 1.5);

    gl_FragColor = vec4(vec3(1.0, 0.0, 0.0) + texture2D(
        sunTexture, vertexUV).xyz, 1.0);
}