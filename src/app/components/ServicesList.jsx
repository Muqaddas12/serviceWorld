'use client'

import React, { useState } from 'react'
import { createOrder, getOrderStatus } from '@/lib/services'

export default function ServicesPage({ services }) {
  const [orders, setOrders] = useState({})
  const [openCategory, setOpenCategory] = useState(null)

  
  const serviceList = Array.isArray(services) ? services : []

  // Group services by category
  const groupedServices = serviceList.reduce((acc, service) => {
    acc[service.category] = acc[service.category] || []
    acc[service.category].push(service)
    return acc
  }, {})

  const handleOrder = async (service) => {
    const link = prompt(`Enter link/username for ${service.name}`)
    const quantity = prompt(`Enter quantity for ${service.name}`)

    if (!link || !quantity) return

    try {
      const orderData = await createOrder({
        service: service.service,
        link,
        quantity: Number(quantity),
      })

      if (orderData.error) throw orderData

      const orderId = orderData.order
      alert(`Order created: ${orderId}`)

      const statusData = await getOrderStatus(orderId)
      setOrders((prev) => ({ ...prev, [orderId]: statusData.status || 'Pending' }))
    } catch (error) {
      alert('Error creating order: ' + (error.error || error.message))
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Services</h1>

      {Object.keys(groupedServices).length === 0 ? (
        <p className="text-black">No services available.</p>
      ) : (
        Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="mb-6">
            <button
              onClick={() => setOpenCategory(openCategory === category ? null : category)}
              className="w-full text-left py-2 px-4 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              {category} ({categoryServices.length})
            </button>

            {openCategory === category && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {categoryServices.map((service) => (
                  <div
                    key={service.service}
                    className="bg-gray-200 rounded-xl shadow p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
                  >
                    <h2 className="text-lg font-semibold mb-2 text-black">{service.name}</h2>
                    <p className="text-sm text-black mb-4">{service.type}</p>

                    <div className="text-black space-y-1 mb-4">
                      <p><span className="font-medium">Rate:</span> ${service.rate}</p>
                      <p><span className="font-medium">Min:</span> {service.min}</p>
                      <p><span className="font-medium">Max:</span> {service.max}</p>
                      <p><span className="font-medium">Description:</span> {service.desc}</p>
                    </div>

                    <button
                      onClick={() => handleOrder(service)}
                      className="mt-auto px-4 py-2 rounded-full bg-gray-400 text-black font-semibold hover:bg-gray-500 transition"
                    >
                      Order Now
                    </button>

                    {Object.entries(orders).length > 0 && (
                      <div className="mt-4 text-sm text-black">
                        {Object.entries(orders).map(([id, status]) => (
                          <p key={id}>Order {id}: {status}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
