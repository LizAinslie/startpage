import type { FC, PropsWithChildren } from "react";

export type DialogContentProps = PropsWithChildren<{
  className?: string;
}>;

export const DialogContent: FC<DialogContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={`dialog_content${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
};
