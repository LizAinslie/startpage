import type { FC } from "react";
import { BookmarkExportSelection } from "../../../types/bookmarks";
import { faCheckSquare, faMinusSquare, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type ExportCheckboxProps = {
  exportSelection: BookmarkExportSelection;
  onChange: (exportState: BookmarkExportSelection) => void;
};

const ICONS: Record<BookmarkExportSelection, IconDefinition> = {
  [BookmarkExportSelection.EXPORT]: faCheckSquare,
  [BookmarkExportSelection.DONT_EXPORT]: faSquare,
  [BookmarkExportSelection.PARTIAL]: faMinusSquare,
};

export const ExportCheckbox: FC<ExportCheckboxProps> = ({
  exportSelection,
  onChange,
}) => {
  return (
    <FontAwesomeIcon
      icon={ICONS[exportSelection]}
      className="mr-2"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (exportSelection === BookmarkExportSelection.EXPORT) {
          onChange(BookmarkExportSelection.DONT_EXPORT);
        } else if (exportSelection === BookmarkExportSelection.DONT_EXPORT) {
          onChange(BookmarkExportSelection.EXPORT); // don't manually change to PARTIAL.
        } else if (exportSelection === BookmarkExportSelection.PARTIAL) {
          onChange(BookmarkExportSelection.EXPORT);
        }
      }}
    />
  );
};
