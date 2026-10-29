import { useState, useMemo, useCallback } from 'react';
import type { CuadernoFilterType, PedidoCatalogo } from '@/types/pedidos';

export interface FilterInfo {
    id: CuadernoFilterType;
    title: string;
    description: string;
    badgeClass: string;
    bgClass: string;
    borderClass: string;
    color: string;
}

export const FILTER_INFOS: Record<CuadernoFilterType, FilterInfo> = {
    todos: {
        id: 'todos',
        title: 'Todos los Cuadernos',
        description: 'Visualización global de todos los registros',
        badgeClass: 'bg-slate-700 text-white',
        bgClass: 'bg-slate-50 dark:bg-slate-900/40',
        borderClass: 'border-l-4 border-l-slate-600',
        color: '#475569',
    },
    la_paz: {
        id: 'la_paz',
        title: 'Cuadernos - La Paz',
        description: 'Pedidos destinados a la sede de La Paz y El Alto',
        badgeClass: 'bg-cyan-600 text-white',
        bgClass: 'bg-cyan-50 dark:bg-cyan-950/30',
        borderClass: 'border-l-4 border-l-cyan-500',
        color: '#06b6d4',
    },
    enviados: {
        id: 'enviados',
        title: 'Cuadernos - Enviados',
        description: 'Despachados a courier o transporte interdepartamental',
        badgeClass: 'bg-emerald-600 text-white',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
        borderClass: 'border-l-4 border-l-emerald-500',
        color: '#10b981',
    },
    listos: {
        id: 'listos',
        title: 'Cuadernos - Listos para Enviar',
        description: 'Armados y verificados, preparados para confirmación y despacho',
        badgeClass: 'bg-amber-500 text-neutral-900 font-semibold',
        bgClass: 'bg-amber-50 dark:bg-amber-950/30',
        borderClass: 'border-l-4 border-l-amber-500',
        color: '#f59e0b',
    },
    pendientes: {
        id: 'pendientes',
        title: 'Cuadernos - Pedidos Pendientes',
        description: 'Pedidos nuevos en espera de revisión o armado',
        badgeClass: 'bg-rose-600 text-white',
        bgClass: 'bg-rose-50 dark:bg-rose-950/30',
        borderClass: 'border-l-4 border-l-rose-500',
        color: '#e11d48',
    },
    recojo: {
        id: 'recojo',
        title: 'Cuadernos - Estado RECOJO',
        description: 'Pendientes de retiro personal en sucursales autorizadas',
        badgeClass: 'bg-amber-600 text-white',
        bgClass: 'bg-amber-50/80 dark:bg-amber-950/20',
        borderClass: 'border-l-4 border-l-amber-600',
        color: '#d97706',
    },
    liquidacion: {
        id: 'liquidacion',
        title: 'Cuadernos de LIQUIDACIONES',
        description: 'Control de saldo, cobros y liquidación de envíos',
        badgeClass: 'bg-orange-600 text-white',
        bgClass: 'bg-orange-50 dark:bg-orange-950/30',
        borderClass: 'border-l-4 border-l-orange-500',
        color: '#ea580c',
    },
    imprimiendo: {
        id: 'imprimiendo',
        title: 'Cuaderno de Pedidos Registrados / Imprimiendo',
        description: 'Generación e impresión masiva de fichas de empaque',
        badgeClass: 'bg-blue-600 text-white',
        bgClass: 'bg-blue-50 dark:bg-blue-950/30',
        borderClass: 'border-l-4 border-l-blue-500',
        color: '#2563eb',
    },
    empemb: {
        id: 'empemb',
        title: 'Cuadernos - Empaquetado y Embolsado',
        description: 'Control de embalaje final previo a la salida',
        badgeClass: 'bg-zinc-800 text-white',
        bgClass: 'bg-zinc-100 dark:bg-zinc-900',
        borderClass: 'border-l-4 border-l-zinc-800',
        color: '#27272a',
    },
    repetidos: {
        id: 'repetidos',
        title: 'Pedidos con Celular Repetido (Sin Confirmar)',
        description: 'Clientes con múltiples pedidos activos para unificar',
        badgeClass: 'bg-purple-600 text-white',
        bgClass: 'bg-purple-50 dark:bg-purple-950/30',
        borderClass: 'border-l-4 border-l-purple-500',
        color: '#9333ea',
    },
};

export const DEPARTAMENTOS_BOLIVIA = [
    'La Paz',
    'Santa Cruz',
    'Cochabamba',
    'Oruro',
    'Potosí',
    'Chuquisaca',
    'Tarija',
    'Beni',
    'Pando',
] as const;

export function useCuadernosTable(initialFilter: CuadernoFilterType = 'todos') {
    const [activeFilter, setActiveFilter] = useState<CuadernoFilterType>(initialFilter);
    const [search, setSearch] = useState('');
    const [searchId, setSearchId] = useState('');
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [selectedDeptos, setSelectedDeptos] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Quick toggle switches state for each row
    const [rowToggles, setRowToggles] = useState<
        Record<number, { la_paz: boolean; enviado: boolean; p_listo: boolean; p_pendiente: boolean }>
    >({});

    // Dialogs state
    const [isFiltroDeptosOpen, setIsFiltroDeptosOpen] = useState(false);
    const [productoModal, setProductoModal] = useState<{
        isOpen: boolean;
        cuaderno: PedidoCatalogo | null;
        imagenId?: number | null;
    }>({ isOpen: false, cuaderno: null });

    const [vincularPagoModal, setVincularPagoModal] = useState<{
        isOpen: boolean;
        cuaderno: PedidoCatalogo | null;
        imagenId?: number | null;
    }>({ isOpen: false, cuaderno: null });

    const [guiaModal, setGuiaModal] = useState<{
        isOpen: boolean;
        cuaderno: PedidoCatalogo | null;
    }>({ isOpen: false, cuaderno: null });

    const [whatsAppModal, setWhatsAppModal] = useState<{
        isOpen: boolean;
        cuaderno: PedidoCatalogo | null;
    }>({ isOpen: false, cuaderno: null });

    const [lightbox, setLightbox] = useState<{
        isOpen: boolean;
        url: string;
        caption: string;
    }>({ isOpen: false, url: '', caption: '' });

    const [reservaModal, setReservaModal] = useState<{
        isOpen: boolean;
        cuaderno: PedidoCatalogo | null;
    }>({ isOpen: false, cuaderno: null });

    // Toggle row checkboxes (La Paz, Enviado, P. Listo, P. Pendiente)
    const handleToggleField = useCallback((id: number, field: 'la_paz' | 'enviado' | 'p_listo' | 'p_pendiente') => {
        setRowToggles((prev) => {
            const current = prev[id] ?? {
                la_paz: false,
                enviado: false,
                p_listo: false,
                p_pendiente: false,
            };
            return {
                ...prev,
                [id]: {
                    ...current,
                    [field]: !current[field],
                },
            };
        });
    }, []);

    // Selection handlers
    const toggleSelectRow = useCallback((id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    }, []);

    const toggleSelectAll = useCallback((pageIds: number[]) => {
        setSelectedIds((prev) => {
            const allSelected = pageIds.every((id) => prev.includes(id));
            if (allSelected) {
                return prev.filter((id) => !pageIds.includes(id));
            }
            return Array.from(new Set([...prev, ...pageIds]));
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    // Department filter handlers
    const toggleDepto = useCallback((depto: string) => {
        setSelectedDeptos((prev) =>
            prev.includes(depto) ? prev.filter((d) => d !== depto) : [...prev, depto]
        );
    }, []);

    const clearDeptos = useCallback(() => {
        setSelectedDeptos([]);
    }, []);

    const currentFilterInfo = useMemo(() => {
        return FILTER_INFOS[activeFilter] ?? FILTER_INFOS.todos;
    }, [activeFilter]);

    return {
        // Filters & Search
        activeFilter,
        setActiveFilter,
        currentFilterInfo,
        search,
        setSearch,
        searchId,
        setSearchId,
        fechaFiltro,
        setFechaFiltro,
        selectedDeptos,
        toggleDepto,
        clearDeptos,

        // Selection
        selectedIds,
        toggleSelectRow,
        toggleSelectAll,
        clearSelection,

        // Toggles
        rowToggles,
        handleToggleField,

        // Modals
        isFiltroDeptosOpen,
        setIsFiltroDeptosOpen,
        productoModal,
        setProductoModal,
        vincularPagoModal,
        setVincularPagoModal,
        guiaModal,
        setGuiaModal,
        whatsAppModal,
        setWhatsAppModal,
        lightbox,
        setLightbox,
        reservaModal,
        setReservaModal,
    };
}

