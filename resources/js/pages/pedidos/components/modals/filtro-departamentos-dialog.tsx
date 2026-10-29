import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';
import { DEPARTAMENTOS_BOLIVIA } from '../../hooks/use-cuadernos-table';

interface FiltroDepartamentosDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDeptos: string[];
    onToggleDepto: (depto: string) => void;
    onClearDeptos: () => void;
}

export default function FiltroDepartamentosDialog({
    isOpen,
    onClose,
    selectedDeptos,
    onToggleDepto,
    onClearDeptos,
}: FiltroDepartamentosDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                        <Filter className="size-4 text-purple-600" />
                        Filtrar por Departamentos
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-2.5 py-3">
                    {DEPARTAMENTOS_BOLIVIA.map((depto) => {
                        const isChecked = selectedDeptos.includes(depto);
                        return (
                            <label
                                key={depto}
                                htmlFor={`depto-${depto}`}
                                className={`flex items-center justify-between rounded-xl border p-2.5 transition-all cursor-pointer ${
                                    isChecked
                                        ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 shadow-xs'
                                        : 'hover:bg-muted/50 border-muted'
                                }`}
                            >
                                <span className="text-sm font-semibold text-foreground">{depto}</span>
                                <Checkbox
                                    id={`depto-${depto}`}
                                    checked={isChecked}
                                    onCheckedChange={() => onToggleDepto(depto)}
                                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                            </label>
                        );
                    })}
                </div>

                <DialogFooter className="flex items-center justify-between border-t pt-3 sm:justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClearDeptos}
                        className="text-xs text-muted-foreground hover:text-destructive"
                    >
                        Limpiar Selección
                    </Button>
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold px-4"
                    >
                        Aplicar Filtros ({selectedDeptos.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

