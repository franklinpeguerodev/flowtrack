export interface PaymentMethodCreateDto{
    name:string;
}

export interface PaymentMethodUpdateDto{
    name:string;
    isActive:boolean;
}

export interface PaymentMethodResponseDto{
    id:string;
    name:string;
    isActive:boolean;
    createdAt:string;
}