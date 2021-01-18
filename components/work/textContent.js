import ReactMarkdown from "react-markdown";

export default function TextContent({
  contentConfig: { text, textAlignment, columnWidth },
}) {
  return (
    <div
      className="text-content"
      style={{
        gridColumnStart: `span ${columnWidth}`,
        marginRight: textAlignment === "right" ? 0 : "auto",
        marginLeft: textAlignment === "left" ? 0 : "auto",
        textAlign: textAlignment,
      }}
    >
      <ReactMarkdown source={text} />
      <style jsx>{`
        .text-content {
          max-width: 42rem;
        }

        .text-content > :global(*:first-child) {
          margin-top: 0;
        }
        .text-content > :global(*:last-child) {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
