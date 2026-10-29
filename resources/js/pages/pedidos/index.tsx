import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PedidosIndexProps } from '@/types/pedidos';
import PedidoFilters from './components/pedido-filters';
import PedidoRow from './components/pedido-row';

const COLUMN_HEADERS = ['#', 'LA PAZ', 'ENVIADO', 'P. LISTO', 'P. PENDIENTE', 'INFORMACIÓN PERSONAL', 'DEPTO/PROV', 'IMÁGENES', 'ESTADO', 'ACCIONES'] as const;

export default function PedidosIndex({ pedidos, productosResueltos, sucursalesResueltas, estados, filtros }: PedidosIndexProps) {
    const { data, links, current_page, last_page, total, from, to } = pedidos;

    return (
        <>
            <Head title="Todos los Cuadernos" />

            <div className="flex h-full flex-col gap-4 p-4">
                {/* ── Filters ──────────────────────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <PedidoFilters filtros={filtros} estados={estados} totalRegistros={total} />
                </div>

                {/* ── Table ────────────────────────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-purple-700 text-white">
                                    {COLUMN_HEADERS.map((header) => (
                                        <th
                                            key={header}
                                            className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wide"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={COLUMN_HEADERS.length}
                                            className="py-16 text-center text-gray-400"
                                        >
                                            No se encontraron pedidos con los filtros aplicados.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((pedido) => (
                                        <PedidoRow
                                            key={pedido.id}
                                            pedido={pedido}
                                            productosResueltos={productosResueltos}
                                            sucursalesResueltas={sucursalesResueltas}
                                            estados={estados}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ───────────────────────────────────────── */}
                    {last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-500">
                                Mostrando <span className="font-medium">{from}</span>–<span className="font-medium">{to}</span>{' '}
                                de <span className="font-medium">{total.toLocaleString('es-BO')}</span> registros
                            </p>

                            <div className="flex items-center gap-1">
                                {links.map((link, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === links.length - 1;

                                    if (isFirst || isLast) {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url ?? '#'}
                                                preserveScroll
                                                className={`flex h-8 w-8 items-center justify-center rounded border text-sm ${
                                                    link.url
                                                        ? 'border-gray-300 hover:bg-gray-100'
                                                        : 'cursor-not-allowed border-gray-200 text-gray-300'
                                                }`}
                                            >
                                                {isFirst ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </Link>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url ?? '#'}
                                            preserveScroll
                                            className={`flex h-8 min-w-[32px] items-center justify-center rounded border px-2 text-sm ${
                                                link.active
                                                    ? 'border-purple-600 bg-purple-600 font-semibold text-white'
                                                    : link.url
                                                      ? 'border-gray-300 hover:bg-gray-100'
                                                      : 'cursor-not-allowed border-gray-200 text-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>

                            <p className="text-sm text-gray-500">
                                Página {current_page} de {last_page}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

PedidosIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Todos los Cuadernos', href: '/pedidos' },
    ],
};

