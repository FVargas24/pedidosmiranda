import { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, UploadCloud, RotateCcw, Save, CheckCircle2 } from 'lucide-react';
import type { PedidoCatalogo } from '@/types/pedidos';

interface GestionGuiaDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cuaderno: PedidoCatalogo | null;
    onSaveGuia?: (data: { cuadernoId: number; file?: File; dataUrl?: string }) => void;
}

export default function GestionGuiaDialog({
    isOpen,
    onClose,
    cuaderno,
    onSaveGuia,
}: GestionGuiaDialogProps) {
    const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!cuaderno) return;
        if (onSaveGuia) {
            onSaveGuia({
                cuadernoId: cuaderno.id,
                file: selectedFile ?? undefined,
                dataUrl: capturedPhoto ?? undefined,
            });
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                        <Camera className="size-4 text-emerald-600" />
                        Gestión de Guía de Envío — Pedido #{cuaderno?.id}
                    </DialogTitle>
                </DialogHeader>

                {/* ── Tabs ────────────────────────────────────────────────── */}
                <div className="flex rounded-xl bg-muted p-1 gap-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'upload'
                                ? 'bg-background shadow-xs text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <UploadCloud className="size-3.5" /> Subir Imagen
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('camera')}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            activeTab === 'camera'
                                ? 'bg-background shadow-xs text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Camera className="size-3.5" /> Sacar Foto
                    </button>
                </div>

                {/* ── Tab Content: Upload ──────────────────────────────────── */}
                {activeTab === 'upload' && (
                    <div className="space-y-3 py-2">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/20 transition-all"
                        >
                            <UploadCloud className="size-10 text-muted-foreground mb-2" />
                            <p className="text-sm font-semibold text-foreground">
                                {selectedFile ? selectedFile.name : 'Arrastre la guía aquí o haga clic'}
                            </p>
                            <span className="text-xs text-muted-foreground">
                                Formatos soportados: JPG, PNG, WEBP
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {filePreview && (
                            <div className="rounded-xl border p-2 bg-background flex flex-col items-center">
                                <span className="text-[11px] font-semibold text-muted-foreground mb-1">
                                    Vista previa de la guía seleccionada:
                                </span>
                                <img
                                    src={filePreview}
                                    alt="Vista previa"
                                    className="h-44 w-auto rounded-lg object-contain border"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* ── Tab Content: Camera ─────────────────────────────────── */}
                {activeTab === 'camera' && (
                    <div className="space-y-3 py-2 text-center">
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-950 p-6 text-white min-h-[220px]">
                            <Camera className="size-12 text-zinc-400 mb-2 animate-pulse" />
                            <p className="text-xs text-zinc-400">
                                Cámara lista para captura directa de comprobante o guía.
                            </p>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setCapturedPhoto('https://picsum.photos/seed/guia/600/400')}
                                className="mt-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4"
                            >
                                <Camera className="mr-1.5 size-3.5" />
                                Capturar Foto
                            </Button>
                        </div>

                        {capturedPhoto && (
                            <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-semibold">
                                <CheckCircle2 className="size-4" /> Foto lista para guardar
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="border-t pt-3 flex items-center justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        disabled={!selectedFile && !capturedPhoto}
                        onClick={handleSave}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                    >
                        <Save className="mr-1.5 size-3.5" />
                        Guardar Guía
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

