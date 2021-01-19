import styles from "./workPageHeading.module.scss";

export default function WorkPageHeading({ heading, subHeading }) {
  return (
    <div className={styles.headingBox}>
      <h1>{heading}</h1>
      <p>{subHeading}</p>
    </div>
  );
}
