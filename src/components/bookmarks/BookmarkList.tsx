import type { FC } from "react";
import type {
  BookmarkItem,
  BookmarkItemFolder,
  BookmarkItemUrl,
} from "../../types/bookmarks";
import { Bookmark } from "./Bookmark";

export type BookmarkListProps = {
  bookmarks: BookmarkItem[];
  createFolder: (parent: BookmarkItemFolder) => void;
  createBookmark: (parent: BookmarkItemFolder) => void;
  deleteBookmark: (bookmark: BookmarkItem) => void;
  editBookmark: (bookmark: BookmarkItemUrl) => void;
  editFolder: (folder: BookmarkItemFolder) => void;
};

export const BookmarkList: FC<BookmarkListProps> = ({
  bookmarks,
  createFolder,
  createBookmark,
  deleteBookmark,
  editBookmark,
  editFolder,
}) => {
  return (
    <ul className="bookmark_list">
      {bookmarks
        .sort((a, b) => a.title.localeCompare(b.title))
        .sort((a, b) => {
          // sort folders so they appear after bookmarks
          if (a.type === "folder" && b.type === "url") return 1;
          if (a.type === "url" && b.type === "folder") return -1;
          return 0;
        })
        .map((bookmark) => (
          <Bookmark
            createBookmark={createBookmark}
            createFolder={createFolder}
            deleteBookmark={deleteBookmark}
            editBookmark={editBookmark}
            editFolder={editFolder}
            key={bookmark.id}
            bookmark={bookmark}
          />
        ))}
    </ul>
  );
};
