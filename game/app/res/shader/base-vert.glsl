#version 300 es

layout(location = 0) in vec2 vertPos;
layout(location = 1) in vec2 texPos;

layout(location = 2) in vec2 posOffset;
layout(location = 3) in vec2 texOffset;

uniform mat3 projection;
uniform mat3 view;

out vec2 texCoords;

void main() {
    gl_Position = vec4((projection * view * vec3(vertPos + posOffset, 1)).xy, 1, 1);
    texCoords = texPos + texOffset;
}