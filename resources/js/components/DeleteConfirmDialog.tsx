import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    itemName: string;
    processing?: boolean;
}

export default function DeleteConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Confirm Deletion',
    itemName,
    processing = false,
}: DeleteConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-3 text-center sm:text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-bg text-danger-fg">
                        <Trash2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-lg font-bold text-text-primary">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-text-secondary">
                            Are you sure you want to delete <span className="font-semibold text-text-primary">"{itemName}"</span>? This action cannot be undone.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:flex-row sm:justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing}
                        className="w-full bg-danger-fg text-white hover:bg-danger-fg/90 sm:w-auto gap-2 transition-all duration-200 hover:-translate-y-0.5"
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
