import { HueLightshowPage } from './app.po';

describe('hue-lightshow App', () => {
  let page: HueLightshowPage;

  beforeEach(() => {
    page = new HueLightshowPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
