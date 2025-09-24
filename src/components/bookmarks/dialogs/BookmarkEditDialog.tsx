import { useState, type FC } from "react";
import { useBookmarksStore } from "../../../store/bookmarks";
import { isUrl } from "../../../util/url";
import {
  Dialog,
  DialogFooter,
  DialogActionButton,
  DialogHeader,
  DialogContent,
  type DialogPropsBase,
  DialogError,
} from "../../dialog";
import { FormErrors } from "../../form/FormErrors";
import type { BookmarkItemUrl } from "../../../types/bookmarks";

export type BookmarkEditDialogProps = DialogPropsBase & {
  onClose: () => void;
  bookmark?: BookmarkItemUrl;
};

export const BookmarkEditDialog: FC<BookmarkEditDialogProps> = ({
  open,
  onClose,
  bookmark,
}) => {
  if (!bookmark) return null;

  const [title, setTitle] = useState(bookmark.title || "");
  const [url, setUrl] = useState(bookmark.url || "");

  const [errors, setErrors] = useState<string[]>([]);

  const editBookmark = useBookmarksStore((state) => state.editBookmark);

  function checkErrors() {
    if (!title.trim()) {
      setErrors((prev) => [...prev, "Bookmark name is required"]);
    }

    if (title.trim().length > 70) {
      setErrors((prev) => [
        ...prev,
        "Bookmark name is too long. Max: 70 characters",
      ]);
    }

    if (!url.trim()) {
      setErrors((prev) => [...prev, "URL is required"]);
    }

    if (!isUrl(url)) {
      setErrors((prev) => [...prev, "Invalid URL"]);
    }
  }

  function save() {
    if (!bookmark) return;
    checkErrors();
    if (errors.length === 0) {
      editBookmark(bookmark.id, title, url);
      close();
    }
  }

  function close() {
    setTitle("");
    setUrl("");
    setErrors([]);
    onClose();
  }

  return (
    <Dialog open={open}>
      <DialogHeader title="Edit Bookmark" onClose={close} showCloseButton />
      {errors.length > 0 && (
        <DialogError heading="Errors:">
          <FormErrors errors={errors} />
        </DialogError>
      )}
      <DialogContent className="form">
        <div className="form_input">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            placeholder="My Bookmark"
            onChange={(e) => setTitle(e.target.value)}
            required
            onBlur={checkErrors}
          />
        </div>
        <div className="form_input">
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="text"
            value={url}
            placeholder="https://example.com"
            onBlur={checkErrors}
            required
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogFooter>
        <DialogActionButton onClick={close} type="cancel">
          Cancel
        </DialogActionButton>
        <DialogActionButton
          onClick={save}
          type="confirm"
          disabled={errors.length > 0}
        >
          Save
        </DialogActionButton>
      </DialogFooter>
    </Dialog>
  );
};
