// import React, { useState, useRef, ChangeEvent } from 'react';
// import { Upload, FileText, Headphones, Download, ArrowRight } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';

// type UploadType = 'audio' | 'transcript';

// function App() {
//   const [selectedType, setSelectedType] = useState<UploadType>('audio');
//   const [file, setFile] = useState<File | null>(null);
//   const [processedContent, setProcessedContent] = useState<string>('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleTypeSelect = (type: UploadType) => {
//     setSelectedType(type);
//     setFile(null);
//     setProcessedContent('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       if (selectedType === 'audio' && selectedFile.size > 200 * 1024 * 1024) {
//         alert('File size must be less than 200MB');
//         return;
//       }
//       setFile(selectedFile);
//     }
//   };

//   const handleProcess = async () => {
//     if (!file) {
//       alert("Please upload a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("file_type", selectedType);

//     console.log("Sending request to backend...");
//     console.log("File:", file);
//     console.log("File Type:", selectedType);

//     try {
//       const response = await fetch("http://10.245.146.151:8785/upload", {
//         method: "POST",
//         body: formData,
//       });

//       console.log("Response Status:", response.status);
//       const data = await response.json();
//       console.log("Response Data:", data);

//       if (!response.ok) {
//         throw new Error(data.error || "Unknown error");
//       }

//       setProcessedContent(data.mom);
//     } catch (error) {
//       console.error("Error:", error);
//       alert(`Failed to process file: ${error.message}`);
//     }
//   };

//   const handleDownload = () => {
//     if (processedContent) {
//       const blob = new Blob([processedContent], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'processed-content.txt';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow-xl p-6 space-y-8">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-900">File Processor</h1>
//             <p className="mt-2 text-gray-600">Choose your file type and upload to process</p>
//           </div>

//           {/* File Type Selection */}
//           <div className="flex justify-center gap-4">
//             <button
//               onClick={() => handleTypeSelect('audio')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
//                 ${selectedType === 'audio'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//             >
//               <Headphones size={20} />
//               Audio
//             </button>
//             <button
//               onClick={() => handleTypeSelect('transcript')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
//                 ${selectedType === 'transcript'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//             >
//               <FileText size={20} />
//               Transcript
//             </button>
//           </div>

//           {/* File Upload Section */}
//           <div className="space-y-4">
//             <div className="flex justify-center">
//               <label className="w-full max-w-lg flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
//                 <Upload className="w-8 h-8 text-gray-400" />
//                 <span className="mt-2 text-sm text-gray-600">
//                   {selectedType === 'audio'
//                     ? 'Upload audio file (MP3 or WAV, max 200MB)'
//                     : 'Upload transcript file (TXT)'}
//                 </span>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   className="hidden"
//                   accept={selectedType === 'audio' ? '.mp3,.wav' : '.txt'}
//                   onChange={handleFileChange}
//                 />
//               </label>
//             </div>

//             {file && (
//               <div className="text-center text-sm text-gray-600">
//                 Selected file: {file.name}
//               </div>
//             )}

//             {/* Process Button */}
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleProcess}
//                 disabled={!file}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium
//                   ${file
//                     ? 'bg-green-600 text-white hover:bg-green-700'
//                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//               >
//                 Process
//                 <ArrowRight size={20} />
//               </button>
//             </div>
//           </div>

//           {/* Results Section */}
//           {processedContent && (
//             <div className="space-y-4">
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <h3 className="font-medium text-gray-900 mb-2">MOM:</h3>
//                 <ReactMarkdown className="text-gray-700">{processedContent}</ReactMarkdown>
//               </div>

//               <div className="flex justify-center">
//                 <button
//                   onClick={handleDownload}
//                   className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                 >
//                   <Download size={20} />
//                   Download Result
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;




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

    <div className="min-h-screen bg-gradient-to-b from-blue-900 bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center ">
        {/* Logo at Top-Left */}
      <div className="absolute top-4 left-4">
        <img src="src/CompanyLogo.png" alt="Logo" className="h-12 w-auto" />
      </div>
      <div className="max-w-2xl w-full min-h-[500px] mx-auto bg-gray-800 rounded-lg shadow-xl p-6 space-y-8 border border-gray-700" 
          style={{
                boxShadow: "0 0 15px rgba(0, 128, 255, 0.5)",
                animation: "glow 2s infinite alternate"
              }}>
        {/* <div className="text-center">
          <h1 className="text-3xl font-bold text-white">MOM Generator</h1>
          <p className="mt-2 text-gray-400">Choose your file type and upload to process</p>
        </div> */}
          <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white tracking-wide uppercase">
                Smart Meeting Minutes
              </h1>
              <div className="mt-6 border-b-4 border-blue-500 w-32 mx-auto"></div> 
              <p className="mt-6 text-lg text-gray-400">Choose your file type and upload to process</p>
            </div>

        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleTypeSelect('audio')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
              ${selectedType === 'audio' ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <Headphones size={20} /> Audio
          </button>
          <button
            onClick={() => handleTypeSelect('transcript')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
              ${selectedType === 'transcript' ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <FileText size={20} /> Transcript
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <label className="w-full max-w-lg flex flex-col items-center px-4 py-6 bg-gray-700 rounded-lg border-2 border-dashed border-gray-500 cursor-pointer hover:bg-gray-600 transition-colors">
              <Upload className="w-8 h-8 text-gray-300" />
              <span className="mt-2 text-sm text-gray-400">
                {selectedType === 'audio' ? 'Upload audio file (MP3 or WAV, max 200MB)' : 'Upload transcript file (TXT)'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={selectedType === 'audio' ? '.mp3,.wav' : '.txt'}
                onChange={handleFileChange}
              />
            </label>
          </div>

          {file && <div className="text-center text-sm text-gray-400">Selected file: {file.name}</div>}
          {uploadProgress > 0 && <div className="w-full bg-gray-600 rounded-full h-2.5"><div className="bg-blue-800 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>}
          
          <div className="flex justify-center gap-4">
            <button
              onClick={handleProcess}
              disabled={!file}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${file ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />} Process
            </button>
          </div>
        </div>

        {/* {processedContent && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="font-medium text-white mb-2">Minutes Of Meeting:</h3>
              {processedContent}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => alert("Download feature coming soon!")}
                className="flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <Download size={20} /> Download Result
              </button>
            </div>
          </div>
        )} */}
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
      className="flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
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
