// /lib/services.js
import axios from "axios";

const API_URL = process.env.BASE_URL
const API_KEY = process.env.KEY

const postAction = async (action, data = {}) => {
  try {
    const params = new URLSearchParams();
    params.append("key", API_KEY);
    params.append("action", action);

    for (const [key, value] of Object.entries(data)) {
      params.append(key, value);
    }

    const res = await axios.post(API_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data;
  } catch (error) {
    console.error("SMM API Error:", error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
};

//
// 🔹 API Actions
//

// ✅ Get all services
export const getServices = () => postAction("services");

// ✅ Create an order
export const createOrder = (data) => postAction("add", data);

// ✅ Get single order status
export const getOrderStatus = (orderId) => postAction("status", { order: orderId });

// ✅ Get multiple order statuses
export const getMultipleOrderStatus = (orderIds) =>
  postAction("status", { orders: orderIds.join(",") });

// ✅ Create a refill for one order
export const createRefill = (orderId) => postAction("refill", { order: orderId });

// ✅ Create multiple refills
export const createMultipleRefills = (orderIds) =>
  postAction("refill", { orders: orderIds.join(",") });

// ✅ Get refill status
export const getRefillStatus = (refillId) => postAction("refill_status", { refill: refillId });

// ✅ Get multiple refill statuses
export const getMultipleRefillStatuses = (refillIds) =>
  postAction("refill_status", { refills: refillIds.join(",") });

// ✅ Get user balance
export const getBalance = () => postAction("balance");

