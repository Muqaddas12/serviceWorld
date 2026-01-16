import { FaSearch ,FaSpinner,FaGlobe} from "react-icons/fa";
export default function CategoryAndSearch({
    searchRef,
    searchTerm,
    setSearchTerm,
    setSearchDropdownOpen,
    searchDropdownOpen,
    loading,
    filteredServices,handleServiceSelect,categoryRef,setCategory,setCategoryDropdownOpen,categoryDropdownOpen,getCategoryIcon,categories,category,

}){
return (
    <>
           {/* SEARCH */}
              <div className="relative border border-gray-500 dark:border-gray-700 rounded-2xl"
     ref={searchRef}>
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchDropdownOpen(true);
                  }}
                  placeholder="Search service..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg"
                />
    
                {searchTerm && searchDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-full max-h-64 bg-gray-50 dark:bg-[#1A1F2B] border rounded-lg z-[99999] overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center">
                        <FaSpinner className="animate-spin" /> Searching...
                      </div>
                    ) : filteredServices.length ? (
                      filteredServices.map((srv, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSearchTerm(srv.name);
                            handleServiceSelect(srv);
                            setCategory(srv.category);
                            setSearchDropdownOpen(false);
                          }}
                          className="px-4 py-3 cursor-pointer hover:bg-gray-200"
                        >
                          <p className="font-semibold">{srv.id} || {srv.name}</p>
                          <p className="text-sm opacity-75">{srv.desc}</p>
                        </div>
                      ))
                    ) : (
                      <p className="p-3 text-center opacity-70">No results found.</p>
                    )}
                  </div>
                )}
              </div>
    
              {/* CATEGORY */}
              <div className="relative z-10" ref={categoryRef}>
                <label>Category</label>
                <div
                  onClick={() => setCategoryDropdownOpen((p) => !p)}
                  className="bg-gray-100 dark:bg-[#0F1117] border px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2"
                >
                  {category ? getCategoryIcon(category) : <FaGlobe />}
                  <span>{category || "Select category"}</span>
                </div>
    
                {categoryDropdownOpen && (
                  <ul className="absolute left-0 top-full mt-2 w-full max-h-56 bg-gray-50 dark:bg-[#1A1F2B] border rounded-lg shadow-lg overflow-y-auto">
                    {categories.map((cat, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setCategory(cat);
                          setCategoryDropdownOpen(false);
                          setSearchTerm("");
                        }}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                      >
                        {getCategoryIcon(cat)}
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              </>
)
}