import { useEffect, useState } from "react";
import Contact from "./Contact";
import Company from "./Company";
import Lead from "./Lead";
import Deal from "./Deal";
import Login from "./Login";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function App() {
  const [activePage, setActivePage] = useState("leads");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [dateFilter, setDateFilter] = useState("6");

  const [counts, setCounts] = useState({
    leads: 0,
    contacts: 0,
    companies: 0,
    deals: 0,
    dealsWon: 0,
    dealsLost: 0,
    dealsNegotiation: 0,
    leadsBySource: {},
    companiesByIndustry: {},
  });

  const leadColors = ["#2563eb", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"];
  const companyColors = ["#8b5cf6", "#2563eb", "#84cc16", "#f59e0b", "#ef4444"];
  const dealColors = ["#f59e0b", "#22c55e", "#ef4444"];
  const dealColorMap = {
    Won: "#22c55e",
    Lost: "#ef4444",
    Negotiation: "#f59e0b",
  };

  const buildGroupCount = (items, fieldName, defaultValue) => {
    return items.reduce((acc, item) => {
      const key = item[fieldName] || defaultValue;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  };

  const getRecordDate = (item) => {
    const dateValue = item.createdDate || item.createdAt || item.updatedAt;
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? null : date;
  };

  const filterByDate = (items) => {
    if (dateFilter === "all") return items;

    const now = new Date();
    const cutoffDate = new Date();

    if (dateFilter === "1") cutoffDate.setMonth(now.getMonth() - 1);
    if (dateFilter === "3") cutoffDate.setMonth(now.getMonth() - 3);
    if (dateFilter === "6") cutoffDate.setMonth(now.getMonth() - 6);
    if (dateFilter === "12") cutoffDate.setFullYear(now.getFullYear() - 1);

    return items.filter((item) => {
      const recordDate = getRecordDate(item);
      if (!recordDate) return true;
      return recordDate >= cutoffDate;
    });
  };

  const fetchCounts = async () => {
    try {
      const [leadsRes, contactsRes, companiesRes, dealsRes] = await Promise.all([
        fetch(`${API_BASE}/leads`),
        fetch(`${API_BASE}/contacts`),
        fetch(`${API_BASE}/companies`),
        fetch(`${API_BASE}/deals`),
      ]);

      const leadsData = await leadsRes.json();
      const contactsData = await contactsRes.json();
      const companiesData = await companiesRes.json();
      const dealsData = await dealsRes.json();

      const leadsList = filterByDate(Array.isArray(leadsData) ? leadsData : []);

const contactsList = filterByDate(Array.isArray(contactsData) ? contactsData : []);

const companiesList = filterByDate(Array.isArray(companiesData) ? companiesData : []);

const dealsRawList = filterByDate(Array.isArray(dealsData) ? dealsData : []);

const dealsList = dealsRawList.filter((deal, index, self) => {
  const company = deal.company?.toLowerCase().trim();

  return (
    index ===
    self.findIndex(
      (item) => item.company?.toLowerCase().trim() === company
    )
  );
});
      const getDealStatus = (deal) =>
        (deal.stage || deal.status || "").toLowerCase().trim();

      const dealsWon = dealsList.filter(
        (deal) => getDealStatus(deal) === "won"
      ).length;

      const dealsLost = dealsList.filter(
        (deal) => getDealStatus(deal) === "lost"
      ).length;

      const dealsNegotiation = dealsList.filter((deal) => {
        const status = getDealStatus(deal);
        return (
          status === "negotiation" ||
          status === "in negotiation" ||
          status === "negotiating"
        );
      }).length;

      setCounts({
        leads: leadsList.length,
        contacts: contactsList.length,
        companies: companiesList.length,
        deals: dealsList.length,
        dealsWon,
        dealsLost,
        dealsNegotiation,
        leadsBySource: buildGroupCount(leadsList, "source", "Website"),
        companiesByIndustry: buildGroupCount(companiesList, "industry", "Other"),
      });
    } catch (error) {
      console.error("Dashboard count error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchCounts();
  }, [isLoggedIn, dateFilter]);

  const openPage = (page) => {
    setActivePage(page);
    if (page === "dashboard") fetchCounts();
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("crmLoggedInUser");
    setIsLoggedIn(false);
    setActivePage("dashboard");
  };

  const menuClass = (page) =>
    `w-full text-left px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
      activePage === page
        ? "bg-blue-600 text-white font-semibold shadow-lg"
        : "hover:bg-blue-800 text-white"
    }`;

  const getPercent = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 1000) / 10;
  };

  const getChartColor = (label, index, colors, colorMap) => {
    if (colorMap && colorMap[label]) return colorMap[label];
    return colors[index % colors.length];
  };

  const getConicGradient = (dataObject, colors, colorMap) => {
    const entries = Object.entries(dataObject).filter(([, value]) => value > 0);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);

    if (!total) return "conic-gradient(#e5e7eb 0% 100%)";

    let start = 0;
    const parts = entries.map(([label, value], index) => {
      const percent = (value / total) * 100;
      const end = start + percent;
      const part = `${getChartColor(label, index, colors, colorMap)} ${start}% ${end}%`;
      start = end;
      return part;
    });

    return `conic-gradient(${parts.join(", ")})`;
  };

  const ChartLegend = ({ dataObject, colors, colorMap }) => {
    const entries = Object.entries(dataObject).filter(([, value]) => value > 0);

    if (!entries.length) {
      return <p className="text-center text-gray-500 mt-4 text-sm">No data available</p>;
    }

    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-2 mt-4 px-4">
        {entries.map(([label, value], index) => (
          <div key={label} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <span
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: getChartColor(label, index, colors, colorMap) }}
            ></span>
            <div className="relative group inline-block">
              <span>
                {label.length > 12 ? label.slice(0, 12) + "..." : label} ({value})
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded-xl border border-white/30 bg-white/20 backdrop-blur-md px-3 py-2 text-xs font-semibold text-gray-900 shadow-2xl z-50">
                {label} ({value})
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const DonutChart = ({ title, icon, dataObject, total, centerLabel, colors, colorMap }) => {
    const entries = Object.entries(dataObject).filter(([, value]) => value > 0);

    let runningPercent = 0;
    const chartLabels = entries.map(([label, value], index) => {
      const percent = total ? (value / total) * 100 : 0;
      const middlePercent = runningPercent + percent / 2;
      runningPercent += percent;

      const angle = (middlePercent / 100) * 360 - 90;
      const radius = 72;
      const center = 104;
      const x = center + radius * Math.cos((angle * Math.PI) / 180);
      const y = center + radius * Math.sin((angle * Math.PI) / 180);

      return {
        label,
        value,
        percent,
        x,
        y,
        color: getChartColor(label, index, colors, colorMap),
      };
    });

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[360px] overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{icon}</span>
            <h2 className="text-base font-bold text-gray-800 leading-tight truncate">
              {title}
            </h2>
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-600 cursor-pointer bg-white"
          >
            <option value="all">All Time</option>
            <option value="1">Last 1 Month</option>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
        </div>

        <div className="relative w-52 h-52 mx-auto">
          <div
            className="w-52 h-52 rounded-full flex items-center justify-center"
            style={{ background: getConicGradient(dataObject, colors, colorMap) }}
          >
            <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner z-10 px-2">
              <p className="text-2xl font-extrabold text-gray-900 leading-none mb-1">{total}</p>
              <p className="text-[11px] font-bold text-gray-800 leading-tight break-words max-w-[80px]">
                {centerLabel}
              </p>
            </div>
          </div>

          {chartLabels.map((item) => (
            <div
              key={item.label}
              className="absolute text-white text-xs font-bold text-center leading-tight pointer-events-none"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div>{item.value}</div>
              <div>({getPercent(item.value, total)}%)</div>
            </div>
          ))}
        </div>

        <ChartLegend dataObject={dataObject} colors={colors} colorMap={colorMap} />
      </div>
    );
  };

  const LineChart = ({ title, icon, dataObject, total, colors }) => {
    const entries = Object.entries(dataObject).filter(([, value]) => value > 0);
    const maxValue = Math.max(...entries.map(([, value]) => value), 1);
    const chartWidth = 300;
    const chartHeight = 185;
    const paddingX = 35;
    const paddingY = 28;
    const [hoveredPoint, setHoveredPoint] = useState(null);

    const points = entries.map(([label, value], index) => {
      const x =
        entries.length === 1
          ? chartWidth / 2
          : paddingX +
            (index * (chartWidth - paddingX * 2)) / (entries.length - 1);

      const y =
        chartHeight -
        paddingY -
        (value / maxValue) * (chartHeight - paddingY * 2);

      return { label, value, x, y };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
        : "";

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[360px] overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{icon}</span>
            <h2 className="text-base font-bold text-gray-800 leading-tight truncate">
              {title}
            </h2>
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-600 cursor-pointer bg-white"
          >
            <option value="all">All Time</option>
            <option value="1">Last 1 Month</option>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
        </div>

        <div className="text-center mb-2">
          <p className="text-2xl font-extrabold text-gray-900">{total}</p>
          <p className="text-xs font-bold text-gray-800">Total Leads</p>
        </div>

        <div className="relative flex justify-center">
          <svg width="320" height="205" viewBox="0 0 320 205">
            <defs>
              <linearGradient id="leadSourceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            <line x1="35" y1="157" x2="300" y2="157" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="35" y1="28" x2="35" y2="157" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="35" y1="92" x2="300" y2="92" stroke="#f3f4f6" strokeWidth="2" />

            {areaPath && <path d={areaPath} fill="url(#leadSourceGradient)" />}

            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((point) => (
              <g
                key={point.label}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
                <circle cx={point.x} cy={point.y} r="7" fill="#2563eb" />
                <circle cx={point.x} cy={point.y} r="3" fill="white" />

                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#111827"
                >
                  {point.value}
                </text>

                <text
                  x={point.x}
                  y="180"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#374151"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {point.label.length > 10 ? point.label.slice(0, 10) + "..." : point.label}
                </text>
              </g>
            ))}
          </svg>
          {hoveredPoint && (
            <div
              className="pointer-events-none absolute z-50 whitespace-nowrap rounded-2xl border border-white/40 bg-white/30 px-4 py-2 text-xs font-bold text-gray-900 shadow-2xl backdrop-blur-md transition-all duration-200"
              style={{
                left: `${hoveredPoint.x + 10}px`,
                top: `${hoveredPoint.y + 48}px`,
                transform: "translateX(-50%)",
              }}
            >
              {hoveredPoint.label}: {hoveredPoint.value}
            </div>
          )}
        </div>

        <ChartLegend dataObject={dataObject} colors={colors} />
      </div>
    );
  };

  // Bar chart for Deals by Status
  const BarChart = ({ title, icon, dataObject, total, colors, colorMap }) => {
    const entries = Object.entries(dataObject).filter(([, value]) => value > 0);
    const maxValue = Math.max(...entries.map(([, value]) => value), 1);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[360px] overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{icon}</span>
            <h2 className="text-base font-bold text-gray-800 leading-tight truncate">
              {title}
            </h2>
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-600 cursor-pointer bg-white"
          >
            <option value="all">All Time</option>
            <option value="1">Last 1 Month</option>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
        </div>

        <div className="text-center mb-4">
          <p className="text-2xl font-extrabold text-gray-900">{total}</p>
          <p className="text-xs font-bold text-gray-800">Total Deals</p>
        </div>

        {entries.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-sm">No data available</p>
        ) : (
          <div className="flex items-end justify-center gap-3 px-2 mt-6 h-40">
            {entries.map(([label, value], index) => {
              const percent = Math.round((value / maxValue) * 100);
              const color = getChartColor(label, index, colors, colorMap);

              return (
                <div key={label} className="flex flex-col items-center justify-end h-full w-16">
                  <div className="text-xs font-bold text-gray-800 mb-2">
                    {value} ({getPercent(value, total)}%)
                  </div>

                  <div className="flex items-end justify-center w-12 h-28 bg-gray-100 rounded-t-xl border border-gray-200 overflow-hidden">
                    <div
                      className="w-full rounded-t-xl flex items-start justify-center pt-2 text-white text-xs font-bold transition-all duration-500"
                      style={{
                        height: `${percent}%`,
                        backgroundColor: color,
                        minHeight: value > 0 ? "34px" : "0px",
                      }}
                    >
                      {value}
                    </div>
                  </div>

                  <div className="relative group mt-2 text-center text-xs font-bold text-gray-700 w-20">
                    <span>{label.length > 10 ? label.slice(0, 10) + "..." : label}</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap rounded-xl border border-white/30 bg-white/20 backdrop-blur-md px-3 py-2 text-xs font-semibold text-gray-900 shadow-2xl z-50">
                      {label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <ChartLegend dataObject={dataObject} colors={colors} colorMap={colorMap} />
      </div>
    );
  };

  const totalDealsStatus = counts.dealsWon + counts.dealsLost + counts.dealsNegotiation;
  const conversionRate = counts.leads ? Math.round((counts.deals / counts.leads) * 100) : 0;
  const wonPercent = totalDealsStatus ? Math.round((counts.dealsWon / totalDealsStatus) * 100) : 0;

  const renderDashboard = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 text-gray-800">CRM Dashboard</h1>
          <p className="text-gray-600 text-sm">Overview of total records present in your CRM.</p>
        </div>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 shadow-sm cursor-pointer"
        >
          <option value="all">📅 All Time</option>
          <option value="1">📅 Last 1 Month</option>
          <option value="3">📅 Last 3 Months</option>
          <option value="6">📅 Last 6 Months</option>
          <option value="12">📅 Last 12 Months</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        <div onClick={() => openPage("leads")} className="bg-yellow-100 p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition relative h-36">
          <div className="absolute right-5 top-5 bg-yellow-200 w-12 h-12 rounded-full flex items-center justify-center text-2xl">👥</div>
          <h2 className="text-xl font-bold text-yellow-800">Leads</h2>
          <p className="text-4xl font-extrabold mt-3 text-yellow-900">{counts.leads}</p>
          <p className="text-gray-700 mt-2 text-sm">Total leads present</p>
        </div>

        <div onClick={() => openPage("contacts")} className="bg-blue-100 p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition relative h-36">
          <div className="absolute right-5 top-5 bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center text-2xl">👤</div>
          <h2 className="text-xl font-bold text-blue-800">Contacts</h2>
          <p className="text-4xl font-extrabold mt-3 text-blue-900">{counts.contacts}</p>
          <p className="text-gray-700 mt-2 text-sm">Total contacts present</p>
        </div>

        <div onClick={() => openPage("companies")} className="bg-purple-100 p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition relative h-36">
          <div className="absolute right-5 top-5 bg-purple-200 w-12 h-12 rounded-full flex items-center justify-center text-2xl">🏢</div>
          <h2 className="text-xl font-bold text-purple-800">Companies</h2>
          <p className="text-4xl font-extrabold mt-3 text-purple-900">{counts.companies}</p>
          <p className="text-gray-700 mt-2 text-sm">Total companies present</p>
        </div>

        <div onClick={() => openPage("deals")} className="bg-green-100 p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition relative h-36">
          <div className="absolute right-5 top-5 bg-green-200 w-12 h-12 rounded-full flex items-center justify-center text-2xl">🤝</div>
          <h2 className="text-xl font-bold text-green-800">Deals</h2>
          <p className="text-4xl font-extrabold mt-3 text-green-900">{counts.deals}</p>
          <p className="text-gray-700 mt-2 text-sm">Total deals present</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <LineChart
          title="Leads by Source"
          icon="📈"
          dataObject={counts.leadsBySource}
          total={counts.leads}
          colors={leadColors}
        />

        <DonutChart
          title="Companies by Industry"
          icon="🏢"
          dataObject={counts.companiesByIndustry}
          total={counts.companies}
          centerLabel="Total Companies"
          colors={companyColors}
        />

        <BarChart
          title="Deals by Status"
          icon="🤝"
          dataObject={{
            Negotiation: counts.dealsNegotiation,
            Won: counts.dealsWon,
            Lost: counts.dealsLost,
          }}
          total={totalDealsStatus}
          colors={dealColors}
          colorMap={dealColorMap}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 px-5 py-2 border-r border-gray-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">📈</div>
          <div>
            <h3 className="font-bold text-blue-700 text-sm">Leads Conversion Rate</h3>
            <p className="text-2xl font-extrabold text-blue-900">{conversionRate}%</p>
            <p className="text-gray-600 text-xs">{counts.deals} deals from {counts.leads} leads</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-2 border-r border-gray-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">🏢</div>
          <div>
            <h3 className="font-bold text-purple-700 text-sm">Companies Added</h3>
            <p className="text-2xl font-extrabold text-purple-900">{counts.companies}</p>
            <p className="text-gray-600 text-xs">Total companies in system</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-5 py-2">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">🎯</div>
          <div>
            <h3 className="font-bold text-green-700 text-sm">Deals Win Rate</h3>
            <p className="text-2xl font-extrabold text-green-900">{wonPercent}%</p>
            <p className="text-gray-600 text-xs">{counts.dealsWon} won out of {totalDealsStatus} deals</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activePage === "leads") return <Lead />;
    if (activePage === "contacts") return <Contact />;
    if (activePage === "companies") return <Company />;
    if (activePage === "deals") return <Deal />;
    return renderDashboard();
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <nav className="w-60 bg-blue-950 text-white flex flex-col shadow-2xl">
        <button
          type="button"
          onClick={() => openPage("dashboard")}
          className="p-5 text-3xl font-extrabold tracking-wide text-left"
        >
          CRM
        </button>

        <div className="flex-1 p-3 space-y-3">
          <button type="button" onClick={() => openPage("dashboard")} className={menuClass("dashboard")}>🏠 Dashboard</button>
          <button type="button" onClick={() => openPage("leads")} className={menuClass("leads")}>👥 Leads</button>
          <button type="button" onClick={() => openPage("contacts")} className={menuClass("contacts")}>👤 Contacts</button>
          <button type="button" onClick={() => openPage("companies")} className={menuClass("companies")}>🏢 Companies</button>
          <button type="button" onClick={() => openPage("deals")} className={menuClass("deals")}>🤝 Deals</button>
        </div>

        <div className="p-5 border-t border-white/20">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-lg"
          >
            ↪ Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}

export default App;
