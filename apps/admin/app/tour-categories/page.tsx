"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2, Edit, Save, X, Image } from "lucide-react";

interface TourCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_emoji: string | null;
  icon_image_url: string | null;
  color_from: string;
  color_to: string;
  background_image_url: string | null;
  display_order: number;
  status: boolean;
}

const colorOptions = [
  { label: "Amber", from: "from-amber-600", to: "to-yellow-500" },
  { label: "Indigo", from: "from-indigo-600", to: "to-purple-500" },
  { label: "Emerald", from: "from-emerald-600", to: "to-teal-500" },
  { label: "Sky", from: "from-sky-600", to: "to-blue-500" },
  { label: "Rose", from: "from-rose-600", to: "to-pink-500" },
  { label: "Violet", from: "from-violet-600", to: "to-fuchsia-500" },
];

export default function TourCategoriesPage() {
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TourCategory>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    icon_emoji: "",
    color_from: "from-sky-600",
    color_to: "to-blue-500",
    display_order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("tour_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory() {
    try {
      const supabase = createClient();

      const { error } = await supabase.from("tour_categories").insert([
        {
          name: newCategory.name,
          slug: newCategory.slug,
          description: newCategory.description,
          icon_emoji: newCategory.icon_emoji,
          color_from: newCategory.color_from,
          color_to: newCategory.color_to,
          display_order: newCategory.display_order,
          status: true,
        },
      ]);

      if (error) throw error;

      setShowAddForm(false);
      setNewCategory({
        name: "",
        slug: "",
        description: "",
        icon_emoji: "",
        color_from: "from-sky-600",
        color_to: "to-blue-500",
        display_order: 0,
      });
      fetchCategories();
    } catch (error: any) {
      console.error("Error adding category:", error);
      alert("Failed to add category: " + error.message);
    }
  }

  async function handleUpdateCategory(id: string) {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tour_categories")
        .update(editData)
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      setEditData({});
      fetchCategories();
    } catch (error: any) {
      console.error("Error updating category:", error);
      alert("Failed to update category: " + error.message);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tour_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category: " + error.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tour Categories Management
          </h1>
          <p className="text-gray-600">
            Manage tour category icons and images
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Category</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Safari Adventures"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., safari"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon Emoji (optional)
                </label>
                <input
                  type="text"
                  value={newCategory.icon_emoji}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      icon_emoji: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 🦁"
                  maxLength={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Scheme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.label}
                      onClick={() =>
                        setNewCategory({
                          ...newCategory,
                          color_from: color.from,
                          color_to: color.to,
                        })
                      }
                      className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                        newCategory.color_from === color.from
                          ? "border-sky-500 bg-sky-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={newCategory.display_order}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              <div
                className={`h-32 bg-gradient-to-r ${cat.color_from} ${cat.color_to} relative`}
              >
                {cat.background_image_url && (
                  <img
                    src={cat.background_image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  {cat.icon_image_url ? (
                    <img
                      src={cat.icon_image_url}
                      alt={cat.name}
                      className="w-20 h-20 object-contain drop-shadow-lg"
                    />
                  ) : cat.icon_emoji ? (
                    <span className="text-6xl drop-shadow-lg">
                      {cat.icon_emoji}
                    </span>
                  ) : (
                    <Image className="w-16 h-16 text-white/50" />
                  )}
                </div>
              </div>

              <div className="p-4">
                {editingId === cat.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.name || cat.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      type="text"
                      value={editData.slug || cat.slug}
                      onChange={(e) =>
                        setEditData({ ...editData, slug: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <textarea
                      value={editData.description || cat.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateCategory(cat.id)}
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1"
                      >
                        <Save className="w-3 h-3" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditData({});
                        }}
                        className="flex-1 px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="pt-3 border-t">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon Image (replaces emoji)
                      </label>
                      <ImageUpload
                        bucket="category-icons"
                        onUpload={(url) => {
                          setEditData({ ...editData, icon_image_url: url });
                        }}
                        existingImages={
                          editData.icon_image_url || cat.icon_image_url
                            ? [editData.icon_image_url || cat.icon_image_url!]
                            : []
                        }
                        onRemove={() => {
                          setEditData({ ...editData, icon_image_url: null });
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {cat.description}
                    </p>
                    {cat.icon_emoji && !cat.icon_image_url && (
                      <p className="text-xs text-gray-500 mb-3">
                        Icon: {cat.icon_emoji}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(cat.id)}
                        className="flex-1 px-3 py-1.5 border rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="flex-1 px-3 py-1.5 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
