import type { FC, PropsWithChildren } from "react";

export const enum DialogActionButtonType {
  CANCEL = "cancel",
  CONFIRM = "confirm",
}

export type DialogActionButtonProps = PropsWithChildren<{
  type: DialogActionButtonType | "cancel" | "confirm";
  disabled?: boolean;
  onClick: () => void;
}>;

export const DialogActionButton: FC<DialogActionButtonProps> = ({
  type,
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button className={`${type}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
