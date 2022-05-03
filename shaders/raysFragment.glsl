varying vec3 vertexNormal; 

void main() {
    float intensity = pow(0.6 - dot(vertexNormal, vec3(1.0, 0.9843, 0.0)), 2.0);
    gl_FragColor = vec4(1.0, 0.651, 0.0, 1.0) * intensity;
}