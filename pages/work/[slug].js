import { readdirSync, readFileSync } from "fs";
import frontMatter from "front-matter";

const BASE_WORK_CONTENT_DIRECTORY = `${process.cwd()}/content/work`;

const getWorkDirectorySlugs = () => {
  return readdirSync(BASE_WORK_CONTENT_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};

export async function getStaticPaths() {
  const workDirectorySlugs = getWorkDirectorySlugs();

  return {
    paths: workDirectorySlugs.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const contentDirectory = `${BASE_WORK_CONTENT_DIRECTORY}/${context.params.slug}`;

  const projects = readdirSync(contentDirectory).map((fileName) => {
    const filePath = `${contentDirectory}/${fileName}`;
    const file = readFileSync(filePath, {
      encoding: "utf-8",
    });

    return frontMatter(file);
  });

  return {
    props: { projects },
  };
}

export default function WorkPage({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.attributes.title}>{project.attributes.title}</li>
      ))}
    </ul>
  );
}
