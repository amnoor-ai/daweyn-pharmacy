import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            richColors
            className="toaster group"
            position="bottom-right"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--success-bg': 'oklch(0.9 0.09 155)',
                    '--success-text': 'oklch(0.3 0.09 155)',
                    '--success-border': 'oklch(0.9 0.12 155)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
