export function brickTracePose(position,aspect=1.8){return {x:position.x,y:position.y,z:position.z,radius:Math.max(13,10/Math.max(.6,aspect))};}
export function explanationVisible(enabled,mode){return enabled&&mode==='factory'}
