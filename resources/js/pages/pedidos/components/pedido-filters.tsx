import { router } from '@inertiajs/react';
import { FileText, Filter, Package, Printer, Search, Store } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { PedidosIndexProps } from '@/types/pedidos';

type Filtros = PedidosIndexProps['filtros'];

interface PedidoFiltersProps {
    filtros: Filtros;
    estados: string[];
    totalRegistros: number;
}

export default function PedidoFilters({ filtros, estados, totalRegistros }: PedidoFiltersProps) {
    const [busqueda, setBusqueda] = useState(filtros.busqueda ?? '');
    const [fecha, setFecha] = useState(filtros.fecha ?? '');
    const [estadoSeleccionado, setEstadoSeleccionado] = useState(filtros.estado ?? '');
    const [perPage, setPerPage] = useState(filtros.per_page ?? '25');

    const aplicarFiltros = useCallback(
        (overrides: Partial<Filtros> = {}) => {
            router.get(
                route('pedidos.index'),
                {
                    busqueda: busqueda || undefined,
                    fecha: fecha || undefined,
                    estado: estadoSeleccionado || undefined,
                    per_page: perPage,
                    ...overrides,
                },
                { preserveScroll: true, preserveState: true },
            );
        },
        [busqueda, fecha, estadoSeleccionado, perPage],
    );

    const limpiarFiltros = () => {
        setBusqueda('');
        setFecha('');
        setEstadoSeleccionado('');
        setPerPage('25');
        router.get(route('pedidos.index'), {}, { preserveScroll: true });
    };

    return (
        <div className="space-y-3">
            {/* ── Top action bar ─────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-2">
                <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <span className="text-2xl">📋</span>
                    Todos los Cuadernos
                </h1>

                <button
                    onClick={() => aplicarFiltros()}
                    className="flex items-center gap-1.5 rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                >
                    <Filter className="h-3.5 w-3.5" />
                    Filtros
                </button>

                <button className="flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700">
                    <Printer className="h-3.5 w-3.5" />
                    PDF Recojos Tienda
                </button>

                <button className="flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                    <FileText className="h-3.5 w-3.5" />
                    Reporte
                </button>

                <button className="flex items-center gap-1.5 rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600">
                    <FileText className="h-3.5 w-3.5" />
                    Reporte Pedido
                </button>

                <button className="flex items-center gap-1.5 rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-600">
                    <Store className="h-3.5 w-3.5" />
                    Almacén
                </button>

                {/* Search bar */}
                <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar ID, Cliente, CI, Cel…"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                            className="w-60 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Package className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar solo por ID…"
                            className="w-44 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* ── Secondary filter bar ───────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Total badge */}
                <span className="rounded bg-blue-500 px-3 py-1 text-sm font-semibold text-white">
                    Total registros: {totalRegistros.toLocaleString('es-BO')}
                </span>

                {/* Date filter */}
                <div className="flex items-center gap-1.5">
                    <label className="text-sm font-medium text-gray-600">FILTRAR POR FECHA</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => {
                            setFecha(e.target.value);
                            aplicarFiltros({ fecha: e.target.value || undefined });
                        }}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {fecha && (
                        <button
                            onClick={() => {
                                setFecha('');
                                aplicarFiltros({ fecha: undefined });
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Status filter */}
                <select
                    value={estadoSeleccionado}
                    onChange={(e) => {
                        setEstadoSeleccionado(e.target.value);
                        aplicarFiltros({ estado: e.target.value || undefined });
                    }}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Todos los estados</option>
                    {estados.map((estado) => (
                        <option key={estado} value={estado}>
                            {estado}
                        </option>
                    ))}
                </select>

                {/* Per page */}
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    Mostrar
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(e.target.value);
                            aplicarFiltros({ per_page: e.target.value });
                        }}
                        className="rounded border border-gray-300 px-1 py-0.5 text-sm"
                    >
                        {['10', '25', '50', '100'].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    registros
                </div>

                {/* Clear filters */}
                {(busqueda || fecha || estadoSeleccionado) && (
                    <button onClick={limpiarFiltros} className="text-sm text-red-500 underline hover:text-red-700">
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
}

