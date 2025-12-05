"use client";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTwitter,
  FaSpotify,
  FaTiktok,
  FaTelegramPlane,
  FaLinkedinIn,
  FaDiscord,
  FaGlobe,
  FaStar,
  FaCircle,
} from "react-icons/fa";
import { getServices } from "@/lib/services";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { MdReceipt, MdAccessTime } from "react-icons/md";
import { createOrderAction } from "@/lib/userActions";
import QuickActions from "./QuickActions";
import { useCurrency } from "@/context/CurrencyContext";
import { getCategories } from "@/lib/services";

const icons = [
  { name: "Instagram", icon: <FaInstagram size={28} /> },
  { name: "Facebook", icon: <FaFacebookF size={28} /> },
  { name: "YouTube", icon: <FaYoutube size={28} /> },
  { name: "Twitter", icon: <FaTwitter size={28} /> },
  { name: "Spotify", icon: <FaSpotify size={28} /> },
  { name: "TikTok", icon: <FaTiktok size={28} /> },
  { name: "Telegram", icon: <FaTelegramPlane size={28} /> },
  { name: "LinkedIn", icon: <FaLinkedinIn size={28} /> },
  { name: "Discord", icon: <FaDiscord size={28} /> },
  { name: "Website", icon: <FaGlobe size={28} /> },
  { name: "Explore", icon: <FaStar size={28} /> },
  { name: "Network", icon: <FaCircle size={28} /> },
];

const getCategoryIcon = (cat) => {
  const found = icons.find((i) =>
    String(cat || "").toLowerCase().includes(i.name.toLowerCase())
  );
  return found ? found.icon : <FaGlobe size={20} />;
};

const getPlatformIcon = (name = "") => {
  const lower = String(name).toLowerCase();

  if (lower.includes("instagram")) return <FaInstagram className="text-pink-500 text-lg" />;
  if (lower.includes("youtube")) return <FaYoutube className="text-red-500 text-lg" />;
  if (lower.includes("facebook")) return <FaFacebookF className="text-blue-600 text-lg" />;
  if (lower.includes("tiktok")) return <FaTiktok className="text-white text-lg" />;
  if (lower.includes("telegram")) return <FaTelegramPlane className="text-sky-400 text-lg" />;
  if (lower.includes("twitter")) return <FaTwitter className="text-blue-400 text-lg" />;

  return <FaGlobe className="text-gray-500 text-lg" />;
};

export default function OrderForm({ selectedCategory = "" }) {
  const { symbol, convert } = useCurrency();

  // form state
  const [category, setCategory] = useState(selectedCategory || "");
  const [service, setService] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [onlySelectedCategories, setOnlySelectedCategories] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState("success");
  const [quantityError, setQuantityError] = useState("");

  // UI controls
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const searchRef = useRef(null);

  // Load all services
  useEffect(() => {
    (async () => {
      try {
        const data = await getServices();
        if (data && Array.isArray(data.plain)) {
          setServices(data.plain);
        } else {
          // if getServices returns array directly
          if (Array.isArray(data)) setServices(data);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
        setServices([]);
      }
    })();
  }, []);

  // Extract categories after services load (and from getCategories())
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCategories();
        // res?.data expected - fallback: derive from services
        const cats = Array.isArray(res?.data)
          ? res.data
          : Array.from(new Set(services.map((s) => s.category).filter(Boolean)));

        if (!mounted) return;

        setCategories(cats);
        setOnlySelectedCategories(cats);

        // Auto-select default category + service only if not already set
        if (!category && cats.length > 0) {
          const firstCategory = cats[0];
          setCategory(firstCategory);

          // pick first service from that category
          const firstSrv = services.find((s) => s.category === firstCategory);
          setSelectedService(firstSrv || null);
          setService(firstSrv?.service || "");
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        if (mounted) {
          const fallback = Array.from(new Set(services.map((s) => s.category).filter(Boolean)));
          setCategories(fallback);
          setOnlySelectedCategories(fallback);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [services, category]);

  // Apply filters (category + search) with debounce
  useEffect(() => {
    setLoading(true);

    const delay = setTimeout(() => {
      const term = String(searchTerm || "").trim().toLowerCase();

      const result = services.filter((s) => {
        const matchesCategory = category ? s.category === category : true;

        // service description might be in s.desc or s.description - handle both
        const description = String(s.desc ?? s.description ?? "").toLowerCase();

        const matchesTerm =
          !term ||
          String(s.name || "")
            .toLowerCase()
            .includes(term) ||
          description.includes(term) ||
          String(s.service || "").toLowerCase().includes(term) ||
          String(s.rate || "").toLowerCase().includes(term);

        return matchesCategory && matchesTerm;
      });

      setFilteredServices(result);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, services, category]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!categoryRef.current?.contains(e.target)) setCategoryDropdownOpen(false);
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
      if (!searchRef.current?.contains(e.target)) setSearchDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quantity validation
  useEffect(() => {
    const srv = services.find((s) => s.service === service);
    if (!srv) {
      setQuantityError("");
      return;
    }

    const qty = Number(quantity);
    if (!quantity) {
      setQuantityError("");
      return;
    }

    const min = Number(srv.min ?? 0);
    const max = Number(srv.max ?? Infinity);

    if (isNaN(qty)) {
      setQuantityError("Invalid quantity.");
      return;
    }

    if (min && qty < min) {
      setQuantityError(`Minimum allowed quantity is ${min}`);
      return;
    }
    if (max && qty > max) {
      setQuantityError(`Maximum allowed quantity is ${max}`);
      return;
    }

    setQuantityError("");
  }, [quantity, service, services]);

  // Clear selected service when category changes and selected service does not belong to it
  useEffect(() => {
    if (selectedService && category && selectedService.category !== category) {
      setService("");
      setSelectedService(null);
    }
  }, [category, selectedService]);

  // Auto-select category (coming from props - selectedCategory)
  useEffect(() => {
    if (!selectedCategory) return;
    if (!onlySelectedCategories || onlySelectedCategories.length === 0) return;

    const lower = String(selectedCategory).toLowerCase();
    const words = lower.split(/[^a-z0-9]+/).filter(Boolean);

    // try to find best match
    const matched = onlySelectedCategories.find((cat) =>
      words.some((w) => String(cat).toLowerCase().includes(w))
    );

    if (matched) {
      // related categories that match any word
      const related = onlySelectedCategories.filter((cat) =>
        words.some((w) => String(cat).toLowerCase().includes(w))
      );

      if (related.length > 0) {
        setCategories(related);
        setCategory(related[0]);
      } else {
        setCategory(matched);
      }
    }
  }, [selectedCategory, onlySelectedCategories]);

  // Auto select first service when filteredServices change
  useEffect(() => {
    if (filteredServices.length > 0) {
      const first = filteredServices[0];
      setSelectedService(first);
      setService(first?.service || "");
    } else {
      // if no results, clear selection
      setSelectedService(null);
      setService("");
    }

    // restore categories if not using selectedCategory
    if (!selectedCategory) {
      setCategories(onlySelectedCategories);
    }
  }, [filteredServices, selectedCategory, onlySelectedCategories]);

  // Calculate charge (fixed: don't wipe it out inadvertently)
  useEffect(() => {
    // default clear
    if (!service || !quantity) {
      setCharge("");
      return;
    }

    const srv = services.find((s) => s.service === service);

    if (!srv) {
      setCharge("");
      return;
    }

    const baseRate = Number(String(srv.rate || "0").replace(/,/g, "")) || 0;
    const profitPct = Number(srv.profitPercentage || srv.Profitpercentage || 0) || 0;

    // final rate (rate + profit)
    const finalRate = baseRate * (1 + profitPct / 100);

    const qty = Number(quantity || 0);
    if (isNaN(qty)) {
      setCharge("");
      return;
    }

    const total = (finalRate / srv.min) * qty;

    // keep as string with 2 decimals
    setCharge(Number(total.toFixed(2)).toFixed(2));
  }, [service, quantity, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponseMessage(null);

    if (!service || !link || !quantity || !charge) {
      setResponseMessage("⚠️ Please fill all fields.");
      setResponseType("error");
      return;
    }

    if (quantityError) {
      setResponseMessage(quantityError);
      setResponseType("error");
      return;
    }

    setSubmitting(true);

    try {
      const res = await createOrderAction(service, link, quantity, charge);
      console.log("createOrderAction response:", res);

      if (!res.success) {
        setResponseMessage("❌ Failed to create order");
        setResponseType("error");
      } else {
        setResponseMessage(`✅ Order created successfully (ID: ${res.orderId})`);
        setResponseType("success");
        setService("");
        setLink("");
        setQuantity("");
        setCharge("");
        setSearchTerm("");
        // reset selection to first filtered service if exists
        if (filteredServices.length > 0) {
          const first = filteredServices[0];
          setSelectedService(first);
          setService(first?.service || "");
        } else {
          setSelectedService(null);
        }
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setResponseMessage("❌ Something went wrong.");
      setResponseType("error");
    }

    setSubmitting(false);
  };

  return (
    <div className="w-full flex-1 flex justify-start bg-gray-100 text-gray-700 dark:bg-[#0F1117] dark:text-white">
      <div
        className="
        w-full max-w-4xl mx-auto
        bg-gray-50 dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-2xl shadow-lg
        py-6 sm:p-8 px-4
        transition-all duration-300
      "
      >
        {/* Title */}
        <h2
          className="
          flex items-center justify-center gap-3
          text-3xl sm:text-4xl font-bold
          text-gray-700 dark:text-gray-200
          mb-8
        "
        >
          <MdReceipt size={38} className="text-gray-600 dark:text-gray-300" />
          Place Order
        </h2>

        <QuickActions />

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SEARCH */}
          <div className="relative" ref={searchRef}>
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

            <input
              type="text"
              placeholder="Search service..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchDropdownOpen(true);
              }}
              className="
      w-full pl-10 pr-3 py-2 rounded-lg
      bg-gray-100 dark:bg-[#0F1117]
      border border-gray-300 dark:border-[#2B3143]
      text-gray-700 dark:text-white
    "
            />

            {searchTerm && searchDropdownOpen && (
              <div
                className="
        absolute left-0 top-full mt-2
        w-full max-h-64 overflow-y-auto
        bg-gray-50 dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-lg shadow-lg
        z-[99999]
      "
              >
                {loading ? (
                  <div className="p-4 text-center">
                    <FaSpinner className="animate-spin inline-block mr-2" />
                    Searching...
                  </div>
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((srv, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSearchTerm(srv.name);
                        setService(srv.service);
                        setSelectedService(srv);
                        setCategory(srv.category);
                        setSearchDropdownOpen(false);
                      }}
                      className="
              px-4 py-3 cursor-pointer
              hover:bg-gray-200 dark:hover:bg-white/10
            "
                    >
                      <p className="font-semibold">{srv.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {srv.desc ?? srv.description ?? ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center p-3 text-gray-500">No results found.</p>
                )}
              </div>
            )}
          </div>

          {/* CATEGORY */}
          <div className="relative" ref={categoryRef}>
            <label className="block mb-1 text-sm font-medium dark:text-gray-300">Category</label>

            <div
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="
    bg-gray-100 dark:bg-[#0F1117]
    border border-gray-300 dark:border-[#2B3143]
    px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2
  "
            >
              {category ? getCategoryIcon(category) : <FaGlobe size={20} />}
              <span>{category || "Select category"}</span>
            </div>

            {categoryDropdownOpen && (
              <ul
                className="
                  absolute left-0 top-full mt-2
                  w-full max-h-56 overflow-y-auto
                  bg-gray-50 dark:bg-[#1A1F2B]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg shadow-lg
                  z-50
                "
              >
                {categories.map((cat, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setCategory(cat);
                      setCategoryDropdownOpen(false);
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer flex items-center gap-2"
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SERVICE */}
          <div className="relative" ref={dropdownRef}>
            <label className="block mb-1 text-sm font-medium dark:text-gray-300">
              Service
            </label>

            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="
      bg-gray-100 dark:bg-[#0F1117]
      border border-gray-300 dark:border-[#2B3143]
      px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2
    "
            >
              {selectedService ? (
                <>
                  {getPlatformIcon(selectedService.name)}
                  <span>
                    {selectedService.service} | {selectedService.name} |{" "}
                    {symbol}
                    {(
                      convert(
                        Number(selectedService?.rate || 0) *
                          (1 + Number(selectedService?.profitPercentage || selectedService?.Profitpercentage || 0) / 100)
                      )
                    ).toFixed(2)}
                  </span>
                </>
              ) : (
                <span>Select a service</span>
              )}
            </div>

            {dropdownOpen && filteredServices.length > 0 && (
              <ul
                className="
        absolute left-0 top-full mt-2
        w-full max-h-56 overflow-y-auto
        bg-gray-50 dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-lg shadow-lg
        z-[99999]
      "
              >
                {filteredServices.map((srv, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setService(srv.service);
                      setSelectedService(srv);
                      setDropdownOpen(false);
                    }}
                    className="
            px-4 py-2 hover:bg-gray-200 dark:hover:bg-white/10 
            cursor-pointer flex items-center gap-2
          "
                  >
                    {getPlatformIcon(srv.name)}

                    <span>
                      {srv.service} — {srv.name} — {symbol}
                      {(
                        convert(
                          Number(srv?.rate || 0) *
                          (1 + Number(srv?.profitPercentage || srv?.Profitpercentage || 0) / 100)
                        )
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SERVICE INFO */}
          {selectedService && (
            <div
              className="
    bg-gray-100 dark:bg-[#0F1117]
    border border-gray-300 dark:border-[#2B3143]
    p-4 rounded-lg shadow-sm
    overflow-hidden break-words
  "
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 whitespace-pre-wrap break-words">
                {selectedService?.desc ??  "No description available."}
              </p>

              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                <MdAccessTime />
                {selectedService.average_time || "No data available"}
              </p>
            </div>
          )}

          {/* LINK */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Link</label>
            <input
              type="text"
              className="
              w-full px-3 py-2 rounded-lg
              bg-gray-100 dark:bg-[#0F1117]
              border border-gray-300 dark:border-[#2B3143]
              text-gray-700 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
            "
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter post or video link"
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className={`w-full px-3 py-2 rounded-lg
              bg-gray-100 dark:bg-[#0F1117]
              border ${quantityError ? "border-red-500" : "border-gray-300 dark:border-[#2B3143]"}
              text-gray-700 dark:text-white
              focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600`}
            />
            {quantityError && <p className="text-red-400 text-sm">{quantityError}</p>}
          </div>

          {/* CHARGE */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">Charge</label>
            <input
              type="text"
              value={charge ? `${symbol}${charge}` : ""}
              readOnly
              className="w-full px-3 py-2 rounded-lg
              bg-gray-100 dark:bg-[#0F1117]
              border border-gray-300 dark:border-[#2B3143]
              text-gray-700 dark:text-white"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300 transition shadow-md shadow-gray-400/30 dark:shadow-none disabled:opacity-50"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              "Place Order"
            )}
          </button>
        </form>

        {/* RESPONSE MESSAGE */}
        {responseMessage && (
          <p
            className={`mt-5 text-center font-medium text-sm ${responseType === "error" ? "text-red-400" : "text-green-400"}`}
          >
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}
