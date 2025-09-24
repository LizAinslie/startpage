import type { FC } from "react";
import type {
  BookmarkItem,
  BookmarkItemUrl,
  BookmarkSearchResultItem,
} from "../../../types/bookmarks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { CommonBookmarkActions } from "../CommonBookmarkActions";

export type BookmarkSearchResultsProps = {
  results: BookmarkSearchResultItem[];
  deleteBookmark: (bookmark: BookmarkItem) => void;
  editBookmark: (bookmark: BookmarkItemUrl) => void;
};

export const BookmarkSearchResults: FC<BookmarkSearchResultsProps> = ({
  results,
  deleteBookmark,
  editBookmark,
}) => {
  return (
    <ul className="bookmark_list">
      {results.map((result, idx) => {
        return (
          <li key={idx} className="bookmark_item">
            <a
              href={result.bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bookmark_line"
            >
              <span className="title">
                <FontAwesomeIcon icon={faLink} />
                {result.bookmark.title}
              </span>
              {result.hierarchy.length > 0 && (
                <span className="hierarchy">
                  in{" "}
                  {result.hierarchy.map((hierarchyPart, idx) => (
                    <>
                      <b>{hierarchyPart}</b>
                      {idx < result.hierarchy.length - 1 && <> &middot; </>}
                    </>
                  ))}
                </span>
              )}
              <div style={{ flexGrow: "1" }} />
              <div className="actions">
                <CommonBookmarkActions
                  editFn={() => editBookmark(result.bookmark)}
                  deleteFn={() => deleteBookmark(result.bookmark)}
                />
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
};
