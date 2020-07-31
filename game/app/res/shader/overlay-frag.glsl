#version 300 es
precision highp float;

in vec2 texCoords;
uniform sampler2D tex;

in vec2 shapeCoords;
uniform sampler2D shape;

uniform vec4 outlineColor;

out vec4 fragColor;

void main() {
    vec3 texel = texture(shape, shapeCoords).rgb;

    if(texel == vec3(1, 0, 1)) {
        fragColor = texture(tex, texCoords);
    } 
    else if(texel == vec3(1, 1, 0)) {
        fragColor = outlineColor;
    }
    else {
        discard;
    }
}