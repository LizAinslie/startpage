import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC, MouseEvent } from "react";

export type CommonBookmarkActionsProps = {
  editFn: () => void;
  deleteFn: () => void;
};

export const CommonBookmarkActions: FC<CommonBookmarkActionsProps> = ({
  editFn,
  deleteFn,
}) => {
  function handleEdit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    editFn();
  }

  function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    deleteFn();
  }

  return (
    <>
      <button className="bookmark_action" onClick={handleEdit}>
        <FontAwesomeIcon icon={faPencil} />
      </button>

      <button className="bookmark_action" onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </>
  );
};
