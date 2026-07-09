// import { Link } from "react-router-dom";

interface Props {
  href: string;
  typo: string;
}

export const AttachedFiles = (props: Props) => {
  return (
    <>
      {/* <Link to={`${props.href}`}> */}
      <div className="poppins-regular text-xs text-[#6F6F6F] leading-4 hover:cursor-not-allowed">
        {props.typo}
      </div>
      {/* </Link> */}
    </>
  );
};
