const API_URL = 'http://localhost:3000/api';

export const uploadFile = async (file, userId = 'anonymous') => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Attempting to upload file:', file.name);
    
    const response = await fetch(`${API_URL}/upload?userId=${userId}`, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Upload response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

export const getFiles = async () => {
  try {
    const response = await fetch(`${API_URL}/files`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch files');
    }
    
    const data = await response.json();
    console.log('Files retrieved:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(`Error fetching files: ${error.message}`);
  }
};

export const downloadFile = (filename) => {
  if (!filename) {
    console.error('No filename provided for download');
    return;
  }
  
  const downloadUrl = `${API_URL}/download/${filename}`;
  console.log('Downloading from:', downloadUrl);
  
  // Using fetch instead of window.open for better error handling
  fetch(downloadUrl)
    .then(response => {
      if (!response.ok) throw new Error('Download failed');
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // You might want to use the original filename here
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
    .catch(error => {
      console.error('Download error:', error);
      alert('Failed to download file');
    });
};

export const deleteFile = async (filename) => {
  try {
    const response = await fetch(`${API_URL}/files/${filename}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Error deleting file');
  }
}; 