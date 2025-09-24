import { useState, type FC } from "react";
import {
  Dialog,
  DialogFooter,
  DialogActionButton,
  DialogHeader,
  DialogContent,
  type DialogPropsBase,
} from "../../dialog";
import { useBookmarksStore } from "../../../store/bookmarks";
import type { BookmarkItemFolder } from "../../../types/bookmarks";
import { FormErrors } from "../../form/FormErrors";

export type FolderCreateDialogProps = DialogPropsBase & {
  onClose: () => void;
  parent?: BookmarkItemFolder;
};

export const FolderCreateDialog: FC<FolderCreateDialogProps> = ({
  open,
  onClose,
  parent,
}) => {
  const [title, setTitle] = useState("");
  const createFolder = useBookmarksStore((state) => state.createFolder);

  const [errors, setErrors] = useState<string[]>([]);

  function checkErrors() {
    setErrors([]);

    if (!title.trim()) {
      setErrors((prev) => [...prev, "Folder name is required"]);
    }

    if (title.trim().length > 50) {
      setErrors((prev) => [
        ...prev,
        "Folder name is too long. Max: 50 characters",
      ]);
    }
  }

  function save() {
    checkErrors();
    if (errors.length === 0) {
      createFolder(title.trim(), parent?.id);
      close();
    }
  }

  function close() {
    setTitle("");
    setErrors([]);
    onClose();
  }

  const dialogTitle = parent
    ? `Create Folder in ${parent.title}`
    : "Create Folder";

  return (
    <Dialog open={open}>
      <DialogHeader title={dialogTitle} onClose={onClose} />
      <DialogContent className="form">
        <FormErrors errors={errors} />
        <div className="form_input">
          <label htmlFor="folder-name">Folder Name:</label>
          <input
            type="text"
            id="folder-name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Documentation"
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
          Save
        </DialogActionButton>
      </DialogFooter>
    </Dialog>
  );
};
