import { useState } from 'react';
import { ResourceType, RESOURCE_TYPE_DEFINITIONS } from '@cliniq/shared-types';

interface ResourceUploadProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ResourceUpload({ onSubmit, onCancel, isLoading = false }: ResourceUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    categoryId: '',
    course: '',
    year: '',
    tags: [] as string[],
    copyrightAck: false
  });
  const [tagInput, setTagInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Set URL to empty when file is selected
      setFormData(prev => ({ ...prev, url: '' }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    
    if (file) {
      submitData.append('file', file);
    }
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'tags') {
        submitData.append(key, JSON.stringify(value));
      } else if (key === 'year') {
        submitData.append(key, value ? String(value) : '');
      } else {
        submitData.append(key, String(value));
      }
    });

    await onSubmit(submitData);
  };

  const getFileTypeIcon = () => {
    if (!file) return '📄';
    
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    const typeMap: Record<string, string> = {
      '.pdf': '📄',
      '.doc': '📄',
      '.docx': '📄',
      '.ppt': '📊',
      '.pptx': '📊',
      '.mp4': '🎥',
      '.avi': '🎥',
      '.mov': '🎥',
      '.jpg': '🖼️',
      '.jpeg': '🖼️',
      '.png': '🖼️',
      '.gif': '🖼️',
      '.mp3': '🎵',
      '.wav': '🎵',
    };
    
    return typeMap[extension] || '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Resource</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File or URL
            </label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="text-3xl mb-2">{getFileTypeIcon()}</div>
                  <span className="text-sm text-gray-600">
                    {file ? file.name : 'Click to upload file'}
                  </span>
                  {file && (
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  )}
                </label>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>or</span>
              </div>
              
              <input
                type="url"
                placeholder="https://example.com/resource"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value, file: null }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                disabled={!!file}
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              minLength={5}
              maxLength={200}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Enter resource title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              minLength={10}
              maxLength={1000}
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Describe the resource content"
            />
          </div>

          {/* Category and Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="">Select category</option>
                {/* Categories would be populated from API */}
                <option value="1">Anatomy & Physiology</option>
                <option value="2">Pharmacology</option>
                <option value="3">Medical-Surgical</option>
                <option value="4">Pediatrics</option>
                <option value="5">Obstetrics & Gynecology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                placeholder="e.g., NURS 101"
              />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Academic year"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags * (1-10 tags)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  placeholder="Add tag and press Enter"
                  disabled={formData.tags.length >= 10}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                  className="rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Copyright Acknowledgment */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                required
                checked={formData.copyrightAck}
                onChange={(e) => setFormData(prev => ({ ...prev, copyrightAck: e.target.checked }))}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                I have the right to share this resource and it complies with copyright laws
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!file && !formData.url)}
              className="flex-1 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {isLoading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
