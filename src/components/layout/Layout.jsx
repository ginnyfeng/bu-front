import { Header as DefaultHeader, Footer } from "../partials";

/**
 * Layout component that renders a header, optional footer, and the children(your page).
 * @param {object} props
 * @param {React.ReactElement} [props.Header] - The header component to render. Defaults to the 'default' orange header if nothing is provided.
 * @param {boolean} [props.showFooter] - Render the footer or not.
 * @param {React.ReactNode} props.children - The children(your page) to render between header and footer.
 */
const Layout = ({ Header = DefaultHeader, showFooter = true, children }) => {
  return (
    <div className="layout">
      <Header />
      {children}
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;