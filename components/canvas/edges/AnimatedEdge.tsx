"use client";

import { BaseEdge, getBezierPath, type EdgeProps } from "reactflow";

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Use the color passed from the source node; fallback to neutral
  const color = (data as { color?: string })?.color ?? "#555";

  return (
    <path
      id={id}
      d={edgePath}
      className="react-flow__edge-path animated-edge"
      style={{
        stroke: color,
        strokeWidth: 2,
        fill: "none",
        strokeOpacity: 0.9,
      }}
    />
  );
}
