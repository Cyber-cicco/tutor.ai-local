import type{ SvgProps } from "../svg/main.svg";

export const ForwardIcon: React.FC<SvgProps> = ({ width = 24, height = 24, color = "currentColor", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={height} width={width} fill="none" viewBox="0 0 24 24" stroke={color}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
};
