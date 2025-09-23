import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC } from "react";

export type DialogHeaderProps = {
  title: string;
  showCloseButton?: boolean;
  onClose?: () => void;
};

export const DialogHeader: FC<DialogHeaderProps> = ({
  title,
  showCloseButton = false,
  onClose,
}) => {
  if (showCloseButton && !onClose) {
    throw new Error("onClose is required when showCloseButton is true");
  }

  return (
    <div className="dialog_header">
      <h3>{title}</h3>
      {showCloseButton && (
        <>
          <div style={{ flexGrow: "1" }} /> {/* spacer */}
          <button onClick={() => onClose?.()} className="dialog_close_button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </>
      )}
    </div>
  );
};
