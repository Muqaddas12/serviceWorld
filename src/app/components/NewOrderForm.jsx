"use client";

import { useState, useEffect } from "react";

export default function NewOrderForm() {
  const [service, setService] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/getservices");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Update charge whenever service or quantity changes
  useEffect(() => {
    if (service && quantity) {
      const selectedService = services.find((s) => s.service === service);
      if (selectedService) {
        const rate = parseFloat(selectedService.rate.toString().replace(/,/g, ""));
        const qty = parseInt(quantity, 10);
        setCharge((rate * qty).toFixed(2));
      } else {
        setCharge("");
      }
    } else {
      setCharge("");
    }
  }, [service, quantity, services]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ service, link, quantity, charge });
    alert("Form submitted! Check console for values.");
  };

  return (
    <div className="card-body bg-gray-100 p-6 rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service */}
        <div>
          <label className="block mb-1 font-semibold">Service</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Select a service</option>
            {loadingServices ? (
              <option>Loading services...</option>
            ) : (
              services.map((srv) => (
                <option key={srv.service} value={srv.service}>
                  {srv.name} | ₹{srv.rate}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <div className="p-2 border rounded-lg bg-white">
            {service
              ? services.find((s) => s.service === service)?.desc || "No description available"
              : "Select a service to see description"}
          </div>
        </div>

        {/* Link */}
        <div>
          <label className="block font-semibold mb-1">Link</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-semibold mb-1">Quantity</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <small className="text-gray-500">Enter quantity as number</small>
        </div>

        {/* Charge */}
        <div>
          <label className="block font-semibold mb-1">Charge</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
            value={charge}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
