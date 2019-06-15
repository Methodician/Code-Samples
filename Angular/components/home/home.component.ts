// This component demonstrates my use of Angular Universal Server Side Rendering
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  TransferState,
  makeStateKey,
  StateKey,
} from '@angular/platform-browser';

import { ArticlePreview } from '@models/interfaces/article-info';
import { TabItem, TabList } from './filter-menu/filter-menu.component';

import { ArticleService } from '@services/article.service';
import { SeoService } from '@services/seo.service';

import { Observable } from 'rxjs';
import { map, tap, startWith } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';

// StateKeys keep track of what state has been provided by server-side rendering
const ALL_ARTICLES_KEY = makeStateKey<Observable<ArticlePreview[]>>(
  'allArticles'
);
const LATEST_ARTICLES_KEY = makeStateKey<Observable<ArticlePreview[]>>(
  'latestArticles'
);

@Component({
  selector: 'cos-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('filterMenu') filterMenu;
  userId: string;

  // Allows for flexible tab structure, tabs can be added and removed with a function below
  filterTabs = [
    { name: 'Latest', selected: true },
    { name: 'All', selected: false },
  ];

  // We store article collections as observables in this component, using the async pipe in HTML
  allArticles$: Observable<ArticlePreview[]>;
  latestArticles$: Observable<ArticlePreview[]>;
  bookmarkedArticles$: Observable<ArticlePreview[]>;

  constructor(
    private articleSvc: ArticleService,
    private seoSvc: SeoService,
    private authSvc: AuthService,
    private state: TransferState
  ) {}

  ngOnInit() {
    this.initializeArticles();
    // My SEO Service is used to dynamically add meta tags during SSR
    this.seoSvc.generateTags({ canonicalUrl: 'https://cosourcery.com/home' });
    this.watchAuthInfo();
  }

  ngOnDestroy() {
    // If we don't clear the State Keys when the component unmounts, we can end up with residual data when routing between components
    this.clearArticleKeys();
  }

  // AUTH STUFF
  watchAuthInfo = () => {
    this.authSvc.authInfo$.subscribe(({ uid }) => {
      this.userId = uid;
      if (uid) {
        this.watchBookmarkedArticles(uid);
        // Dynamically add a tab if we may have bookmarked articles to display
        this.addFilterTab({ name: 'Bookmarked', selected: false });
      }
    });
  };
  //end auth stuff

  // ARTICLE STUFF
  initializeArticles = () => {
    this.latestArticles$ = this.ssrArticleCollection(
      this.articleSvc.latestArticlesRef().valueChanges(),
      LATEST_ARTICLES_KEY
    );

    this.allArticles$ = this.ssrArticleCollection(
      this.articleSvc.allArticlesRef().valueChanges(),
      ALL_ARTICLES_KEY
    );
  };

  clearArticleKeys = () => {
    this.state.set(ALL_ARTICLES_KEY, null);
    this.state.set(LATEST_ARTICLES_KEY, null);
  };

  watchBookmarkedArticles = (uid: string) => {
    this.bookmarkedArticles$ = this.articleSvc
      .watchBookmarkedArticles(this.userId)
      .pipe(
        map(articles =>
          // Mapping through our observables to ensure the output has consistent timestamps both SSR and dynamic
          articles.map(art => this.articleSvc.processArticleTimestamps(art))
        )
      );
  };

  // Composable function to add collection observables to SSR state and handle some processing
  ssrArticleCollection = (
    articles$: Observable<ArticlePreview[]>,
    stateKey: StateKey<Observable<ArticlePreview[]>>
  ) => {
    const preExisting$ = this.state.get(stateKey, null as any);
    return articles$.pipe(
      map(articles =>
        articles.map(art => this.articleSvc.processArticleTimestamps(art))
      ),
      tap(articles => this.state.set(stateKey, articles)),
      startWith(preExisting$)
    );
  };

  //end article stuff

  // HOME FILTER FUNCTIONALITY
  addFilterTab = (tab: TabItem) => {
    if (!this.filterMenu.getTabByName(tab.name)) {
      this.filterTabs.push(tab);
    }
  };

  onFilterTabAdded = ($event: TabList) => {
    const lastTabIndex = $event.length - 1;
    const newestTabName = $event[lastTabIndex].name;
    if (newestTabName === 'Search Results') {
      this.filterMenu.selectTab(lastTabIndex);
    }
  };
  //end home filter functionality
}
