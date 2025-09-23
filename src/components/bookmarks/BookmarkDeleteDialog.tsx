import type { FC } from "react";
import { Dialog, type DialogPropsBase } from "../dialog/Dialog";
import { DialogHeader } from "../dialog/DialogHeader";
import { BookmarkType, type BookmarkItem } from "../../types/bookmarks";
import { DialogContent } from "../dialog/DialogContent";
import { DialogFooter } from "../dialog/DialogFooter";
import { DialogActionButton } from "../dialog/DialogActionButton";
import { useBookmarksStore } from "../../store/bookmarks";

export type BookmarkDeleteDialogProps = DialogPropsBase & {
  onClose: () => void;
  bookmark?: BookmarkItem;
};

export const BookmarkDeleteDialog: FC<BookmarkDeleteDialogProps> = ({
  open,
  onClose,
  bookmark,
}) => {
  const deleteBookmark = useBookmarksStore((state) => state.deleteBookmark);

  function handleDelete() {
    if (!bookmark) return;
    deleteBookmark(bookmark.id);
    onClose();
  }

  return (
    bookmark && (
      <Dialog open={open}>
        <DialogHeader
          title={`Deleting ${bookmark?.title}`}
          onClose={onClose}
          showCloseButton
        />
        <DialogContent className="warning">
          <p>
            Are you sure you want to delete this {bookmark.type.toString()}?
          </p>
          <p>This action cannot be undone.</p>
          {bookmark.type === BookmarkType.FOLDER && (
            <p className="important">
              This folder AND ALL ITS CONTENTS will be deleted PERMANENTLY.
            </p>
          )}
        </DialogContent>

        <DialogFooter>
          <DialogActionButton onClick={onClose} type="cancel">
            Cancel
          </DialogActionButton>
          <DialogActionButton onClick={handleDelete} type="confirm">
            Delete
          </DialogActionButton>
        </DialogFooter>
      </Dialog>
    )
  );
};
