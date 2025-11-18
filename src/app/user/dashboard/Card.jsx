const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`
      bg-gray-50 dark:bg-[#1A1F2B]
      border border-gray-300 dark:border-[#2B3143]
      rounded-2xl 
      shadow-md hover:shadow-lg hover:shadow-gray-400/20
      p-3 sm:p-4 lg:p-5
      transition-all duration-300
      ${className}
    `}
  >
    {children}
  </div>
);
export default Card