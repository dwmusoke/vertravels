"use client";

import { useState } from "react";
import {
  Map,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Save,
  Download,
  Send,
  Eye,
  Plane,
  Hotel,
  MapPin,
  Car,
  Camera,
  FileText,
} from "lucide-react";

interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    activity: string;
    location: string;
    duration: string;
  }[];
}

interface Itinerary {
  id: string;
  customer: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "Draft" | "Sent" | "Confirmed";
  content: ItineraryDay[];
}

const itineraries: Itinerary[] = [
  {
    id: "IT-001",
    customer: "John Smith",
    destination: "London, UK",
    startDate: "Jun 15, 2026",
    endDate: "Jun 22, 2026",
    days: 7,
    status: "Sent",
    content: [
      {
        day: 1,
        title: "Arrival in London",
        activities: [
          {
            time: "14:00",
            activity: "Arrive at Heathrow",
            location: "London",
            duration: "",
          },
          {
            time: "16:00",
            activity: "Check-in at Hotel",
            location: "Marriott Hotel",
            duration: "1hr",
          },
        ],
      },
      {
        day: 2,
        title: "City Tour",
        activities: [
          {
            time: "09:00",
            activity: "Tower of London Tour",
            location: "Tower of London",
            duration: "3hrs",
          },
          {
            time: "14:00",
            activity: "Thames River Cruise",
            location: "River Thames",
            duration: "2hrs",
          },
        ],
      },
    ],
  },
  {
    id: "IT-002",
    customer: "Sarah Johnson",
    destination: "Dubai",
    startDate: "Jul 01, 2026",
    endDate: "Jul 05, 2026",
    days: 5,
    status: "Draft",
    content: [
      {
        day: 1,
        title: "Arrival",
        activities: [
          {
            time: "10:00",
            activity: "Arrive at Dubai Airport",
            location: "Dubai",
            duration: "",
          },
        ],
      },
    ],
  },
  {
    id: "IT-003",
    customer: "Mike Wilson",
    destination: "Masai Mara",
    startDate: "Jul 10, 2026",
    endDate: "Jul 15, 2026",
    days: 5,
    status: "Confirmed",
    content: [
      {
        day: 1,
        title: "Arrival & Safari",
        activities: [
          {
            time: "12:00",
            activity: "Arrive at Camp",
            location: "Masai Mara",
            duration: "",
          },
          {
            time: "16:00",
            activity: "Evening Game Drive",
            location: "Savannah",
            duration: "3hrs",
          },
        ],
      },
    ],
  },
];

function Modal({
  open,
  onClose,
  title,
  children,
  onSave,
  saveLabel = "Save",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItinerary, setViewItinerary] = useState<Itinerary | null>(null);
  const [form, setForm] = useState({
    customer: "",
    destination: "",
    startDate: "",
    endDate: "",
  });

  const stats = {
    total: itineraries.length,
    drafts: itineraries.filter((i) => i.status === "Draft").length,
    sent: itineraries.filter((i) => i.status === "Sent").length,
    confirmed: itineraries.filter((i) => i.status === "Confirmed").length,
  };

  const filtered = itineraries.filter((i) => {
    const matches =
      i.customer.toLowerCase().includes(search.toLowerCase()) ||
      i.destination.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || i.status === filter;
    return matches && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Itinerary Builder</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" /> Create Itinerary
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Itineraries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Sent</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.sent}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search itineraries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {it.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {it.destination}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {it.days} Days
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {it.startDate} - {it.endDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${it.status === "Confirmed" ? "bg-green-100 text-green-700" : it.status === "Sent" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {it.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewItinerary(it)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Itinerary"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Itinerary Builder</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((day) => (
                <div key={day} className="border rounded-lg p-4">
                  <p className="font-medium mb-2">Day {day}</p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Activity title"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Time"
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        className="px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!viewItinerary}
        onClose={() => setViewItinerary(null)}
        title={`Itinerary - ${viewItinerary?.destination}`}
      >
        {viewItinerary && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-xl font-bold">
                  {viewItinerary.destination}
                </h3>
                <p className="text-gray-500">{viewItinerary.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {viewItinerary.startDate} - {viewItinerary.endDate}
                </p>
                <p className="text-sm text-gray-500">
                  {viewItinerary.days} Days
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {viewItinerary.content.map((day) => (
                <div
                  key={day.day}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="bg-sky-50 px-4 py-2 border-b">
                    <p className="font-medium text-sky-700">
                      Day {day.day}: {day.title}
                    </p>
                  </div>
                  <div className="p-4 space-y-2">
                    {day.activities.map((act, idx) => (
                      <div key={idx} className="flex gap-4 text-sm">
                        <p className="font-medium text-gray-500 w-16">
                          {act.time}
                        </p>
                        <p className="flex-1">{act.activity}</p>
                        <p className="text-gray-500">{act.location}</p>
                        <p className="text-gray-400 w-20">{act.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                <FileText className="w-4 h-4" /> Export Word
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                <Send className="w-4 h-4" /> Send to Customer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
