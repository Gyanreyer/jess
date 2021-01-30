import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";

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
  return (
    <>
      <NextSeo title="Admin Page" />
      <CMS />
    </>
  );
}
