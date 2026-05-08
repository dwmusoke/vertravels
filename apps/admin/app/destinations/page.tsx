"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/ui/image-upload";
import { MapPin, Plus, Trash2, Edit, Save, X } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  country: string;
  image_url: string | null;
  flights_count: number;
  hotels_count: number;
  price_from: string;
  featured: boolean;
  created_at: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Destination>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDestination, setNewDestination] = useState({
    name: "",
    country: "",
    price_from: "",
    flights_count: 0,
    hotels_count: 0,
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error: any) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddDestination() {
    try {
      const supabase = createClient();

      const { error } = await supabase.from("destinations").insert([
        {
          name: newDestination.name,
          country: newDestination.country,
          price_from: newDestination.price_from,
          flights_count: newDestination.flights_count,
          hotels_count: newDestination.hotels_count,
          featured: false,
        },
      ]);

      if (error) throw error;

      setShowAddForm(false);
      setNewDestination({
        name: "",
        country: "",
        price_from: "",
        flights_count: 0,
        hotels_count: 0,
      });
      fetchDestinations();
    } catch (error: any) {
      console.error("Error adding destination:", error);
      alert("Failed to add destination: " + error.message);
    }
  }

  async function handleUpdateDestination(id: string) {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("destinations")
        .update(editData)
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      setEditData({});
      fetchDestinations();
    } catch (error: any) {
      console.error("Error updating destination:", error);
      alert("Failed to update destination: " + error.message);
    }
  }

  async function handleDeleteDestination(id: string, imageUrl?: string | null) {
    if (!confirm("Are you sure you want to delete this destination?")) return;

    try {
      const supabase = createClient();

      if (imageUrl) {
        const urlParts = imageUrl.split("/");
        const fileName = urlParts.slice(-2).join("/");

        await supabase.storage
          .from("destination-images")
          .remove([fileName]);
      }

      const { error } = await supabase
        .from("destinations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      fetchDestinations();
    } catch (error: any) {
      console.error("Error deleting destination:", error);
      alert("Failed to delete destination: " + error.message);
    }
  }

  async function handleToggleFeatured(id: string, currentFeatured: boolean) {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("destinations")
        .update({ featured: !currentFeatured })
        .eq("id", id);

      if (error) throw error;

      fetchDestinations();
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Destinations Management
          </h1>
          <p className="text-gray-600">
            Manage destination images and information
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Destination</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newDestination.name}
                  onChange={(e) =>
                    setNewDestination({
                      ...newDestination,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Dubai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={newDestination.country}
                  onChange={(e) =>
                    setNewDestination({
                      ...newDestination,
                      country: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., UAE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price From
                </label>
                <input
                  type="text"
                  value={newDestination.price_from}
                  onChange={(e) =>
                    setNewDestination({
                      ...newDestination,
                      price_from: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., $450"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flights
                  </label>
                  <input
                    type="number"
                    value={newDestination.flights_count}
                    onChange={(e) =>
                      setNewDestination({
                        ...newDestination,
                        flights_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotels
                  </label>
                  <input
                    type="number"
                    value={newDestination.hotels_count}
                    onChange={(e) =>
                      setNewDestination({
                        ...newDestination,
                        hotels_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAddDestination}
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
          <p className="mt-4 text-gray-600">Loading destinations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100">
                {dest.image_url ? (
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MapPin className="w-12 h-12" />
                  </div>
                )}

                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() =>
                      handleToggleFeatured(dest.id, dest.featured)
                    }
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      dest.featured
                        ? "bg-amber-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {dest.featured ? "Featured" : "Mark Featured"}
                  </button>
                </div>
              </div>

              <div className="p-4">
                {editingId === dest.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.name || dest.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      type="text"
                      value={editData.country || dest.country}
                      onChange={(e) =>
                        setEditData({ ...editData, country: e.target.value })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <input
                      type="text"
                      value={editData.price_from || dest.price_from}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price_from: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateDestination(dest.id)}
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
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {dest.country}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-sky-600">
                        From {dest.price_from}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>{dest.flights_count} flights</span>
                      <span>{dest.hotels_count} hotels</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(dest.id)}
                        className="flex-1 px-3 py-1.5 border rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteDestination(dest.id, dest.image_url)
                        }
                        className="flex-1 px-3 py-1.5 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {editingId === dest.id && (
                  <div className="mt-4 pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Image
                    </label>
                    <ImageUpload
                      bucket="destination-images"
                      onUpload={(url) => {
                        setEditData({ ...editData, image_url: url });
                      }}
                      existingImages={
                        editData.image_url || dest.image_url
                          ? [editData.image_url || dest.image_url!]
                          : []
                      }
                      onRemove={() => {
                        setEditData({ ...editData, image_url: null });
                      }}
                    />
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
