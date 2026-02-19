"use client";
import {
  FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaSpotify,
  FaTiktok, FaTelegramPlane, FaLinkedinIn, FaDiscord, FaGlobe
} from "react-icons/fa";

import {  MdAccessTime } from "react-icons/md";
import { getUserDetails } from "@/lib/userActions";
import { getEnabledServices, getCategories } from "@/lib/services";
import { createOrderAction } from "@/lib/userActions";
import QuickActions from "./QuickActions";
import { useCurrency } from "@/context/CurrencyContext";
import Loading from "./loading";
import { useState, useEffect, useMemo, useCallback, useRef ,Suspense} from "react";
import CategoryAndSearch from "./CategoryAndSearch";
// ---------------------------------------------------------
// ICON HELPERS
// ---------------------------------------------------------
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
];

const getCategoryIcon = (cat = "") =>
  icons.find((i) =>
    cat
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .includes(i.name.toLowerCase())
  )?.icon || <FaGlobe size={28} />;


export default function OrderForm({ selectedCategory = "" }) {
  const { symbol, convert } = useCurrency();

  // MAIN DATA
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
const [user,setUser]=useState(null)
  // FORM STATE
  const [category, setCategory] = useState(selectedCategory || "");
  const [service, setService] = useState("");
  const [selectedService, setSelectedService] = useState(null);
const [allCategory,setAllCategory]=useState([])
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charge, setCharge] = useState("");
  const [quantityError, setQuantityError] = useState("");

  // UI
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // SUBMIT STATE
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState("success");

  const dropdownRef = useRef();
  const categoryRef = useRef();
  const searchRef = useRef();




  function normalizeText(text) {
  return text
    .normalize("NFKD")               // convert bold/fancy unicode
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s]/g, "")         // remove emojis/symbols
    .trim()
    .toLowerCase();
}

function getPlatformOrder(text) {
  const t = normalizeText(text);

  if (t.includes("facebook")) return 1;
  if (t.includes("instagram")) return 2;
  if (t.includes("youtube")) return 3;
  if (t.includes("tiktok")) return 4;
  if (t.includes("telegram")) return 5;

  return 99; // others at bottom
}

function sortCategories(categories) {
  return [...categories].sort((a, b) => {
    const pa = getPlatformOrder(a);
    const pb = getPlatformOrder(b);

    // 1️⃣ platform priority
    if (pa !== pb) return pa - pb;

    // 2️⃣ alphabetical inside same platform
    return normalizeText(a).localeCompare(normalizeText(b));
  });
}

// ---------------------------------------------------------
// LOAD ALL DATA FIRST (CATEGORIES + SERVICES)
// ---------------------------------------------------------
useEffect(() => {
  let alive = true;

  async function load() {
    try {
      
      const [srvRes, catRes,userRes] = await Promise.all([
  getEnabledServices(),
  getCategories(),
  getUserDetails()
]);
setUser(userRes)

      const srvList = Array.isArray(srvRes?.plain)
        ? srvRes.plain
        : Array.isArray(srvRes)
        ? srvRes
        : [];

      // collect categories that actually HAVE services
      const serviceCategories = new Set(
        srvList.map(s => s.category).filter(Boolean)
      );

      const rawCatList = Array.isArray(catRes?.data)
        ? catRes.data
        : [...serviceCategories];

      // ❗ FILTER OUT EMPTY CATEGORIES
      const List = rawCatList.filter(c =>
        serviceCategories.has(c)
      );

const catList = sortCategories(List);

      if (!alive) return;

      setServices(srvList);
      setCategories(catList);
      setAllCategory(catList);

      let chosenCategory = selectedCategory
        ? catList.find(c =>
            c.toLowerCase().includes(selectedCategory.toLowerCase())
          ) || catList[0]
        : catList[0];

      setCategory(chosenCategory);

      const filtered = srvList.filter(
        s => s.category === chosenCategory
      );

      const firstSrv = filtered[0] || null;
      setSelectedService(firstSrv);
      setService(firstSrv?.service || "");
    } catch (e) {
      console.error(e);
    }
  }

  load();
  return () => (alive = false);
}, []);


// ---------------------------------------------------------
// MEMOIZED FILTERED SERVICES
// ---------------------------------------------------------
const filteredServices = useMemo(() => {
  if (!Array.isArray(services) || !services.length) return [];

  const term =
    typeof searchTerm === "string" && searchTerm.trim()
      ? searchTerm.toLowerCase()
      : "";

  return services.filter(s => {
  
    // ✅ Apply category ONLY if not searching
    if (!term && category && s.category !== category) return false;
 const ID = s.id?.toString(); // safe conversion
    // No search → show all (or category-filtered)
    if (!term) return true;

    // Search across ALL services
    return (
      (typeof s.name === "string" && s.name.toLowerCase().includes(term)) ||
      (typeof s.desc === "string" && s.desc.toLowerCase().includes(term)) ||
      (typeof s.service === "string" && s.service.toLowerCase().includes(term))||
   (ID && ID.includes(term))
    );
  });
}, [services, category, searchTerm]);

// ---------------------------------------------------------
// ACTIVE SERVICE
// ---------------------------------------------------------
const activeService = useMemo(
  () => services.find(s => s.service === service) || null,
  [services, service]
);


// ---------------------------------------------------------
// QUANTITY VALIDATION + CHARGE
// ---------------------------------------------------------
useEffect(() => {
  if (!activeService || !quantity) {
    setCharge("");
    setQuantityError("");
    return;
  }

  const qty = Number(quantity);
  const min = Number(activeService.min || 0);
  const max = Number(activeService.max || Infinity);

  if (qty < min) {
    setQuantityError(`Minimum allowed quantity is ${min}`);
    return;
  }

  if (qty > max) {
    setQuantityError(`Maximum allowed quantity is ${max}`);
    return;
  }

  setQuantityError("");

  const base = Number(activeService.rate || 0);
  const profit = Number(
    activeService.profitPercentage ||
    activeService.Profitpercentage ||
    0
  );

  const total = ((base * (1 + profit / 100)) / 1000) * qty;
  setCharge(total.toFixed(2));
}, [quantity, activeService]);


// ---------------------------------------------------------
// CLICK OUTSIDE CLOSE DROPDOWNS
// ---------------------------------------------------------
useEffect(() => {
  function close(e) {
    if (!dropdownRef.current?.contains(e.target))
      setDropdownOpen(false);
    if (!categoryRef.current?.contains(e.target))
      setCategoryDropdownOpen(false);
    if (!searchRef.current?.contains(e.target))
      setSearchDropdownOpen(false);
  }

  document.addEventListener("mousedown", close);
  return () => document.removeEventListener("mousedown", close);
}, []);


// ---------------------------------------------------------
// CATEGORY CHANGE → PICK FIRST SERVICE
// ---------------------------------------------------------
useEffect(() => {
  if (!category || !services.length) {
    setSelectedService(null);
    setService("");
    return;
  }

  const filtered = services.filter(
    s => s.category === category
  );

  const first = filtered[0] || null;
  setSelectedService(first);
  setService(first?.service || "");
}, [category, services]);


// ---------------------------------------------------------
// APPLY selectedCategory PARAM (FILTER SAFE)
// ---------------------------------------------------------
useEffect(() => {
  if (!selectedCategory) {
    setCategories(allCategory);
    return;
  }

  const target = selectedCategory
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase();

  const matched = allCategory.filter(c => {
    const clean = c
      .normalize("NFKD")
      .replace(/[^\x00-\x7F]/g, "")
      .toLowerCase();
    return clean.startsWith(target);
  });

  if (!matched.length) return;

  setCategories(matched);
  setCategory(matched[0]);

  const firstSrv = services.find(
    s => s.category === matched[0]
  ) || null;

  setSelectedService(firstSrv);
  setService(firstSrv?.service || "");
}, [selectedCategory]);


// ---------------------------------------------------------
// SELECT SERVICE HANDLER
// ---------------------------------------------------------
const handleServiceSelect = useCallback((srv) => {
  setSelectedService(srv);
  setService(srv.service);
  setDropdownOpen(false);
}, []);


// ---------------------------------------------------------
// SUBMIT HANDLER
// ---------------------------------------------------------
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!service || !link || !quantity || !charge) {
    setResponseType("error");
    setResponseMessage("⚠️ Please fill all fields.");
    return;
  }

  if (quantityError) {
    setResponseType("error");
    setResponseMessage(quantityError);
    return;
  }

  setSubmitting(true);

  try {
    const discount = Number(user?.discount || 0);

const discountAmount =
  charge && discount > 0 ? (charge * discount) / 100 : 0;

const finalCharge =
  charge && discount > 0 ? charge - discountAmount : charge;

    const res = await createOrderAction(
      service,
      link,
      quantity,
finalCharge,
    );

    if (!res.success) {
      setResponseType("error");
      setResponseMessage(
        res.message === "Insufficient balance."
          ? "Insufficient balance. Please Add Fund In Your Account"
          : res.message
      );
    } else {
      setResponseType("success");
      setResponseMessage(
        `✅ Order created successfully (ID: ${res.orderId})`
      );

      setService("");
      setLink("");
      setQuantity("");
      setCharge("");
      setSearchTerm("");
    }
  } catch {
    setResponseType("error");
    setResponseMessage("❌ Something went wrong.");
  } finally {
    setSubmitting(false);
  }
};


  // ---------------------------------------------------------
  // JSX (UNCHANGED UI)
  // ---------------------------------------------------------
  return (
      <Suspense fallback={<Loading />}>
    <div className="w-full flex-1 flex justify-start bg-gray-100 dark:bg-[#0F1117]">
      <div className="w-full max-w-4xl mx-auto bg-gray-50 dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#2B3143] rounded-2xl shadow-lg py-6 sm:p-8 px-4">



        <QuickActions />

        {/* FORM START */}
        <form onSubmit={handleSubmit} className="space-y-4">
<CategoryAndSearch
  searchRef={searchRef}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  setSearchDropdownOpen={setSearchDropdownOpen}
  searchDropdownOpen={searchDropdownOpen}
  loading={loading}
  filteredServices={filteredServices}
  handleServiceSelect={handleServiceSelect}
  setCategory={setCategory}
  categoryRef={categoryRef}
  setCategoryDropdownOpen={setCategoryDropdownOpen}
  categoryDropdownOpen={categoryDropdownOpen}
  getCategoryIcon={getCategoryIcon}
  categories={categories}
  category={category}
/>


          {/* SERVICE */}
          <div className="relative" ref={dropdownRef}>
            <label>Service</label>
            <div
              onClick={() => setDropdownOpen((p) => !p)}
              className="bg-gray-100 dark:bg-[#0F1117] border px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2"
            >
              {selectedService ? (
                <>
                
                  <span>
                    {selectedService.id} | {selectedService.name} |{" "}
                    {symbol}
                    {(
                      convert(
                        Number(selectedService.rate || 0) *
                          (1 +
                            Number(selectedService.profitPercentage || selectedService.Profitpercentage || 0) /
                              100
                          )
                      )
                    ).toFixed(2)}
                  </span>
                </>
              ) : (
                "Select a service"
              )}
            </div>

            {dropdownOpen && filteredServices.length > 0 && (
              <ul className="absolute left-0 top-full mt-2 w-full max-h-56 bg-gray-50 dark:bg-[#1A1F2B] border rounded-lg overflow-y-auto z-[99999]">
                {filteredServices.map((srv, i) => (
                  <li
                    key={i}
                    onClick={() => handleServiceSelect(srv)}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  >
                   
                    <span>
                      {srv.id} — {srv.name} —{" "}
                      {(
                        convert(
                          Number(srv.rate || 0) *
                            (1 +
                              Number(srv.profitPercentage || srv.Profitpercentage || 0) /
                                100
                            )
                        )
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SERVICE INFO */}
          {selectedService &&selectedService.desc && (
            <div className="border p-4 rounded-lg">
              <p className="text-sm opacity-75">{selectedService.desc || "No description available"}</p>
              <p className="flex items-center gap-2 mt-2 opacity-80">
                <MdAccessTime />
                {selectedService.average_time ||""}
              </p>
            </div>
          )}

          {/* LINK */}
          <div>
            <label>Link</label>
            <input
              className="w-full bg-gray-100 dark:bg-[#0F1117] border px-3 py-2 rounded-lg"
              placeholder="Enter post or video link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label>Quantity</label>
            <input
              type="number"
              className={`w-full px-3 py-2 rounded-lg ${
                quantityError ? "border-red-500" : "border"
              }`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
            { selectedService&&<p className="text-gray-700 font-bold text-sm">Min: {selectedService?.min}-Max:{selectedService?.max}</p>}
            {quantityError && <p className="text-red-400 text-sm">{quantityError}</p>}
          </div>

{/* PRICE SUMMARY */}
{charge && (
  <div className="mt-3 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-4">
    <p className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
      <span className="block">
        Price:{" "}
        <span className="font-semibold">
          {symbol}{charge}
        </span>
      </span>

      <span className="block text-base font-semibold mt-2">
        ✅ Final Price: {symbol}{charge}
      </span>
    </p>
  </div>
)}

 {/* DISCOUNT SUMMARY */}
{charge && user?.discount > 0 && (() => {
  const discountAmount = (charge * user.discount) / 100;
  const finalPrice = charge - discountAmount;

  return (
    <div className="mt-3 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 px-4 py-4">
      <p className="text-sm text-green-700 dark:text-green-300 space-y-1">
        <span className="block">
          Original Price:{" "}
          <span className="line-through font-medium">
            {symbol}{charge}
          </span>
        </span>

        <span className="block">
          Discount:{" "}
          <span className="font-semibold">
            {user.discount}%
          </span>{" "}
          ({symbol}{discountAmount.toFixed(2)})
        </span>

        <span className="block text-base font-semibold mt-2">
          🎉 Final Price: {symbol}{finalPrice.toFixed(2)}
        </span>
      </p>
    </div>
  );
})()}



          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-gray-800 text-white font-bold"
          >
            {submitting ? "Processing..." : "Place Order"}
          </button>
        </form>

       {responseMessage && (
  <p
    className={`mt-4 text-center ${
      responseType === "error" ? "text-red-400" : "text-green-400"
    }`}
  >
    {responseMessage.replace(/\(ID:.*?\)/, "")}
    <br />
<span className="text-sm opacity-80">
  {!(responseType?.toLowerCase() === 'error') &&
    `ID: ${responseMessage.match(/\(ID:\s*(\d+)\)/)?.[1]}`}
</span>

  </p>
)}

      </div>
    </div>
    </Suspense>
  );
}
