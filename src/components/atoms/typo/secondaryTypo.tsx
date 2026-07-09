import { useState } from 'react';

interface Props {
  typo: string;
  styles?: string;
  maxLength?: number;
}

export const SecondaryTypo = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = props.maxLength || props.typo.length;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (props.typo.length <= maxLength) {
      return props.typo;
    }

    if (isExpanded) {
      return (
        <>
          {props.typo}
          <span 
            className="text-gray-400 ml-3 cursor-pointer " 
            onClick={toggleExpand}
          >
            Show less
          </span>
        </>
      );
    }

    return (
      <>
        {props.typo.slice(0, maxLength)}...
        <span 
          className="text-gray-400 cursor-pointer ml-1" 
          onClick={toggleExpand}
        >
          Read more
        </span>
      </>
    );
  };

  return (
    <div
      className={`poppins-medium text-sm text-[#6F6F6F] leading-[21px] ${props.styles}`}
    >
      {renderText()}
    </div>
  );
};