import type { CSSProperties, FC } from "react";

export interface LaserFlowProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
  wispDensity?: number;
  dpr?: number;
  mouseSmoothTime?: number;
  mouseTiltStrength?: number;
  horizontalBeamOffset?: number;
  verticalBeamOffset?: number;
  flowSpeed?: number;
  verticalSizing?: number;
  horizontalSizing?: number;
  fogIntensity?: number;
  fogScale?: number;
  wispSpeed?: number;
  wispIntensity?: number;
  flowStrength?: number;
  decay?: number;
  falloffStart?: number;
  fogFallSpeed?: number;
}

declare const LaserFlow: FC<LaserFlowProps>;
export default LaserFlow;
