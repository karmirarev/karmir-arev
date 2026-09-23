// GPU toys for the game covers. WebGL2 port of the cellular automata from
// snek-git/quickshell-toys (Lenia step shader, Gray-Scott, MNCA rings, Life, Wolfram).
(function () {
  var ORBIUM = [0,0,0,0,0,0,0,0.051,0.0157,0,0,0,0,0,0,0.2353,0,0,0,0,0,0,0,0,0,0,0.1373,0.2078,0.2118,0.0824,0.0706,0.098,0.102,0.0706,0.0039,0.2549,0,0,0,0,0,0,0,0,0,0.0863,0.2667,0.3569,0.3843,0.3412,0.1882,0.1843,0.1725,0.1843,0.1765,0.1059,0.349,0,0,0,0,0,0,0,0.0118,0.0667,0.349,0.4549,0.4667,0.3804,0.1294,0.0784,0.0549,0.0627,0.1216,0.2157,0.7059,0,0,0,0,0,0,0.0353,0.1294,0.1843,0.3412,0.4039,0.3843,0.2824,0.1333,0,0,0,0,0.0471,0.4,0.3294,0,0,0.0039,0,0.0157,0.1373,0.1686,0.1333,0.1098,0.2471,0.2706,0.2627,0.2078,0,0,0,0,0,0.0196,0.8627,0,0,0.2353,0,0.102,0.1725,0.0784,0,0,0.2,0.3098,0.3686,0.3725,0.2392,0,0,0,0,0,0.4549,0.1569,0,0,0.1216,0.1843,0.1098,0,0,0,0.2706,0.4275,0.5059,0.5373,0.5098,0,0,0,0,0,0,0.5176,0,0,0.5882,0.2157,0.0314,0,0,0,0.1882,0.5294,0.6353,0.6824,0.6824,0.4196,0,0,0,0,0,0.4275,0,0,0.5529,0.2353,0,0,0,0,0.0275,0.6196,0.7569,0.8392,0.8549,0.8078,0.1059,0,0,0,0,0.2824,0.098,0,0,0.5961,0,0,0,0,0,0.6667,0.8745,0.9608,0.9922,0.9725,0.5608,0,0,0,0,0.2235,0.1412,0,0,0.8392,0,0,0,0,0,0.5059,0.9686,1,1,1,0.9137,0.2784,0,0,0.0235,0.2196,0.1333,0,0,0.5529,0.0745,0,0,0,0,0.3333,1,1,0.9804,1,0.9725,0.5569,0.1569,0.051,0.1176,0.2431,0.0863,0,0,0.0314,0.4471,0,0,0,0,0.1765,0.851,1,0.8941,0.8627,0.8667,0.651,0.3333,0.1961,0.2157,0.2314,0.0392,0,0,0,0.4235,0.1137,0,0,0,0.1137,0.6196,0.8784,0.8235,0.7804,0.7412,0.6118,0.4078,0.2941,0.2667,0.1647,0,0,0,0,0.0784,0.3333,0.0745,0,0,0.1176,0.4235,0.6745,0.7216,0.6784,0.6275,0.5255,0.4039,0.3098,0.2235,0.0627,0,0,0,0,0,0.1647,0.2588,0.149,0.1176,0.1725,0.3373,0.498,0.5569,0.5451,0.498,0.4275,0.3373,0.2431,0.1176,0,0,0,0,0,0,0,0.1451,0.2314,0.2353,0.2588,0.3176,0.3882,0.4235,0.4118,0.3608,0.3059,0.2275,0.1255,0.0196,0,0,0,0,0,0,0,0,0.0706,0.1686,0.2275,0.251,0.2745,0.2784,0.2588,0.2314,0.1647,0.0941,0.0196,0,0,0,0,0,0,0,0,0,0,0,0.0588,0.102,0.1294,0.1333,0.1176,0.0784,0.0431,0,0,0,0,0];

  var FORCE = /toys=force/.test(location.search);
  var VERT = '#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0,1);}';

  var COMMON = '#version 300 es\nprecision highp float;precision highp int;precision highp sampler2D;\n' +
    'uniform sampler2D u_state;uniform ivec2 u_size;uniform float u_seed;uniform int u_frame;out vec4 o;\n' +
    'vec4 cell(ivec2 p){p=(p%u_size+u_size)%u_size;return texelFetch(u_state,p,0);}\n' +
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+u_seed*17.17)*43758.5453);}\n';

  // ---- Lenia: single channel, ring kernel + bell growth (Bert Chan), from step.frag ----
  var LENIA = COMMON +
    'uniform float u_R;uniform float u_T;uniform float u_mu;uniform float u_sigma;uniform int u_nb;uniform vec4 u_beta;\n' +
    'float bell(float x,float m,float s){float d=(x-m)/s;return exp(-0.5*d*d);}\n' +
    'float kw(float d){if(d>u_R)return 0.0;float br=float(u_nb)*d/u_R;int ring=int(floor(br));float h=ring==0?u_beta.x:ring==1?u_beta.y:ring==2?u_beta.z:u_beta.w;return h*bell(br-floor(br),0.5,0.15);}\n' +
    'void main(){ivec2 p=ivec2(gl_FragCoord.xy);float self=cell(p).r;float sum=0.0,tot=0.0;int R=int(ceil(u_R));\n' +
    'for(int y=-R;y<=R;y++)for(int x=-R;x<=R;x++){float d=sqrt(float(x*x+y*y));float w=kw(d);if(w<=0.0)continue;sum+=w*cell(p+ivec2(x,y)).r;tot+=w;}\n' +
    'float avg=sum/max(tot,1e-6);float g=bell(avg,u_mu,u_sigma)*2.0-1.0;o=vec4(clamp(self+g/u_T,0.0,1.0),0,0,1);}';

  // ---- Gray-Scott, Karl Sims discretisation ----
  var GS = COMMON +
    'uniform float u_F;uniform float u_k;\n' +
    'void main(){ivec2 p=ivec2(gl_FragCoord.xy);vec2 c=cell(p).rg;\n' +
    'vec2 l=-c+0.2*(cell(p+ivec2(1,0)).rg+cell(p+ivec2(-1,0)).rg+cell(p+ivec2(0,1)).rg+cell(p+ivec2(0,-1)).rg)+0.05*(cell(p+ivec2(1,1)).rg+cell(p+ivec2(1,-1)).rg+cell(p+ivec2(-1,1)).rg+cell(p+ivec2(-1,-1)).rg);\n' +
    'float uvv=c.x*c.y*c.y;float u=c.x+(1.0*l.x-uvv+u_F*(1.0-c.x));float v=c.y+(0.5*l.y+uvv-(u_F+u_k)*c.y);o=vec4(clamp(u,0.0,1.0),clamp(v,0.0,1.0),0,1);}';

  // ---- MNCA: three ring neighbourhoods, lo/hi/dv rules (Slackermanz), rings from mn_rings_default ----
  var MNCA = COMMON +
    'float ringAvg(ivec2 p,int r0,int r1){float s=0.0;float n=0.0;for(int y=-r1;y<=r1;y++)for(int x=-r1;x<=r1;x++){int d2=x*x+y*y;if(d2>r1*r1||d2<r0*r0||(x==0&&y==0))continue;s+=cell(p+ivec2(x,y)).r;n+=1.0;}return s/n;}\n' +
    'void main(){ivec2 p=ivec2(gl_FragCoord.xy);float v=cell(p).r;float dv=0.0;\n' +
    'float a=ringAvg(p,1,4);if(a>=0.170&&a<0.360)dv+=0.06;if(a>=0.520)dv-=0.06;\n' +
    'float b=ringAvg(p,5,9);if(b<0.100)dv-=0.05;if(b>=0.380)dv-=0.06;\n' +
    'float c=ringAvg(p,10,16);if(c>=0.400)dv-=0.05;\n' +
    'o=vec4(clamp(v+dv,0.0,1.0),0,0,1);}';

  // ---- Conway's Life ----
  var LIFE = COMMON +
    'void main(){ivec2 p=ivec2(gl_FragCoord.xy);int n=0;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){if(x==0&&y==0)continue;n+=cell(p+ivec2(x,y)).r>0.5?1:0;}\n' +
    'float s=cell(p).r>0.5?1.0:0.0;float r=(n==3||(n==2&&s>0.5))?1.0:0.0;float age=r>0.5?min(1.0,cell(p).g+0.05):0.0;o=vec4(r,age,0,1);}';

  // ---- Wolfram rule, scrolling history: row 0 is the live row, older rows shift down ----
  var WOLF = COMMON +
    'uniform int u_rule;\n' +
    'void main(){ivec2 p=ivec2(gl_FragCoord.xy);int top=u_size.y-1;\n' +
    'if(p.y<top){o=vec4(cell(ivec2(p.x,p.y+1)).r,0,0,1);return;}\n' +
    'int l=cell(ivec2(p.x-1,top)).r>0.5?1:0;int c=cell(ivec2(p.x,top)).r>0.5?1:0;int r=cell(ivec2(p.x+1,top)).r>0.5?1:0;\n' +
    'int idx=(l<<2)|(c<<1)|r;o=vec4(((u_rule>>idx)&1)==1?1.0:0.0,0,0,1);}';

  // ---- seeding shaders ----
  var SEED_NOISE = COMMON + 'uniform float u_fill;void main(){vec2 p=gl_FragCoord.xy;o=vec4(hash(p)<u_fill?1.0:0.0,0,0,1);}';
  var SEED_GS = COMMON + 'void main(){vec2 p=gl_FragCoord.xy;float v=0.0;for(int i=0;i<12;i++){vec2 c=vec2(hash(vec2(float(i),1.0)),hash(vec2(float(i),2.0)))*vec2(u_size);if(abs(p.x-c.x)<3.5&&abs(p.y-c.y)<3.5)v=0.9;}o=vec4(1.0,v,0,1);}';
  var SEED_DISCS = COMMON + 'void main(){vec2 p=gl_FragCoord.xy;float v=0.0;for(int i=0;i<24;i++){vec2 c=vec2(hash(vec2(float(i),3.0)),hash(vec2(float(i),4.0)))*vec2(u_size);float r=4.0+10.0*hash(vec2(float(i),5.0));vec2 d=p-c;d=min(abs(d),vec2(u_size)-abs(d));if(dot(d,d)<r*r)v=0.5+0.5*hash(p);}o=vec4(v,0,0,1);}';
  var SEED_ROW = COMMON + 'void main(){ivec2 p=ivec2(gl_FragCoord.xy);int mid=int(float(u_size.x)*(0.3+0.4*hash(vec2(1.0,2.0))));float v=(p.y==u_size.y-1&&p.x==mid)?1.0:0.0;o=vec4(v,0,0,1);}';

  // ---- view: paper palette with ordered dither ----
  var VIEW = '#version 300 es\nprecision highp float;uniform sampler2D u_state;uniform ivec2 u_size;uniform vec2 u_res;uniform vec3 u_paper;uniform vec3 u_ink;uniform vec3 u_ink2;uniform int u_mode;out vec4 o;\n' +
    'float bayer(ivec2 p){int x=p.x&3,y=p.y&3;int m[16]=int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5);return (float(m[y*4+x])+0.5)/16.0;}\n' +
    'void main(){vec2 uv=gl_FragCoord.xy/u_res;ivec2 c=ivec2(uv*vec2(u_size));vec4 s=texelFetch(u_state,c,0);\n' +
    'float v;vec3 ink=u_ink;\n' +
    'if(u_mode==1){v=smoothstep(0.1,0.5,s.g);}\n' +
    'else if(u_mode==2){v=s.r;ink=mix(u_ink2,u_ink,s.g);}\n' +
    'else if(u_mode==3){v=s.r;}\n' +
    'else if(u_mode==4){v=smoothstep(0.05,0.45,s.g);ink=mix(u_ink,u_ink2,smoothstep(0.25,0.6,s.g));}\n' +
    'else{v=smoothstep(0.02,0.7,s.r);ink=mix(u_ink,u_ink2,smoothstep(0.35,0.9,s.r));}\n' +
    'float d=bayer(ivec2(gl_FragCoord.xy));float q=step(d,v);o=vec4(mix(u_paper,ink,q),1.0);}';

  function hex(h) { return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255]; }
  var PAPER = hex('#d4d3c8'), PLUM = hex('#911254'), GREEN = hex('#129150'), LILAC = hex('#9582F8'), INK = hex('#1b1b1b'), LIME = hex('#c9d94a');

  var TOYS = {
    sandsong: { step: GS, seed: SEED_GS, mode: 4, size: [192, 108], sps: 6, ink: PLUM, ink2: LILAC, u: { u_F: 0.029, u_k: 0.057 } },
    'kami-hovani': { step: LENIA, seed: null, mode: 0, size: [128, 72], sps: 1, ink: GREEN, ink2: PLUM, u: { u_R: 13, u_T: 10, u_mu: 0.15, u_sigma: 0.015, u_nb: 1, u_beta: [1, 0, 0, 0] } },
    'bebe-heist': { step: LIFE, seed: SEED_NOISE, mode: 1, size: [128, 72], sps: 1, every: 4, ink: PLUM, ink2: PLUM, u: { u_fill: 0.3 } },
    pingala: { step: WOLF, seed: SEED_ROW, mode: 3, size: [160, 90], sps: 1, every: 2, ink: INK, ink2: INK, u: { u_rule: 30 } },
    khali: { step: MNCA, seed: SEED_DISCS, mode: 0, size: [192, 108], sps: 1, ink: LILAC, ink2: PLUM, u: {} }
  };

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  function program(gl, frag) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(p)); return null; }
    return p;
  }
  function setU(gl, p, name, v) {
    var loc = gl.getUniformLocation(p, name); if (loc === null) return;
    if (typeof v === 'number') { if (Number.isInteger(v) && /u_(nb|rule|frame|mode)/.test(name)) gl.uniform1i(loc, v); else gl.uniform1f(loc, v); }
    else if (v.length === 2) gl.uniform2f(loc, v[0], v[1]);
    else if (v.length === 3) gl.uniform3f(loc, v[0], v[1], v[2]);
    else if (v.length === 4) gl.uniform4f(loc, v[0], v[1], v[2], v[3]);
  }
  function makeTex(gl, w, h, data) {
    var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, data || null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  function start(canvas, name) {
    var cfg = TOYS[name]; if (!cfg) return;
    var gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) { canvas.classList.add('no-gl'); return; }
    var W = cfg.size[0], H = cfg.size[1];
    var stepP = program(gl, cfg.step), viewP = program(gl, VIEW), seedP = cfg.seed ? program(gl, cfg.seed) : null;
    if (!stepP || !viewP) { canvas.classList.add('no-gl'); return; }
    var tex = [makeTex(gl, W, H), makeTex(gl, W, H)], fb = gl.createFramebuffer(), cur = 0, seed = Math.random() * 100, frame = 0;

    function bindTarget(i) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex[i], 0);
      gl.viewport(0, 0, W, H);
    }
    function run(p, uniforms) {
      gl.useProgram(p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
      setU(gl, p, 'u_state', 0); gl.uniform2i(gl.getUniformLocation(p, 'u_size'), W, H);
      setU(gl, p, 'u_seed', seed); gl.uniform1i(gl.getUniformLocation(p, 'u_frame'), frame);
      for (var k in uniforms) setU(gl, p, k, uniforms[k]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function reseed() {
      seed = Math.random() * 100; frame = 0;
      if (seedP) { bindTarget(1 - cur); run(seedP, cfg.u); cur = 1 - cur; }
      else {
        // Lenia: a few Orbium creatures pasted at random spots and rotations
        var data = new Float32Array(W * H * 4);
        for (var n = 0; n < 4; n++) {
          var ox = Math.floor(Math.random() * (W - 20)), oy = Math.floor(Math.random() * (H - 20));
          var flipX = Math.random() < 0.5, flipY = Math.random() < 0.5, swap = Math.random() < 0.5;
          for (var y = 0; y < 20; y++) for (var x = 0; x < 20; x++) {
            var sx = flipX ? 19 - x : x, sy = flipY ? 19 - y : y;
            var v = swap ? ORBIUM[sx * 20 + sy] : ORBIUM[sy * 20 + sx];
            var i = ((oy + y) * W + (ox + x)) * 4; data[i] = Math.max(data[i], v);
          }
        }
        gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, W, H, gl.RGBA, gl.FLOAT, data);
      }
    }
    function step() { bindTarget(1 - cur); run(stepP, cfg.u); cur = 1 - cur; }
    function draw() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      var w = canvas.clientWidth | 0, h = canvas.clientHeight | 0, dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      run(viewP, { u_res: [canvas.width, canvas.height], u_paper: PAPER, u_ink: cfg.ink, u_ink2: cfg.ink2, u_mode: cfg.mode });
    }

    var visible = false, raf = 0, last = 0, tick = 0;
    function loop(t) {
      raf = 0;
      if (!visible || (document.hidden && !FORCE)) return;
      var every = cfg.every || 1;
      if (t - last >= 1000 / 60) {
        last = t; tick++;
        if (tick % every === 0) for (var i = 0; i < cfg.sps; i++) { step(); frame++; }
        draw();
        // Lenia and Life go stale eventually: start over now and then
        var life = name === 'kami-hovani' ? 2400 : name === 'bebe-heist' ? 1800 : 0;
        if (life && frame > life) reseed();
      }
      raf = requestAnimationFrame(loop);
    }
    function wake() { if (!raf && visible && (!document.hidden || FORCE)) raf = requestAnimationFrame(loop); }

    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; wake(); }, { threshold: 0.05 }).observe(canvas);
    document.addEventListener('visibilitychange', wake);
    canvas.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); reseed(); });

    reseed(); draw(); wake();
    canvas.advance = function (n) { for (var i = 0; i < n; i++) { step(); frame++; } draw(); };
    canvas.readState = function () {
      bindTarget(cur);
      var px = new Float32Array(W * H * 4); gl.readPixels(0, 0, W, H, gl.RGBA, gl.FLOAT, px);
      var sr = 0, sg = 0, mx = 0; for (var i = 0; i < W * H; i++) { sr += px[i * 4]; sg += px[i * 4 + 1]; mx = Math.max(mx, px[i * 4]); }
      return { meanR: sr / (W * H), meanG: sg / (W * H), maxR: mx, frame: frame };
    };
  }

  window.startToys = function () { document.querySelectorAll('canvas[data-toy]:not([data-live])').forEach(function (c) { c.dataset.live = '1'; start(c, c.dataset.toy); }); };
})();
