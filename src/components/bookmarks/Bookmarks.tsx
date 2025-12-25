import { useMemo, useState, type FC } from "react";

import { useBookmarksStore } from "../../store/bookmarks";
import { BookmarkList } from "./BookmarkList";
import { FolderCreateDialog } from "./dialogs/FolderCreateDialog";

import "../../styles/bookmarks.scss";
import { BookmarkCreateDialog } from "./dialogs/BookmarkCreateDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faFileExport,
  faFileImport,
  faFolder,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import type {
  BookmarkItem,
  BookmarkItemFolder,
  BookmarkItemUrl,
  BookmarkSearchResultItem,
} from "../../types/bookmarks";
import { BookmarkDeleteDialog } from "./dialogs/BookmarkDeleteDialog";
import { BookmarkEditDialog } from "./dialogs/BookmarkEditDialog";
import { FolderEditDialog } from "./dialogs/FolderEditDialog";
import { BookmarkSearchResults } from "./search/BookmarkSearchResults";
import { ExportBookmarksDialog } from "./dialogs/ExportBookmarksDialog";
import { ImportBookmarksDialog } from "./dialogs/ImportBookmarksDialog";

const Bookmarks: FC = () => {
  const bookmarks = useBookmarksStore((store) => store.bookmarks);

  const searchable = useBookmarksStore((store) => store.searchIndex);
  const [searchTerm, setSearchTerm] = useState("");
  const searching = useMemo(() => searchTerm !== "", [searchTerm]);
  const searchResults = useMemo((): BookmarkSearchResultItem[] => {
    if (searchTerm === "") return searchable;
    else
      return searchable.filter(
        ({ bookmark }) =>
          bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }, [searchTerm, searchable]);

  const [folderCreateDialogOpen, setFolderCreateDialogOpen] = useState(false);
  const [folderCreateDialogParent, setFolderCreateDialogParent] = useState<
    BookmarkItemFolder | undefined
  >(undefined);

  function openFolderCreateDialog(parent?: BookmarkItemFolder) {
    setFolderCreateDialogOpen(true);
    setFolderCreateDialogParent(parent);
  }

  function closeFolderCreateDialog() {
    setFolderCreateDialogOpen(false);
    setFolderCreateDialogParent(undefined);
  }

  const [createBookmarkDialogOpen, setCreateBookmarkDialogOpen] =
    useState(false);
  const [createBookmarkDialogParent, setCreateBookmarkDialogParent] = useState<
    BookmarkItemFolder | undefined
  >(undefined);

  function openBookmarkCreateDialog(parent?: BookmarkItemFolder) {
    setCreateBookmarkDialogOpen(true);
    setCreateBookmarkDialogParent(parent);
  }

  function closeBookmarkCreateDialog() {
    setCreateBookmarkDialogOpen(false);
    setCreateBookmarkDialogParent(undefined);
  }

  const [deleteBookmarkDialogOpen, setDeleteBookmarkDialogOpen] =
    useState(false);
  const [deleteBookmarkDialogBookmark, setDeleteBookmarkDialogBookmark] =
    useState<BookmarkItem | undefined>(undefined);

  function openBookmarkDeleteDialog(bookmark: BookmarkItem) {
    setDeleteBookmarkDialogOpen(true);
    setDeleteBookmarkDialogBookmark(bookmark);
  }

  function closeBookmarkDeleteDialog() {
    setDeleteBookmarkDialogOpen(false);
    setDeleteBookmarkDialogBookmark(undefined);
  }

  const [bookmarkEditDialogOpen, setBookmarkEditDialogOpen] = useState(false);
  const [bookmarkEditDialogBookmark, setBookmarkEditDialogBookmark] = useState<
    BookmarkItemUrl | undefined
  >(undefined);

  function openBookmarkEditDialog(bookmark: BookmarkItemUrl) {
    setBookmarkEditDialogOpen(true);
    setBookmarkEditDialogBookmark(bookmark);
  }

  function closeBookmarkEditDialog() {
    setBookmarkEditDialogOpen(false);
    setBookmarkEditDialogBookmark(undefined);
  }

  const [folderEditDialogOpen, setFolderEditDialogOpen] = useState(false);
  const [folderEditDialogFolder, setFolderEditDialogFolder] = useState<
    BookmarkItemFolder | undefined
  >(undefined);

  function openFolderEditDialog(folder: BookmarkItemFolder) {
    setFolderEditDialogOpen(true);
    setFolderEditDialogFolder(folder);
  }

  function closeFolderEditDialog() {
    setFolderEditDialogOpen(false);
    setFolderEditDialogFolder(undefined);
  }

  const [exportBookmarksDialogOpen, setExportBookmarksDialogOpen] = useState(false);

  function openExportBookmarksDialog() {
    setExportBookmarksDialogOpen(true);
  }

  function closeExportBookmarksDialog() {
    setExportBookmarksDialogOpen(false);
  }

  const [importBookmarksDialogOpen, setImportBookmarksDialogOpen] = useState(false);

  function openImportBookmarksDialog() {
    setImportBookmarksDialogOpen(true);
  }

  function closeImportBookmarksDialog() {
    setImportBookmarksDialogOpen(false);
  }

  return (
    <div className="bookmarks">
      <div className="header">
        <h2>Bookmarks</h2>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Bookmarks"
        />
      </div>

      <div className="content">
        {searching ? (
          <BookmarkSearchResults
            results={searchResults}
            editBookmark={openBookmarkEditDialog}
            deleteBookmark={openBookmarkDeleteDialog}
          />
        ) : (
          <BookmarkList
            bookmarks={bookmarks}
            createFolder={openFolderCreateDialog}
            createBookmark={openBookmarkCreateDialog}
            deleteBookmark={openBookmarkDeleteDialog}
            editBookmark={openBookmarkEditDialog}
            editFolder={openFolderEditDialog}
          />
        )}
      </div>

      <div className="footer">
        <button onClick={() => openBookmarkCreateDialog()}>
          <FontAwesomeIcon
            icon={faPlus}
            transform={{ size: 8, y: -1 }}
            mask={faBookmark}
          />
        </button>

        <button onClick={() => openFolderCreateDialog()}>
          <FontAwesomeIcon
            icon={faPlus}
            transform={{ size: 8 }}
            mask={faFolder}
          />
        </button>

        <button onClick={() => openExportBookmarksDialog()}>
          <FontAwesomeIcon
            icon={faFileExport}
          />
        </button>

        <button onClick={() => openImportBookmarksDialog()}>
          <FontAwesomeIcon
            icon={faFileImport}
          />
        </button>
      </div>

      <BookmarkCreateDialog
        open={createBookmarkDialogOpen}
        onClose={closeBookmarkCreateDialog}
        parent={createBookmarkDialogParent}
      />

      <FolderCreateDialog
        open={folderCreateDialogOpen}
        onClose={closeFolderCreateDialog}
        parent={folderCreateDialogParent}
      />

      <BookmarkDeleteDialog
        open={deleteBookmarkDialogOpen}
        onClose={closeBookmarkDeleteDialog}
        bookmark={deleteBookmarkDialogBookmark}
      />

      <BookmarkEditDialog
        open={bookmarkEditDialogOpen}
        onClose={closeBookmarkEditDialog}
        bookmark={bookmarkEditDialogBookmark}
      />

      <FolderEditDialog
        open={folderEditDialogOpen}
        onClose={closeFolderEditDialog}
        folder={folderEditDialogFolder}
      />

      <ExportBookmarksDialog
        open={exportBookmarksDialogOpen}
        onClose={closeExportBookmarksDialog}
        bookmarks={bookmarks}
      />

      <ImportBookmarksDialog
        open={importBookmarksDialogOpen}
        onClose={closeImportBookmarksDialog}
      />
    </div>
  );
};

export default Bookmarks;
