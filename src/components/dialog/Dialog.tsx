import type { FC, PropsWithChildren } from "react";

import "../../styles/dialog.scss";

export type DialogPropsBase = {
  open: boolean;
  width?: string;
};

export type DialogProps = PropsWithChildren<DialogPropsBase>;

export const Dialog: FC<DialogProps> = ({ children, open, width }) => {
  if (open)
    return (
      <div className="dialog_container">
        <div className="dialog" style={{ width }}>{children}</div>;
      </div>
    );
};
