type Props = {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

const Avatar = ({ name, size = 'sm' }: Props) => {
  const initial = name.charAt(0).toUpperCase()
  return (
    <div className={`${sizeMap[size]} rounded-full bg-[#1a1a1a] border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] font-medium flex-shrink-0`}>
      {initial}
    </div>
  )
}

export default Avatar
