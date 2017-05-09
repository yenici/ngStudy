import { NgStudyPage } from './app.po';

describe('ng-study App', () => {
  let page: NgStudyPage;

  beforeEach(() => {
    page = new NgStudyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
