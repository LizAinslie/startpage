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

const CLASSES: Record<DialogActionButtonType, string> = {
  [DialogActionButtonType.CANCEL]: "solid-red",
  [DialogActionButtonType.CONFIRM]: "solid-green",
};

export const DialogActionButton: FC<DialogActionButtonProps> = ({
  type,
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button className={`button ${CLASSES[type]}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
