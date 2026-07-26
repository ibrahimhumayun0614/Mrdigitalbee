import type { ReactNode } from "react";
import styles from "./BorderBeam.module.css";

type BorderBeamProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  /** Use a black beam — clearer on white card backgrounds */
  tone?: "default" | "black";
};

export default function BorderBeam({
  children,
  className = "",
  compact = false,
  tone = "default",
}: BorderBeamProps) {
  return (
    <div
      className={`${styles.beam} ${className}`.trim()}
      data-compact={compact ? "true" : undefined}
      data-tone={tone}
    >
      <div className={styles.beamSpin} aria-hidden />
      <div className={styles.beamInner}>{children}</div>
    </div>
  );
}
