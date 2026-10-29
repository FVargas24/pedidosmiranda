import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

interface ImageLightboxDialogProps {
    isOpen: boolean;
    onClose: () => void;
    src: string;
    caption?: string;
}

export default function ImageLightboxDialog({
    isOpen,
    onClose,
    src,
    caption,
}: ImageLightboxDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl p-3 rounded-2xl bg-black/90 border-zinc-800 text-white">
                <DialogHeader className="p-2 border-b border-zinc-800">
                    <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                        <Eye className="size-4 text-purple-400" />
                        {caption || 'Visor de Comprobante / Fotografía'}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-2">
                    {src ? (
                        <img
                            src={src}
                            alt={caption || 'Vista previa'}
                            className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                        />
                    ) : (
                        <div className="py-20 text-center text-zinc-400 text-sm">
                            No se ha cargado ninguna imagen.
                        </div>
                    )}
                    {caption && (
                        <p className="mt-3 text-center text-xs font-medium text-zinc-300 uppercase tracking-wider">
                            {caption}
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

