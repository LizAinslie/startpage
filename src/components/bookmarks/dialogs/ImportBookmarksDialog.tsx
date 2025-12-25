import { useCallback, useEffect, useState, type FC } from "react";
import z from "zod";
import { Dialog, DialogActionButton, DialogContent, DialogError, DialogFooter, DialogHeader, type DialogPropsBase } from "../../dialog";
import { BookmarkExportSelection, BookmarkItemSchema, filterExports, makeExportable, walkAndSetAllChildrenToSelection, walkAndUpdateBookmarkExportSelection, type BookmarkItem, type ExportableBookmarkItem } from "../../../types/bookmarks";
import { useDropzone } from "react-dropzone";
import { BookmarkExportList } from "../export/BookmarkExportList";
import { useBookmarksStore } from "../../../store/bookmarks";

export type ImportBookmarksDialogProps = {
  onClose: () => void;
} & DialogPropsBase;

const enum ImportDialogPage {
  UPLOAD = "upload",
  SELECT = "select"
}

export const ImportBookmarksDialog: FC<ImportBookmarksDialogProps> = ({
  open,
  onClose,
  width = "70%"
}) => {
  const [importList, setImportList] = useState<ExportableBookmarkItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(ImportDialogPage.UPLOAD);
  const importBookmarks = useBookmarksStore(state => state.importBookmarks);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setError("No files selected");
      return;
    }

    if (acceptedFiles.length > 1) {
      setError("Only one file can be imported at a time");
      return;
    }

    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onabort = () => setError("File reading was aborted");
    reader.onerror = () => setError("File reading has failed");
    reader.onload = () => {
      const data = reader.result;
      if (typeof data === "string") {
        try {
          const bookmarks = z
            .array(BookmarkItemSchema)
            .parse(JSON.parse(data));

          setImportList(bookmarks.map(makeExportable));
          setPage(ImportDialogPage.SELECT);
        } catch (error) {
          setError("Invalid JSON format");
        }
      }
    };
    reader.readAsText(file);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const handleBookmarkImportSelectionChange = (id: string, state: BookmarkExportSelection) => {
    setImportList(prev => walkAndUpdateBookmarkExportSelection(prev, id, state));
  };

  const selectAll = () => {
    setImportList(prev => walkAndSetAllChildrenToSelection(prev, BookmarkExportSelection.EXPORT));
  };

  const deselectAll = () => {
    setImportList(prev => walkAndSetAllChildrenToSelection(prev, BookmarkExportSelection.DONT_EXPORT));
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (error) {
        setError(null);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [error]);

  const close = () => {
    setImportList([]);
    setError(null);
    setPage(ImportDialogPage.UPLOAD);
    onClose();
  }

  const doImport = () => {
    const imported = filterExports(importList);

    importBookmarks(imported);

    close();
  }

  return (
    <Dialog open={open} width={width}>
      <DialogHeader title="Import Bookmarks" onClose={close} />
      {error && (
        <DialogError heading="Error">
          <p>{error}</p>
        </DialogError>
      )}
      {page === ImportDialogPage.UPLOAD && (
        <DialogContent>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag 'n' drop a file here, or click to select a file</p>
            )}
          </div>
        </DialogContent>
      )}
      {page === ImportDialogPage.SELECT && (
        <DialogContent>
          <div className="buttonBar full" style={{ marginBottom: ".5rem" }}>
            <button className="button small outline-green" onClick={selectAll}>Select All</button>
            <button className="button small outline-red" onClick={deselectAll}>Deselect All</button>
          </div>

          <BookmarkExportList
            bookmarks={importList}
            changeBookmarkExportSelection={handleBookmarkImportSelectionChange}
          />
        </DialogContent>
      )}
      <DialogFooter>
        <DialogActionButton type="cancel" onClick={close}>Cancel</DialogActionButton>

        {page === ImportDialogPage.SELECT && (
          <DialogActionButton type="confirm" onClick={doImport}>Import</DialogActionButton>
        )}
      </DialogFooter>
    </Dialog>
  )
}
