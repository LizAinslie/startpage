import { useState, type FC } from "react";
import { BookmarkExportSelection, BookmarkType, type ExportableBookmarkItem, type ExportableFolderBookmarkItem, type ExportableUrlBookmarkItem } from "../../../types/bookmarks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFolderOpen, faLink } from "@fortawesome/free-solid-svg-icons";
import { BookmarkExportList } from "./BookmarkExportList";
import { ExportCheckbox } from "./ExportCheckbox";

type ExportListBookmarkBaseProps = {
  changeBookmarkExportSelection: (bookmarkId: string, exportState: BookmarkExportSelection) => void;
}

export type FolderExportListBookmarkProps = {
  bookmark: ExportableFolderBookmarkItem,
} & ExportListBookmarkBaseProps;

const FolderExportListBookmark: FC<FolderExportListBookmarkProps> = ({ bookmark, changeBookmarkExportSelection }) => {
  const [open, setOpen] = useState(false);

  const handleCheckboxChange = (exportState: BookmarkExportSelection) => {
    changeBookmarkExportSelection(bookmark.id, exportState);
    if (exportState === BookmarkExportSelection.EXPORT) {
      bookmark.children.forEach(child => {
        changeBookmarkExportSelection(child.id, BookmarkExportSelection.EXPORT);
      });
    } else if (exportState === BookmarkExportSelection.DONT_EXPORT) {
      bookmark.children.forEach(child => {
        changeBookmarkExportSelection(child.id, BookmarkExportSelection.DONT_EXPORT);
      });
    }
  };

  return (
    <li className="bookmark_item">
      <span onClick={() => setOpen(!open)} className="bookmark_line">
        <span className="title">
          <ExportCheckbox
            exportSelection={bookmark.export}
            onChange={handleCheckboxChange}
          />
          <FontAwesomeIcon icon={open ? faFolderOpen : faFolder} />
          {bookmark.title}
        </span>
        <div style={{ flexGrow: "1" }} /> {/* spacer */}
      </span>

      {open && (
        <div className="bookmark_children">
          <BookmarkExportList
            changeBookmarkExportSelection={changeBookmarkExportSelection}
            bookmarks={bookmark.children}
          />
        </div>
      )}
    </li>
  );
};

export type UrlExportListBookmarkProps = {
  bookmark: ExportableUrlBookmarkItem;
  parent?: ExportableFolderBookmarkItem;
} & ExportListBookmarkBaseProps;

export const UrlExportListBookmark: FC<UrlExportListBookmarkProps> = ({ bookmark, parent = null, changeBookmarkExportSelection }) => {
  const handleCheckboxChange = (exportState: BookmarkExportSelection) => {
    changeBookmarkExportSelection(bookmark.id, exportState);

    if (parent && parent.children.every(child => child.export === exportState))
      changeBookmarkExportSelection(parent.id, exportState);
  };

  return (
    <li className="bookmark_item">
      <span className="bookmark_line">
        <span className="title">
          <ExportCheckbox
            exportSelection={bookmark.export}
            onChange={handleCheckboxChange}
          />
          <FontAwesomeIcon icon={faLink} />
          {bookmark.title}
        </span>
        <div style={{ flexGrow: "1" }} /> {/* spacer */}
      </span>
    </li>
  );
};

export type ExportListBookmarkProps = {
  bookmark: ExportableBookmarkItem
} & ExportListBookmarkBaseProps;

export const ExportListBookmark: FC<ExportListBookmarkProps> = ({
  bookmark,
  changeBookmarkExportSelection,
}) => {
  const buildInnerBookmark = () => {
    if (bookmark.type === BookmarkType.URL)
      return (
        <UrlExportListBookmark
          bookmark={bookmark}
          changeBookmarkExportSelection={changeBookmarkExportSelection}
        />
      );
    if (bookmark.type === BookmarkType.FOLDER)
      return (
        <FolderExportListBookmark
          bookmark={bookmark}
          changeBookmarkExportSelection={changeBookmarkExportSelection}
        />
      );
  };

  return <li className="bookmark_item">{buildInnerBookmark()}</li>;
};
