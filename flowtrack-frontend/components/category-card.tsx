"use client";

import { Trash2, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryResponseDto, CategoryUpdateDto } from "@/types/category";
import { EditCategoryDialog } from "@/components/edit-category-dialog";

interface CategoryCardProps {
  category: CategoryResponseDto;
  onDelete: (id: string) => void;
  onUpdate: (id: string, dto: CategoryUpdateDto) => Promise<unknown>;
}

export function CategoryCard({ category, onDelete, onUpdate }: CategoryCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Tag className="size-4" />
          </div>
          <div>
            <p className="font-medium">{category.name}</p>
            <Badge variant={category.isActive ? "default" : "secondary"} className="mt-1">
              {category.isActive ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <EditCategoryDialog category={category} onUpdate={onUpdate} />
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(category.id); 
            }}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}