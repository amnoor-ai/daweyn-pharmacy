import { Package } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProductAvatarProps = {
    src?: string | null;
    alt: string;
    className?: string;
};

export default function ProductAvatar({ src, alt, className }: ProductAvatarProps) {
    return (
        <Avatar className={`h-10 w-10 rounded-md border border-border ${className || ''}`}>
            {src ? (
                <AvatarImage src={src} alt={alt} className="object-cover" />
            ) : null}
            <AvatarFallback className="rounded-md bg-muted/30">
                <Package className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
        </Avatar>
    );
}
