import dynamic from "next/dynamic";

// import WorkPagePreviewTemplate from "../components/admin/workPagePreviewTemplate";
import config from "../cms/config.yml";

const CMS = dynamic(
  async () => {
    const WorkPagePreviewTemplate = await dynamic(() =>
      import("../components/admin/workPagePreviewTemplate")
    );
    return import("netlify-cms-app").then((cms) => {
      cms.registerPreviewTemplate("work", WorkPagePreviewTemplate);
      cms.init({ config });
    });
  },
  { ssr: false }
);

export default function AdminPage() {
  return <CMS />;
}
