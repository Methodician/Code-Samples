// This file includes excerpts from an Angular service for working with Firebase
import { Injectable } from "@angular/core";

// AngularFire Stuff
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

// RXJS stuff
import { switchMap, take } from "rxjs/operators";
import { combineLatest } from "rxjs";

// Internal Models
import { ArticlePreview, ArticleDetail } from "@models/interfaces/article-info";

@Injectable({
  providedIn: "root"
})
export class ArticleService {
  constructor(
    private afs: AngularFirestore,
    private afd: AngularFireDatabase
  ) {}

  // Firestore Ref Builders
  articleDetailRef = (id: string): AngularFirestoreDocument<ArticleDetail> =>
    this.afs.doc(`articleData/articles/articles/${id}`);

  articlePreviewRef = (id: string): AngularFirestoreDocument<ArticlePreview> =>
    this.afs.doc(`articleData/articles/previews/${id}`);

  allArticlesRef = (): AngularFirestoreCollection<ArticlePreview> =>
    this.afs.collection("articleData/articles/previews", ref =>
      ref.orderBy("lastUpdated", "desc").where("isFlagged", "==", false)
    );

  latestArticlesRef = (): AngularFirestoreCollection<ArticlePreview> =>
    this.afs.collection("articleData/articles/previews", ref =>
      ref
        .orderBy("timestamp", "desc")
        .where("isFlagged", "==", false)
        .limit(12)
    );

  // Some tight RxJS magic
  watchBookmarkedArticles = uid => {
    // Create an observable for modification
    const bookmarks$ = this.afd
      .list(`userInfo/articleBookmarksPerUser/${uid}`)
      .snapshotChanges();

    // Converts a list of article ID/Keys into an array of ArticlePreview
    // Observables, then to a single Observable of Articles in
    // a clean, composable way
    return bookmarks$.pipe(
      // switchMap is like map but removes observable nesting
      switchMap(bookmarkSnaps => {
        // Takes an array of snapshots and converts to array of keys
        const keys = bookmarkSnaps.map(snap => snap.key);
        // Converts array of keys to Observable of an array of articles
        const articleSnapshots = keys.map(key =>
          this.articlePreviewRef(key)
            .valueChanges()
            .pipe(take(1))
        );
        return combineLatest(articleSnapshots);
      })
    );
  };

  // Feeling clever - doing above in effectively one line of code does not make it better...
  // This is an example of what I call "cryptic ninja coding" and I strongly deter my team from this behavior
  watchBookmarkedArticlesUgly = uid =>
    this.afd
      .list(`userInfo/articleBookmarksPerUser/${uid}`)
      .snapshotChanges()
      .pipe(
        switchMap(bookmarkSnaps =>
          combineLatest(
            bookmarkSnaps
              .map(snap => snap.key)
              .map(key =>
                this.articlePreviewRef(key)
                  .valueChanges()
                  .pipe(take(1))
              )
          )
        )
      );

  // Helper method because Server Side Rendering messes with Firestore Timestamps
  processArticleTimestamps = (article: ArticlePreview | ArticleDetail) => {
    const { timestamp, lastUpdated } = article;
    if (timestamp) article.timestamp = timestamp.toDate();
    if (lastUpdated) article.lastUpdated = lastUpdated.toDate();
    return article;
  };
}
