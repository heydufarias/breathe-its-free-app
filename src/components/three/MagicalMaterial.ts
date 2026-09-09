import { MeshPhysicalMaterial, ShaderChunk } from 'three'

const HEADERS = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}

float pnoise(vec3 P,vec3 rep){
  vec3 Pi0=mod(floor(P),rep),Pi1=mod(Pi0+1.,rep);
  Pi0=mod289(Pi0);Pi1=mod289(Pi1);
  vec3 Pf0=fract(P),Pf1=Pf0-1.;
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x),iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz,iz1=Pi1.zzzz;
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0),ixy1=permute(ixy+iz1);
  vec4 gx0=ixy0*(1./7.),gy0=fract(floor(gx0)*(1./7.))-.5;
  gx0=fract(gx0);
  vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0),sz0=step(gz0,vec4(0.));
  gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);
  vec4 gx1=ixy1*(1./7.),gy1=fract(floor(gx1)*(1./7.))-.5;
  gx1=fract(gx1);
  vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1),sz1=step(gz1,vec4(0.));
  gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
  vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(dot(g000,Pf0),dot(g100,vec3(Pf1.x,Pf0.yz)),dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),dot(g110,vec3(Pf1.xy,Pf0.z))),
  vec4(dot(g001,vec3(Pf0.xy,Pf1.z)),dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z)),dot(g011,vec3(Pf0.x,Pf1.yz)),dot(g111,Pf1)),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  return 2.2*mix(n_yz.x,n_yz.y,fade_xyz.x);
}

uniform float time;
uniform float distort;
uniform float frequency;
uniform float surfaceDistort;
uniform float surfaceFrequency;
uniform float surfaceTime;
uniform float numberOfWaves;
uniform float fixNormals;
uniform float surfacePoleAmount;
uniform float gooPoleAmount;

#define M_PI 3.1415926538
#define NOISE_PERIOD 10.

float f(vec3 p){
  float yPos=smoothstep(-1.,1.,p.y),amount=sin(yPos*M_PI);
  float wavePoleAmt=mix(amount,1.,surfacePoleAmount),gooAmt=mix(amount,1.,gooPoleAmount);
  float goo=pnoise(p/frequency+mod(time,NOISE_PERIOD),vec3(NOISE_PERIOD))*pow(distort,2.);
  float sn=pnoise(p/surfaceFrequency+mod(surfaceTime,NOISE_PERIOD),vec3(NOISE_PERIOD));
  float waves=(p.x*sin((p.y+sn)*M_PI*numberOfWaves)+p.z*cos((p.y+sn)*M_PI*numberOfWaves))*0.01*pow(surfaceDistort,2.0);
  return waves*wavePoleAmt+goo*gooAmt;
}

vec3 orthogonal(vec3 v){
  return normalize(abs(v.x)>abs(v.z)?vec3(-v.y,v.x,0.):vec3(0.,-v.z,v.y));
}
`

const DISPLACEMENT = `
  vec3 displacedPosition = position + normalize(normal) * f(position);
  vec3 displacedNormal = normalize(normal);
  if(fixNormals==1.0){
    float offset=.5/512.;
    vec3 tangent=orthogonal(normal),bitangent=normalize(cross(normal,tangent));
    vec3 n1=position+tangent*offset,n2=position+bitangent*offset;
    vec3 dn1=n1+normal*f(n1),dn2=n2+normal*f(n2);
    displacedNormal=normalize(cross(dn1-displacedPosition,dn2-displacedPosition));
  }
`

export class MagicalMaterialImpl extends MeshPhysicalMaterial {
  _time = { value: 0 }
  _surfaceTime = { value: 0 }
  speed = 0.1
  surfaceSpeed = 0.5
  _u = {
    distort: { value: 0.2 },
    frequency: { value: 1.5 },
    surfaceDistort: { value: 0.6 },
    surfaceFrequency: { value: 0.8 },
    numberOfWaves: { value: 2.0 },
    fixNormals: { value: 1.0 },
    surfacePoleAmount: { value: 0.0 },
    gooPoleAmount: { value: 0.0 },
  }

  onBeforeCompile(shader: any) {
    shader.uniforms.time = this._time
    shader.uniforms.surfaceTime = this._surfaceTime
    Object.assign(shader.uniforms, this._u)
    shader.vertexShader = HEADERS + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('void main() {', `void main() {\n${DISPLACEMENT}`)
    shader.vertexShader = shader.vertexShader.replace('#include <displacementmap_vertex>', 'transformed = displacedPosition;')
    shader.vertexShader = shader.vertexShader.replace(
      '#include <defaultnormal_vertex>',
      ShaderChunk.defaultnormal_vertex.replace('vec3 transformedNormal = objectNormal;', 'vec3 transformedNormal = displacedNormal;')
    )
  }

  customProgramCacheKey() { return 'MagicalMaterial' }

  get time() { return this._time.value }
  set time(v: number) { this._time.value = v }
  get surfaceTime() { return this._surfaceTime.value }
  set surfaceTime(v: number) { this._surfaceTime.value = v }
}