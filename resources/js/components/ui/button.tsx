import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        
        return (
            <Comp
                className={cn(
                    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300 disabled:pointer-events-none disabled:opacity-50',
                    {
                        'bg-[#c0942f] text-white shadow hover:bg-amber-600': variant === 'default',
                        'bg-red-600 text-white shadow-sm hover:bg-red-700': variant === 'destructive',
                        'border border-amber-300 bg-transparent text-amber-800 shadow-sm hover:bg-amber-50 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-900/30': variant === 'outline',
                        'bg-amber-100 text-amber-800 shadow-sm hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:hover:bg-amber-900/50': variant === 'secondary',
                        'hover:bg-amber-50 hover:text-amber-900 dark:hover:bg-amber-900/30 dark:hover:text-amber-100': variant === 'ghost',
                        'text-amber-700 underline-offset-4 hover:underline dark:text-amber-400': variant === 'link',
                    },
                    {
                        'h-9 px-4 py-2': size === 'default',
                        'h-8 rounded-md px-3 text-xs': size === 'sm',
                        'h-10 rounded-md px-8': size === 'lg',
                        'h-9 w-9': size === 'icon',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
