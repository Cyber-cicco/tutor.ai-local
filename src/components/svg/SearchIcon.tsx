import type{ SvgProps } from "../svg/main.svg";

export const SearchIcon: React.FC<SvgProps> = ({ width = 20, height = 20, color = "currentColor", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={height} width={width} fill="none" viewBox="0 0 24 24" stroke={color}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
};
