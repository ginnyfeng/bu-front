import { useNavigate } from "react-router-dom";

/**
 * Allows the use of useNavigate outside react components.
 */
export const history = {
  navigate: null,
  /**
   * Navigates to a specified page or goes back in the history stack.
   * @param {string | -1} page - The target page path as a string, or -1 to go back one page.
   * @param {...any} rest - Additional arguments passed to the navigate function.
   */
  push: (page, ...rest) => history.navigate(page, ...rest),
};

/**
 * Initializes the `history.navigate` function to allow navigation via `history.push`.
 */
export default function HistoryProvider() {
  history.navigate = useNavigate();
  return null;
}
