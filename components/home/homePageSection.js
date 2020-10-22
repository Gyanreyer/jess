const HomePageSection = (props) => (
  <>
    <section {...props} />
    <style jsx>{`
      section {
        position: relative;
        font-size: 1.2rem;

        :global(h1) {
          font-size: 3rem;
          margin: 0 0 0.75rem;
        }
      }
    `}</style>
  </>
);

export default HomePageSection;
