import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createComputed } from "zustand-computed";

import eq from "fast-deep-equal";

import {
  BookmarkType,
  type BookmarkItem,
  type BookmarkItemFolder,
  type BookmarkItemUrl,
  type BookmarkSearchResultItem,
} from "../types/bookmarks";

type BookmarksStore = {
  bookmarks: BookmarkItem[];
  createBookmark: (title: string, url: string, parentId?: string) => void;
  createFolder: (title: string, parentId?: string) => void;
  deleteBookmark: (bookmarkId: string) => void;
  editBookmark: (bookmarkId: string, newTitle: string, newUrl: string) => void;
  editFolder: (folderId: string, newTitle: string) => void;
  importBookmarks: (bookmarks: BookmarkItem[]) => void;
};

function walkAndFlattenBookmarks(
  bookmarks: BookmarkItem[],
  hierarchy: string[] = [],
): BookmarkSearchResultItem[] {
  const result: BookmarkSearchResultItem[] = [];

  for (const bookmark of bookmarks)
    if (bookmark.type === BookmarkType.URL)
      result.push({
        bookmark,
        hierarchy: hierarchy,
      });
    else if (bookmark.type === BookmarkType.FOLDER)
      result.push(
        ...walkAndFlattenBookmarks(bookmark.children, [
          ...hierarchy,
          bookmark.title,
        ]),
      );

  return result;
}

/**
 * ComputedBookmarksStore represents a computed store containing a search index
 * that should be recalculated any time a bookmark is added, deleted or updated.
 */
type ComputedBookmarksStore = {
  searchIndex: BookmarkSearchResultItem[];
};

const computed = createComputed(
  (state: BookmarksStore): ComputedBookmarksStore => ({
    searchIndex: walkAndFlattenBookmarks(state.bookmarks),
  }),
  {
    shouldRecompute: (state, next) => !eq(state.bookmarks, next.bookmarks),
  },
);

function walkAndCreateBookmark(
  bookmarks: BookmarkItem[],
  newBookmarkItem: BookmarkItem,
  parentId?: string,
): BookmarkItem[] {
  if (!parentId) {
    return [...bookmarks, newBookmarkItem];
  }

  const updatedBookmarks: BookmarkItem[] = bookmarks.map((bookmark) => {
    if (bookmark.type === BookmarkType.FOLDER) {
      // we only care about folders as parents
      if (bookmark.id === parentId) {
        // if a matching parent is found, create the bookmark
        return {
          ...bookmark,
          children: [...bookmark.children, newBookmarkItem],
        };
      } else {
        // if no matching parent is found, continue walking the tree to find a matching parent
        return {
          ...bookmark,
          children: walkAndCreateBookmark(
            bookmark.children,
            newBookmarkItem,
            parentId,
          ),
        };
      }
    }

    return bookmark;
  });

  return updatedBookmarks;
}

function walkAndEditBookmark(
  bookmarks: BookmarkItem[],
  bookmarkId: string,
  newTitle: string,
  newUrl: string,
): BookmarkItem[] {
  const updatedBookmarks: BookmarkItem[] = bookmarks.map((bookmark) => {
    console.log(
      `Checking bookmark: ${bookmark.title} (${bookmark.id}). Looking for ${bookmarkId}`,
    );
    if (bookmark.id === bookmarkId && bookmark.type === BookmarkType.URL) {
      // if a matching bookmark is found, edit it
      console.log(`Editing bookmark: ${bookmark.title}`);
      return {
        ...bookmark,
        title: newTitle,
        url: newUrl,
      };
    } else if (bookmark.type === BookmarkType.FOLDER) {
      // walk the children of each folder to find a matching bookmark
      console.log(`Walking children of folder: ${bookmark.title}`);
      return {
        ...bookmark,
        children: walkAndEditBookmark(
          bookmark.children,
          bookmarkId,
          newTitle,
          newUrl,
        ),
      };
    }

    return bookmark;
  });

  return updatedBookmarks;
}

function walkAndEditFolder(
  bookmarks: BookmarkItem[],
  folderId: string,
  newTitle: string,
): BookmarkItem[] {
  const updatedBookmarks: BookmarkItem[] = bookmarks.map((bookmark) => {
    if (bookmark.type === BookmarkType.FOLDER) {
      if (bookmark.id === folderId) {
        // if a matching folder is found, edit it
        return {
          ...bookmark,
          title: newTitle,
        };
      } else {
        // walk the children of each folder to find a matching folder
        return {
          ...bookmark,
          children: walkAndEditFolder(bookmark.children, folderId, newTitle),
        };
      }
    }

    return bookmark;
  });

  return updatedBookmarks;
}

function walkAndDeleteBookmark(
  bookmarks: BookmarkItem[],
  bookmarkId: string,
): BookmarkItem[] {
  const updatedBookmarks: (BookmarkItem | null)[] = bookmarks.map(
    (bookmark) => {
      if (bookmark.id === bookmarkId) {
        // regardless of the type, delete the bookmark if it matches
        return null;
      } else if (bookmark.type === BookmarkType.FOLDER) {
        // otherwise we walk again
        return {
          ...bookmark,
          children: walkAndDeleteBookmark(bookmark.children, bookmarkId),
        };
      }

      return bookmark;
    },
  );

  // filter out deleted values.
  return updatedBookmarks.filter((it) => it !== null) as BookmarkItem[];
}

function walkAndDetermineIfUuidTaken(
  bookmarks: BookmarkItem[],
  uuid: string,
): boolean {
  return bookmarks.some((bookmark) => {
    if (bookmark.id === uuid) {
      return true;
    } else if (bookmark.type === BookmarkType.FOLDER) {
      return walkAndDetermineIfUuidTaken(bookmark.children, uuid);
    }

    return false;
  });
}

function walkAndGenerateUuid(bookmarks: BookmarkItem[]): string {
  let newId = crypto.randomUUID();
  while (walkAndDetermineIfUuidTaken(bookmarks, newId)) {
    newId = crypto.randomUUID();
  }
  return newId;
}

function collectAllIds(bookmarks: BookmarkItem[], out = new Set<string>()) {
  for (const bookmark of bookmarks) {
    out.add(bookmark.id);
    if (bookmark.type === BookmarkType.FOLDER) {
      collectAllIds(bookmark.children, out);
    }
  }
  return out;
}

function generateIdRemap(
  bookmarks: BookmarkItem[],
  taken: Set<string>,
  remap = new Map<string, string>(),
): Map<string, string> {
  for (const bookmark of bookmarks) {
    if (taken.has(bookmark.id)) {
      let newId = crypto.randomUUID();
      while (taken.has(newId)) {
        newId = crypto.randomUUID();
      }
      remap.set(bookmark.id, newId);
      taken.add(newId);
    } else {
      taken.add(bookmark.id);
    }

    if (bookmark.type === BookmarkType.FOLDER) {
      generateIdRemap(bookmark.children, taken, remap);
    }
  }

  return remap;
}

function cloneWithRemappedIds(
  bookmarks: BookmarkItem[],
  remap: Map<string, string>,
): BookmarkItem[] {
  return bookmarks.map((bookmark) => {
    const id = remap.get(bookmark.id) ?? bookmark.id;

    if (bookmark.type === BookmarkType.URL) {
      return {
        ...bookmark,
        id,
      };
    }

    return {
      ...bookmark,
      id,
      children: cloneWithRemappedIds(bookmark.children, remap),
    };
  });
}


export const useBookmarksStore = create<BookmarksStore>()(
  computed(
    persist(
      (set, get) => ({
        bookmarks: [],
        createBookmark: (title, url, parentId) => {
          const newBookmark: BookmarkItemUrl = {
            id: walkAndGenerateUuid(get().bookmarks),
            type: BookmarkType.URL,
            title,
            url,
          };

          set({
            // update the bookmark by walking the tree and finding a parent BookmarkItemFolder
            bookmarks: walkAndCreateBookmark(
              get().bookmarks,
              newBookmark,
              parentId,
            ),
          });
        },
        createFolder: (title, parentId) => {
          const newFolder: BookmarkItemFolder = {
            id: walkAndGenerateUuid(get().bookmarks),
            type: BookmarkType.FOLDER,
            title,
            children: [],
          };

          set({
            // update the bookmark by walking the tree and finding a parent BookmarkItemFolder
            bookmarks: walkAndCreateBookmark(
              get().bookmarks,
              newFolder,
              parentId,
            ),
          });
        },
        editBookmark: (id, title, url) => {
          set({
            bookmarks: walkAndEditBookmark(get().bookmarks, id, title, url),
          });
        },
        editFolder: (id, title) => {
          set({
            bookmarks: walkAndEditFolder(get().bookmarks, id, title),
          });
        },
        deleteBookmark: (id) => {
          set({
            bookmarks: walkAndDeleteBookmark(get().bookmarks, id),
          });
        },
        importBookmarks: (incoming) => {
          const existing = get().bookmarks;

          const takenIds = collectAllIds(existing);
          const remap = generateIdRemap(incoming, takenIds);
          const imported = cloneWithRemappedIds(incoming, remap);

          set({
            bookmarks: [...existing, ...imported],
          });
        },
      }),
      {
        name: "bookmarks",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
