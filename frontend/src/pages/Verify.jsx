import React, { useState } from 'react';
import api from '../services/api';
import './Verify.css';

function Verify() {
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
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      setResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
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
      const response = await api.post('/api/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
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
    <div className="verify-container">
      <div className="verify-content">
        <div className="verify-header">
          <h1>Verify Image</h1>
          <p>Check if an image has been authenticated on the blockchain</p>
        </div>

        {!result ? (
          <div className="verify-card">
            {!preview ? (
              <div className="upload-zone">
                <input
                  type="file"
                  id="verify-file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="verify-file-input" className="upload-label">
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="upload-text">Select image to verify</span>
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
                    onClick={handleVerify} 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Image'}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div className={`result-card ${result.authentic ? 'authentic' : 'not-authentic'}`}>
            <div className={`status-icon ${result.authentic ? 'success' : 'warning'}`}>
              {result.authentic ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            
            <h2>
              {result.authentic ? 'Image Verified!' : 'Image Not Authenticated'}
            </h2>
            
            <p className="result-message">
              {result.authentic 
                ? 'This image exists in our blockchain registry and is authentic.' 
                : 'This image was not found in our blockchain registry or has been modified.'}
            </p>

            {result.authentic && result.details && (
              <div className="result-details">
                {result.details.imageId && (
                  <div className="result-item">
                    <span className="result-label">Image ID:</span>
                    <span className="result-value">{result.details.imageId}</span>
                  </div>
                )}
                {result.details.uploadedAt && (
                  <div className="result-item">
                    <span className="result-label">Upload Date:</span>
                    <span className="result-value">
                      {new Date(result.details.uploadedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {result.details.similarity && (
                  <div className="result-item">
                    <span className="result-label">Match Confidence:</span>
                    <span className="result-value">{result.details.similarity}%</span>
                  </div>
                )}
              </div>
            )}

            <button onClick={handleReset} className="btn btn-primary">
              Verify Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Verify;
