export interface ExpenseCreateDto{
    amount:number;
    date:string;
    description:string | null;
    categoryId:string;
    paymentMethodId:string;
}

export interface ExpenseUpdateDto{
    amount:number;
    date:string;
    description:string | null;
    categoryId:string;
    paymentMethodId:string;
}

export interface ExpenseResponseDto{
    id:string;
    amount:number;
    date:string;
    description:string | null;
    categoryId:string;
    categoryName:string;
    paymentMethodId:string;
    paymentMethodName:string;
    createdAt:string;
}