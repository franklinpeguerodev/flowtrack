export interface CategoryCreateDto {
  name: string;
}


export interface CategoryUpdateDto {
  name: string;
  isActive:boolean;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  isActive: boolean;
  createdAt:string;
}