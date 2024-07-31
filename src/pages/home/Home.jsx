import { Layout } from "../../components/layout";
import sections from "./sections";

import s from "./styles.module.css";

const Home = () => {
  return (
    <Layout>
      <main className={s.container}>
        {sections.map((Section, i) => (
          <Section key={i} />
        ))}
      </main>
    </Layout>
  );
};

export default Home;
