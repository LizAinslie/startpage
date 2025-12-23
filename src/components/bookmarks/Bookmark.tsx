import type { FC, MouseEvent } from "react";
import { useState } from "react";
import {
  BookmarkType,
  type BookmarkItem,
  type BookmarkItemFolder,
  type BookmarkItemUrl,
} from "../../types/bookmarks";
import { BookmarkList } from "./BookmarkList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faFolder,
  faFolderOpen,
  faLink,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { CommonBookmarkActions } from "./CommonBookmarkActions";

export type BookmarkPropsBase = {
  bookmark: BookmarkItem;
};

export type FolderBookmarkProps = BookmarkPropsBase & {
  bookmark: BookmarkItemFolder;
  createFolder: (parent: BookmarkItemFolder) => void;
  createBookmark: (parent: BookmarkItemFolder) => void;
  deleteBookmark: (bookmark: BookmarkItem) => void;
  editBookmark: (bookmark: BookmarkItemUrl) => void;
  editFolder: (folder: BookmarkItemFolder) => void;
};

export const FolderBookmark: FC<FolderBookmarkProps> = ({
  bookmark,
  createFolder,
  createBookmark,
  deleteBookmark,
  editBookmark,
  editFolder,
}) => {
  const [open, setOpen] = useState(false);

  function handleCreateFolder(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    createFolder(bookmark);
  }

  function handleCreateBookmark(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    createBookmark(bookmark);
  }

  return (
    <li className="bookmark_item">
      <span onClick={() => setOpen(!open)} className="bookmark_line">
        <span className="title">
          <FontAwesomeIcon icon={open ? faFolderOpen : faFolder} />
          {bookmark.title}
        </span>
        <div style={{ flexGrow: "1" }} /> {/* spacer */}
        <div className="actions">
          <button className="bookmark_action" onClick={handleCreateBookmark}>
            <FontAwesomeIcon
              icon={faPlus}
              transform={{ size: 8, y: -1 }}
              mask={faBookmark}
            />
          </button>

          <button className="bookmark_action" onClick={handleCreateFolder}>
            <FontAwesomeIcon
              icon={faPlus}
              transform={{ size: 8 }}
              mask={faFolder}
            />
          </button>

          <CommonBookmarkActions
            editFn={() => editFolder(bookmark)}
            deleteFn={() => deleteBookmark(bookmark)}
          />
        </div>
      </span>

      {open && (
        <div className="bookmark_children">
          <BookmarkList
            createBookmark={createBookmark}
            createFolder={createFolder}
            deleteBookmark={deleteBookmark}
            editBookmark={editBookmark}
            editFolder={editFolder}
            bookmarks={bookmark.children}
          />
        </div>
      )}
    </li>
  );
};

export type UrlBookmarkProps = BookmarkPropsBase & {
  bookmark: BookmarkItemUrl;
  editBookmark: (bookmark: BookmarkItemUrl) => void;
  deleteBookmark: (bookmark: BookmarkItem) => void;
};

export const UrlBookmark: FC<UrlBookmarkProps> = ({
  bookmark,
  editBookmark,
  deleteBookmark,
}) => {
  return (
    <a
      href={bookmark.url}
      rel="noopener noreferrer"
      className="bookmark_line"
    >
      <span className="title">
        <FontAwesomeIcon icon={faLink} />
        {bookmark.title}
      </span>
      <div style={{ flexGrow: "1" }} /> {/* spacer */}
      <div className="actions">
        <CommonBookmarkActions
          editFn={() => editBookmark(bookmark)}
          deleteFn={() => deleteBookmark(bookmark)}
        />
      </div>
    </a>
  );
};

export type BookmarkProps = BookmarkPropsBase & {
  bookmark: BookmarkItem;
  createFolder: (parent: BookmarkItemFolder) => void;
  createBookmark: (parent: BookmarkItemFolder) => void;
  deleteBookmark: (bookmark: BookmarkItem) => void;
  editBookmark: (bookmark: BookmarkItemUrl) => void;
  editFolder: (folder: BookmarkItemFolder) => void;
};

export const Bookmark: FC<BookmarkProps> = ({
  bookmark,
  createFolder,
  createBookmark,
  deleteBookmark,
  editBookmark,
  editFolder,
}) => {
  const buildInnerBookmark = () => {
    if (bookmark.type === BookmarkType.URL)
      return (
        <UrlBookmark
          bookmark={bookmark}
          deleteBookmark={deleteBookmark}
          editBookmark={editBookmark}
        />
      );
    else if (bookmark.type === BookmarkType.FOLDER)
      return (
        <FolderBookmark
          bookmark={bookmark}
          createFolder={createFolder}
          createBookmark={createBookmark}
          deleteBookmark={deleteBookmark}
          editBookmark={editBookmark}
          editFolder={editFolder}
        />
      );
  };

  return <li className="bookmark_item">{buildInnerBookmark()}</li>;
};
