interface InventoryStatus {
    label: string;
    value: string;
}
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: InventoryStatus;
    category?: string;
    image?: string;
    rating?: number;

    device_id?:number,
    client_id?: number,
    device?: string,
    device_name?: string,
    do_channel?: number,
    model?: string,
    lat?: string,
    lon?: string,
    imei_no?: string,
    last_maintenance?: string
}