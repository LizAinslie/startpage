import type { FC, PropsWithChildren } from "react";

import "../../styles/dialog.scss";

export type DialogPropsBase = {
  open: boolean;
};

export type DialogProps = PropsWithChildren<DialogPropsBase>;

export const Dialog: FC<DialogProps> = ({ children, open }) => {
  if (open)
    return (
      <div className="dialog_container">
        <div className="dialog">{children}</div>;
      </div>
    );
};
