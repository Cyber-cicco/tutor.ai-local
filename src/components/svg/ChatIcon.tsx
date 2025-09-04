import { SvgProps } from "./main.svg";

export const ChatIcon: React.FC<SvgProps> = ({ width = 24, height = 24, color = "#259591", className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={height} width={width} fill={color} viewBox="0 0 24 24">
      <path d="M21 6h-2v9H6v2c0 1.1.9 2 2 2h9l4 4V7c0-1.1-.9-2-2-2zm-4 6V3c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v14l4-4h10c1.1 0 2-.9 2-2z" />
    </svg>
  );
};
