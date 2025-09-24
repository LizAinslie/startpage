import {
  faExclamationTriangle,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export type DialogErrorProps = PropsWithChildren<{
  icon?: IconDefinition;
  heading: string;
}>;

export const DialogError: FC<DialogErrorProps> = ({
  icon = faExclamationTriangle,
  heading,
  children,
}) => (
  <DialogContent className="error">
    <span className="heading">
      <FontAwesomeIcon icon={icon} />
      {heading}
    </span>
    {children}
  </DialogContent>
);
