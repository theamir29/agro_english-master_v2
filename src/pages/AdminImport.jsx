import React, { useState } from "react";
import {
  Upload,
  Download,
  FileText,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import * as api from "../api";
import { parseCSV, exportToCSV } from "../data";
import { Loader, Toast } from "../components/Utils";

const AdminImport = ({ t, navigate }) => {
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setToast({ message: "Please select a CSV file", type: "error" });
      return;
    }

    setImportFile(file);
    setImportResult(null);

    // Preview file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = parseCSV(text);
      setImportPreview(parsed.slice(0, 5));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importFile) {
      setToast({ message: "Please select a file first", type: "error" });
      return;
    }

    setIsImporting(true);
    try {
      const response = await api.bulkImportTerms(importFile);
      setImportResult({
        success: true,
        imported: response.imported || 0,
        failed: response.failed || 0,
        errors: response.errors || [],
      });
      setToast({
        message: `Successfully imported ${response.imported} terms`,
        type: "success",
      });
    } catch (error) {
      setImportResult({
        success: false,
        error: error.message,
      });
      setToast({ message: "Import failed", type: "error" });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportTerms = async () => {
    setIsExporting(true);
    try {
      // ИЗМЕНЕНО: используем limit: 0 для загрузки всех терминов
      const response = await api.getTerms({ limit: 0 });
      if (response.data && response.data.length > 0) {
        exportToCSV(
          response.data,
          `terms_export_${new Date().toISOString().split("T")[0]}.csv`
        );
        setToast({
          message: `Exported ${response.data.length} terms successfully`,
          type: "success",
        });
      } else {
        setToast({ message: "No terms to export", type: "warning" });
      }
    } catch (error) {
      setToast({ message: "Export failed", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  const sampleCSV = `term_kaa,term_en,theme
Biydag'ay,Wheat,Crop Production
Arpa,Barley,Crop Production
Mákke,Corn,Crop Production
Shaly,Rice,Crop Production`;

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
            <h1 className="text-4xl font-bold mb-4">
              {t("admin.terms.import")}
            </h1>
            <p className="text-xl text-gray-600">
              Bulk import and export dictionary data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Import Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Upload className="mr-3 text-green-600" size={28} />
                Import Terms
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer"
                  />
                </div>

                {importFile && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium mb-2">
                      Selected file: {importFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: {(importFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                {importPreview.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">
                      Preview (first 5 rows):
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border rounded">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-2 py-1 border">Karakalpak</th>
                            <th className="px-2 py-1 border">English</th>
                            <th className="px-2 py-1 border">Theme</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importPreview.map((row, i) => (
                            <tr key={i}>
                              <td className="px-2 py-1 border">
                                {row.term_kaa}
                              </td>
                              <td className="px-2 py-1 border">
                                {row.term_en}
                              </td>
                              <td className="px-2 py-1 border">{row.theme}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    importFile && !isImporting
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isImporting ? (
                    <>
                      <Loader size="small" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Import Terms</span>
                    </>
                  )}
                </button>

                {importResult && (
                  <div
                    className={`rounded-lg p-4 ${
                      importResult.success
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {importResult.success ? (
                      <>
                        <div className="flex items-center mb-2">
                          <CheckCircle size={20} className="mr-2" />
                          <p className="font-medium">Import successful!</p>
                        </div>
                        <p className="text-sm">
                          Imported: {importResult.imported} terms
                        </p>
                        {importResult.failed > 0 && (
                          <p className="text-sm">
                            Failed: {importResult.failed} terms
                          </p>
                        )}
                        {importResult.errors &&
                          importResult.errors.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Errors:</p>
                              {importResult.errors.slice(0, 3).map((err, i) => (
                                <p key={i} className="text-xs mt-1">
                                  Row {i + 1}: {err.error}
                                </p>
                              ))}
                            </div>
                          )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center mb-2">
                          <AlertCircle size={20} className="mr-2" />
                          <p className="font-medium">Import failed!</p>
                        </div>
                        <p className="text-sm">{importResult.error}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Export Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Download className="mr-3 text-blue-600" size={28} />
                Export Terms
              </h2>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Export all terms from the database to a CSV file for backup or
                  external use.
                </p>

                <button
                  onClick={handleExportTerms}
                  disabled={isExporting}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <Loader size="small" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Export All Terms</span>
                    </>
                  )}
                </button>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">CSV Format Requirements:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>File must be in CSV format</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Required columns: term_kaa, term_en, theme</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Optional columns: definition_en, definition_kaa
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Use UTF-8 encoding for proper character support
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Sample CSV Format:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {sampleCSV}
                  </pre>
                  <button
                    onClick={() => {
                      const blob = new Blob([sampleCSV], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "sample_import.csv";
                      a.click();
                    }}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline flex items-center"
                  >
                    <FileText size={16} className="mr-1" />
                    Download Sample CSV
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle
                      className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">
                        Important:
                      </p>
                      <p className="text-yellow-700">
                        Make sure themes exist before importing terms. Create
                        themes in the Themes management section first.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default AdminImport;
