import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Name of the item being deleted — shown in the dialog body */
    itemName: string;
    /** Called when the user clicks the red "Delete" button */
    onConfirm: () => void;
    /** Optional override for the description line */
    description?: string;
};

/**
 * Reusable delete-confirmation dialog.
 *
 * Usage:
 *   const [target, setTarget] = useState<Item | null>(null);
 *   <DeleteConfirmDialog
 *     open={!!target}
 *     onOpenChange={(open) => !open && setTarget(null)}
 *     itemName={target?.name ?? ''}
 *     onConfirm={() => { router.delete(...); setTarget(null); }}
 *   />
 */
export default function DeleteConfirmDialog({
    open,
    onOpenChange,
    itemName,
    onConfirm,
    description,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-surface border-border-soft">
                <DialogHeader>
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-danger-bg">
                        <Trash2 className="h-5 w-5 text-danger-fg" />
                    </div>
                    <DialogTitle className="text-center text-base text-text-primary">
                        Delete &ldquo;{itemName}&rdquo;?
                    </DialogTitle>
                    <DialogDescription className="text-center text-text-secondary">
                        {description ?? 'This action cannot be undone. The record will be permanently removed.'}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-2 sm:flex-row sm:justify-center gap-2">
                    <Button
                        variant="outline"
                        className="border-border-soft text-text-primary hover:bg-canvas"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                        className="bg-danger-fg text-white hover:bg-danger-fg/90 transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
