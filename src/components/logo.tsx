import { cn } from '@/lib/utils';

const CustomLogoIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 18V6H8V16H18V18H6Z"
      fill="currentColor"
    />
    <path
      d="M12 12L18 6V9L15 12L18 15V18L12 12Z"
      fill="currentColor"
    />
  </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-bold',
        className
      )}
    >
      <div className="bg-primary text-primary-foreground p-2 rounded-md">
        <CustomLogoIcon className="h-5 w-5" />
      </div>
      <span className="text-xl">LKRAMOS</span>
    </div>
  );
}
