// Several TypeScript interfaces for handling Article objects
// I really love TypeScript interfaces, more for the intellisense and
// reducing cognitive load than to eliminate bugs or whatever folks claim about them

export interface ArticlePreview {
  // Article Previews are used to display cards, lists, etc...
  // Duplicating this data in Firestore saves bandwidth when displaying search results, etc...
  articleId: string;
  authorId: string;
  title: string;
  introduction: string;
  imageUrl: string;
  imageAlt: string;
  lastUpdated: any;
  timestamp: any;
  version: number;
  editors: KeyMap<number>;
  commentCount?: number;
  viewCount?: number;
  tags?: string[];
  isFlagged?: boolean;
}

export interface ArticleDetail {
  // The complete article object, used for displaying and editing article details
  articleId: string;
  authorId: string;
  title: string;
  introduction: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  authorImageUrl: string;
  lastUpdated: any;
  timestamp: any;
  lastEditorId: string;
  version: number;
  // Makes use of KeyMap from below to allow for multiple simultaneous editors to be tracked
  editors: KeyMap<number>;
  commentCount?: number;
  viewCount?: number;
  tags?: string[];
  isFeatured?: boolean;
  isFlagged?: boolean;
  bodyImages?: BodyImageMap;
}

export interface KeyMap<T> {
  // Interface for array-like objects (I like to call them "KeyMaps" instead of "Dictionaries")
  [key: string]: T;
}
export interface BodyImageMeta {
  orientation: number;
  path: string;
}

// Quick intellisense-boosting interface for use within the above Article interfaces
export interface BodyImageMap extends KeyMap<BodyImageMeta> {}
