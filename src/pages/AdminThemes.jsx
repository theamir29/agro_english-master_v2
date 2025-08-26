import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ArrowLeft, Layers } from "lucide-react";
import * as api from "../api";
import { validateTheme } from "../data";
import { Loader, Modal, Toast } from "../components/Utils";

const AdminThemes = ({ t, navigate }) => {
  const [themes, setThemes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [newTheme, setNewTheme] = useState({
    name_en: "",
    name_kaa: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      const response = await api.getThemes();
      setThemes(response || []);
    } catch (error) {
      console.error("Error loading themes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTheme = async () => {
    const validation = validateTheme(newTheme);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.createTheme(newTheme);
      setThemes([...themes, response.data]);
      setShowAddModal(false);
      setNewTheme({ name_en: "", name_kaa: "", description: "" });
      setToast({ message: "Theme created successfully", type: "success" });
    } catch (error) {
      setToast({ message: "Error creating theme", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTheme = async () => {
    const validation = validateTheme(editingTheme);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await api.updateTheme(editingTheme._id, editingTheme);
      setThemes(
        themes.map((t) => (t._id === editingTheme._id ? editingTheme : t))
      );
      setShowEditModal(false);
      setEditingTheme(null);
      setToast({ message: "Theme updated successfully", type: "success" });
    } catch (error) {
      setToast({ message: "Error updating theme", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTheme = async (themeId) => {
    if (
      !window.confirm("Are you sure? This will affect all terms in this theme.")
    )
      return;

    try {
      await api.deleteTheme(themeId);
      setThemes(themes.filter((t) => t._id !== themeId));
      setToast({ message: "Theme deleted successfully", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.error || "Error deleting theme",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 xl:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  {t("admin.themes.title")}
                </h1>
                <p className="text-xl text-gray-600">
                  Organize terms by themes
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>{t("admin.themes.addNew")}</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <Loader text="Loading themes..." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <div
                  key={theme._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Layers className="text-green-600" size={24} />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingTheme({ ...theme });
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTheme(theme._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">
                    {theme.name_en}
                  </h3>
                  <p className="text-gray-600 mb-2">{theme.name_kaa}</p>
                  {theme.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {theme.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Terms:</span>
                    <span className="font-semibold">
                      {theme.terms_count || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {themes.length === 0 && !isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-16 text-center">
              <Layers size={64} className="mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No themes yet</h3>
              <p className="text-gray-600 mb-6">
                Start by creating your first theme
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create First Theme
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Theme Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setErrors({});
        }}
        title={t("admin.themes.addNew")}
        size="small"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.themes.fields.nameEn")} *
            </label>
            <input
              type="text"
              value={newTheme.name_en}
              onChange={(e) =>
                setNewTheme({ ...newTheme, name_en: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.name_en ? "border-red-500" : ""
              }`}
              placeholder="e.g. Crop Production"
            />
            {errors.name_en && (
              <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.themes.fields.nameKaa")} *
            </label>
            <input
              type="text"
              value={newTheme.name_kaa}
              onChange={(e) =>
                setNewTheme({ ...newTheme, name_kaa: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.name_kaa ? "border-red-500" : ""
              }`}
              placeholder="e.g. Egin óndirisi"
            />
            {errors.name_kaa && (
              <p className="text-red-500 text-sm mt-1">{errors.name_kaa}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("admin.themes.fields.description")}
            </label>
            <textarea
              value={newTheme.description}
              onChange={(e) =>
                setNewTheme({ ...newTheme, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Brief description of this theme..."
            />
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
              onClick={handleAddTheme}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : t("common.save")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Theme Modal */}
      {editingTheme && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingTheme(null);
            setErrors({});
          }}
          title="Edit Theme"
          size="small"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                English Name *
              </label>
              <input
                type="text"
                value={editingTheme.name_en}
                onChange={(e) =>
                  setEditingTheme({
                    ...editingTheme,
                    name_en: e.target.value,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.name_en ? "border-red-500" : ""
                }`}
              />
              {errors.name_en && (
                <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Karakalpak Name *
              </label>
              <input
                type="text"
                value={editingTheme.name_kaa}
                onChange={(e) =>
                  setEditingTheme({
                    ...editingTheme,
                    name_kaa: e.target.value,
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  errors.name_kaa ? "border-red-500" : ""
                }`}
              />
              {errors.name_kaa && (
                <p className="text-red-500 text-sm mt-1">{errors.name_kaa}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editingTheme.description || ""}
                onChange={(e) =>
                  setEditingTheme({
                    ...editingTheme,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTheme(null);
                  setErrors({});
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTheme}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </Modal>
      )}

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

export default AdminThemes;
