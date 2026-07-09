import { Link } from "react-router-dom";

interface Props {
  href: string;
  icon: string;
}

export const SocialMediaIcons = (props: Props) => {
  return (
    <>
      <Link to={`${props.href}`} target="_blank" rel="noopener noreferrer">
        <div className="hover:opacity-70 transition-opacity duration-200">
          <img src={props.icon} alt="social media icon" className="w-6 h-6" />
        </div>
      </Link>
    </>
  );
};
