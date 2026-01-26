export interface CartItem {
    name: string;
    quantity: number;
    price: number;
    image?: string;
    imageSize?: number;
    originalPrice?: number;
    size?: string;
    shopUrl?: string;
    shopLinkText?: string;
}
export interface CartActions {
    checkout?: {
        text?: string;
        action: string;
    };
    clear?: {
        text?: string;
        action: string;
    };
}
export interface CartTemplateOptions {
    items: CartItem[];
    actions?: CartActions;
    currencySymbol?: string;
    emptyMessage?: string;
    layout?: 'vertical' | 'horizontal';
    showTotal?: boolean;
}
/**
 * 购物车模板函数
 * @param options 购物车配置选项
 * @returns 购物车 HTML 字符串
 */
export declare const cart_template: (options: CartTemplateOptions) => string;
