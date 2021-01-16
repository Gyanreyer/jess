import dynamic from "next/dynamic";
import config from "../cms/config.yml";

const CMS = dynamic(
  () =>
    import("netlify-cms-app").then((cms) => {
      cms.init({ config });
    }),
  { ssr: false, loading: () => <p>Loading...</p> }
);

export default function AdminPage() {
  return <CMS />;
}
