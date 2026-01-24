import React, { useState } from 'react';
import api from '../services/api';
import './Upload.css';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await api.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="upload-container">
      <div className="upload-content">
        <div className="upload-header">
          <h1>Upload Image</h1>
          <p>Upload an image to create a blockchain attestation</p>
        </div>

        {!result ? (
          <div className="upload-card">
            {!preview ? (
              <div className="upload-zone">
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-input" className="upload-label">
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="upload-text">Click to select image</span>
                  <span className="upload-hint">PNG, JPG, GIF up to 10MB</span>
                </label>
              </div>
            ) : (
              <div className="preview-section">
                <img src={preview} alt="Preview" className="preview-image" />
                <div className="preview-info">
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="preview-actions">
                  <button onClick={handleReset} className="btn btn-secondary">
                    Choose Different Image
                  </button>
                  <button 
                    onClick={handleUpload} 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Uploading...' : 'Upload & Authenticate'}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div className="result-card">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Image Authenticated Successfully!</h2>
            <div className="result-details">
              <div className="result-item">
                <span className="result-label">Image ID:</span>
                <span className="result-value">{result.imageId}</span>
              </div>
              {result.ipfsHash && (
                <div className="result-item">
                  <span className="result-label">IPFS Hash:</span>
                  <span className="result-value monospace">{result.ipfsHash}</span>
                </div>
              )}
              {result.txHash && (
                <div className="result-item">
                  <span className="result-label">Transaction Hash:</span>
                  <span className="result-value monospace">{result.txHash}</span>
                </div>
              )}
              <div className="result-item">
                <span className="result-label">Status:</span>
                <span className="result-value success">Recorded on Blockchain</span>
              </div>
            </div>
            <button onClick={handleReset} className="btn btn-primary">
              Upload Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
