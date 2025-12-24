import { useState, type FC } from "react";
import { Dialog, DialogContent, DialogError, DialogFooter, DialogHeader, type DialogPropsBase } from "../../dialog";
import type { BookmarkItem, ExportableBookmarkItem } from "../../../types/bookmarks";

export type ImportBookmarksDialogProps = {
  onClose: () => void;
  onConfirm: (bookmarks: BookmarkItem[]) => void;
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

  return (
    <Dialog open={open} width={width}>
      <DialogHeader title="Export Bookmarks" onClose={close} />
      {error && (
        <DialogError heading="Error">
          <p>{error}</p>
        </DialogError>
      )}
      {page === ImportDialogPage.UPLOAD && (
        <DialogContent>
          {/* todo */}
        </DialogContent>
      )}
      {page === ImportDialogPage.SELECT && (
        <DialogContent>
          {/* todo */}
        </DialogContent>
      )}
      <DialogFooter>
        {/* todo */}
      </DialogFooter>
    </Dialog>
  )
}
