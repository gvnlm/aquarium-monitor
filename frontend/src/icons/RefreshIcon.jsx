const RefreshIcon = ({ className = '', ...props }) => {
  const strokeWidth = 11;

  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 10 512 512"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M320,146s24.36-12-64-12A160,160,0,1,0,416,294"
        style={{
          fill: 'none',
          stroke: 'currentColor',
          strokeLinecap: 'square',
          strokeMiterlimit: 10,
          strokeWidth: strokeWidth * 2,
        }}
      />
      <polyline
        points="256 58 336 138 256 218"
        style={{
          fill: 'none',
          stroke: 'currentColor',
          strokeLinecap: 'square',
          strokeMiterlimit: 10,
          strokeWidth: strokeWidth * 2,
        }}
      />
    </svg>
  );
};

export default RefreshIcon;
