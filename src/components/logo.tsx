const Logo = ({ width = 28, height = 28, ...props }: { width?: number; height?: number } & React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <circle cx="16" cy="16" r="6" fill="white" />
    </svg>
  )
}

export default Logo