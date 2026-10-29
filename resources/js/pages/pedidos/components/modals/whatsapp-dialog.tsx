import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';
import type { PedidoCatalogo } from '@/types/pedidos';

interface WhatsAppDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cuaderno: PedidoCatalogo | null;
    onSendMessage?: (type: 'listo' | 'falta' | 'nohay', text: string) => void;
}

export default function WhatsAppDialog({
    isOpen,
    onClose,
    cuaderno,
    onSendMessage,
}: WhatsAppDialogProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const clienteNombre = cuaderno?.cliente?.nombre ?? 'Estimado cliente';
    const telefono = cuaderno?.cliente?.celular ?? '';
    const pedidoId = cuaderno?.id ?? 0;

    const MENSAJES = [
        {
            type: 'listo' as const,
            title: 'Pedido Listo para Entrega',
            color: 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
            btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
            text: `¡Hola ${clienteNombre}! Le informamos desde Pedidos Miranda que su pedido #${pedidoId} de cuadernos ya se encuentra LISTO para entrega/recojo. Puede pasar por sucursal o coordinar con nosotros. ¡Muchas gracias!`,
        },
        {
            type: 'falta' as const,
            title: 'Faltan Productos / Coordinación',
            color: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
            btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
            text: `Estimado(a) ${clienteNombre}, nos comunicamos de Pedidos Miranda respecto a su pedido #${pedidoId}. Algunos productos de su solicitud están siendo transferidos de almacén central. Le avisaremos en breve cuando esté 100% completo.`,
        },
        {
            type: 'nohay' as const,
            title: 'Sin Stock / Cancelación',
            color: 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
            btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
            text: `Estimado(a) ${clienteNombre}, lamentamos informarle que los modelos solicitados para el pedido #${pedidoId} se encuentran agotados por el momento. Por favor contáctenos para brindarle alternativas o gestionar su devolución.`,
        },
    ];

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSend = (type: 'listo' | 'falta' | 'nohay', text: string) => {
        if (onSendMessage) {
            onSendMessage(type, text);
        }
        // In preview mode: open WhatsApp Web link if phone provided
        if (telefono) {
            const cleanPhone = telefono.replace(/\D/g, '');
            const url = `https://wa.me/591${cleanPhone}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl rounded-2xl">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                        <MessageSquare className="size-4 text-emerald-600" />
                        Notificar por WhatsApp al Cliente — Celular: {telefono ? `+591 ${telefono}` : 'Sin registrar'}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
                    {MENSAJES.map((item, idx) => (
                        <div
                            key={item.type}
                            className={`flex flex-col justify-between rounded-xl border p-3 shadow-xs ${item.color}`}
                        >
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wide block">
                                    {item.title}
                                </span>
                                <Textarea
                                    readOnly
                                    value={item.text}
                                    rows={6}
                                    className="resize-none text-xs bg-background/80 border-muted font-normal text-foreground leading-relaxed"
                                />
                            </div>

                            <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-muted/50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(item.text, idx)}
                                    className="h-8 flex-1 text-xs"
                                >
                                    {copiedIndex === idx ? (
                                        <>
                                            <Check className="mr-1 size-3 text-emerald-600" /> Copiado
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-1 size-3" /> Copiar
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleSend(item.type, item.text)}
                                    className={`h-8 flex-1 text-xs font-semibold ${item.btnColor}`}
                                >
                                    <ExternalLink className="mr-1 size-3" /> Enviar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="border-t pt-3 flex items-center justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

