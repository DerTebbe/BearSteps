import { browser, by, element } from 'protractor';

/**
 * @ignore
 */
export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.deepCss('app-root ion-content')).getText();
  }
}
