import { Link } from "react-router-dom";

const BulletPoints = ({ typo, href }: { typo: string; href?: string }) => {
  const ScrollTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div onClick={ScrollTop}>
      <Link
        to={`${href}`}
        target={href?.includes("https://") ? "_blank" : undefined}
        rel={href?.includes("https://") ? "noreferrer" : undefined}>
          
        <div className="poppins-medium text-sm text-[#6F6F6F] leading-5">
          {typo}
        </div>
      </Link>
    </div>
  );
};

export default BulletPoints;
