// ─── Domain types for the Pedidos module ─────────────────────────────────────

export interface Cliente {
    id: number;
    nombre: string;
    ci: string;
    celular: string;
    avatar: string | null;
}

export interface Departamento {
    id: number;
    nombre: string;
}

export interface Provincia {
    id: number;
    nombre: string;
}

export interface Destino {
    id: number;
    id_departamento: number;
    id_provincia: number;
    estado: string;
    tipo_destino: string;
    departamento: Departamento | null;
    provincia: Provincia | null;
}

export interface Imagen {
    id: number;
    url: string;
}

export interface PedidoProductoImagen {
    id: number;
    id_pedido_producto: number;
    id_imagen_pedido: number;
}

export interface PedidoProducto {
    id: number;
    id_pedido: number;
    id_producto: number;
    cantidad: number;
    precio_venta: string;
    sucursal_origen_id: number;
    sucursal_destino_id: number;
    estado: string;
    imagenes_vinculadas: PedidoProductoImagen[];
}

export interface PedidoPago {
    id: number;
    id_movimiento_pago: number;
    id_imagen_pedido: number;
    monto_vinculado: string;
}

export interface ImagenPedido {
    id: number;
    id_pedido: number;
    id_imagen: number;
    tipo: string;
    cantidad: number;
    estado: string;
    imagen: Imagen | null;
    pagos: PedidoPago[];
    productos_vinculados: PedidoProductoImagen[];
}

export interface PedidoNota {
    id: number;
    id_pedido: number;
    id_user: number;
    cantidad: number;
}

export interface PedidoCatalogo {
    id: number;
    id_cliente: number;
    id_destino: number;
    estado_pedido: string;
    detalle: string | null;
    sucursal_recojo_id: number | null;
    created_at: string;
    updated_at: string;
    cliente: Cliente | null;
    destino: Destino | null;
    productos: PedidoProducto[];
    imagenes: ImagenPedido[];
    recibos: PedidoNota[];
}

// ─── External API resolved types ────────────────────────────────────────────

export interface ExternalProducto {
    id: number;
    nombre: string;
    codigo: string;
    precio: number;
}

export interface ExternalSucursal {
    id: number;
    nombre: string;
    ciudad: string;
    direccion: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

// ─── Page props ───────────────────────────────────────────────────────────────

export interface PedidosIndexProps {
    pedidos: Paginated<PedidoCatalogo>;
    productosResueltos: Record<number, ExternalProducto>;
    sucursalesResueltas: Record<number, ExternalSucursal>;
    estados: string[];
    filtros: {
        fecha?: string;
        busqueda?: string;
        estado?: string;
        sucursal_id?: string;
        per_page?: string;
    };
}

