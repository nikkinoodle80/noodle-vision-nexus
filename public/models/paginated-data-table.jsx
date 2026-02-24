"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  data = [],
  columns = [],
  pageSize = 10,
  initialSort = { field: null, direction: 'asc' },
  filters = {},
  onPageChange = () => {},
  onSortChange = () => {},
  onFilterChange = () => {},
  totalItems = 0,
  currentPage = 1,
  loading = false
}) {
  const [sort, setSort] = useState(initialSort);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    const newSort = { field, direction: newDirection };
    setSort(newSort);
    onSortChange(newSort);
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="bg-[#1B1B1B] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[#4B4B4B]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[#2C2C2C] text-[#F6F6F6] rounded-lg border border-[#4B4B4B] focus:outline-none focus:border-[#DFFF4E]"
          />
          <div className="flex items-center gap-2">
            <span className="text-[#B1B1B1]">
              {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#2C2C2C]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  onClick={() => column.sortable && handleSort(column.field)}
                  className={`px-6 py-3 text-left text-[#F6F6F6] font-inter-tight-medium ${
                    column.sortable ? 'cursor-pointer hover:bg-[#4B4B4B]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sort.field === column.field && (
                      <i className={`fas fa-sort-${sort.direction === 'asc' ? 'up' : 'down'}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4B4B4B]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-[#B1B1B1]">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DFFF4E]"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-[#B1B1B1]">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-[#2C2C2C]">
                  {columns.map((column) => (
                    <td key={column.field} className="px-6 py-4 text-[#F6F6F6]">
                      {column.render ? column.render(row[column.field], row) : row[column.field]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#4B4B4B] flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-[#F6F6F6] disabled:text-[#4B4B4B] disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-left" />
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-full ${
                currentPage === page
                  ? 'bg-[#DFFF4E] text-[#1B1B1B]'
                  : 'text-[#F6F6F6] hover:bg-[#2C2C2C]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-[#F6F6F6] disabled:text-[#4B4B4B] disabled:cursor-not-allowed"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ field: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({});

  const sampleData = [
    { id: 1, name: 'HDMI Cable', type: 'Cable', status: 'In Stock', price: 29.99 },
    { id: 2, name: 'USB Adapter', type: 'Adapter', status: 'Low Stock', price: 19.99 },
    { id: 3, name: 'DisplayPort Cable', type: 'Cable', status: 'In Stock', price: 34.99 },
    { id: 4, name: 'Audio Jack', type: 'Connector', status: 'Out of Stock', price: 9.99 },
    { id: 5, name: 'VGA Adapter', type: 'Adapter', status: 'In Stock', price: 24.99 },
  ];

  const columns = [
    { field: 'name', label: 'Name', sortable: true },
    { field: 'type', label: 'Type', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    {
      field: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
  ];

  return (
    <div className="p-6 bg-[#1B1B1B] min-h-screen">
      <h2 className="text-2xl font-inter-tight-medium text-[#F6F6F6] mb-6">Data Table Example</h2>
      
      <MainComponent
        data={sampleData}
        columns={columns}
        pageSize={2}
        currentPage={currentPage}
        totalItems={sampleData.length}
        initialSort={sort}
        filters={filters}
        onPageChange={setCurrentPage}
        onSortChange={setSort}
        onFilterChange={setFilters}
      />

      <div className="mt-8">
        <h3 className="text-xl font-inter-tight-medium text-[#F6F6F6] mb-4">Loading State</h3>
        <MainComponent
          data={[]}
          columns={columns}
          pageSize={2}
          currentPage={1}
          totalItems={0}
          loading={true}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-inter-tight-medium text-[#F6F6F6] mb-4">Empty State</h3>
        <MainComponent
          data={[]}
          columns={columns}
          pageSize={2}
          currentPage={1}
          totalItems={0}
        />
      </div>
    </div>
  );
});
}