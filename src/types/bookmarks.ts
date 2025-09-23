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
