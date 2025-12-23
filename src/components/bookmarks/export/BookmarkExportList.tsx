import type { FC } from "react";
import type { BookmarkExportSelection, ExportableBookmarkItem } from "../../../types/bookmarks";
import { ExportListBookmark } from "./ExportListBookmarks";

export type BookmarkExportListProps = {
  bookmarks: ExportableBookmarkItem[];
  changeBookmarkExportSelection: (bookmarkId: string, exportState: BookmarkExportSelection) => void;
};

export const BookmarkExportList: FC<BookmarkExportListProps> = ({
  bookmarks,
  changeBookmarkExportSelection
}) => {
  return (
    <ul className="bookmark_list">
      {bookmarks.map(bookmark =>
        <ExportListBookmark
          key={bookmark.id}
          bookmark={bookmark}
          changeBookmarkExportSelection={changeBookmarkExportSelection}
        />
      )}
    </ul>
  )
}
