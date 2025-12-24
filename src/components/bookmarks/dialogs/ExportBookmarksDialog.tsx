import { useEffect, useState, type FC } from "react";

import {
  Dialog,
  DialogFooter,
  DialogActionButton,
  DialogHeader,
  DialogContent,
  type DialogPropsBase,
  DialogError,
} from "../../dialog";
import { BookmarkExportSelection, filterExports, makeExportable, walkAndSetAllChildrenToSelection, walkAndUpdateBookmarkExportSelection, type BookmarkItem, type ExportableBookmarkItem } from "../../../types/bookmarks";
import { BookmarkExportList } from "../export/BookmarkExportList";

export type ExportBookmarksDialogProps = {
  onClose: () => void;
  bookmarks: BookmarkItem[];
} & DialogPropsBase;

export const ExportBookmarksDialog: FC<ExportBookmarksDialogProps> = ({
  open,
  onClose,
  bookmarks,
  width = "70%"
}) => {
  const [exportList, setExportList] = useState<ExportableBookmarkItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExportList(bookmarks.map(makeExportable));
  }, [bookmarks]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (error) {
        setError(null);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [error]);

  const close = () => {
    setExportList(prev => walkAndSetAllChildrenToSelection(prev, BookmarkExportSelection.DONT_EXPORT));
    onClose();
  };

  const doExport = () => {
    const exported = filterExports(exportList);

    if (exported.length === 0) {
      setError("No bookmarks selected for export.");
      return;
    }

    const blob = new Blob([JSON.stringify(exported)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "bookmarks.json"; // Forces download instead of navigation
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL

      close();
  };

  const handleBookmarkExportSelectionChange = (id: string, state: BookmarkExportSelection) => {
    setExportList(prev => walkAndUpdateBookmarkExportSelection(prev, id, state));
  };

  const selectAll = () => {
    setExportList(prev => walkAndSetAllChildrenToSelection(prev, BookmarkExportSelection.EXPORT));
  };

  const deselectAll = () => {
    setExportList(prev => walkAndSetAllChildrenToSelection(prev, BookmarkExportSelection.DONT_EXPORT));
  };

  return (
    <Dialog open={open} width={width}>
      <DialogHeader title="Export Bookmarks" onClose={close} />
      {error && (
        <DialogError heading="Error">
          <p>{error}</p>
        </DialogError>
      )}
      <DialogContent>
        <div className="buttonBar full" style={{ marginBottom: ".5rem" }}>
          <button className="button small outline-green" onClick={selectAll}>Select All</button>
          <button className="button small outline-red" onClick={deselectAll}>Deselect All</button>
        </div>
        <BookmarkExportList
          bookmarks={exportList}
          changeBookmarkExportSelection={handleBookmarkExportSelectionChange}
        />
      </DialogContent>
      <DialogFooter>
        <DialogActionButton type="confirm" onClick={doExport}>Export</DialogActionButton>
        <DialogActionButton type="cancel" onClick={close}>Cancel</DialogActionButton>
      </DialogFooter>
    </Dialog>
  );
};
