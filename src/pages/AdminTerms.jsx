import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Search,
  X,
  ArrowLeft,
} from "lucide-react";
import * as api from "../api";
import { validateTerm, exportToCSV } from "../data";
import { Loader, Modal, Pagination, Toast } from "../components/Utils";

const AdminTerms = ({ t, navigate }) => {
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [themes, setThemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [newTerm, setNewTerm] = useState({
    term_kaa: "",
    term_en: "",
    definition_en: "",
    definition_kaa: "",
    theme: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTerms();
  }, [terms, searchTerm, selectedTheme]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [termsResponse, themesResponse] = await Promise.all([
        api.getTerms(),
        api.getThemes(),
      ]);
      setTerms(termsResponse.data || []);
      setThemes(themesResponse || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTerms = () => {
    let filtered = [...terms];

    if (searchTerm) {
      filtered = filtered.filter(
        (term) =>
          term.term_kaa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.term_en?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTheme !== "all") {
      filtered = filtered.filter((term) => term.theme === selectedTheme);
    }

    setFilteredTerms(filtered);
    setCurrentPage(1);
  };

  const handleAddTerm = async () => {
    const validation = validateTerm(newTerm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.createTerm(newTerm);
      setTerms([response.data, ...terms]);
      setShowAddModal(false);
      setNewTerm({
        term_kaa: "",
        term_en: "",
        definition_en: "",
        definition_kaa: "",
        theme: "",
      });
      setToast({ message: t("admin.terms.messages.created"), type: "success" });
    } catch (error) {
      setToast({ message: "Error creating term", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTerm = async () => {
    const validation = validateTerm(editingTerm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await api.updateTerm(editingTerm._id, editingTerm);
      setTerms(terms.map((t) => (t._id === editingTerm._id ? editingTerm : t)));
      setShowEditModal(false);
      setEditingTerm(null);
      setToast({ message: t("admin.terms.messages.updated"), type: "success" });
    } catch (error) {
      setToast({ message: "Error updating term", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTerm = async (termId) => {
    if (!window.confirm("Are you sure you want to delete this term?")) return;

    try {
      await api.deleteTerm(termId);
      setTerms(terms.filter((t) => t._id !== termId));
      setToast({ message: t("admin.terms.messages.deleted"), type: "success" });
    } catch (error) {
      setToast({ message: "Error deleting term", type: "error" });
    }
  };

  const handleExport = () => {
    exportToCSV(
      terms,
      `terms_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    setToast({ message: "Terms exported successfully", type: "success" });
  };

  const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
  const paginatedTerms = filteredTerms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  {t("admin.terms.title")}
                </h1>
                <p className="text-xl text-gray-600">Manage dictionary terms</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>{t("admin.terms.addNew")}</span>
                </button>
                <button
                  onClick={handleExport}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>{t("admin.terms.export")}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Themes</option>
                {themes.map((theme) => (
                  <option key={theme._id} value={theme.name_en}>
                    {theme.name_en}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {paginatedTerms.length} of {filteredTerms.length} terms
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8">
                <Loader text="Loading terms..." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Karakalpak
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        English
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Theme
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTerms.map((term) => (
                      <tr key={term._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {term.term_kaa}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {term.term_en}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                            {term.theme}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingTerm({ ...term });
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTerm(term._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Term Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setErrors({});
        }}
        title={t("admin.terms.addNew")}
        size="medium"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.terms.fields.termKaa")} *
            </label>
            <input
              type="text"
              value={newTerm.term_kaa}
              onChange={(e) =>
                setNewTerm({ ...newTerm, term_kaa: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.term_kaa ? "border-red-500" : ""
              }`}
            />
            {errors.term_kaa && (
              <p className="text-red-500 text-sm mt-1">{errors.term_kaa}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.terms.fields.termEn")} *
            </label>
            <input
              type="text"
              value={newTerm.term_en}
              onChange={(e) =>
                setNewTerm({ ...newTerm, term_en: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.term_en ? "border-red-500" : ""
              }`}
            />
            {errors.term_en && (
              <p className="text-red-500 text-sm mt-1">{errors.term_en}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.terms.fields.definitionEn")} *
            </label>
            <textarea
              value={newTerm.definition_en}
              onChange={(e) =>
                setNewTerm({ ...newTerm, definition_en: e.target.value })
              }
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.definition_en ? "border-red-500" : ""
              }`}
            />
            {errors.definition_en && (
              <p className="text-red-500 text-sm mt-1">
                {errors.definition_en}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.terms.fields.definitionKaa")}
            </label>
            <textarea
              value={newTerm.definition_kaa}
              onChange={(e) =>
                setNewTerm({ ...newTerm, definition_kaa: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.terms.fields.theme")} *
            </label>
            <select
              value={newTerm.theme}
              onChange={(e) =>
                setNewTerm({ ...newTerm, theme: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.theme ? "border-red-500" : ""
              }`}
            >
              <option value="">Select theme</option>
              {themes.map((theme) => (
                <option key={theme._id} value={theme.name_en}>
                  {theme.name_en}
                </option>
              ))}
            </select>
            {errors.theme && (
              <p className="text-red-500 text-sm mt-1">{errors.theme}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setShowAddModal(false);
                setErrors({});
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleAddTerm}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : t("common.save")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Term Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTerm(null);
          setErrors({});
        }}
        title={t("admin.terms.edit")}
        size="medium"
      >
        {editingTerm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.terms.fields.termKaa")} *
              </label>
              <input
                type="text"
                value={editingTerm.term_kaa}
                onChange={(e) =>
                  setEditingTerm({ ...editingTerm, term_kaa: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.term_kaa ? "border-red-500" : ""
                }`}
              />
              {errors.term_kaa && (
                <p className="text-red-500 text-sm mt-1">{errors.term_kaa}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.terms.fields.termEn")} *
              </label>
              <input
                type="text"
                value={editingTerm.term_en}
                onChange={(e) =>
                  setEditingTerm({ ...editingTerm, term_en: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.term_en ? "border-red-500" : ""
                }`}
              />
              {errors.term_en && (
                <p className="text-red-500 text-sm mt-1">{errors.term_en}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.terms.fields.definitionEn")} *
              </label>
              <textarea
                value={editingTerm.definition_en}
                onChange={(e) =>
                  setEditingTerm({
                    ...editingTerm,
                    definition_en: e.target.value,
                  })
                }
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.definition_en ? "border-red-500" : ""
                }`}
              />
              {errors.definition_en && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.definition_en}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.terms.fields.definitionKaa")}
              </label>
              <textarea
                value={editingTerm.definition_kaa || ""}
                onChange={(e) =>
                  setEditingTerm({
                    ...editingTerm,
                    definition_kaa: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.terms.fields.theme")} *
              </label>
              <select
                value={editingTerm.theme}
                onChange={(e) =>
                  setEditingTerm({ ...editingTerm, theme: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.theme ? "border-red-500" : ""
                }`}
              >
                {themes.map((theme) => (
                  <option key={theme._id} value={theme.name_en}>
                    {theme.name_en}
                  </option>
                ))}
              </select>
              {errors.theme && (
                <p className="text-red-500 text-sm mt-1">{errors.theme}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTerm(null);
                  setErrors({});
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleUpdateTerm}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminTerms;
