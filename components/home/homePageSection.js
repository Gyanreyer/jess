import styles from "./homePageSection.module.scss";

const HomePageSection = ({ className = "", ...props }) => (
  <section className={`${styles.homePageSection} ${className}`} {...props} />
);

export default HomePageSection;
