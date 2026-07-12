import { AlertTriangle, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type ErrorType = 'stock' | 'expiry' | 'generic';

interface PosErrorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    errorType: ErrorType;
    message: string;
}

const CONFIG: Record<ErrorType, { icon: React.ComponentType<{ className?: string }>, iconBg: string, iconColor: string, title: string }> = {
    stock: {
        icon: PackageX,
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        title: 'Insufficient Stock',
    },
    expiry: {
        icon: AlertTriangle,
        iconBg: 'bg-destructive/10',
        iconColor: 'text-destructive',
        title: 'Expired Product',
    },
    generic: {
        icon: AlertTriangle,
        iconBg: 'bg-destructive/10',
        iconColor: 'text-destructive',
        title: 'Sale Failed',
    },
};

export default function PosErrorDialog({ open, onOpenChange, errorType, message }: PosErrorDialogProps) {
    const { icon: Icon, iconBg, iconColor, title } = CONFIG[errorType];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-3 text-center sm:text-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg} ${iconColor}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-lg font-bold text-foreground">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            {message}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-4 sm:justify-center">
                    <Button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto"
                    >
                        Back to Cart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
