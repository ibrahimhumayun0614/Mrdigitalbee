import type { ReactNode } from "react";
import styles from "./BorderBeam.module.css";

type BorderBeamProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  /** Use a black beam — clearer on white card backgrounds */
  tone?: "default" | "black";
  /** Keep the border beam animating without hover */
  active?: boolean;
};

export default function BorderBeam({
  children,
  className = "",
  compact = false,
  tone = "default",
  active = false,
}: BorderBeamProps) {
  return (
    <div
      className={`${styles.beam} ${className}`.trim()}
      data-beam
      data-compact={compact ? "true" : undefined}
      data-tone={tone}
      data-active={active ? "true" : undefined}
    >
      <div className={styles.beamSpin} aria-hidden />
      <div className={styles.beamInner}>{children}</div>
    </div>
  );
}
