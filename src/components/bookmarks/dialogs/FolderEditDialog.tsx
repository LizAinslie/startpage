import { useState, type FC } from "react";
import type { BookmarkItemFolder } from "../../../types/bookmarks";
import { useBookmarksStore } from "../../../store/bookmarks";
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

export type FolderEditDialogProps = DialogPropsBase & {
  folder?: BookmarkItemFolder;
  onClose: () => void;
};

export const FolderEditDialog: FC<FolderEditDialogProps> = ({
  folder,
  open,
  onClose,
}) => {
  if (!folder) return null;

  const [title, setTitle] = useState(folder.title);
  const [errors, setErrors] = useState<string[]>([]);

  const editFolder = useBookmarksStore((store) => store.editFolder);

  function checkErrors() {
    setErrors([]);

    if (!title.trim()) {
      setErrors((prev) => [...prev, "Folder name cannot be empty"]);
    }

    if (title.trim().length > 50) {
      setErrors((prev) => [
        ...prev,
        "Folder name is too long. Max: 50 characters",
      ]);
    }
  }

  function save() {
    if (!folder) return;
    checkErrors();
    if (errors.length === 0) {
      editFolder(folder.id, title.trim());
      close();
    }
  }

  function close() {
    setTitle("");
    setErrors([]);
    onClose();
  }

  return (
    <Dialog open={open}>
      <DialogHeader title="Edit Folder" showCloseButton onClose={onClose} />
      {errors.length > 0 && (
        <DialogError heading="Errors:">
          <FormErrors errors={errors} />
        </DialogError>
      )}
      <DialogContent>
        <div className="form_input">
          <label htmlFor="folder-name">Folder Name:</label>
          <input
            type="text"
            id="folder-name"
            value={title}
            placeholder="My Folder"
            required
            onChange={(e) => setTitle(e.target.value)}
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
          Save
        </DialogActionButton>
      </DialogFooter>
    </Dialog>
  );
};
