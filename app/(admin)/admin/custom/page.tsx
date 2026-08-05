"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Clock, Calendar, AlertCircle } from "lucide-react";
import { CustomOrderInspector } from "@/components/admin/CustomOrderInspector";
import Image from "next/image";

const COLUMNS = [
  { id: "submitted", title: "Submitted" },
  { id: "in_design", title: "In Design" },
  { id: "ready", title: "Ready for Shipping" },
  { id: "shipped", title: "Shipped" },
];

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drag and Drop state
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/v1/admin/custom-orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch custom orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedOrderId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (!draggedOrderId) return;

    const orderToMove = orders.find(o => o.id === draggedOrderId);
    if (!orderToMove || orderToMove.status === targetStatus) {
      setDraggedOrderId(null);
      return;
    }

    // Optimistic UI Update
    setOrders(prev => prev.map(o => o.id === draggedOrderId ? { ...o, status: targetStatus } : o));
    setDraggedOrderId(null);

    // API Call
    try {
      await fetch(`/api/v1/admin/custom-orders/${draggedOrderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus })
      });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchOrders(); // Revert on failure
    }
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.customerName?.toLowerCase().includes(query) ||
      order.customerEmail?.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query)
    );
  });

  // Helper to determine deadline urgency
  const getDeadlineStatus = (deadlineStr: string) => {
    if (!deadlineStr) return { text: "No deadline", color: "bg-mist text-ink" };
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Overdue", color: "bg-red-100 text-red-700 font-bold" };
    if (diffDays <= 3) return { text: `Due in ${diffDays}d`, color: "bg-red-100 text-red-700" };
    if (diffDays <= 7) return { text: `Due in ${diffDays}d`, color: "bg-orange-100 text-orange-700" };
    return { text: `Due in ${diffDays}d`, color: "bg-green-50 text-green-700" };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display text-obsidian">Custom Orders</h1>
          <p className="text-sm text-ink mt-1">Manage artisan workflow and sizing requests.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink" />
            <input 
              type="text" 
              placeholder="Search ID or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-chrome rounded-lg focus:outline-none focus:border-obsidian"
            />
          </div>
          <button className="p-2 border border-chrome bg-white rounded-lg hover:bg-mist text-obsidian">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-ink">Loading orders...</div>
        ) : (
          <div className="flex gap-6 min-w-max h-full">
            {COLUMNS.map((col) => {
              const columnOrders = filteredOrders.filter(o => o.status === col.id);
              
              return (
                <div 
                  key={col.id} 
                  className="w-80 flex flex-col h-full bg-mist/30 rounded-2xl p-4 border border-transparent transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-obsidian">{col.title}</h3>
                      <span className="bg-white text-ink text-xs font-mono px-2 py-0.5 rounded-full border border-chrome">
                        {columnOrders.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pb-10">
                    {columnOrders.map(order => {
                      const deadlineInfo = getDeadlineStatus(order.deadline);
                      
                      return (
                        <div 
                          key={order.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, order.id)}
                          className="bg-white border border-chrome rounded-xl p-4 hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-mono text-ink">#{order.id.slice(0,6)}</span>
                            
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="text-ink hover:text-obsidian p-1 rounded hover:bg-mist"
                              title="View Details"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                          
                          <div 
                            className="flex gap-3 mb-3 cursor-pointer"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-mist border border-chrome relative shrink-0">
                              {order.referenceImageUrls?.[0] ? (
                                <Image src={order.referenceImageUrls[0]} alt="thumbnail" fill sizes="64px" className="object-cover hover:scale-110 transition-transform" />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-[10px] text-ink text-center">No Img</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-obsidian text-sm truncate">{order.customerName}</h4>
                              <p className="text-xs text-ink truncate mt-0.5">{order.customerEmail}</p>
                              
                              <div className="flex gap-1.5 mt-2 flex-wrap">
                                {order.shape && (
                                  <span className="text-[10px] bg-mist px-1.5 py-0.5 rounded border border-chrome text-obsidian">
                                    {order.shape}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-3 border-t border-chrome flex items-center justify-between">
                            <div className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${deadlineInfo.color}`}>
                              <Calendar size={10} /> {deadlineInfo.text}
                            </div>
                            <span className="text-xs text-green-700 font-medium">{order.budget}</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Empty State */}
                    {columnOrders.length === 0 && (
                      <div className="border-2 border-dashed border-chrome rounded-xl p-6 flex items-center justify-center text-sm text-ink bg-white/50">
                        Drop orders here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspector Modal */}
      {selectedOrder && (
        <CustomOrderInspector 
          isOpen={true} 
          onClose={() => {
            setSelectedOrder(null);
            fetchOrders(); // Refresh data in case status/notes were updated
          }} 
          order={selectedOrder} 
        />
      )}
    </div>
  );
}
