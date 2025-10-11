
const LogoIcon = ({ className, width = 48, height = 48 }: { className?: string; width?: number; height?: number }) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <rect width='24' height='24' rx='6' fill='currentColor' />
    <circle cx='12' cy='12' r='4' fill='white' />
  </svg>
)

const Logo = () => {
  return (
    <div className='flex flex-col gap-4 md:flex-row'>
      <div className='flex h-52 w-full items-center justify-center rounded-lg bg-white'>
        <LogoIcon className='text-black' width={48} height={48} />
      </div>
      <div className='flex h-52 w-full items-center justify-center rounded-lg bg-black'>
        <LogoIcon className='text-white' width={48} height={48} />
      </div>
    </div>
  )
}

export default Logo// Create a simple logo component or replace with your own
const LogoIcon = ({ className, width = 48, height = 48 }: { className?: string; width?: number; height?: number }) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <rect width='24' height='24' rx='6' fill='currentColor' />
    <circle cx='12' cy='12' r='4' fill='white' />
  </svg>
)

const Logo = () => {
  return (
    <div className='flex flex-col gap-4 md:flex-row'>
      <div className='flex h-52 w-full items-center justify-center rounded-lg bg-white'>
        <LogoIcon className='text-black' width={48} height={48} />
      </div>
      <div className='flex h-52 w-full items-center justify-center rounded-lg bg-black'>
        <LogoIcon className='text-white' width={48} height={48} />
      </div>
    </div>
  )
}

export default Logo