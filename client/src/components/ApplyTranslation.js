import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, getOrCreateChat } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContext';
import './ApplyTranslation.css';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  // Add more as needed
];

const ApplyTranslation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  // Get translatorId from query params
  const params = new URLSearchParams(location.search);
  const translatorId = params.get('translatorId');

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [form, setForm] = useState({
    source_lang: '',
    target_lang: '',
    notes: '',
    deadline: '',
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [price, setPrice] = useState(15);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f && f.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFilePreview(null);
    }
  };
  const handlePagesChange = (e) => {
    const pages = Math.max(1, Number(e.target.value));
    setForm({ ...form, pages });
    setPrice(Math.max(15, pages * 15));
  };
  const handleLangChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleNext = () => {
    if (step === 1 && !file) {
      showToast('Please upload a document', 'error');
      return;
    }
    if (step === 2 && (!form.source_lang || !form.target_lang || !form.deadline)) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !form.source_lang || !form.target_lang || !form.deadline) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `translations/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { publicURL } = supabase.storage.from('documents').getPublicUrl(filePath);
      // 2. Create translation request
      const { data: reqData, error: reqError } = await supabase
        .from('translation_requests')
        .insert([{
          client_id: user.id,
          translator_id: translatorId,
          file_url: publicURL,
          source_lang: form.source_lang,
          target_lang: form.target_lang,
          notes: form.notes,
          deadline: form.deadline,
          pages: form.pages,
          price,
        }])
        .select('id')
        .single();
      if (reqError) throw reqError;
      // 3. Create or fetch chat
      const chatId = await getOrCreateChat(user.id, translatorId);
      // 4. Update translation_request with chat_id
      await supabase.from('translation_requests').update({ chat_id: chatId }).eq('id', reqData.id);
      showToast('Request submitted! Redirecting to chat...', 'success');
      // 5. Redirect to messages page with chatId
      navigate(`/messages?chatId=${chatId}`);
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Failed to submit request: ' + (err.message || err), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-translation-modern">
      <div className="apply-card">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${step * 33.3}%` }} />
        </div>
        <h2 className="apply-title">Request a Translation</h2>
        <div className="steps">
          <div className={`step ${step === 1 ? 'active' : ''}`}>1. Upload</div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>2. Details</div>
          <div className={`step ${step === 3 ? 'active' : ''}`}>3. Review</div>
        </div>
        <form onSubmit={handleSubmit} className="apply-form">
          {step === 1 && (
            <div className="step-content">
              <label className="file-label">
                <span>Upload Document (PDF, Image, DOC)</span>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} required />
              </label>
              {filePreview && <img src={filePreview} alt="Preview" className="file-preview" />}
              {file && !filePreview && <div className="file-info">{file.name}</div>}
              <button type="button" className="next-btn" onClick={handleNext}>Next</button>
            </div>
          )}
          {step === 2 && (
            <div className="step-content">
              <div className="form-group">
                <label>Source Language</label>
                <select name="source_lang" value={form.source_lang} onChange={handleLangChange} required>
                  <option value="">Select source language</option>
                  {languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Target Language</label>
                <select name="target_lang" value={form.target_lang} onChange={handleLangChange} required>
                  <option value="">Select target language</option>
                  {languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Number of Pages</label>
                <input type="number" name="pages" min="1" value={form.pages} onChange={handlePagesChange} required />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} />
              </div>
              <div className="price-estimate">Estimated Price: <b>{price} TND</b></div>
              <div className="step-actions">
                <button type="button" className="back-btn" onClick={handleBack}>Back</button>
                <button type="button" className="next-btn" onClick={handleNext}>Next</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="step-content review-step">
              <h3>Review Your Request</h3>
              <ul className="review-list">
                <li><b>File:</b> {file?.name}</li>
                <li><b>Source Language:</b> {languageOptions.find(l => l.value === form.source_lang)?.label}</li>
                <li><b>Target Language:</b> {languageOptions.find(l => l.value === form.target_lang)?.label}</li>
                <li><b>Deadline:</b> {form.deadline}</li>
                <li><b>Pages:</b> {form.pages}</li>
                <li><b>Notes:</b> {form.notes || 'None'}</li>
                <li><b>Estimated Price:</b> {price} TND</li>
              </ul>
              <div className="step-actions">
                <button type="button" className="back-btn" onClick={handleBack}>Back</button>
                <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplyTranslation;