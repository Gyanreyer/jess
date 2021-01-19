import {
  secondaryAccentColor,
  primaryAccentColor,
} from "../../constants/colors";

export default function WorkPageHeading({ heading, subHeading }) {
  return (
    <div className="heading-box">
      <h1>{heading}</h1>
      <p>{subHeading}</p>
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
            font-size: 6rem;
            line-height: 1;
            letter-spacing: -2px;
            margin: 0 0 1rem;
            text-transform: lowercase;
          }

          p {
            max-width: 40rem;
            margin: 0;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
