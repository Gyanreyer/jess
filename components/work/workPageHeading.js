import { secondaryAccentColor, primaryAccentColor } from "../../constants/colors";

export default function WorkPageHeading({ title, subtext }) {
  return (
    <div className="heading-box">
      <h1>{title}</h1>
      <p>{subtext}</p>
      <style jsx>{`
        .heading-box {
          border: 0.5rem solid ${secondaryAccentColor};
          margin: 1rem 4% 3rem;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          h1 {
            color: ${primaryAccentColor};
            font-size: 3rem;
            margin: 0 0 1rem;
          }

          p {
            max-width: 40rem;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
