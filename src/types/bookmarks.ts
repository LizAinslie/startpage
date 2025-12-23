export enum BookmarkType {
  URL = "url",
  FOLDER = "folder",
}

export type BookmarkItemBase = {
  id: string;
  title: string;
  type: BookmarkType;
};

export type BookmarkItemUrl = BookmarkItemBase & {
  type: BookmarkType.URL;
  url: string;
};

export type BookmarkItemFolder = BookmarkItemBase & {
  type: BookmarkType.FOLDER;
  children: BookmarkItem[];
};

export type BookmarkItem = BookmarkItemUrl | BookmarkItemFolder;

export type BookmarkSearchResultItem = {
  bookmark: BookmarkItemUrl;
  hierarchy: string[];
};

export const enum BookmarkExportSelection {
  DONT_EXPORT = "dont_export",
  PARTIAL = "partial",
  EXPORT = "export",
}

export type ExportableBookmarkItemBase = BookmarkItemBase & {
  export: BookmarkExportSelection;
};

export type ExportableFolderBookmarkItem = ExportableBookmarkItemBase & {
  type: BookmarkType.FOLDER;
  children: ExportableBookmarkItem[];
};

export type ExportableUrlBookmarkItem = BookmarkItemUrl & ExportableBookmarkItemBase;

export type ExportableBookmarkItem = ExportableFolderBookmarkItem | ExportableUrlBookmarkItem;

export function makeExportable(bookmark: BookmarkItem): ExportableBookmarkItem {
  if (bookmark.type === "folder") {
    return {
      ...bookmark,
      children: bookmark.children.map(makeExportable),
      export: BookmarkExportSelection.DONT_EXPORT,
    };
  }
  return {
    ...bookmark,
    export: BookmarkExportSelection.DONT_EXPORT,
  };
}


export function filterExports(bookmarks: ExportableBookmarkItem[]): BookmarkItem[] {
  const returnValue: BookmarkItem[] = [];
  for (const bookmark of bookmarks) {
    if (bookmark.type === BookmarkType.FOLDER) {
      // console.log("Folder:", bookmark.id, bookmark.title, bookmark.export);
      if (bookmark.export === BookmarkExportSelection.EXPORT || bookmark.export === BookmarkExportSelection.PARTIAL) {
        returnValue.push({
          id: bookmark.id,
          type: BookmarkType.FOLDER,
          title: bookmark.title,
          children: filterExports(bookmark.children),
        });
      }
    } else if (bookmark.export === BookmarkExportSelection.EXPORT) {
      // console.log("URL:", bookmark.id, bookmark.title);
      returnValue.push({
        id: bookmark.id,
        type: BookmarkType.URL,
        title: bookmark.title,
        url: bookmark.url,
      });
    }
  }
  return returnValue;
}

export function walkAndSetAllChildrenToSelection(bookmarks: ExportableBookmarkItem[], selection: BookmarkExportSelection): ExportableBookmarkItem[] {
  const returnValue: ExportableBookmarkItem[] = [];

  for (const bookmark of bookmarks) {
    if (bookmark.type === BookmarkType.FOLDER) {
      const children = walkAndSetAllChildrenToSelection(bookmark.children, selection);
      returnValue.push({
        ...bookmark,
        children,
        export: selection,
      });
    } else {
      returnValue.push({
        ...bookmark,
        export: selection,
      });
    }
  }
  return returnValue;
}

function allExported(bookmarks: ExportableBookmarkItem[]): boolean {
  return bookmarks.every(bookmark => {
    if (bookmark.type === BookmarkType.FOLDER) {
      return allExported(bookmark.children);
    }
    return bookmark.export === BookmarkExportSelection.EXPORT;
  });
}

export function walkAndUpdateBookmarkExportSelection(bookmarks: ExportableBookmarkItem[], id: string, selection: BookmarkExportSelection, parent: ExportableFolderBookmarkItem | undefined = undefined): ExportableBookmarkItem[] {
  const returnValue = [];

  for (const bookmark of bookmarks) {
    let stateToSet = selection;

    // ignore PARTIAL for everything other than folder bookmarks as it is not
    // supported outside of that case.
    if (
      bookmark.id === id
      && bookmark.type !== BookmarkType.FOLDER
      && selection === BookmarkExportSelection.PARTIAL
    ) stateToSet = bookmark.export;

    switch (bookmark.type) {
      case BookmarkType.FOLDER: {
        // this saves computation time, if the bookmark is the one we're
        // updating there's no need to recurse into its children (unless
        // we're setting the folder to EXPORT)
        const children = bookmark.id === id
        ? (selection === BookmarkExportSelection.EXPORT || selection === BookmarkExportSelection.DONT_EXPORT ? walkAndSetAllChildrenToSelection(bookmark.children, selection) : bookmark.children)
          : walkAndUpdateBookmarkExportSelection(bookmark.children, id, selection, bookmark)

        const allChildrenExported = allExported(children);
        const someChildrenExported = children.some(child => child.export === BookmarkExportSelection.EXPORT || child.export === BookmarkExportSelection.PARTIAL);
        const noneChildrenExported = children.every(child => child.export === BookmarkExportSelection.DONT_EXPORT);

        let setFolderAlso = false

        if (someChildrenExported && !allChildrenExported) {
          setFolderAlso = true;
          stateToSet = BookmarkExportSelection.PARTIAL;
        } else if (noneChildrenExported) {
          setFolderAlso = true;
          stateToSet = BookmarkExportSelection.DONT_EXPORT;
        } else if (allChildrenExported) {
          setFolderAlso = true;
          stateToSet = BookmarkExportSelection.EXPORT;
        }

        returnValue.push({
          ...bookmark,
          children,
          export: bookmark.id === id || setFolderAlso ? stateToSet : bookmark.export,
        });
        break;
      }
      case BookmarkType.URL: {
        returnValue.push({
          ...bookmark,
          export: bookmark.id === id ? stateToSet : bookmark.export,
        });
        break;
      }
    }
  }

  return returnValue;
}
