import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import CuadernosTableRow from './cuadernos-table-row';
import type {
    CuadernoFilterType,
    ExternalProducto,
    ExternalSucursal,
    Paginated,
    PedidoCatalogo,
} from '@/types/pedidos';

interface CuadernosTableProps {
    pedidos: Paginated<PedidoCatalogo>;
    productosResueltos: Record<number, ExternalProducto>;
    sucursalesResueltas: Record<number, ExternalSucursal>;
    activeFilter: CuadernoFilterType;
    selectedIds: number[];
    onToggleSelectRow: (id: number) => void;
    onToggleSelectAll: (pageIds: number[]) => void;
    rowToggles: Record<
        number,
        { la_paz: boolean; enviado: boolean; p_listo: boolean; p_pendiente: boolean }
    >;
    onToggleField: (
        id: number,
        field: 'la_paz' | 'enviado' | 'p_listo' | 'p_pendiente'
    ) => void;
    onOpenAgregarProducto: (pedido: PedidoCatalogo, imagenId?: number) => void;
    onOpenVincularPago: (pedido: PedidoCatalogo, imagenId?: number) => void;
    onOpenGuia: (pedido: PedidoCatalogo) => void;
    onOpenWhatsApp: (pedido: PedidoCatalogo) => void;
    onOpenLightbox: (url: string, caption: string) => void;
    onOpenReservaManual: (pedido: PedidoCatalogo) => void;
}

export default function CuadernosTable({
    pedidos,
    productosResueltos,
    sucursalesResueltas,
    activeFilter,
    selectedIds,
    onToggleSelectRow,
    onToggleSelectAll,
    rowToggles,
    onToggleField,
    onOpenAgregarProducto,
    onOpenVincularPago,
    onOpenGuia,
    onOpenWhatsApp,
    onOpenLightbox,
    onOpenReservaManual,
}: CuadernosTableProps) {
    const { data, links, current_page, last_page, total, from, to } = pedidos;

    const isSelectableFilter =
        activeFilter === 'listos' || activeFilter === 'empemb' || activeFilter === 'repetidos';

    const pageIds = data.map((p) => p.id);
    const isAllSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    return (
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <Table className="w-full text-xs">
                    {/* ── Table Header with Gradient Styling ────────────────── */}
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:bg-purple-800 border-none text-white font-bold uppercase tracking-wider text-[11px]">
                            {isSelectableFilter && (
                                <TableHead className="text-center w-10 text-white p-2">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={() => onToggleSelectAll(pageIds)}
                                        className="border-white/60 data-[state=checked]:bg-white data-[state=checked]:text-purple-800"
                                    />
                                </TableHead>
                            )}
                            <TableHead className="text-center text-white w-12 p-2">#</TableHead>
                            <TableHead className="text-center text-white w-12 p-1 text-[10px] [writing-mode:vertical-rl] rotate-180 h-20">
                                La Paz
                            </TableHead>
                            <TableHead className="text-center text-white w-12 p-1 text-[10px] [writing-mode:vertical-rl] rotate-180 h-20">
                                Enviado
                            </TableHead>
                            <TableHead className="text-center text-white w-12 p-1 text-[10px] [writing-mode:vertical-rl] rotate-180 h-20">
                                P. Listo
                            </TableHead>
                            <TableHead className="text-center text-white w-12 p-1 text-[10px] [writing-mode:vertical-rl] rotate-180 h-20">
                                P. Pendiente
                            </TableHead>
                            <TableHead className="text-left text-white p-3 min-w-[210px]">
                                Información Personal
                            </TableHead>
                            <TableHead className="text-center text-white p-2 min-w-[130px]">
                                Depto / Prov
                            </TableHead>
                            <TableHead className="text-left text-white p-2 min-w-[260px]">
                                Productos Solicitados
                            </TableHead>
                            <TableHead className="text-center text-white p-2 min-w-[130px]">
                                Imágenes
                            </TableHead>
                            <TableHead className="text-center text-white p-2 w-28">
                                Estado
                            </TableHead>
                            <TableHead className="text-center text-white p-2 w-14">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* ── Table Body ────────────────────────────────────────── */}
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={isSelectableFilter ? 12 : 11}
                                    className="py-16 text-center text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Inbox className="size-10 text-muted-foreground/40" />
                                        <p className="text-sm font-semibold">
                                            No se encontraron pedidos con los filtros aplicados.
                                        </p>
                                        <span className="text-xs text-muted-foreground/80">
                                            Intente cambiar la fecha, los términos de búsqueda o la vista activa.
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((pedido) => (
                                <CuadernosTableRow
                                    key={pedido.id}
                                    pedido={pedido}
                                    productosResueltos={productosResueltos}
                                    sucursalesResueltas={sucursalesResueltas}
                                    activeFilter={activeFilter}
                                    isSelected={selectedIds.includes(pedido.id)}
                                    onToggleSelect={onToggleSelectRow}
                                    toggles={
                                        rowToggles[pedido.id] ?? {
                                            la_paz: false,
                                            enviado: false,
                                            p_listo: false,
                                            p_pendiente: false,
                                        }
                                    }
                                    onToggleField={onToggleField}
                                    onOpenAgregarProducto={onOpenAgregarProducto}
                                    onOpenVincularPago={onOpenVincularPago}
                                    onOpenGuia={onOpenGuia}
                                    onOpenWhatsApp={onOpenWhatsApp}
                                    onOpenLightbox={onOpenLightbox}
                                    onOpenReservaManual={onOpenReservaManual}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Pagination ──────────────────────────────────────────────── */}
            {last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t px-4 py-3 gap-3 bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                        Mostrando <span className="font-semibold text-foreground">{from}</span> a{' '}
                        <span className="font-semibold text-foreground">{to}</span> de{' '}
                        <span className="font-semibold text-foreground">{total.toLocaleString('es-BO')}</span> registros
                    </p>

                    <div className="flex items-center gap-1">
                        {links.map((link, index) => {
                            const isFirst = index === 0;
                            const isLast = index === links.length - 1;

                            if (isFirst || isLast) {
                                return (
                                    <Button
                                        key={index}
                                        asChild
                                        variant="outline"
                                        size="icon"
                                        disabled={!link.url}
                                        className="size-8 rounded-lg"
                                    >
                                        {link.url ? (
                                            <Link href={link.url} preserveScroll>
                                                {isFirst ? (
                                                    <ChevronLeft className="size-4" />
                                                ) : (
                                                    <ChevronRight className="size-4" />
                                                )}
                                            </Link>
                                        ) : (
                                            <span>
                                                {isFirst ? (
                                                    <ChevronLeft className="size-4" />
                                                ) : (
                                                    <ChevronRight className="size-4" />
                                                )}
                                            </span>
                                        )}
                                    </Button>
                                );
                            }

                            return (
                                <Button
                                    key={index}
                                    asChild
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-8 min-w-[32px] px-2 text-xs rounded-lg ${
                                        link.active ? 'bg-purple-600 hover:bg-purple-700 text-white font-bold' : ''
                                    }`}
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            );
                        })}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Página {current_page} de {last_page}
                    </p>
                </div>
            )}
        </div>
    );
}

