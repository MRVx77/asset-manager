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

  const handleAddNewCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newCategoryName);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddNewCategory} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="categoryName">New Category</Label>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              id="categoryName"
              placeholder="Enter Category name"
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-teal-500 hover:bg-teal-700 text-white cursor-pointer"
            >
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
