import { SvgProps } from "../svg/main.svg";

export const ChevronDownIcon: React.FC<SvgProps> = ({ width = 20, height = 20, color = "currentColor", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={height} width={width} fill="none" viewBox="0 0 24 24" stroke={color}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
};
