import { useState, type FC } from "react";

import {
  Dialog,
  DialogFooter,
  DialogActionButton,
  DialogHeader,
  DialogContent,
  type DialogPropsBase,
  DialogError,
} from "../../dialog";
import { useBookmarksStore } from "../../../store/bookmarks";
import { isUrl } from "../../../util/url";
import { FormErrors } from "../../form/FormErrors";
import type { BookmarkItemFolder } from "../../../types/bookmarks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export type BookmarkCreateDialogProps = DialogPropsBase & {
  onClose: () => void;
  parent?: BookmarkItemFolder;
};

export const BookmarkCreateDialog: FC<BookmarkCreateDialogProps> = ({
  open,
  onClose,
  parent,
}) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const createBookmark = useBookmarksStore((store) => store.createBookmark);

  function checkErrors() {
    setErrors([]);

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
    checkErrors();
    if (errors.length === 0) {
      createBookmark(title.trim(), url.trim(), parent?.id);
      close();
    }
  }

  function close() {
    setTitle("");
    setUrl("");
    setErrors([]);
    onClose();
  }

  const dialogTitle = parent
    ? `Create Bookmark in ${parent.title}`
    : "Create Bookmark";

  return (
    <Dialog open={open}>
      <DialogHeader title={dialogTitle} onClose={onClose} />
      {errors.length > 0 && (
        <DialogError heading="Form errors:">
          <FormErrors errors={errors} />
        </DialogError>
      )}
      <DialogContent className="form">
        <div className="form_input">
          <label htmlFor="bookmark-name">Bookmark Name:</label>
          <input
            type="text"
            id="bookmark-name"
            placeholder="My Bookmark"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            onBlur={checkErrors}
          />
        </div>
        <div className="form_input">
          <label htmlFor="bookmark-url">URL:</label>
          <input
            type="text"
            id="bookmark-url"
            placeholder="https://example.com"
            value={url}
            required
            onChange={(e) => setUrl(e.target.value)}
            onBlur={checkErrors}
          />
        </div>
      </DialogContent>
      <DialogFooter>
        <DialogActionButton type="cancel" onClick={close}>
          Cancel
        </DialogActionButton>
        <DialogActionButton
          type="confirm"
          onClick={save}
          disabled={errors.length > 0}
        >
          Create
        </DialogActionButton>
      </DialogFooter>
    </Dialog>
  );
};
