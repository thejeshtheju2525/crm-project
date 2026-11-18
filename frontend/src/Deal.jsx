import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "/api";
const API = `${API_BASE}/deals`;
const COMPANY_API = `${API_BASE}/companies`;

function Deal() {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("Proposal Sent");

  const getLoggedInUser = () => {
    return localStorage.getItem("crmLoggedInUser") || "admin";
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US");
  };

  const getDateForSorting = (dateValue) => {
    if (!dateValue) return Number.MAX_SAFE_INTEGER;

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return Number.MAX_SAFE_INTEGER;
    }

    return date.getTime();
  };

  const fetchDeals = async () => {
    try {
      const response = await axios.get(API);
      const dealList = Array.isArray(response.data) ? response.data : [];

      const updatedDeals = dealList.map((deal) => ({
        ...deal,
        createdDate: deal.createdDate || deal.createdAt || getTodayDate(),
        createdBy: deal.createdBy || getLoggedInUser(),
      }));

      const uniqueDeals = updatedDeals.filter((deal, index, self) => {
        const dealCompany = deal.company?.toLowerCase().trim();

        return (
          index ===
          self.findIndex(
            (item) => item.company?.toLowerCase().trim() === dealCompany
          )
        );
      });

      setDeals(uniqueDeals);
    } catch (error) {
      console.error("GET DEALS ERROR:", error);
      setDeals([]);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(COMPANY_API);
      setCompanies(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("GET COMPANIES ERROR:", error);
      setCompanies([]);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchCompanies();
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setTitle("");
    setCompany("");
    setValue("");
    setStage("Proposal Sent");
  };

  const validateDeal = () => {
    if (!title || !company || !value || !stage) {
      alert("Please fill all fields");
      return false;
    }

    if (Number(value) <= 0) {
      alert("Deal value must be greater than 0");
      return false;
    }

    return true;
  };

  const addDeal = async () => {
    if (!validateDeal()) return;

    const duplicateDeal = deals.find(
      (deal) =>
        deal.company?.toLowerCase().trim() === company.toLowerCase().trim()
    );

    if (duplicateDeal) {
      alert("A deal already exists for this company");
      return;
    }

    try {
      await axios.post(API, {
        title,
        company,
        value,
        stage,
        createdDate: getTodayDate(),
        createdBy: getLoggedInUser(),
      });

      clearForm();
      fetchDeals();
    } catch (error) {
      console.error("ADD DEAL ERROR:", error);
    }
  };

  const updateDeal = async () => {
    if (!validateDeal()) return;

    const oldDeal = deals.find((deal) => deal.id === editingId);

    try {
      await axios.put(`${API}/${editingId}`, {
        ...oldDeal,
        title,
        company,
        value,
        stage,
        createdDate:
          oldDeal?.createdDate || oldDeal?.createdAt || getTodayDate(),
        createdBy: oldDeal?.createdBy || getLoggedInUser(),
      });

      clearForm();
      fetchDeals();
    } catch (error) {
      console.error("UPDATE DEAL ERROR:", error);
    }
  };

  const deleteDeal = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchDeals();
    } catch (error) {
      console.error("DELETE DEAL ERROR:", error);
    }
  };

  const editDeal = (deal) => {
    setEditingId(deal.id);
    setTitle(deal.title || "");
    setCompany(deal.company || "");
    setValue(deal.value || "");
    setStage(deal.stage || "Proposal Sent");

    const pageContainer = document.querySelector("main");

    if (pageContainer) {
      pageContainer.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-US");
  };

  const openMailComposer = (deal) => {
    const selectedCompany = companies.find(
      (item) => item.name?.toLowerCase() === deal.company?.toLowerCase()
    );

    const toEmail = selectedCompany?.email || "";
    const subject = encodeURIComponent(`Regarding ${deal.title || "Deal"}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am reaching out regarding the deal: ${
        deal.title || "Deal"
      }.\nCompany: ${deal.company || "N/A"}\nValue: $${
        deal.value || "0"
      }\nStage: ${deal.stage || "N/A"}\n\nThank you.`
    );

    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
  };

  const sortedDeals = [...deals].sort(
    (a, b) =>
      getDateForSorting(a.createdDate || a.createdAt) -
      getDateForSorting(b.createdDate || b.createdAt)
  );

  const proposalCount = sortedDeals.filter(
    (deal) => deal.stage === "Proposal Sent"
  ).length;

  const negotiationCount = sortedDeals.filter(
    (deal) => deal.stage === "Negotiation"
  ).length;

  const wonCount = sortedDeals.filter((deal) => deal.stage === "Won").length;
  const lostCount = sortedDeals.filter((deal) => deal.stage === "Lost").length;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Deal Management
      </h1>

      <div className="grid grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Deal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-3 rounded-lg bg-white"
        >
          <option value="">Select Company</option>
          {companies.map((comp) => (
            <option key={comp.id} value={comp.name}>
              {comp.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Deal Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-3 rounded-lg"
          autoComplete="off"
        />

        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="border p-3 rounded-lg bg-white"
        >
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <div className="mt-6 flex gap-4">
        {editingId ? (
          <button
            onClick={updateDeal}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Update Deal
          </button>
        ) : (
          <button
            onClick={addDeal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Deal
          </button>
        )}

        <button
          onClick={clearForm}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Deal Pipeline</h2>

          <div className="flex gap-3 text-sm font-semibold">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
              Proposal Sent: {proposalCount}
            </div>
            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg">
              Negotiation: {negotiationCount}
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
              Won: {wonCount}
            </div>
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
              Lost: {lostCount}
            </div>
          </div>
        </div>

        {sortedDeals.length === 0 ? (
          <p className="text-gray-500">No deals found</p>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {sortedDeals.map((deal) => (
              <div key={deal.id} className="relative bg-gray-100 p-5 rounded-lg shadow">
                <button
                  onClick={() => openMailComposer(deal)}
                  title="Compose Mail"
                  className="absolute top-4 right-4 text-2xl hover:scale-110"
                >
                  ✉️
                </button>

                <h3 className="text-xl font-bold text-blue-700 pr-10">
                  {deal.title}
                </h3>
                <p className="mt-2">Company: {deal.company}</p>
                <p>Value: ${deal.value}</p>
                <p>
                  Created Date: {formatDate(deal.createdDate || deal.createdAt)}
                </p>
                <p>Created By: {deal.createdBy || "admin"}</p>
                <p
                  className={`font-semibold mt-2 ${
                    deal.stage === "Won"
                      ? "text-green-600"
                      : deal.stage === "Lost"
                      ? "text-red-600"
                      : deal.stage === "Negotiation"
                      ? "text-orange-500"
                      : deal.stage === "Proposal Sent"
                      ? "text-blue-600"
                      : "text-blue-600"
                  }`}
                >
                  Stage: {deal.stage}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editDeal(deal)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteDeal(deal.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Deal;
