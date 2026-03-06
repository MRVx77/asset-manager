"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

type Category = {
  id: number;
  name: string;
  createdAt: Date;
};

interface CategoryManagerProps {
  categories: Category[];
}

function CategoryManager({
  categories: intialCategories,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(intialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <div className="space-y-6">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categoryName">New Category</Label>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              id="categoryName"
              placeholder="Enter Category name"
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CategoryManager;
