import dynamic from "next/dynamic";

import config from "../cms/config.yml";

const WorkPagePreviewTemplate = dynamic(() =>
  import("../components/admin/workPagePreviewTemplate")
);
const CMS = dynamic(
  () =>
    import("netlify-cms-app").then((cms) => {
      cms.registerPreviewTemplate("work", WorkPagePreviewTemplate);
      cms.init({ config });
    }),
  { ssr: false }
);

export default function AdminPage() {
  return <CMS />;
}
