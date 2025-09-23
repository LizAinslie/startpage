import type { FC, PropsWithChildren } from "react";

export type DialogFooterProps = PropsWithChildren;

export const DialogFooter: FC<DialogFooterProps> = ({ children }) => {
  return <div className="dialog_footer">{children}</div>;
};
