interface Props {
  typo: string | boolean;
  styles?: string;
}
{/* todo - need to replace this after payment intergration */}

export const PrimaryTypo = (props: Props) => {
  return (
    <div className={`poppins-semibold text-base leading-6 ${props.styles}`}>
      {props.typo}
    </div>
  );
};
