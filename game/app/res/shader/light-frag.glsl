#version 300 es
precision highp float;

in vec2 coords;
out vec4 fragColor;

void main() {
    float dist = distance(coords, vec2(0, 0));
    fragColor = vec4(1, 1, 0.75, 1.0-dist);
}