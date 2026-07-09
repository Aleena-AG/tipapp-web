import { FunctionComponent, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface RatingProps {
  value: number;
  size?: 30 | number;
  onChange: (value: number) => void;
  isToDisplay?: boolean;
}

const Rating: FunctionComponent<RatingProps> = ({
  value,
  onChange,
  size,
  isToDisplay,
}) => {
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            className={`${!isToDisplay ? "cursor-pointer mx-6" : "mr-6"}`}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            {!isToDisplay && (
              <>
                {ratingValue <= (hover || value) ? (
                  <AiFillStar
                    size={size ? size : 30}
                    className="text-[#F4D11B]"
                  />
                ) : (
                  <AiOutlineStar
                    size={size ? size : 30}
                    className="text-[#F4D11B]"
                  />
                )}
              </>
            )}
            {isToDisplay && (
              <>
                {ratingValue <= value ? (
                  <AiFillStar
                    size={size ? size : 30}
                    className="text-[#F4D11B]"
                  />
                ) : (
                  <AiOutlineStar
                    size={size ? size : 30}
                    className="text-[#F4D11B]"
                  />
                )}
              </>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
