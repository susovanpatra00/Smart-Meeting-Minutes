
import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, FileText, Headphones, Download, ArrowRight, Loader2 } from 'lucide-react';

type UploadType = 'audio' | 'transcript';

function App() {
  const [selectedType, setSelectedType] = useState<UploadType>('audio');
  const [file, setFile] = useState<File | null>(null);
  const [processedContent, setProcessedContent] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeSelect = (type: UploadType) => {
    setSelectedType(type);
    setFile(null);
    setProcessedContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedType === 'audio' && selectedFile.size > 200 * 1024 * 1024) {
        alert('File size must be less than 200MB');
        return;
      }
      setFile(selectedFile);
      setUploadProgress(100);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setProcessedContent('');
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", selectedType);

    try {
      const response = await fetch("http://10.245.146.157:8785/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unknown error");
      }
      setProcessedContent(data.mom);
    } catch (error) {
      alert(`Failed to process file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex items-center justify-center px-6 py-12 relative text-gray-900">
      {/* Logo at Top-Left */}
      <div className="absolute top-4 left-4">
        <img src="src/logo.png" alt="Logo" className="h-12 w-auto" />
      </div>

      <div
        className="max-w-2xl w-full min-h-[520px] mx-auto rounded-2xl p-8 space-y-8 shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 uppercase">
            Smart Meeting Minutes
          </h1>
          <div className="mt-3 border-b-4 border-indigo-600 w-24 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700">
            Choose your file type and upload to process
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleTypeSelect("audio")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow ${selectedType === "audio"
              ? "bg-indigo-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <Headphones size={20} /> Audio
          </button>
          <button
            onClick={() => handleTypeSelect("transcript")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow ${selectedType === "transcript"
              ? "bg-indigo-700 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            <FileText size={20} /> Transcript
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <label className="w-full max-w-lg flex flex-col items-center px-4 py-6 bg-gray-100 hover:bg-gray-200 rounded-xl border-2 border-dashed border-gray-400 cursor-pointer transition-all duration-300">
              <Upload className="w-8 h-8 text-indigo-600" />
              <span className="mt-2 text-sm text-gray-600 text-center">
                {selectedType === "audio"
                  ? "Upload audio file (MP3 or WAV, max 200MB)"
                  : "Upload transcript file (TXT)"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={selectedType === "audio" ? ".mp3,.wav" : ".txt"}
                onChange={handleFileChange}
              />
            </label>
          </div>

          {file && (
            <div className="text-center text-sm text-gray-600">
              Selected file: {file.name}
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-300 rounded-full h-2.5">
              <div
                className="bg-indigo-700 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleProcess}
              disabled={!file}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${file
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <ArrowRight size={20} />
              )}
              Process
            </button>
          </div>
        </div>

        {processedContent && (
          <div className="flex justify-center">
            <button
              onClick={() => {
                const blob = new Blob([processedContent], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "MinutesOfMeeting.txt";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-700 text-white rounded-full font-medium hover:bg-indigo-600 transition-all duration-300"
            >
              <Download size={20} /> Download Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
