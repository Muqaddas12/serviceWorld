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
    cat.toLowerCase().includes(i.name.toLowerCase())
  );
  return found ? found.icon : <FaGlobe size={20} />;
};
const getPlatformIcon = (name = "") => {
  const lower = name.toLowerCase();

  if (lower.includes("instagram")) return <FaInstagram className="text-pink-500 text-lg" />;
  if (lower.includes("youtube")) return <FaYoutube className="text-red-500 text-lg" />;
  if (lower.includes("facebook")) return <FaFacebookF className="text-blue-600 text-lg" />;
  if (lower.includes("tiktok")) return <FaTiktok className="text-white text-lg" />;
  if (lower.includes("telegram")) return <FaTelegramPlane className="text-sky-400 text-lg" />;
  if (lower.includes("twitter")) return <FaTwitter className="text-blue-400 text-lg" />;

  return <FaGlobe className="text-gray-500 text-lg" />;
};

export default function OrderForm({ selectedCategory='' }) {
  const {symbol,convert}=useCurrency()
  const [category, setCategory] = useState(selectedCategory || "");
  const [service, setService] = useState('');
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState("success");
  const [quantityError, setQuantityError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [onlySelectedCategories,setOnlySelectedCategories]=useState([])

  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const searchRef = useRef(null);
// Load all services
useEffect(() => {
  (async () => {
    const data = await getServices();
    if (data) setServices(data.plain);
  })();
}, []);

// Extract categories after services load
useEffect(() => {
  const loadcategory=async()=>{
    const res=await getCategories()
    console.log(res)
    if (services.length > 0) {
    
   const cats=res?.data
    setCategories(cats);
    setOnlySelectedCategories(cats);

    // Auto-select default category + service
    if (!category) {
      const firstCategory = cats[0];
      setCategory(firstCategory);

      const firstSrv = services.find((s) => s.category === firstCategory);
      setSelectedService(firstSrv || null);
      setService(firstSrv?.service || "");
    }
  } else {
    setCategories([]);
    setCategory("");
  }
  }
  loadcategory()
  
}, [services]);

// Apply filters (category + search) with debounce
useEffect(() => {
  setLoading(true);

  const delay = setTimeout(() => {
    const term = searchTerm.trim().toLowerCase();

    const result = services.filter((s) => {
      const matchesCategory = category ? s.category === category : true;
      const matchesTerm =
        !term ||
        s.name.toLowerCase().includes(term) ||
        (s.description || "").toLowerCase().includes(term) ||
        (s.service || "").toLowerCase().includes(term);
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
  if (!srv) return setQuantityError("");

  const qty = Number(quantity);

  if (!quantity) return setQuantityError("");
  if (qty < srv.min) return setQuantityError(`Minimum allowed quantity is ${srv.min}`);
  if (qty > srv.max) return setQuantityError(`Maximum allowed quantity is ${srv.max}`);

  setQuantityError("");
}, [quantity, service, services]);

// Clear service when category changes and selected service does not belong to it
useEffect(() => {
  if (selectedService && category && selectedService.category !== category) {
    setService("");
    setSelectedService(null);
  }
}, [category, selectedService]);

// Auto-select category (coming from props - selectedCategory)
useEffect(() => {
  if (selectedCategory && onlySelectedCategories.length > 0) {
    const lower = selectedCategory.toLowerCase();
    const words = lower.split(/[^a-z0-9]+/);

    const matched = onlySelectedCategories.find((cat) =>
      words.some((w) => cat.toLowerCase().includes(w))
    );

    if (matched) {
      const related = onlySelectedCategories.filter((cat) =>
        words.some((w) => cat.toLowerCase().includes(w))
      );

      setCategories(related);
      setCategory(related[0]);
    }
  }
}, [selectedCategory, onlySelectedCategories]);

// Auto select first service when filter changes
useEffect(() => {
  if (filteredServices.length > 0) {
    const first = filteredServices[0];
    setSelectedService(first);
    setService(first?.service || "");
  }

  if (!selectedCategory) {
    setCategories(onlySelectedCategories);
  }
}, [filteredServices]);

// Calculate charge
useEffect(() => {
  if (service && quantity) {
    const srv = services.find((s) => s.service === service);

    if (srv) {
      const rate = parseFloat(String(srv.rate).replace(/,/g, "")) || 0;
      const total = (rate / 1000) * Number(quantity || 0);
      return setCharge(total.toFixed(2));
    }
  }

  setCharge("");
}, [service, quantity, services]);

    const handleSubmit = async (e) => {
    e.preventDefault();

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
console.log(res)
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
      }
    } catch (err) {
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
        filteredServices.map((srv,index) => (
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
              {srv.description}
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
                {categories.map((cat,index) => (
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
          {convert(Number(selectedService?.rate || 0)).toFixed(2)}
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
      {filteredServices.map((srv , index) => (
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
            {convert(Number(srv.rate || 0)).toFixed(2)}
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
    {selectedService?.desc || "No description available."}
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
              value={charge ? `₹${charge}` : ""}
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
