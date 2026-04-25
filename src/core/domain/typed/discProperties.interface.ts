
/**
 * DiscProperties is an interface that defines the properties of a disc in the game.
 * more information in the official haxball api
 */
export interface DiscProperties {
  x?: number;
  y?: number;
  xspeed?: number;
  yspeed?: number;
  xgravity?: number;
  ygravity?: number;
  radius?: number;
  bCoeff?: number;
  invMass?: number;
  damping?: number;
  color?: number;
  cMask?: number;
  cGroup?: number;
}
