import { useEffect, useRef } from 'react';

const vertexSrc = `
  attribute vec2 position;
  varying vec2 v_texCoord;
  void main() {
    v_texCoord = position * 0.5 + 0.5;
    v_texCoord.y = 1.0 - v_texCoord.y;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentSrc = `
  precision highp float;
  varying vec2 v_texCoord;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;

    float grid = 0.0;
    grid += smoothstep(0.48, 0.5, abs(fract(uv.x * 20.0) - 0.5));
    grid += smoothstep(0.48, 0.5, abs(fract(uv.y * 20.0) - 0.5));

    vec3 color1 = vec3(0.008, 0.518, 0.780);
    vec3 color2 = vec3(0.969, 0.976, 0.984);

    float wave = sin(uv.x * 5.0 + u_time * 0.5) * cos(uv.y * 3.0 - u_time * 0.3);
    float dist = length(uv - mouse);
    float glow = smoothstep(0.3, 0.0, dist);

    vec3 finalColor = mix(color2, color1, grid * 0.05);
    finalColor = mix(finalColor, color1, glow * 0.1);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;

    const cvs = canvas;
    const ctx = gl;

    function render(time: number) {
      animId = requestAnimationFrame(render);
      const width = cvs.clientWidth;
      const height = cvs.clientHeight;
      if (cvs.width !== width || cvs.height !== height) {
        cvs.width = width;
        cvs.height = height;
        ctx.viewport(0, 0, width, height);
      }

      ctx.uniform1f(timeLoc, time * 0.001);
      ctx.uniform2f(resLoc, width, height);
      ctx.uniform2f(mouseLoc, mouseX, height - mouseY);
      ctx.drawArrays(ctx.TRIANGLES, 0, 6);
    }

    render(0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      ctx.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-shader" className="absolute inset-0 w-full h-full pointer-events-none" />;
}
