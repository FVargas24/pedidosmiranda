import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { PedidosIndexProps, PedidoCatalogo } from '@/types/pedidos';

// Custom Hook
import { useCuadernosTable } from './hooks/use-cuadernos-table';

// Modular Components
import CuadernosFilterHeader from './components/cuadernos-filter-header';
import CuadernosDashboardCards from './components/cuadernos-dashboard-cards';
import CuadernosToolbar from './components/cuadernos-toolbar';
import CuadernosTable from './components/cuadernos-table';

// Modals
import FiltroDepartamentosDialog from './components/modals/filtro-departamentos-dialog';
import AgregarProductoDialog from './components/modals/agregar-producto-dialog';
import VincularPagoDialog from './components/modals/vincular-pago-dialog';
import GestionGuiaDialog from './components/modals/gestion-guia-dialog';
import WhatsAppDialog from './components/modals/whatsapp-dialog';
import ImageLightboxDialog from './components/modals/image-lightbox-dialog';
import ReservaManualDialog from './components/modals/reserva-manual-dialog';

const BREADCRUMBS: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Cuadernos / Pedidos', href: '/pedidos' },
];

export default function PedidosIndex({
    pedidos,
    productosResueltos,
    sucursalesResueltas,
    estados,
    filtros,
}: PedidosIndexProps) {
    const {
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
        selectedIds,
        toggleSelectRow,
        toggleSelectAll,
        clearSelection,
        rowToggles,
        handleToggleField,
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
    } = useCuadernosTable('todos');

    return (
        <AppLayout breadcrumbs={BREADCRUMBS}>
            <Head title={`${currentFilterInfo.title} — Pedidos Miranda`} />

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-full overflow-hidden">
                {/* ── 1. Contextual Filter Header ─────────────────────────── */}
                <CuadernosFilterHeader
                    filterInfo={currentFilterInfo}
                    search={search}
                    onSearchChange={setSearch}
                    searchId={searchId}
                    onSearchIdChange={setSearchId}
                    selectedDeptosCount={selectedDeptos.length}
                    onOpenFiltrosDeptos={() => setIsFiltroDeptosOpen(true)}
                    onReporteRecojos={() => window.alert('Generando PDF Recojos Tienda...')}
                    onReporteFiltrado={() => window.alert('Generando Reporte General...')}
                    onReportePedido={() => window.alert('Generando Reporte Pedidos...')}
                    onOpenAlmacen={() => window.alert('Abriendo consulta de stock en Almacén...')}
                />

                {/* ── 2. Action Cards Banner (based on active filter) ─────── */}
                <CuadernosDashboardCards
                    activeFilter={activeFilter}
                    selectedCount={selectedIds.length}
                    onConfirmarBCP={() => window.alert('Confirmar Resumen BCP')}
                    onVerPdfsAnteriores={() => window.alert('Ver PDFs Anteriores')}
                    onResumenRespaldo={() => window.alert('Resumen BCP Respaldo')}
                    onNotaVenta={() => window.alert('Generar Nota de Venta')}
                    onClearSelection={clearSelection}
                    onMarkAsSent={() => window.alert(`Marcar ${selectedIds.length} pedidos como Enviados`)}
                    onPrintAllAndPack={() => window.alert('Imprimir todas las fichas y empacar')}
                    onReporteFichas={() => window.alert('Generar Reporte Fichas Pedido')}
                    onDescargarReporteSumarizado={() => window.alert('Descargar Reporte Sumarizado')}
                    onPendientesToListos={() => window.alert('Pasar todos los pendientes a listos')}
                    onJuntarPedidos={() => window.alert(`Juntar ${selectedIds.length} pedidos seleccionados`)}
                />

                {/* ── 3. Sub-header / Toolbar ─────────────────────────────── */}
                <CuadernosToolbar
                    totalRegistros={pedidos.total}
                    fechaFiltro={fechaFiltro}
                    onFechaFiltroChange={setFechaFiltro}
                    onClearFechaFiltro={() => setFechaFiltro('')}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {/* ── 4. Main Data Table ──────────────────────────────────── */}
                <CuadernosTable
                    pedidos={pedidos}
                    productosResueltos={productosResueltos}
                    sucursalesResueltas={sucursalesResueltas}
                    activeFilter={activeFilter}
                    selectedIds={selectedIds}
                    onToggleSelectRow={toggleSelectRow}
                    onToggleSelectAll={toggleSelectAll}
                    rowToggles={rowToggles}
                    onToggleField={handleToggleField}
                    onOpenAgregarProducto={(cuaderno, imagenId) =>
                        setProductoModal({ isOpen: true, cuaderno, imagenId })
                    }
                    onOpenVincularPago={(cuaderno, imagenId) =>
                        setVincularPagoModal({ isOpen: true, cuaderno, imagenId })
                    }
                    onOpenGuia={(cuaderno) => setGuiaModal({ isOpen: true, cuaderno })}
                    onOpenWhatsApp={(cuaderno) => setWhatsAppModal({ isOpen: true, cuaderno })}
                    onOpenLightbox={(url, caption) => setLightbox({ isOpen: true, url, caption })}
                    onOpenReservaManual={(cuaderno) => setReservaModal({ isOpen: true, cuaderno })}
                />
            </div>

            {/* ── 5. Componentized Modal Dialogs ──────────────────────────── */}
            <FiltroDepartamentosDialog
                isOpen={isFiltroDeptosOpen}
                onClose={() => setIsFiltroDeptosOpen(false)}
                selectedDeptos={selectedDeptos}
                onToggleDepto={toggleDepto}
                onClearDeptos={clearDeptos}
            />

            <AgregarProductoDialog
                isOpen={productoModal.isOpen}
                onClose={() => setProductoModal({ isOpen: false, cuaderno: null })}
                cuaderno={productoModal.cuaderno}
                imagenId={productoModal.imagenId}
                productosResueltos={productosResueltos}
                onSave={(data) => {
                    console.log('Guardar producto:', data);
                    window.alert(`Producto guardado para el cuaderno #${data.cuaderno_id}`);
                }}
            />

            <VincularPagoDialog
                isOpen={vincularPagoModal.isOpen}
                onClose={() => setVincularPagoModal({ isOpen: false, cuaderno: null })}
                cuaderno={vincularPagoModal.cuaderno}
                imagenId={vincularPagoModal.imagenId}
                onVincular={(data) => {
                    console.log('Vincular pagos:', data);
                    window.alert(`Pagos vinculados para el cuaderno #${data.cuadernoId}`);
                }}
            />

            <GestionGuiaDialog
                isOpen={guiaModal.isOpen}
                onClose={() => setGuiaModal({ isOpen: false, cuaderno: null })}
                cuaderno={guiaModal.cuaderno}
                onSaveGuia={(data) => {
                    console.log('Guardar guía:', data);
                    window.alert(`Guía guardada para el cuaderno #${data.cuadernoId}`);
                }}
            />

            <WhatsAppDialog
                isOpen={whatsAppModal.isOpen}
                onClose={() => setWhatsAppModal({ isOpen: false, cuaderno: null })}
                cuaderno={whatsAppModal.cuaderno}
                onSendMessage={(type, text) => {
                    console.log('Mensaje enviado:', type, text);
                }}
            />

            <ImageLightboxDialog
                isOpen={lightbox.isOpen}
                onClose={() => setLightbox({ isOpen: false, url: '', caption: '' })}
                src={lightbox.url}
                caption={lightbox.caption}
            />

            <ReservaManualDialog
                isOpen={reservaModal.isOpen}
                onClose={() => setReservaModal({ isOpen: false, cuaderno: null })}
                cuaderno={reservaModal.cuaderno}
                productosResueltos={productosResueltos}
                sucursalesResueltas={sucursalesResueltas}
                onConfirmReserva={(prodId, sucursales) => {
                    console.log('Reserva confirmada:', prodId, sucursales);
                    window.alert('Reserva manual efectuada correctamente.');
                }}
            />
        </AppLayout>
    );
}
