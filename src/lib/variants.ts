import { cva } from "class-variance-authority";

export const layoutVariants = cva(
  'transition-colors duration-500',
  {
    variants: {
      mode: {
        relax: 'bg-emerald-50 text-relax',
        focus: 'bg-orange-50 text-focus',
        sleep: 'bg-violet-50 text-sleep',
      },
    },
  }
);

export const solidBgVariants = cva(
  'transition-colors duration-500',
  {
    variants: {
      mode: {
        relax: 'bg-relax',
        focus: 'bg-focus',
        sleep: 'bg-sleep',
      },
    },
  }
);

export const indicatorVariants = cva(
  'transition-all duration-500 ease-in-out',
  {
    variants: {
      mode: {
        relax: 'translate-x-0',
        focus: 'translate-x-full',
        sleep: 'translate-x-[200%]',
      },
    },
  }
);