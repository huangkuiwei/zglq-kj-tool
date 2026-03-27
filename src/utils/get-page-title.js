import { websiteTitle } from "./deploy/index";
document.title = websiteTitle;

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${websiteTitle}`;
  }
  return `${websiteTitle}`;
}
